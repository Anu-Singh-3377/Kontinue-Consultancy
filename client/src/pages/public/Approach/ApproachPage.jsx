import PageHero from '../../../components/common/PageHero';
import Reveal from '../../../components/ui/Reveal';
import SectionHeading from '../../../components/common/SectionHeading';
import { processSteps } from '../../../data/siteData';

export default function ApproachPage() {
  return (
    <>
      <PageHero
        title="Our Approach"
        description="We focus on understanding your business first, then creating a simple and dependable structure to support your financial administration."
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=85"
      />

      <section className="section">
        <div className="container">
          <SectionHeading title="The Kontinue process" subtitle="Our working style is collaborative, clear and built around practical delivery." />
          <div className="steps-grid">
            {processSteps.map((step, index) => (
              <Reveal as="article" className="step-card" delay={index * 75} key={step.title}>
                <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading title="What clients can expect" subtitle="We believe good financial support should feel professional but approachable." />
          <div className="values-grid">
            <Reveal as="article" className="value-box">
              <h3>Clear communication</h3>
              <p>We explain matters in a straightforward way and make sure your questions are addressed.</p>
            </Reveal>
            <Reveal as="article" className="value-box" delay={75}>
              <h3>Order and structure</h3>
              <p>We help create a consistent financial routine so records are organised and controllable.</p>
            </Reveal>
            <Reveal as="article" className="value-box" delay={150}>
              <h3>Practical guidance</h3>
              <p>Our advice is grounded in the realities of running a business and maintaining proper financial oversight.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
