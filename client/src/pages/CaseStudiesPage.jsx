import CaseStudyCard from '../components/CaseStudyCard';
import CTASection from '../components/CTASection';
import PageHero from '../components/PageHero';
import { caseStudies } from '../data/siteData';

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        title="Case Studies"
        description="How we help businesses bring structure and clarity to their finances."
        image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          <p className="notice" role="note">
            These are example case studies. They will be replaced with approved client stories before publication.
          </p>
          <div className="case-grid">
            {caseStudies.map((study, index) => (
              <CaseStudyCard key={study.slug} study={study} delay={index * 80} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Have a similar challenge?"
        description="Tell us about your business and we will explain how we can help."
        buttonText="Book a Consultation"
        buttonTo="/contact"
      />
    </>
  );
}
