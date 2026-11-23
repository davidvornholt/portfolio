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
  type MarkDescription,
} from '@/features/changes/services/describe-mark';
import type { Snapshot } from '@/features/changes/services/snapshot';
import { formatPostDate } from '@/shared/content/services/format-post-date';
import styles from './change-field.module.css';
import {
  collectMarks,
  type FieldMark,
  markOfNextDay,
  nearestMark,
} from './field-marks';
import { SelectionPanel } from './selection-panel';

/** `pinned` keeps the selection when the pointer moves on. */
type Selection = Readonly<{ index: number; pinned: boolean }>;
type SetSelection = Dispatch<SetStateAction<Selection | undefined>>;

// How far, in pixels, a pointer or a finger may be from a square to mean it.
const hoverReach = 12;
const tapReach = 48;
// Below this width the panel takes the full width under the chart, so a
// finger doesn't cover it.
const narrowFrame = 560;
const panelDistance = 12;
// The panel may reach this far above the chart before it moves below.
const roomAbove = 56;

/** Measures the squares, and again whenever the chart changes its width. */
const useMarks = (
  frame: RefObject<HTMLDivElement | null>,
): ReadonlyArray<FieldMark> => {
  const [marks, setMarks] = useState<ReadonlyArray<FieldMark>>([]);
  useEffect(() => {
    const element = frame.current;
    if (element === null) {
      return;
    }
    const observer = new ResizeObserver(() => setMarks(collectMarks(element)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [frame]);
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
const usePointerSelection = (
  frame: RefObject<HTMLDivElement | null>,
  panel: RefObject<HTMLDivElement | null>,
  marks: ReadonlyArray<FieldMark>,
  pinned: boolean,
  setSelection: SetSelection,
): void => {
  useEffect(() => {
    const element = frame.current;
    if (element === null) {
      return;
    }
    const markAt = (event: PointerEvent | MouseEvent, reach: number) => {
      const origin = element.getBoundingClientRect();
      return nearestMark(
        marks,
        { x: event.clientX - origin.left, y: event.clientY - origin.top },
        reach,
      );
    };
    const inPanel = (event: Event): boolean =>
      event.target instanceof Node &&
      panel.current?.contains(event.target) === true;
    const point = (event: PointerEvent): void => {
      if (pinned || event.pointerType !== 'mouse' || inPanel(event)) {
        return;
      }
      const index = markAt(event, hoverReach);
      setSelection(index === undefined ? undefined : { index, pinned: false });
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
      const index = markAt(event, tapReach);
      setSelection(index === undefined ? undefined : { index, pinned: true });
    };
    const pickNothing = (event: PointerEvent): void => {
      if (pinned && event.target instanceof Node && !element.contains(event.target)) {
        setSelection(undefined);
      }
    };
    element.addEventListener('pointermove', point);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('click', pick);
    document.addEventListener('pointerdown', pickNothing);
    return () => {
      element.removeEventListener('pointermove', point);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('click', pick);
      document.removeEventListener('pointerdown', pickNothing);
    };
  }, [frame, panel, marks, pinned, setSelection]);
};

/** Puts the marker on the selected square and the panel beside it. */
const usePlacement = (
  frame: RefObject<HTMLDivElement | null>,
  panel: RefObject<HTMLDivElement | null>,
  mark: FieldMark | undefined,
  description: MarkDescription | undefined,
): void => {
  // The panel's size depends on what it says, so it is placed again whenever
  // the description arrives or changes.
  useLayoutEffect(() => {
    const element = frame.current;
    const box = panel.current;
    if (element === null || box === null || mark === undefined) {
      return;
    }
    const narrow = element.clientWidth < narrowFrame;
    const above = mark.y - mark.size / 2 - box.offsetHeight - panelDistance;
    const x = Math.max(
      0,
      Math.min(mark.x - box.offsetWidth / 2, element.clientWidth - box.offsetWidth),
    );
    const beside =
      above >= -roomAbove ? above : mark.y + mark.size / 2 + panelDistance;
    const place = (name: string, pixels: number): void =>
      element.style.setProperty(name, `${Math.round(pixels)}px`);
    place('--marker-x', mark.x - mark.size / 2);
    place('--marker-y', mark.y - mark.size / 2);
    place('--marker-size', mark.size);
    place('--panel-x', narrow ? 0 : x);
    place('--panel-y', narrow ? element.clientHeight + panelDistance : beside);
  }, [frame, panel, mark, description]);
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

/**
 * Lets a visitor ask the chart about single changes: by pointing, by tapping,
 * or with the keyboard through a range input that steps from change to
 * change. The chart itself is rendered on the server and passed in.
 */
export const FieldExplorer = ({
  children,
  describedBy,
}: Readonly<{ children: ReactNode; describedBy: string }>): ReactNode => {
  const frame = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Selection>();
  const marks = useMarks(frame);
  const details = useDetails(selection !== undefined);
  const last = Math.max(marks.length - 1, 0);
  const mark = selection === undefined ? undefined : marks[selection.index];
  const description =
    mark === undefined || details === undefined
      ? undefined
      : describeMark(details, mark);
  const pinned = selection?.pinned === true;
  usePointerSelection(frame, panel, marks, pinned, setSelection);
  usePlacement(frame, panel, mark, description);
  const stepTo = (index: number): void =>
    setSelection({ index: Math.max(0, Math.min(index, last)), pinned: true });

  return (
    <div ref={frame} className={styles.frame}>
      {children}
      <input
        type="range"
        className={styles.stepper}
        min={0}
        max={last}
        step={1}
        value={selection?.index ?? last}
        aria-label="Step through the changes one by one"
        aria-describedby={describedBy}
        aria-valuetext={valueText(mark, description)}
        onChange={(event) => stepTo(Number(event.target.value))}
        onFocus={() => setSelection((current) => current ?? { index: last, pinned: true })}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setSelection(undefined);
          } else if (event.key === 'PageUp' || event.key === 'PageDown') {
            event.preventDefault();
            stepTo(
              markOfNextDay(
                marks,
                selection?.index ?? last,
                event.key === 'PageUp' ? 1 : -1,
              ),
            );
          }
        }}
      />
      {mark === undefined ? null : (
        <>
          <div aria-hidden="true" className={styles.marker} />
          <div
            ref={panel}
            className={`${styles.panel} ${pinned ? styles.pinned : ''}`}
          >
            <SelectionPanel
              date={mark.date}
              description={description}
              pinned={pinned}
              onStep={(step) => stepTo((selection?.index ?? last) + step)}
              onClose={() => setSelection(undefined)}
            />
          </div>
        </>
      )}
    </div>
  );
};
