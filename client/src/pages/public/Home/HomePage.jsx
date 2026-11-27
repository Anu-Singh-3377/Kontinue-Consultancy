import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BenefitCard from '../../../components/cards/BenefitCard';
import BlogCard from '../../../components/cards/BlogCard';
import CaseStudyCard from '../../../components/cards/CaseStudyCard';
import CountUp from '../../../components/ui/CountUp';
import CTASection from '../../../components/sections/CTASection';
import FAQAccordion from '../../../components/ui/FAQAccordion';
import Reveal from '../../../components/ui/Reveal';
import SectionHeading from '../../../components/common/SectionHeading';
import ServiceCard from '../../../components/cards/ServiceCard';
import ServiceTicker from '../../../components/sections/ServiceTicker';
import TestimonialCarousel from '../../../components/ui/TestimonialCarousel';
import WordReveal from '../../../components/ui/WordReveal';
import {
  benefits,
  caseStudies,
  faqs,
  insights,
  processSteps,
  serviceCatalog,
  testimonials,
} from '../../../data/siteData';

// One tile per main area of the site: the home page doubles as a site overview.
const siteOverview = [
  { to: '/about', title: 'About Us', text: 'Who we are, what drives us and the principles behind our work.' },
  { to: '/services', title: 'Services', text: 'Bookkeeping, annual accounts, tax, payroll and financial management.' },
  { to: '/approach', title: 'Our Approach', text: 'A clear, four-step process from first conversation to ongoing support.' },
  { to: '/case-studies', title: 'Case Studies', text: 'How we bring structure and clarity to businesses like yours.' },
  { to: '/insights', title: 'Insights', text: 'Practical articles on accounts, compliance and financial organisation.' },
  { to: '/contact', title: 'Contact', text: 'Book a consultation or send us a question. We reply promptly.' },
];

function SectionHead({ title, subtitle, to, linkText }) {
  return (
    <div className="section-head">
      <SectionHeading centered={false} title={title} subtitle={subtitle} />
      <Link to={to} className="button button-outline button--arrow section-head__link">
        {linkText} <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <img
          className="hero__image"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=85"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__eyebrow">Accounting &amp; Advice · The Hague</div>
            <WordReveal
              className="heading heading--xl hero__title"
              text="Clarity in Your Finances. Confidence in Your Business."
              startDelay={200}
            />
            <p className="hero__description">
              At Kontinue Consultancy, we help businesses maintain clear financial records, manage their accounts and
              navigate their financial responsibilities with confidence.
            </p>
            <div className="hero__actions">
              <Link to="/services" className="button button-primary button--arrow">
                Explore Our Services <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/contact" className="button button-outline-light">Book a Consultation</Link>
            </div>
          </div>

          <div className="hero__panel">
            <h2 className="hero__panel-title">Financial administration, in thoughtful hands.</h2>
            <div className="stats-grid">
              <div className="stat-box"><CountUp value={2001} duration={1400} /><span>Established</span></div>
              <div className="stat-box"><CountUp value={1} suffix=":1" /><span>Tailored support</span></div>
              <div className="stat-box"><CountUp value={6} suffix="+" /><span>Core services</span></div>
              <div className="stat-box"><CountUp value={100} suffix="%" duration={1200} /><span>Clarity-first</span></div>
            </div>
          </div>
        </div>
      </section>

      <ServiceTicker />

      {/* Site overview */}
      <section className="section">
        <div className="container">
          <SectionHeading
            centered={false}
            title="Everything Kontinue, at a glance"
            subtitle="Start wherever is most useful. Each area of the site in one place."
          />
          <nav className="overview-grid" aria-label="Site overview">
            {siteOverview.map((item, index) => (
              <Reveal key={item.to} delay={index * 60}>
                <Link to={item.to} className="overview-tile">
                  <span className="overview-tile__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="overview-tile__title">{item.title}</span>
                  <span className="overview-tile__text">{item.text}</span>
                  <ArrowUpRight className="overview-tile__arrow" size={20} aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </nav>
        </div>
      </section>

      {/* About teaser */}
      <section className="section section--soft">
        <div className="container split">
          <Reveal className="split__media">
            <img
              src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=85"
              alt="Colleagues reviewing business information together in a bright office"
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal className="split__copy" delay={90}>
            <p className="eyebrow">About Kontinue</p>
            <h2 className="heading heading--lg">Your Financial Administration, in Experienced Hands.</h2>
            <p>
              Managing finances is an essential part of running any business, but it can also become time-consuming and
              complex. Based in The Hague, we provide accounting, bookkeeping and financial consultancy services designed
              to make financial management easier to understand, manage and maintain.
            </p>
            <Link to="/about" className="button button-outline button--arrow">
              Discover Kontinue <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <SectionHead
            title="Our Core Services"
            subtitle="Practical, professional financial administration and guidance."
            to="/services"
            linkText="All services"
          />
          <div className="service-grid">
            {serviceCatalog.map((service, index) => (
              <ServiceCard key={service.slug} item={service} delay={(index % 3) * 70} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            title="A Financial Partner You Can Rely On."
            subtitle="Good financial management is about more than maintaining records. It is about having the right information, understanding your financial position and meeting your responsibilities."
          />
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.title}
                title={benefit.title}
                description={benefit.description}
                index={index + 1}
                delay={index * 70}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Approach timeline */}
      <section className="section">
        <div className="container">
          <SectionHead
            title="The Kontinue Approach"
            subtitle="A clear process designed to give businesses practical support and peace of mind."
            to="/approach"
            linkText="Our approach"
          />
          <Reveal className="timeline">
            <div className="timeline__line" aria-hidden="true" />
            <ol className="steps-grid timeline__steps">
              {processSteps.map((step, index) => (
                <li className="step-card timeline__step" style={{ transitionDelay: `${250 + index * 180}ms` }} key={step.title}>
                  <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Case studies preview */}
      <section className="section section--soft">
        <div className="container">
          <SectionHead
            title="Case Studies"
            subtitle="How we bring structure and clarity to businesses' finances."
            to="/case-studies"
            linkText="All case studies"
          />
          <div className="case-grid">
            {caseStudies.map((study, index) => (
              <CaseStudyCard key={study.slug} study={study} delay={index * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="section">
        <div className="container">
          <SectionHeading
            title="Credibility & Membership"
            subtitle="Professional standing and transparency matter. We support our services with clear communication and trustworthy guidance."
          />
          <Reveal className="credibility-box">
            <img
              className="credibility-box__image"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85"
              alt="Professionals collaborating at a table in a light-filled office"
              loading="lazy"
              decoding="async"
            />
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
          </Reveal>
        </div>
      </section>

      {/* Insights preview */}
      <section className="section section--soft">
        <div className="container">
          <SectionHead
            title="Latest Insights"
            subtitle="Practical perspectives on managing accounts and meeting your responsibilities."
            to="/insights"
            linkText="All insights"
          />
          <div className="insights-grid">
            {insights.slice(0, 3).map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <SectionHeading title="Verified client testimonial" subtitle="Placeholder content to be added once approved by the client." />
          <Reveal>
            <TestimonialCarousel items={testimonials} />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--soft">
        <div className="container">
          <SectionHeading title="Frequently Asked Questions" subtitle="Practical questions that help clients understand what to expect before contacting us." />
          <FAQAccordion items={faqs} />
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
