/**
 * The measures of the diagram of a change's path: a line that leaves the bar,
 * runs through four stations above it and comes back down, with a loop from
 * the review back to the agent. All numbers are units of the SVG's view box.
 */
export type JourneyGeometry = Readonly<{
  width: number;
  height: number;
  /** The side of a station's square. */
  node: number;
  /** The x of the six stations, from the problem to live. */
  stations: ReadonlyArray<number>;
  /** The y of the line where it runs above the bar. */
  branch: number;
  /** The y of the top of the loop that leads back to the agent. */
  loopTop: number;
  stroke: number;
  /** The size of the word on the loop. */
  label: number;
}>;

export type Point = Readonly<{ x: number; y: number }>;

/** The point this share of the straight way from one point to another. */
export const between = (from: Point, to: Point, share: number): Point => ({
  x: from.x + (to.x - from.x) * share,
  y: from.y + (to.y - from.y) * share,
});

/** The stations in the order of the way, as the player addresses them. */
export const stationNames = [
  'problem',
  'agent',
  'proposal',
  'checks',
  'review',
  'live',
] as const;

const wideWidth = 1200;
const narrowWidth = 360;
const half = 2;

// The stations stand at the middles of equal columns, so the names in the
// bar and the steps under it line up with them.
const columnCentres = (width: number): ReadonlyArray<number> =>
  stationNames.map(
    (_, position) => (width * (position + 1 / half)) / stationNames.length,
  );

/** The picture for wide screens. */
export const wideGeometry: JourneyGeometry = {
  width: wideWidth,
  height: 250,
  node: 26,
  stations: columnCentres(wideWidth),
  branch: 128,
  loopTop: 46,
  stroke: 2.5,
  label: 19,
};

/** The same picture for a phone, with larger squares for its width. */
export const narrowGeometry: JourneyGeometry = {
  width: narrowWidth,
  height: 190,
  node: 18,
  stations: columnCentres(narrowWidth),
  branch: 106,
  loopTop: 44,
  stroke: 2,
  label: 13,
};

// How far along the way to the next station the line starts to climb and has
// reached its height, and the same for the way down.
const climbStart = 0.3;
const climbEnd = 0.8;
const loopClearance = 3;
const cornerShare = 0.9;

/** The y of the middle of a square that stands on the bar. */
export const standing = (geometry: JourneyGeometry): number =>
  geometry.height - geometry.node / half;

/** Where each station's square has its middle. */
export const stationCentres = (
  geometry: JourneyGeometry,
): ReadonlyArray<Readonly<{ x: number; y: number }>> =>
  geometry.stations.map((x, position) => ({
    x,
    y:
      position === 0 || position === geometry.stations.length - 1
        ? standing(geometry)
        : geometry.branch,
  }));

/** The way of a change: off the bar, along the stations, back onto the bar. */
export const routePath = (geometry: JourneyGeometry): string => {
  const [first = 0, second = 0, , , fifth = 0, last = 0] = geometry.stations;
  const ground = standing(geometry);
  const up = {
    from: first + (second - first) * climbStart,
    to: first + (second - first) * climbEnd,
  };
  const down = {
    from: fifth + (last - fifth) * (1 - climbEnd),
    to: fifth + (last - fifth) * (1 - climbStart),
  };
  const upMiddle = (up.from + up.to) / half;
  const downMiddle = (down.from + down.to) / half;
  return [
    `M${first} ${ground}`,
    `L${up.from} ${ground}`,
    `C${upMiddle} ${ground} ${upMiddle} ${geometry.branch} ${up.to} ${geometry.branch}`,
    `L${down.from} ${geometry.branch}`,
    `C${downMiddle} ${geometry.branch} ${downMiddle} ${ground} ${down.to} ${ground}`,
    `L${last} ${ground}`,
  ].join(' ');
};

/** Where the loop leaves the review and where it reaches the agent again. */
export const loopFoot = (geometry: JourneyGeometry): number =>
  geometry.branch - geometry.node / half - loopClearance;

/** The loop from the review back to the agent, drawn the way it is walked. */
export const loopPath = (geometry: JourneyGeometry): string => {
  const [, agent = 0, , , review = 0] = geometry.stations;
  const foot = loopFoot(geometry);
  const corner = (foot - geometry.loopTop) * cornerShare;
  return [
    `M${review} ${foot}`,
    `C${review} ${geometry.loopTop} ${review} ${geometry.loopTop} ${review - corner} ${geometry.loopTop}`,
    `L${agent + corner} ${geometry.loopTop}`,
    `C${agent} ${geometry.loopTop} ${agent} ${geometry.loopTop} ${agent} ${foot}`,
  ].join(' ');
};
