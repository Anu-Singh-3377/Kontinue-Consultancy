import Reveal from './Reveal';

export default function PageHero({
  title,
  description,
  image = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85',
}) {
  return (
    <section className="page-hero">
      <img className="page-hero__image" src={image} alt="" aria-hidden="true" fetchPriority="high" />
      <Reveal className="container page-hero__inner">
        <h1 className="heading heading--xl" style={{ color: '#fff', marginBottom: 12 }}>{title}</h1>
        {description && <p>{description}</p>}
      </Reveal>
    </section>
  );
}
