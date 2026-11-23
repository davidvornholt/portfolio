import type { MarkAddress } from '@/features/changes/services/describe-mark';

/** One square of the chart as it stands in the page. */
export type FieldMark = MarkAddress &
  Readonly<{
    element: HTMLElement;
    /** The centre of the square, measured from the frame's top left corner. */
    x: number;
    y: number;
    size: number;
  }>;

const dayMarks = (
  day: Element,
  kind: MarkAddress['kind'],
  origin: DOMRect,
): ReadonlyArray<FieldMark> => {
  const date = day.getAttribute('data-date') ?? '';
  return [...day.querySelectorAll<HTMLElement>('i')].map((element, position) => {
    const box = element.getBoundingClientRect();
    return {
      date,
      kind,
      position,
      element,
      x: box.left - origin.left + box.width / 2,
      y: box.top - origin.top + box.height / 2,
      size: box.width,
    };
  });
};

/**
 * Every square the chart shows at its present width, day by day: a day's
 * changes in the order they merged, then the attempts that were sent back.
 * Days outside the present window are not laid out and have no box.
 */
export const collectMarks = (frame: HTMLElement): ReadonlyArray<FieldMark> => {
  const origin = frame.getBoundingClientRect();
  const row = (name: string) => [
    ...frame.querySelectorAll(`[data-row="${name}"] > [data-date]`),
  ];
  const attemptsOf = new Map(
    row('inside').map((day) => [day.getAttribute('data-date'), day]),
  );
  return row('above')
    .filter((day) => day.getClientRects().length > 0)
    .flatMap((day) => {
      const attempts = attemptsOf.get(day.getAttribute('data-date'));
      return [
        ...dayMarks(day, 'change', origin),
        ...(attempts === undefined
          ? []
          : dayMarks(attempts, 'attempt', origin)),
      ];
    });
};

/**
 * The mark nearest to a point, if one lies within `reach`. Squares are a few
 * pixels wide, so a pointer or a finger rarely rests exactly on one.
 */
export const nearestMark = (
  marks: ReadonlyArray<FieldMark>,
  point: Readonly<{ x: number; y: number }>,
  reach: number,
): number | undefined => {
  let nearest: number | undefined;
  let nearestDistance = reach;
  for (const [index, mark] of marks.entries()) {
    const distance = Math.hypot(mark.x - point.x, mark.y - point.y);
    if (distance <= nearestDistance) {
      nearest = index;
      nearestDistance = distance;
    }
  }
  return nearest;
};

/** The first mark of the nearest other day, in the direction of `step`. */
export const markOfNextDay = (
  marks: ReadonlyArray<FieldMark>,
  from: number,
  step: 1 | -1,
): number => {
  const date = marks[from]?.date;
  for (
    let index = from;
    index >= 0 && index < marks.length;
    index += step
  ) {
    if (marks[index]?.date !== date) {
      const target = marks[index]?.date;
      return step === 1
        ? index
        : marks.findIndex((mark) => mark.date === target);
    }
  }
  return from;
};
