import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { legalPages } from '../data/siteData';

export default function LegalPage({ slug: slugOverride }) {
  const { slug: routeSlug } = useParams();
  const slug = slugOverride || routeSlug;
  const page = legalPages.find((item) => item.slug === slug);

  if (!page) {
    return (
      <section className="section">
        <div className="container">
          <PageHero title="Page not found" description="The requested legal page could not be found." />
          <div style={{ marginTop: 24 }}>
            <Link to="/" className="button button-primary">Return home</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero title={page.title} description={page.summary} />

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="article-body">
            {page.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div style={{ marginTop: 20 }}>
              <Link to="/contact" className="button button-primary">Contact us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
