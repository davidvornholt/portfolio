// What the diagram shows at each moment of the way. `JourneyPlayer` moves the
// change, and these set which parts are lit while it does.

type Lit = 'off' | 'on' | 'bad';

const all = (root: ParentNode, selector: string): ReadonlyArray<Element> => [
  ...root.querySelectorAll(selector),
];

export const setLit = (root: ParentNode, selector: string, lit: Lit): void => {
  for (const element of all(root, selector)) {
    element.setAttribute('data-lit', lit);
  }
};

export const setCurrent = (root: ParentNode, name: string): void => {
  for (const step of all(root, '[data-step]')) {
    step.setAttribute(
      'data-current',
      String(step.getAttribute('data-step') === name),
    );
  }
};

/** Marks a station as passed and its step as the one the change is at. */
export const reach = (root: ParentNode, name: string): void => {
  setLit(root, `[data-node="${name}"], [data-tick="${name}"]`, 'on');
  setCurrent(root, name);
};

const litParts =
  '[data-node], [data-tick], [data-loop-part], [data-flag], [data-token]';

/** Back to the picture as it is drawn: every station passed. */
export const showResult = (root: HTMLElement): void => {
  root.removeAttribute('data-run');
  for (const element of all(root, litParts)) {
    element.removeAttribute('data-lit');
  }
  for (const step of all(root, '[data-step]')) {
    step.removeAttribute('data-current');
  }
  for (const loop of all(root, '[data-path="loop"]')) {
    loop.removeAttribute('stroke-dashoffset');
  }
};

/** Nothing passed yet, the loop not yet drawn. */
const clear = (root: HTMLElement): void => {
  setLit(root, litParts, 'off');
  for (const loop of all(root, '[data-path="loop"]')) {
    loop.setAttribute('stroke-dashoffset', '1');
  }
};

/** The start of the way. */
export const showStart = (root: HTMLElement): void => {
  root.setAttribute('data-run', 'playing');
  clear(root);
};

/**
 * The start of the way, set up at once and without fading while the diagram
 * is still off screen. A visitor who scrolls to it finds it waiting, and
 * never sees the finished picture clear itself first.
 */
export const showWaiting = (root: HTMLElement): void => {
  root.setAttribute('data-still', '');
  clear(root);
  globalThis.requestAnimationFrame(() =>
    globalThis.requestAnimationFrame(() => root.removeAttribute('data-still')),
  );
};
