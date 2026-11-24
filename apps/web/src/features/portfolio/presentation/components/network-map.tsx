import { Navigation2 } from 'lucide-react';
import { MapLandmarks } from './map-landmarks';

const routes = {
  work: 'M-36 327H59Q69 327 77 319L168 228Q176 220 189 220H289Q305 220 317 208L410 112Q422 100 437 100H618',
  method:
    'M60 -15V60Q60 75 71 86L183 198Q196 211 211 211H272Q290 211 303 224L395 318Q408 331 425 331H620',
  notes: 'M175 450V340Q175 325 185 315L275 225Q285 215 300 215H615',
} as const;

type StationProps = {
  readonly x: number;
  readonly y: number;
  readonly name: string;
  readonly href: string;
  readonly above?: boolean;
  readonly interchange?: boolean;
};

const Station = ({ x, y, name, href, above, interchange }: StationProps) => (
  <g transform={`translate(${x} ${y})`}>
    <a href={href} className="map-stop">
      <rect x="-38" y="-38" width="76" height="76" fill="transparent" />
      <circle r={interchange ? '17' : '8'} className="station-ring" />
      {interchange === true && <circle r="8" className="station-core" />}
      <text
        textAnchor="middle"
        y={above ? '-26' : '36'}
        className={interchange ? 'hub-name' : undefined}
      >
        {name}
      </text>
    </a>
  </g>
);

export const NetworkMap = () => (
  <nav className="network" aria-label="Portfolio map">
    <div className="map-heading">
      <span>Network map</span>
      <Navigation2 size={17} aria-hidden="true" />
    </div>
    <svg
      viewBox="0 0 580 406"
      className="network-drawing"
      aria-label="Choose a station to visit"
    >
      <title>Work, method, and writing routes through ProsaBridge</title>
      <defs>
        <pattern
          id="blocks"
          width="60"
          height="46"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-30)"
        >
          <path
            className="city-block"
            d="M3 3h31v15H3zM37 3h19v15H37zM3 22h16v19H3zM22 22h34v19H22z"
          />
        </pattern>
        <pattern id="park" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="m0 6 6-6" className="park-hatch" />
        </pattern>
      </defs>
      <g>
        <rect width="580" height="406" fill="url(#blocks)" />
        <path
          d="m340 -24 -23 68 -52 27 -29 82 -51 13 -51 91 -99 39 -47 73"
          className="waterway"
        />
        <path
          d="m360 -26 -22 80 -52 26 -33 84 -52 15 -50 93 -103 39 -46 72"
          className="water-edge"
        />
        <path
          d="m369 12 96 -36 74 60 -23 67 -90 -11zM5 129l55-28 36 58-44 39-49-14zM340 363l109-18 47 85-117 13z"
          fill="url(#park)"
        />
        <MapLandmarks />
        {Object.entries(routes).map(([line, d]) => (
          <g key={line}>
            <path d={d} className="route-bed" />
            <path d={d} className="route" data-line={line} pathLength="1" />
          </g>
        ))}
      </g>
      <Station x={115} y={130} above={true} href="#method" name="Review loop" />
      <Station x={97} y={299} href="/works/atrium" name="Atrium" />
      <Station
        x={488}
        y={100}
        above={true}
        href="/works/fes-kirchheim"
        name="FES Kirchheim"
      />
      <Station x={483} y={215} href="/posts" name="Writing" />
      <Station x={469} y={331} href="#record" name="Test results" />
      <Station
        x={282}
        y={215}
        above={true}
        interchange={true}
        href="/works/prosabridge"
        name="ProsaBridge"
      />
    </svg>
    <div className="map-key">
      <p className="map-prompt">Select a stop</p>
      {[
        ['key-work', 'P', 'Projects'],
        ['key-method', 'M', 'Method'],
        ['key-notes', 'W', 'Writing'],
      ].map(([line, code, label]) => (
        <span key={line}>
          <i className={line}>{code}</i>
          {label}
        </span>
      ))}
    </div>
  </nav>
);
