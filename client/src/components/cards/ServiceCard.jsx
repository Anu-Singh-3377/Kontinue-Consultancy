import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

export default function ServiceCard({ item, delay = 0 }) {
  return (
    <Reveal as="article" className="service-card" delay={delay}>
      <img
        className="service-card__image"
        src={item.image}
        alt={`${item.title} professional support`}
        loading="lazy"
        decoding="async"
      />
      <div className="service-card__body">
        <div className="service-card__icon">
          <ArrowRight size={18} />
        </div>
        <h3>{item.title}</h3>
        <p className="text-muted">{item.shortDescription}</p>
        <Link className="card-link" to={`/services/${item.slug}`}>
          Learn more <ArrowRight size={16} />
        </Link>
      </div>
    </Reveal>
  );
}
