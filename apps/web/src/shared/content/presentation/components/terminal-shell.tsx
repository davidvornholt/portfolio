'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  type SubmitEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { OutputLine } from '@/shared/content/services/loosened-rule';
import {
  initialShellState,
  runCommand,
  type ShellState,
} from '@/shared/content/services/terminal-shell';

type Entry = Readonly<{
  id: number;
  command: string;
  lines: ReadonlyArray<OutputLine & { readonly id: number }>;
}>;

type Screen = Readonly<{
  shell: ShellState;
  entries: ReadonlyArray<Entry>;
  /** `clear` was typed, so the run the page showed at first is gone too. */
  cleared: boolean;
}>;

// An empty paragraph has no height, so a blank line holds a space that
// doesn't collapse.
const blankLine = '\u00a0';

const firstScreen: Screen = {
  shell: initialShellState,
  entries: [],
  cleared: false,
};

/** Where in the typed commands the arrow keys are: one past the last is the empty line. */
const stepThrough = (
  commands: ReadonlyArray<string>,
  at: number,
  key: string,
): number => {
  const step = key === 'ArrowUp' ? -1 : 1;
  return Math.min(commands.length, Math.max(0, at + step));
};

/**
 * Puts the block cursor where the browser's own, hidden one is. In a
 * monospaced font that is as many characters from the left as the caret's
 * index, less what a long line has scrolled.
 */
const placeCaret = (
  input: HTMLInputElement | null,
  caret: HTMLElement | null,
): void => {
  if (input === null || caret === null) {
    return;
  }
  const index =
    input.selectionDirection === 'backward'
      ? input.selectionStart
      : input.selectionEnd;
  caret.style.translate = `calc(${index ?? 0}ch - ${input.scrollLeft}px)`;
};

/**
 * A click anywhere in the terminal goes to the prompt, as in a real one,
 * unless the visitor is selecting text.
 */
const useClickToPrompt = (
  bodyRef: RefObject<HTMLElement | null>,
  inputRef: RefObject<HTMLInputElement | null>,
): void => {
  useEffect(() => {
    const body = bodyRef.current;
    if (body === null) {
      return;
    }
    const focusPrompt = (): void => {
      if (globalThis.getSelection()?.isCollapsed !== false) {
        inputRef.current?.focus({ preventScroll: true });
      }
    };
    body.addEventListener('click', focusPrompt);
    return () => body.removeEventListener('click', focusPrompt);
  }, [bodyRef, inputRef]);
};

const Entries = ({
  entries,
}: {
  readonly entries: ReadonlyArray<Entry>;
}): ReactNode => (
  <div role="log" className="grid gap-1">
    {entries.map((entry) => (
      <div key={entry.id} className="grid gap-1">
        <p>
          <span className="terminal-dim">$</span> {entry.command}
        </p>
        {entry.lines.map((line) => (
          <p
            key={line.id}
            className="terminal-line"
            data-failed={line.failed ? '' : undefined}
          >
            {line.text === '' ? blankLine : line.text}
          </p>
        ))}
      </div>
    ))}
  </div>
);

/**
 * The body of the terminal, with a prompt a visitor can type into. `children`
 * is the run the page shows at first. The terminal keeps the height it has
 * when the first command is typed, and scrolls like a real one from then on,
 * so the page around it doesn't move.
 *
 * The prompt is offered only where a pointer can hover: a phone would zoom
 * into the small text as soon as the field has focus.
 */
export const TerminalShell = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const nextIdRef = useRef(0);
  const inputId = useId();
  const [screen, setScreen] = useState(firstScreen);
  const [typed, setTyped] = useState('');
  const [commands, setCommands] = useState<ReadonlyArray<string>>([]);
  const [recalled, setRecalled] = useState(0);
  useClickToPrompt(bodyRef, inputRef);

  // After a command was sent or recalled, the caret is at the end of what
  // the field holds now. `typed` is named so that this runs then.
  useEffect(() => {
    if (typed !== undefined) {
      placeCaret(inputRef.current, caretRef.current);
    }
  }, [typed]);

  // The newest line stays in view. `screen` is named so that this runs
  // whenever what the terminal shows has changed.
  useEffect(() => {
    const body = bodyRef.current;
    if (body !== null && screen !== firstScreen) {
      body.scrollTop = body.scrollHeight;
    }
  }, [screen]);

  const submit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const body = bodyRef.current;
    if (body !== null && body.style.blockSize === '') {
      body.style.blockSize = `${body.offsetHeight}px`;
    }
    const answer = runCommand(screen.shell, typed);
    const entry: Entry = {
      id: nextIdRef.current,
      command: typed.trim(),
      lines: answer.lines.map((line, place) => ({ ...line, id: place })),
    };
    nextIdRef.current += 1;
    setScreen({
      shell: answer.state,
      entries: answer.clears ? [] : [...screen.entries, entry],
      cleared: screen.cleared || answer.clears,
    });
    const remembered =
      entry.command === '' ? commands : [...commands, entry.command];
    setCommands(remembered);
    setRecalled(remembered.length);
    setTyped('');
  };

  const recall = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      return;
    }
    event.preventDefault();
    const at = stepThrough(commands, recalled, event.key);
    setRecalled(at);
    setTyped(commands[at] ?? '');
  };

  const follow = (): void => placeCaret(inputRef.current, caretRef.current);
  const firstRun = screen.cleared ? null : children;
  // The word that says what to type is there until the first command.
  const hint = commands.length === 0 ? 'help' : undefined;
  return (
    <div
      ref={bodyRef}
      className="terminal-body"
      data-scrolls={screen === firstScreen ? undefined : ''}
    >
      {firstRun}
      <Entries entries={screen.entries} />
      <form className="terminal-prompt" onSubmit={submit}>
        <span aria-hidden="true" className="terminal-dim">
          $
        </span>
        <label htmlFor={inputId} className="sr-only">
          Command for the terminal. Type help to see what it knows.
        </label>
        <span className="terminal-field">
          <input
            ref={inputRef}
            id={inputId}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={recall}
            onSelect={follow}
            onScroll={follow}
            placeholder={hint}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
          />
          <span ref={caretRef} aria-hidden="true" className="terminal-caret" />
        </span>
      </form>
    </div>
  );
};
