import { serviceCatalog } from '../data/siteData';

// Slow, looping strip of service names. Decorative: the same services are listed in full below.
export default function ServiceTicker() {
  const items = [...serviceCatalog, ...serviceCatalog];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {items.map((service, index) => (
          <span className="ticker__item" key={`${service.slug}-${index}`}>{service.title}</span>
        ))}
      </div>
    </div>
  );
}
