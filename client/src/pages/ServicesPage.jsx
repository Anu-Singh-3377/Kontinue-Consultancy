import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import { serviceCatalog } from '../data/siteData';

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our Services" description="Practical accounting and financial support designed to help businesses stay organised, compliant and informed." />

      <section className="section">
        <div className="container">
          <SectionHeading title="Service overview" subtitle="Thoughtful support for day-to-day administration, reporting and business financial clarity." />
          <div className="service-grid">
            {serviceCatalog.map((service) => (
              <ServiceCard key={service.slug} item={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
