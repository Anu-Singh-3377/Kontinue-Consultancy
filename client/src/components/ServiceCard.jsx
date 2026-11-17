import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ item }) {
  return (
    <article className="service-card">
      <img className="service-card__image" src={item.image} alt={item.title} />
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
    </article>
  );
}
