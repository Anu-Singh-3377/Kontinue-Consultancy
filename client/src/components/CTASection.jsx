import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

// Full-width navy banner used at the end of every page.
export default function CTASection({ title, description, buttonText = 'Contact Kontinue', buttonTo = '/contact' }) {
  return (
    <section className="cta-banner">
      <Reveal className="container cta-banner__inner">
        <div className="cta-banner__copy">
          <h2 className="heading heading--md">{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <Link className="button button-primary button--arrow" to={buttonTo}>
          {buttonText} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
