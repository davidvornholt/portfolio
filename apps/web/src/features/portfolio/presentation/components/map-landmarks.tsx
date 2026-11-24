// Schematic landmarks share the map's perspective and stay behind its links.
export const MapLandmarks = () => (
  <g className="map-landmarks" strokeLinejoin="round" strokeLinecap="round">
    <g transform="translate(218 81)">
      <path className="landmark-shadow" d="m-6 34 44 23 63-32-44-23z" />
      <path className="landmark-side" d="m0 24 42 20 53-27v11L42 55 0 35z" />
      <path className="landmark-face" d="m0 24 53-27 42 20-53 27z" />
      <path d="m4 29 38 18 48-24m-86 9 38 18 48-24" />
      <path className="landmark-side" d="m-4 11 42 20L91 4v11L38 42-4 22z" />
      <path className="landmark-face" d="M-4 11 49-16 91 4 38 31z" />
      <path d="m1 17 37 18 47-24m-42-21 18 8-26 13-18-8z" />
      <path className="landmark-ribbon" d="m49-10 7 3-37 19v10l-4-4-3 1V9z" />
    </g>
    <g transform="translate(436 28) scale(.63)">
      <path className="landmark-shadow" d="m-9 42 44 23 79-39-44-22z" />
      <path className="landmark-side" d="M0 9 39 29v33L0 42z" />
      <path className="landmark-face" d="m39 29 69-34v33L39 62z" />
      <path className="landmark-side" d="m-4 9 71-36 43 21-71 36z" />
      <path className="landmark-face" d="m-4 9 12-20 70-35-11 19z" />
      <path className="landmark-face" d="m8-11 32 15 70-35-32-15z" />
      <path className="landmark-side" d="m40 4 70-35v25L39 30z" />
      <path d="m46 34 6-3v10l-6 3zm14-7 6-3v10l-6 3zm14-7 6-3v10l-6 3zm14-7 6-3v10l-6 3zM8 22l7 4v9l-7-4zm13 7 7 3v10l-7-4z" />
    </g>
  </g>
);
