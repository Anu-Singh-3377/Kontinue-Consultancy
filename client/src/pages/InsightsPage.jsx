import PageHero from '../components/PageHero';
import BlogCard from '../components/BlogCard';
import { insights } from '../data/siteData';

export default function InsightsPage() {
  return (
    <>
      <PageHero title="Insights" description="Useful articles and perspectives on managing accounts, meeting responsibilities and keeping a business financially organised." />

      <section className="section">
        <div className="container">
          <div className="insights-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {insights.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
