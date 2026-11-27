import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import BlogCard from '../components/BlogCard';
import { insights } from '../data/siteData';

export default function ArticlePage() {
  const { slug } = useParams();
  const article = insights.find((item) => item.slug === slug);

  if (!article) {
    return (
      <section className="section">
        <div className="container">
          <Breadcrumb items={[{ label: 'Insights', to: '/insights' }, { label: 'Article not found' }]} />
          <h1 className="heading heading--lg">Article not found</h1>
          <Link to="/insights" className="button button-primary">Back to insights</Link>
        </div>
      </section>
    );
  }

  const related = insights.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: 'Insights', to: '/insights' }, { label: article.title }]} />
        <div className="article-layout">
          <div>
            <div className="article-hero">
              <img
                src={article.image}
                alt={`Editorial image for ${article.title}`}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="article-body">
              <span style={{ color: '#0b7b7d', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.72rem' }}>{article.category}</span>
              <h1 className="heading heading--lg" style={{ marginTop: 16 }}>{article.title}</h1>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', color: '#5b6576', marginBottom: 24 }}>
                <span>{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>Author: {article.author}</span>
              </div>
              {article.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {article.disclaimer && (
                <div style={{ marginTop: 26, borderTop: '1px solid rgba(20,35,59,0.1)', paddingTop: 18, color: '#5b6576' }}>
                  <strong>Disclaimer:</strong> {article.disclaimer}
                </div>
              )}
            </div>
          </div>

          <aside className="sidebar-card">
            <h3>Related insights</h3>
            <div style={{ display: 'grid', gap: 18 }}>
              {related.map((item) => (
                <Link key={item.slug} to={`/insights/${item.slug}`} style={{ display: 'grid', gap: 8 }}>
                  <span style={{ color: '#0b7b7d', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.72rem' }}>{item.category}</span>
                  <strong style={{ color: '#14233b' }}>{item.title}</strong>
                </Link>
              ))}
            </div>
            <Link to="/insights" className="button button-light" style={{ marginTop: 18, width: '100%' }}>
              View all insights <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
