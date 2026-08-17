const bezierX1 = 0.22;
const bezierY1 = 1;
const bezierX2 = 0.36;
const bezierY2 = 1;

/**
 * The single easing curve for all motion, kept in sync with the
 * `--ease-out` token in `theme.css`. Typed as a mutable tuple because
 * motion's `BezierDefinition` does not accept readonly tuples.
 */
export const easing: [number, number, number, number] = [
  bezierX1,
  bezierY1,
  bezierX2,
  bezierY2,
];

export const easingCss = `cubic-bezier(${easing.join(', ')})`;
