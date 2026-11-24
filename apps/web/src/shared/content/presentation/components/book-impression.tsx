// Each page bends away from the same binding. The front edge is a translated
// copy of the back edge so the two ink plates keep the same perspective.
const binding = { x: 202, y: 319 };
const depth = { x: 139, y: 95 };
const page = {
  startAngle: 1.04,
  sweep: 1.01,
  reach: 189,
  tilt: 0.28,
  lift: 65,
  curlX: 0.42,
  curlY: 0.68,
  rise: 35,
};
const leafCount = 52;
const leaves = Array.from({ length: leafCount }, (_, index) => {
  const turn = index / (leafCount - 1);
  const angle = Math.PI * (page.startAngle - turn * page.sweep);
  const dx = Math.cos(angle) * page.reach;
  const dy = -Math.sin(angle) * page.reach - Math.abs(dx) * page.tilt;
  const lift = Math.sin(angle) * page.lift;
  const { x, y } = binding;
  const frontX = x + depth.x;
  const frontY = y + depth.y;
  const cx = dx * page.curlX - lift;
  const cy = dy * page.curlY - page.rise;
  return {
    index,
    d: `M ${x} ${y} Q ${x + cx} ${y + cy} ${x + dx} ${y + dy} l ${depth.x} ${depth.y} Q ${frontX + cx} ${frontY + cy} ${frontX} ${frontY} Z`,
  };
});
const leftEnd = 26;
const redLeaves = leaves.slice(0, leftEnd);
const blueLeaves = leaves.slice(leftEnd).toReversed();
export const BookImpression = () => (
  <svg aria-hidden="true" viewBox="0 78 560 365" className="book-impression">
    <title>Open book printed in two inks</title>
    {[redLeaves, blueLeaves].map((group, i) => (
      <g
        key={group[0]?.index}
        className={i === 0 ? 'vermillion-plate' : 'ultramarine-plate'}
      >
        {group.map(({ d, index }) => (
          <path key={index} d={d} />
        ))}
      </g>
    ))}
  </svg>
);
