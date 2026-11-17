import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogCard({ article }) {
  return (
    <article className="article-card">
      <img src={article.image} alt={article.title} style={{ borderRadius: 18, marginBottom: 16, height: 220, objectFit: 'cover', width: '100%' }} />
      <div style={{ display: 'grid', gap: 8 }}>
        <span style={{ color: '#315c50', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.72rem' }}>{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 8, fontSize: '0.85rem', color: '#5d6971' }}>
          <span>{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <Link to={`/insights/${article.slug}`} className="card-link" style={{ marginTop: 0 }}>
            Read Article <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
