import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection({ title, description, buttonText = 'Contact Kontinue', buttonTo = '/contact' }) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-section">
          <div>
            <h2 className="heading heading--md" style={{ color: '#fff', marginBottom: 10 }}>{title}</h2>
            <p>{description}</p>
          </div>
          <Link className="button button-primary" to={buttonTo}>
            {buttonText} <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
