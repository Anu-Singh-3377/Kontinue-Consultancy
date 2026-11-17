import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BenefitCard from '../components/BenefitCard';
import CTASection from '../components/CTASection';
import FAQAccordion from '../components/FAQAccordion';
import ServiceCard from '../components/ServiceCard';
import SectionHeading from '../components/SectionHeading';
import { benefits, faqs, processSteps, serviceCatalog, testimonials } from '../data/siteData';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <div className="hero__eyebrow">Accounting &amp; Advice</div>
            <h1 className="heading heading--xl" style={{ color: '#fff' }}>Clarity in Your Finances. Confidence in Your Business.</h1>
            <p className="hero__description">
              At Kontinue Consultancy, we help businesses maintain clear financial records, manage their accounts and navigate their financial responsibilities with confidence.
              From everyday bookkeeping and financial administration to tax-related support, our focus is on helping businesses stay organised and make informed financial decisions.
            </p>
            <div className="hero__actions">
              <Link to="/services" className="button button-primary">Explore Our Services</Link>
              <Link to="/contact" className="button button-secondary">Get in Touch</Link>
            </div>
          </div>

          <div className="hero__panel">
            <h3>Financial administration, in thoughtful hands.</h3>
            <div className="stats-grid">
              <div className="stat-box"><strong>2001</strong><span>Established</span></div>
              <div className="stat-box"><strong>1:1</strong><span>Tailored support</span></div>
              <div className="stat-box"><strong>6+</strong><span>Core services</span></div>
              <div className="stat-box"><strong>100%</strong><span>Clarity-first</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container intro-grid">
          <div className="intro-image">
            <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80" alt="Consultation meeting" />
          </div>
          <div className="intro-copy">
            <h2 className="heading heading--lg">Your Financial Administration, in Experienced Hands.</h2>
            <p>Managing finances is an essential part of running any business, but it can also become time-consuming and complex.</p>
            <p>At Kontinue Consultancy B.V., we understand the importance of accurate financial administration and organised business records.</p>
            <p>Based in The Hague, Netherlands, we provide accounting, bookkeeping and financial consultancy services designed to support businesses with their financial and administrative needs.</p>
            <p>Our aim is to make financial management easier to understand, manage and maintain.</p>
            <Link to="/about" className="button button-light" style={{ marginTop: 10 }}>
              Discover Kontinue <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            title="Our Core Services"
            subtitle="We support businesses with practical, professional financial administration and guidance."
          />
          <div className="service-grid">
            {serviceCatalog.map((service) => (
              <ServiceCard key={service.slug} item={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="A Financial Partner You Can Rely On." subtitle="Good financial management is about more than maintaining records. It is about having the right information, understanding your financial position and meeting your responsibilities." />
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <BenefitCard key={benefit.title} title={benefit.title} description={benefit.description} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading title="The Kontinue Approach" subtitle="A clear process designed to give businesses practical support and peace of mind." />
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

      <section className="section">
        <div className="container">
          <SectionHeading title="Credibility & Membership" subtitle="Professional standing and transparency matter. We support our services with clear communication and trustworthy guidance." />
          <div className="credibility-box">
            <div className="credibility-box__image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80')" }} />
            <div className="credibility-box__content">
              <h3>NOAB membership details to be confirmed.</h3>
              <p>We operate from The Hague and prioritise professionalism, transparency and careful administration.</p>
              <ul>
                <li>Established in 2001.</li>
                <li>Based in The Hague, Netherlands.</li>
                <li>Professional support positioned around accounting, bookkeeping and financial administration.</li>
                <li>Membership and certification claims should be verified before publication.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading title="Frequently Asked Questions" subtitle="Practical questions that help clients understand what to expect before contacting us." />
          <FAQAccordion items={faqs} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Verified client testimonial" subtitle="Placeholder content to be added once approved by the client." />
          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <div className="testimonial" key={item.name}>
                <p style={{ fontStyle: 'italic' }}>&ldquo;{item.quote}&rdquo;</p>
                <strong style={{ display: 'block', marginTop: 18 }}>{item.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Let’s Bring Clarity to Your Finances."
        description="Whether you need support with bookkeeping, financial administration or tax-related matters, start by telling us what your business needs."
        buttonText="Contact Kontinue"
        buttonTo="/contact"
      />
    </>
  );
}
