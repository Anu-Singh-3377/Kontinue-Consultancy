import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { processSteps } from '../data/siteData';

export default function ApproachPage() {
  return (
    <>
      <PageHero title="Our Approach" description="We focus on understanding your business first, then creating a simple and dependable structure to support your financial administration." />

      <section className="section">
        <div className="container">
          <SectionHeading title="The Kontinue process" subtitle="Our working style is collaborative, clear and built around practical delivery." />
          <div className="steps-grid">
            {processSteps.map((step, index) => (
              <div className="step-card" key={step.title}>
                <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading title="What clients can expect" subtitle="We believe good financial support should feel professional but approachable." />
          <div className="values-grid">
            <div className="value-box">
              <h3>Clear communication</h3>
              <p>We explain matters in a straightforward way and make sure your questions are addressed.</p>
            </div>
            <div className="value-box">
              <h3>Order and structure</h3>
              <p>We help create a consistent financial routine so records are organised and controllable.</p>
            </div>
            <div className="value-box">
              <h3>Practical guidance</h3>
              <p>Our advice is grounded in the realities of running a business and maintaining proper financial oversight.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
