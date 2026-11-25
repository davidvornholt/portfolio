'use client';

import {
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { between, type Point } from './journey-geometry';
import { textLinkClassName } from './text-link';

// How long each part of the way takes, in milliseconds. Together they come
// to about eight seconds, the pace of someone telling it aloud.
const pace = {
  settle: 500,
  toChecks: 1500,
  toReview: 600,
  verdict: 1100,
  loop: 1300,
  breath: 250,
  again: 1400,
  second: 650,
  land: 900,
} as const;

// How much of the diagram has to be on screen before it plays by itself.
const inView = 0.6;
const searchRounds = 30;
const half = 2;
const cubic = 3;

type Lit = 'off' | 'on' | 'bad';

type Stage = Readonly<{
  root: HTMLElement;
  route: SVGPathElement;
  loop: SVGPathElement;
  token: SVGRectElement;
  signal: AbortSignal;
}>;

const all = (root: ParentNode, selector: string): ReadonlyArray<Element> => [
  ...root.querySelectorAll(selector),
];

const setLit = (root: ParentNode, selector: string, lit: Lit): void => {
  for (const element of all(root, selector)) {
    element.setAttribute('data-lit', lit);
  }
};

const setCurrent = (root: ParentNode, name: string): void => {
  for (const step of all(root, '[data-step]')) {
    step.setAttribute(
      'data-current',
      String(step.getAttribute('data-step') === name),
    );
  }
};

/** Marks a station as passed and its step as the one the change is at. */
const reach = (root: ParentNode, name: string): void => {
  setLit(root, `[data-node="${name}"], [data-tick="${name}"]`, 'on');
  setCurrent(root, name);
};

const litParts =
  '[data-node], [data-tick], [data-loop-part], [data-flag], [data-token]';

/** Back to the picture as it is drawn: every station passed. */
const showResult = (root: HTMLElement): void => {
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

/** The start of the way: nothing passed yet, the loop not yet drawn. */
const showStart = (root: HTMLElement): void => {
  root.setAttribute('data-run', 'playing');
  setLit(root, litParts, 'off');
  for (const loop of all(root, '[data-path="loop"]')) {
    loop.setAttribute('stroke-dashoffset', '1');
  }
};

const sleep = (duration: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve) => {
    const timer = globalThis.setTimeout(resolve, duration);
    signal.addEventListener(
      'abort',
      () => {
        globalThis.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

/** How far along `path` the point with this x lies. The way never turns back. */
const lengthAtX = (path: SVGPathElement, x: number): number => {
  let low = 0;
  let high = path.getTotalLength();
  for (let round = 0; round < searchRounds; round += 1) {
    const middle = (low + high) / half;
    if (path.getPointAtLength(middle).x < x) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return low;
};

const easeInOut = (progress: number): number =>
  progress < 1 / half
    ? (half * progress) ** cubic / half
    : 1 - (half - half * progress) ** cubic / half;

type Leg = Readonly<{
  /** Where the change is after this much of the way. */
  pointAt: (length: number) => Point;
  from: number;
  to: number;
  duration: number;
  onLength?: (length: number) => void;
}>;

const along =
  (path: SVGPathElement) =>
  (length: number): Point =>
    path.getPointAtLength(length);

/** Moves the change along one stretch of a way. */
const travel = (stage: Stage, leg: Leg): Promise<void> =>
  new Promise((resolve) => {
    const size = stage.token.width.baseVal.value;
    const started = performance.now();
    const frame = (now: number): void => {
      if (stage.signal.aborted) {
        resolve();
        return;
      }
      const progress = Math.min(1, (now - started) / leg.duration);
      const length = leg.from + (leg.to - leg.from) * easeInOut(progress);
      const point = leg.pointAt(length);
      stage.token.setAttribute('x', String(point.x - size / half));
      stage.token.setAttribute('y', String(point.y - size / half));
      leg.onLength?.(length);
      if (progress < 1) {
        globalThis.requestAnimationFrame(frame);
      } else {
        resolve();
      }
    };
    globalThis.requestAnimationFrame(frame);
  });

const stationX = (root: ParentNode, name: string): number => {
  const node = root.querySelector<SVGRectElement>(`[data-node="${name}"]`);
  return node === null
    ? 0
    : node.x.baseVal.value + node.width.baseVal.value / half;
};

/** The way up to the review, where the reviewers find something. */
const firstRound = async (stage: Stage, lengths: Lengths): Promise<void> => {
  const { root, route } = stage;
  reach(root, 'problem');
  await sleep(pace.settle, stage.signal);
  await travel(stage, {
    pointAt: along(route),
    from: 0,
    to: lengths.checks,
    duration: pace.toChecks,
    onLength: (length) => {
      if (length >= lengths.agent) {
        reach(root, length >= lengths.proposal ? 'proposal' : 'agent');
        setLit(root, '[data-node="agent"]', 'on');
      }
    },
  });
  reach(root, 'checks');
  await travel(stage, {
    pointAt: along(route),
    from: lengths.checks,
    to: lengths.review,
    duration: pace.toReview,
  });
  setLit(root, '[data-node="review"]', 'bad');
  setLit(root, '[data-flag="bad"]', 'on');
  setCurrent(root, 'review');
  await sleep(pace.verdict, stage.signal);
};

/** Back to the agent over the loop, and through the stations once more. */
const secondRound = async (stage: Stage, lengths: Lengths): Promise<void> => {
  const { root, route, loop } = stage;
  setLit(root, '[data-loop-part]', 'on');
  // The loop is drawn from above one square to above the other. The change
  // starts and ends in the middle of a square, so it also rises out of the
  // review and sinks into the agent, all in one movement.
  const loopLength = loop.getTotalLength();
  const review = route.getPointAtLength(lengths.review);
  const agent = route.getPointAtLength(lengths.agent);
  const loopStart = loop.getPointAtLength(0);
  const loopEnd = loop.getPointAtLength(loopLength);
  const rise = Math.hypot(loopStart.x - review.x, loopStart.y - review.y);
  const sink = Math.hypot(agent.x - loopEnd.x, agent.y - loopEnd.y);
  const onLoop = (length: number): number =>
    Math.min(loopLength, Math.max(0, length - rise));
  await travel(stage, {
    pointAt: (length) => {
      if (length < rise) {
        return between(review, loopStart, length / rise);
      }
      return length <= rise + loopLength
        ? loop.getPointAtLength(onLoop(length))
        : between(loopEnd, agent, (length - rise - loopLength) / sink);
    },
    from: 0,
    to: rise + loopLength + sink,
    duration: pace.loop,
    onLength: (length) =>
      loop.setAttribute(
        'stroke-dashoffset',
        String(1 - onLoop(length) / loopLength),
      ),
  });
  setLit(root, '[data-node="review"]', 'off');
  setCurrent(root, 'agent');
  await sleep(pace.breath, stage.signal);
  await travel(stage, {
    pointAt: along(route),
    from: lengths.agent,
    to: lengths.review,
    duration: pace.again,
    onLength: (length) => {
      if (length >= lengths.proposal) {
        setCurrent(root, length >= lengths.checks ? 'checks' : 'proposal');
      }
    },
  });
  reach(root, 'review');
  setLit(root, '[data-flag="bad"]', 'off');
  setLit(root, '[data-flag="ok"]', 'on');
  await sleep(pace.second, stage.signal);
  await travel(stage, {
    pointAt: along(route),
    from: lengths.review,
    to: route.getTotalLength(),
    duration: pace.land,
  });
  reach(root, 'live');
};

type Lengths = Readonly<{
  agent: number;
  proposal: number;
  checks: number;
  review: number;
}>;

/** Plays the way of one change through the diagram that is on screen. */
const play = async (root: HTMLElement, signal: AbortSignal): Promise<void> => {
  const diagram = [
    ...root.querySelectorAll<SVGSVGElement>('[data-diagram]'),
  ].find((candidate) => candidate.getBoundingClientRect().width > 0);
  const route = diagram?.querySelector<SVGPathElement>('[data-path="route"]');
  const loop = diagram?.querySelector<SVGPathElement>('[data-path="loop"]');
  const token = diagram?.querySelector<SVGRectElement>('[data-token]');
  if (diagram === undefined || !route || !loop || !token) {
    return;
  }
  const stage: Stage = { root, route, loop, token, signal };
  const lengths: Lengths = {
    agent: lengthAtX(route, stationX(diagram, 'agent')),
    proposal: lengthAtX(route, stationX(diagram, 'proposal')),
    checks: lengthAtX(route, stationX(diagram, 'checks')),
    review: lengthAtX(route, stationX(diagram, 'review')),
  };
  showStart(root);
  const start = route.getPointAtLength(0);
  const size = token.width.baseVal.value;
  token.setAttribute('x', String(start.x - size / half));
  token.setAttribute('y', String(start.y - size / half));
  token.setAttribute('data-lit', 'on');
  await firstRound(stage, lengths);
  if (!signal.aborted) {
    await secondRound(stage, lengths);
  }
  if (!signal.aborted) {
    showResult(root);
  }
};

type Playback = Readonly<{
  rootRef: RefObject<HTMLDivElement | null>;
  controllerRef: RefObject<AbortController | null>;
  setPlaying: Dispatch<SetStateAction<boolean>>;
}>;

const startPlayback = ({
  rootRef,
  controllerRef,
  setPlaying,
}: Playback): void => {
  const root = rootRef.current;
  if (root === null) {
    return;
  }
  controllerRef.current?.abort();
  const controller = new AbortController();
  controllerRef.current = controller;
  setPlaying(true);
  play(root, controller.signal)
    .then(() => {
      if (!controller.signal.aborted) {
        setPlaying(false);
      }
    })
    .catch(() => showResult(root));
};

const stopPlayback = ({
  rootRef,
  controllerRef,
  setPlaying,
}: Playback): void => {
  controllerRef.current?.abort();
  if (rootRef.current !== null) {
    showResult(rootRef.current);
  }
  setPlaying(false);
};

/**
 * Plays one change's way through the diagram it wraps: once when the diagram
 * comes into view, and again whenever the visitor asks. The diagram is drawn
 * in its final state, so without scripts, and for a visitor who prefers
 * reduced motion, it simply stands there.
 */
export const JourneyPlayer = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => {
  const rootRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const still = globalThis.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (root === null || still) {
      return;
    }
    setReady(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          startPlayback({ rootRef, controllerRef, setPlaying });
        }
      },
      { threshold: inView },
    );
    observer.observe(root.querySelector('[data-stage]') ?? root);
    return () => {
      observer.disconnect();
      controllerRef.current?.abort();
    };
  }, []);

  const playback: Playback = { rootRef, controllerRef, setPlaying };
  return (
    <div ref={rootRef} className="journey-figure keeps-colors">
      {children}
      {/* The line keeps its room before the script has started, so that
          the sections below don't move when the button appears. */}
      <p className="page-column mt-6 min-h-6 print:hidden">
        {ready ? (
          <button
            type="button"
            onClick={() =>
              playing ? stopPlayback(playback) : startPlayback(playback)
            }
            className={textLinkClassName}
          >
            {playing ? 'Skip to the end' : 'Play it again'}
          </button>
        ) : null}
      </p>
    </div>
  );
};
