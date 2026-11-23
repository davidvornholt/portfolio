import type { ReactNode } from 'react';
import {
  type JourneyGeometry,
  loopFoot,
  loopPath,
  routePath,
  stationCentres,
  stationNames,
} from './journey-geometry';

// The stations whose square gets a tick once the change is through them.
const ticked: ReadonlySet<string> = new Set(['checks', 'review', 'live']);

const half = 2;
const tickStart = 0.25;
const tickDip = 0.17;
const tickRise = 0.33;
const tokenShare = 0.62;
const arrowHalfWidth = 0.2;
const arrowLength = 0.34;
const labelGap = 0.5;

/**
 * The diagram for one geometry. Drawn here is its final state, with every
 * station passed. `JourneyPlayer` finds the parts by their `data-` names and
 * plays the way through them.
 */
export const JourneyDiagram = ({
  geometry,
  size,
}: Readonly<{
  geometry: JourneyGeometry;
  size: 'wide' | 'narrow';
}>): ReactNode => {
  const centres = stationCentres(geometry);
  const [, agent = 0, , , review = 0] = geometry.stations;
  const foot = loopFoot(geometry);
  const arrow = geometry.node * arrowHalfWidth;
  return (
    <svg
      aria-hidden="true"
      className="journey-diagram"
      data-diagram={size}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
    >
      <path
        className="journey-line"
        data-path="route"
        d={routePath(geometry)}
        strokeWidth={geometry.stroke}
      />
      <path
        className="journey-line"
        data-path="loop"
        d={loopPath(geometry)}
        pathLength={1}
        strokeWidth={geometry.stroke}
      />
      <path
        className="journey-arrow"
        data-loop-part="arrow"
        d={`M${agent - arrow} ${foot - geometry.node * arrowLength} L${agent + arrow} ${foot - geometry.node * arrowLength} L${agent} ${foot} Z`}
      />
      <text
        className="journey-loop-label"
        data-loop-part="label"
        x={(agent + review) / half}
        y={geometry.loopTop - geometry.label * labelGap}
        fontSize={geometry.label}
        textAnchor="middle"
      >
        Fixes
      </text>
      {centres.map((centre, position) => {
        const name = stationNames[position] ?? '';
        const corner = geometry.node / half;
        return (
          <g key={name}>
            <rect
              className="journey-node"
              data-node={name}
              x={centre.x - corner}
              y={centre.y - corner}
              width={geometry.node}
              height={geometry.node}
              strokeWidth={geometry.stroke}
            />
            {ticked.has(name) ? (
              <path
                className="journey-tick"
                data-tick={name}
                d={`M${centre.x - geometry.node * tickStart} ${centre.y} l${geometry.node * tickDip} ${geometry.node * tickDip} l${geometry.node * tickRise} ${-geometry.node * tickRise}`}
                strokeWidth={geometry.stroke}
              />
            ) : null}
          </g>
        );
      })}
      <rect
        className="journey-token"
        data-token=""
        width={geometry.node * tokenShare}
        height={geometry.node * tokenShare}
        strokeWidth={geometry.stroke}
      />
    </svg>
  );
};
