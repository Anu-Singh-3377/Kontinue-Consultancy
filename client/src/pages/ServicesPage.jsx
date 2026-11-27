import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import { serviceCatalog } from '../data/siteData';

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        description="Practical accounting and financial support designed to help businesses stay organised, compliant and informed."
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=85"
      />

      <section className="section">
        <div className="container">
          <SectionHeading title="Service overview" subtitle="Thoughtful support for day-to-day administration, reporting and business financial clarity." />
          <div className="service-grid">
            {serviceCatalog.map((service, index) => (
              <ServiceCard key={service.slug} item={service} delay={(index % 3) * 70} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
