import Reveal from './Reveal';

export default function SectionHeading({ title, subtitle, centered = true }) {
  return (
    <Reveal className={`section-heading ${centered ? '' : 'section-heading--left'}`}>
      <h2 className="heading heading--lg">{title}</h2>
      {subtitle && <p className="subheading">{subtitle}</p>}
    </Reveal>
  );
}
