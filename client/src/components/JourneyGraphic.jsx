import Reveal from './Reveal';

const stages = [
  { x: 36, y: 262, label: 'Understand' },
  { x: 132, y: 200, label: 'Structure' },
  { x: 228, y: 138, label: 'Advise' },
  { x: 324, y: 76, label: 'Grow' },
];

const STAGE_W = 112;
const STAGE_H = 34;

// Abstract "Our Journey" panel: connected stages rising along a diagonal band,
// suggesting continuous progress. Pure SVG so it stays sharp and lightweight.
export default function JourneyGraphic() {
  const path = stages
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${s.x + 10} ${s.y + STAGE_H / 2}`)
    .join(' ');

  return (
    <Reveal as="figure" className="journey">
      <svg viewBox="0 0 480 360" role="img" aria-labelledby="journey-title journey-desc">
        <title id="journey-title">Our Journey</title>
        <desc id="journey-desc">Four connected stages rising from left to right: Understand, Structure, Advise and Grow.</desc>

        <defs>
          <pattern id="journey-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="480" height="360" fill="var(--deep-navy)" />
        <rect width="480" height="360" fill="url(#journey-grid)" />

        {/* Diagonal bands: movement and direction */}
        <path d="M168 360h96L480 30V-0h-60Z" fill="var(--teal)" opacity="0.16" />
        <path d="M232 360h40L480 52V8Z" fill="var(--teal)" opacity="0.5" />
        <path d="M300 360h14L480 110V88Z" fill="#7fe0df" opacity="0.35" />

        {/* Connector line drawn on reveal */}
        <path className="journey__path" d={path} fill="none" stroke="var(--teal)" strokeWidth="2" />

        {stages.map((s, i) => {
          const last = i === stages.length - 1;
          return (
            <g className="journey__stage" style={{ transitionDelay: `${300 + i * 180}ms` }} key={s.label}>
              <rect
                x={s.x}
                y={s.y}
                width={STAGE_W}
                height={STAGE_H}
                rx="5"
                fill={last ? 'var(--teal)' : '#15294a'}
                stroke={last ? 'none' : 'rgba(127,224,223,0.35)'}
              />
              <circle cx={s.x + 10} cy={s.y + STAGE_H / 2} r="4" fill={last ? 'var(--deep-navy)' : 'var(--teal)'} />
              <text
                x={s.x + 22}
                y={s.y + STAGE_H / 2 + 4}
                fill={last ? 'var(--deep-navy)' : '#fff'}
                fontSize="12"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                {String(i + 1).padStart(2, '0')} {s.label}
              </text>
            </g>
          );
        })}

        <text x="28" y="40" fill="#fff" fontSize="15" fontWeight="600" fontFamily="Inter, sans-serif">Our Journey</text>
        <rect x="28" y="50" width="28" height="2" fill="var(--teal)" />
      </svg>
    </Reveal>
  );
}
