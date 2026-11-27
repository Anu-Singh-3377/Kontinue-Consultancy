import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from '../../../components/ui/CountUp';
import CTASection from '../../../components/sections/CTASection';
import JourneyGraphic from '../../../components/sections/JourneyGraphic';
import Reveal from '../../../components/ui/Reveal';
import SectionHeading from '../../../components/common/SectionHeading';
import ValueCard from '../../../components/cards/ValueCard';
import { aboutStats, kontinueValues } from '../../../data/siteData';

const enterDelay = (ms) => ({ '--enter-delay': `${ms}ms` });

export default function AboutPage() {
  return (
    <>
      {/* Who we are */}
      <section className="about-hero" aria-labelledby="about-title">
        <div className="container about-hero__grid">
          <div className="about-hero__media enter" style={enterDelay(0)}>
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
              alt="A team working together around a shared desk in a bright, open office"
              width="1200"
              height="900"
              fetchPriority="high"
            />
          </div>

          <div className="about-hero__content">
            <p className="eyebrow eyebrow--light enter" style={enterDelay(120)}>Who we are</p>
            <h1 id="about-title" className="heading heading--xl enter" style={enterDelay(200)}>
              Driving Growth &amp; Innovation
            </h1>
            <p className="about-hero__lead enter" style={enterDelay(300)}>
              At kontinue, we believe in the power of continuous evolution. We partner with forward-thinking businesses to
              navigate complexity, streamline operations, and unlock sustainable growth.
            </p>
            <dl className="about-stats enter" style={enterDelay(420)}>
              {aboutStats.map((stat) => (
                <div className="about-stats__item" key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    <CountUp value={stat.value} suffix={stat.suffix} duration={1400} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Vision & purpose */}
      <section className="section">
        <div className="container split">
          <Reveal className="split__copy">
            <p className="eyebrow">Our Vision &amp; Purpose</p>
            <h2 className="heading heading--lg">Empowering businesses to adapt and thrive in an ever-changing landscape.</h2>
            <p>We blend deep expertise with agility to deliver practical, results-driven solutions.</p>
          </Reveal>
          <JourneyGraphic />
        </div>
      </section>

      {/* Values */}
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            centered={false}
            title="The kontinue Way"
            subtitle="Four principles that shape how we work with every client."
          />
          <div className="values-row">
            {kontinueValues.map((value, index) => (
              <ValueCard key={value.title} {...value} delay={index * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* Why partner with us */}
      <section className="section">
        <div className="container split">
          <Reveal className="split__copy">
            <p className="eyebrow">Why Partner With Us?</p>
            <h2 className="heading heading--lg">A partnership designed for your progress.</h2>
            <p>
              We are there when it matters most, delivering consistent excellence and practical, forward-looking strategies
              tailored to your unique challenges.
            </p>
            <Link to="/services" className="button button-outline button--arrow">
              Explore our services <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal className="split__media" delay={100}>
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
              alt="Colleagues in a strategy workshop, one presenting ideas on a wall of sticky notes"
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Partner in Growth, Trust, and Transparency"
        description="Tell us where your business is heading and we will help you get there with clarity."
        buttonText="Let's Get Started"
        buttonTo="/contact"
      />
    </>
  );
}
