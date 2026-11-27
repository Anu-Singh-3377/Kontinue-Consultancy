import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/common/Breadcrumb';
import CTASection from '../../../components/sections/CTASection';
import PageHero from '../../../components/common/PageHero';
import { serviceCatalog } from '../../../data/siteData';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = serviceCatalog.find((item) => item.slug === slug);

  if (!service) {
    return <PageHero title="Service not found" description="The requested service could not be located." />;
  }

  return (
    <>
      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Services', to: '/services' }, { label: service.title }]} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container service-detail">
          <div>
            <div className="service-card__icon" style={{ width: 52, height: 52 }}>
              <ArrowRight size={20} />
            </div>
            <h1 className="heading heading--lg" style={{ marginTop: 18 }}>{service.highlight}</h1>
            <p className="text-muted" style={{ maxWidth: 640 }}>{service.longDescription}</p>
            <div style={{ marginTop: 28 }}>
              <h3 style={{ marginBottom: 12 }}>Core focus</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {service.activities.map((activity) => (
                  <li key={activity} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#5b6576' }}>
                    <CheckCircle2 size={18} color="#0b7b7d" />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <img
              className="service-detail__image"
              src={service.image}
              alt={`${service.title} professional support`}
              loading="lazy"
              decoding="async"
            />
            <ul className="service-detail__meta" style={{ marginTop: 20 }}>
              <li>
                <strong>Target audience</strong>
                <span>{service.audience}</span>
              </li>
              <li>
                <strong>Service status</strong>
                <span>{service.slug === 'payroll' || service.slug === 'international-tax' ? 'Subject to confirmation.' : 'Core service offering.'}</span>
              </li>
            </ul>
            <Link to="/contact" className="button button-primary" style={{ width: '100%', marginTop: 20 }}>
              Book a consultation
            </Link>
          </div>
        </div>
      </section>

      <CTASection title="Need support with this service?" description="Tell us about your business needs and let’s discuss the most suitable support." buttonText="Contact Kontinue" buttonTo="/contact" />
    </>
  );
}
