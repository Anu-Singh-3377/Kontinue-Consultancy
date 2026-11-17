import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <PageHero title="Page not found" description="The page you requested does not exist or may have moved." />
        <div style={{ marginTop: 24 }}>
          <Link to="/" className="button button-primary">Back to homepage</Link>
        </div>
      </div>
    </section>
  );
}
