import Reveal from '../ui/Reveal';

export default function BenefitCard({ title, description, index = 1, delay = 0 }) {
  return (
    <Reveal as="article" className="benefit-card" delay={delay}>
      <span>{String(index).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </Reveal>
  );
}
