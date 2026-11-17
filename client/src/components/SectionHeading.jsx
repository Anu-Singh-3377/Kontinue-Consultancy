export default function SectionHeading({ title, subtitle, centered = true }) {
  return (
    <div className="section-heading" style={centered ? undefined : { textAlign: 'left' }}>
      <h2 className="heading heading--lg">{title}</h2>
      {subtitle && <p className="subheading">{subtitle}</p>}
    </div>
  );
}
