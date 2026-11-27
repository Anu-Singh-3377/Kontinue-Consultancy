import Reveal from './Reveal';

export default function ValueCard({ tag, title, description, delay = 0 }) {
  return (
    <Reveal as="article" className="value-card" delay={delay}>
      <span className="tag">{tag}</span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </Reveal>
  );
}
