import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link to="/">Home</Link>
      {items.map((item, index) => (
        <span key={item.label}>
          <span> / </span>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
