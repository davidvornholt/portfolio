'use client';

import {
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  describeMark,
  type MarkAddress,
  type MarkDescription,
} from '@/features/changes/services/describe-mark';
import type { Snapshot } from '@/features/changes/services/snapshot';
import { formatPostDate } from '@/shared/content/services/format-post-date';
import './change-field.css';
import {
  collectMarks,
  type FieldMark,
  markOfNextDay,
  nearestMark,
} from './field-marks';
import { SelectionPanel } from './selection-panel';

/**
 * `pinned` keeps the selection when the pointer moves on. The selection names
 * the change rather than its place in the list of marks, because that list
 * is measured again, and holds other weeks, whenever the chart changes its
 * width.
 */
type Selection = Readonly<{ address: MarkAddress; pinned: boolean }>;
type ElementRef = RefObject<HTMLDivElement | null>;

const indexOf = (
  marks: ReadonlyArray<FieldMark>,
  selection: Selection | undefined,
): number =>
  selection === undefined
    ? -1
    : marks.findIndex(
        (mark) =>
          mark.date === selection.address.date &&
          mark.kind === selection.address.kind &&
          mark.position === selection.address.position,
      );

const selectionAt = (
  marks: ReadonlyArray<FieldMark>,
  index: number | undefined,
  pinned: boolean,
): Selection | undefined => {
  const mark = index === undefined ? undefined : marks[index];
  return mark === undefined
    ? undefined
    : {
        address: { date: mark.date, kind: mark.kind, position: mark.position },
        pinned,
      };
};

// How far, in pixels, a pointer or a finger may be from a square to mean it.
const hoverReach = 12;
const tapReach = 48;
// Below this width the panel takes the full width under the chart, so a
// finger doesn't cover it.
const narrowFrame = 560;
const panelDistance = 12;

/** Measures the squares, and again whenever the chart changes its width. */
const useMarks = (frameRef: ElementRef): ReadonlyArray<FieldMark> => {
  const [marks, setMarks] = useState<ReadonlyArray<FieldMark>>([]);
  useEffect(() => {
    const frame = frameRef.current;
    if (frame === null) {
      return;
    }
    const observer = new ResizeObserver(() => setMarks(collectMarks(frame)));
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRef]);
  return marks;
};

/**
 * The details behind the squares. They are most of the page's weight and
 * nobody needs them before pointing at a square, so they load on demand.
 */
const useDetails = (wanted: boolean): Snapshot | undefined => {
  const [details, setDetails] = useState<Snapshot>();
  useEffect(() => {
    if (!wanted || details !== undefined) {
      return;
    }
    let current = true;
    const load = async (): Promise<void> => {
      const module = await import('@/features/changes/data/changes.json');
      if (current) {
        setDetails(module.default as unknown as Snapshot);
      }
    };
    // Without the details the panel still shows the day, so a failed
    // download costs the visitor the title and nothing else.
    load().catch(() => undefined);
    return () => {
      current = false;
    };
  }, [wanted, details]);
  return details;
};

/** Selects by mouse and touch. The keyboard goes through the range input. */
const usePointerSelection = ({
  frameRef,
  panelRef,
  marks,
  pinned,
  setSelection,
}: Readonly<{
  frameRef: ElementRef;
  panelRef: ElementRef;
  marks: ReadonlyArray<FieldMark>;
  pinned: boolean;
  setSelection: Dispatch<SetStateAction<Selection | undefined>>;
}>): void => {
  useEffect(() => {
    const frame = frameRef.current;
    if (frame === null) {
      return;
    }
    const markAt = (event: MouseEvent, reach: number): number | undefined => {
      const origin = frame.getBoundingClientRect();
      return nearestMark(
        marks,
        { x: event.clientX - origin.left, y: event.clientY - origin.top },
        reach,
      );
    };
    const inPanel = (event: Event): boolean =>
      event.target instanceof Node &&
      panelRef.current?.contains(event.target) === true;
    const point = (event: PointerEvent): void => {
      if (pinned || event.pointerType !== 'mouse' || inPanel(event)) {
        return;
      }
      setSelection(selectionAt(marks, markAt(event, hoverReach), false));
    };
    const leave = (): void => {
      if (!pinned) {
        setSelection(undefined);
      }
    };
    const pick = (event: MouseEvent): void => {
      if (inPanel(event)) {
        return;
      }
      setSelection(selectionAt(marks, markAt(event, tapReach), true));
    };
    const pickNothing = (event: PointerEvent): void => {
      const outside =
        event.target instanceof Node && !frame.contains(event.target);
      if (pinned && outside) {
        setSelection(undefined);
      }
    };
    frame.addEventListener('pointermove', point);
    frame.addEventListener('pointerleave', leave);
    frame.addEventListener('click', pick);
    document.addEventListener('pointerdown', pickNothing);
    return () => {
      frame.removeEventListener('pointermove', point);
      frame.removeEventListener('pointerleave', leave);
      frame.removeEventListener('click', pick);
      document.removeEventListener('pointerdown', pickNothing);
    };
  }, [frameRef, panelRef, marks, pinned, setSelection]);
};

const place = (
  frame: HTMLElement,
  panel: HTMLElement,
  mark: FieldMark,
): void => {
  // Beside the square, on the side with room, and never outside the chart:
  // above it lies the page's navigation.
  const right = mark.x + mark.size / 2 + panelDistance;
  const beside =
    right + panel.offsetWidth <= frame.clientWidth
      ? right
      : mark.x - mark.size / 2 - panelDistance - panel.offsetWidth;
  const level = Math.max(
    0,
    Math.min(
      mark.y - panel.offsetHeight / 2,
      frame.clientHeight - panel.offsetHeight,
    ),
  );
  const narrow = frame.clientWidth < narrowFrame;
  const set = (name: string, pixels: number): void =>
    frame.style.setProperty(name, `${Math.round(pixels)}px`);
  set('--marker-x', mark.x - mark.size / 2);
  set('--marker-y', mark.y - mark.size / 2);
  set('--marker-size', mark.size);
  set('--panel-x', narrow ? 0 : Math.max(0, beside));
  set('--panel-y', narrow ? frame.clientHeight + panelDistance : level);
};

/** Puts the marker on the selected square and the panel beside it. */
const usePlacement = (
  frameRef: ElementRef,
  panelRef: ElementRef,
  mark: FieldMark | undefined,
): void => {
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const panel = panelRef.current;
    if (frame === null || panel === null || mark === undefined) {
      return;
    }
    place(frame, panel, mark);
    // The panel grows when the details arrive, so it is placed again
    // whenever its size changes.
    const observer = new ResizeObserver(() => place(frame, panel, mark));
    observer.observe(panel);
    return () => observer.disconnect();
  }, [frameRef, panelRef, mark]);
};

const valueText = (
  mark: FieldMark | undefined,
  description: MarkDescription | undefined,
): string | undefined => {
  if (mark === undefined) {
    return;
  }
  return [
    formatPostDate(mark.date),
    description?.project,
    description?.title,
    description?.verdict,
  ]
    .filter((part) => part !== undefined)
    .join(', ');
};

/** Lets Escape close the panel from the chart and from the panel's own buttons. */
const useEscape = (
  frameRef: RefObject<HTMLDivElement | null>,
  open: boolean,
  setSelection: Dispatch<SetStateAction<Selection | undefined>>,
): void => {
  useEffect(() => {
    const frame = frameRef.current;
    if (frame === null || !open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setSelection(undefined);
      }
    };
    frame.addEventListener('keydown', onKeyDown);
    return () => frame.removeEventListener('keydown', onKeyDown);
  }, [frameRef, open, setSelection]);
};

/**
 * Lets a visitor ask the chart about single changes: by pointing, by tapping,
 * or with the keyboard through a range input that steps from change to
 * change. The chart itself is rendered on the server and passed in.
 */
export const FieldExplorer = ({
  children,
  describedBy,
}: Readonly<{ children: ReactNode; describedBy: string }>): ReactNode => {
  const frameRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Selection>();
  const marks = useMarks(frameRef);
  const details = useDetails(selection !== undefined);
  const last = Math.max(marks.length - 1, 0);
  const found = indexOf(marks, selection);
  const index = found === -1 ? last : found;
  // A change of a week the chart no longer shows has no mark. It shows no
  // panel and holds no pin, and appears again with its week.
  const mark = found === -1 ? undefined : marks[found];
  const description =
    mark === undefined || details === undefined
      ? undefined
      : describeMark(details, mark);
  const pinned = mark !== undefined && selection?.pinned === true;
  usePointerSelection({ frameRef, panelRef, marks, pinned, setSelection });
  usePlacement(frameRef, panelRef, mark);
  useEscape(frameRef, mark !== undefined, setSelection);
  const stepTo = (target: number): void =>
    setSelection(selectionAt(marks, Math.max(0, Math.min(target, last)), true));

  return (
    <div ref={frameRef} className="field-frame keeps-colors">
      {children}
      <input
        type="range"
        className="field-stepper"
        min={0}
        max={last}
        step={1}
        value={index}
        aria-label="Step through the changes one by one"
        aria-describedby={describedBy}
        aria-valuetext={valueText(mark, description)}
        onChange={(event) => stepTo(Number(event.target.value))}
        onFocus={() =>
          setSelection((current) =>
            indexOf(marks, current) === -1
              ? selectionAt(marks, last, true)
              : current,
          )
        }
        onKeyDown={(event) => {
          if (event.key === 'PageUp' || event.key === 'PageDown') {
            event.preventDefault();
            stepTo(
              markOfNextDay(marks, index, event.key === 'PageUp' ? 1 : -1),
            );
          }
        }}
      />
      {mark === undefined ? null : (
        <>
          <div aria-hidden="true" className="field-marker" />
          <div
            ref={panelRef}
            className="field-panel"
            data-pinned={pinned ? '' : undefined}
          >
            <SelectionPanel
              date={mark.date}
              description={description}
              pinned={pinned}
              onStep={(step) => stepTo(index + step)}
              onClose={() => setSelection(undefined)}
            />
          </div>
        </>
      )}
    </div>
  );
};
