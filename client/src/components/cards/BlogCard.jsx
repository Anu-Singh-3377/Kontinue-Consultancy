import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

export default function BlogCard({ article }) {
  return (
    <Reveal as="article" className="article-card">
      <img
        src={article.image}
        alt={`Editorial image for ${article.title}`}
        loading="lazy"
        decoding="async"
      />
      <div style={{ display: 'grid', gap: 8 }}>
        <span style={{ color: '#0b7b7d', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.72rem' }}>{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 8, fontSize: '0.85rem', color: '#5b6576' }}>
          <span>{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <Link to={`/insights/${article.slug}`} className="card-link" style={{ marginTop: 0 }}>
            Read Article <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
