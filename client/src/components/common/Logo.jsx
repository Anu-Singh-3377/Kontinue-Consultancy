// Kontinue wordmark: a lowercase "k" with a teal leg, followed by "ontinue".
// The stem and lettering use currentColor, so the logo adapts to light or dark backgrounds.
export function LogoMark({ size = 32, className = '' }) {
  return (
    <svg
      className={className}
      width={size * 0.62}
      height={size}
      viewBox="0 0 62 100"
      fill="none"
      aria-hidden="true"
    >
      <KShape />
    </svg>
  );
}

function KShape() {
  return (
    <>
      <path d="M0 0h14v100H0z" fill="currentColor" />
      <path d="M14 61 45 44 30 71 14 83Z" fill="currentColor" />
      <path d="M45 44h17L30 71Z" fill="var(--teal)" />
      <path d="M33 75 46 67 62 100H47Z" fill="var(--teal)" />
    </>
  );
}

export default function Logo({ height = 28, className = '' }) {
  return (
    <svg
      className={`logo ${className}`}
      height={height}
      viewBox="0 0 470 102"
      role="img"
      aria-label="Kontinue"
    >
      <KShape />
      <text
        x="72"
        y="100"
        fill="currentColor"
        fontFamily="Inter, 'Segoe UI', sans-serif"
        fontWeight="500"
        fontSize="100"
        textLength="396"
        lengthAdjust="spacingAndGlyphs"
      >
        ontinue
      </text>
    </svg>
  );
}
