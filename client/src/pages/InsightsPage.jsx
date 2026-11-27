import PageHero from '../components/PageHero';
import BlogCard from '../components/BlogCard';
import { insights } from '../data/siteData';

export default function InsightsPage() {
  return (
    <>
      <PageHero
        title="Insights"
        description="Useful articles and perspectives on managing accounts, meeting responsibilities and keeping a business financially organised."
        image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=85"
      />

      <section className="section">
        <div className="container">
          <div className="insights-grid">
            {insights.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
