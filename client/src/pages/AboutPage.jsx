import { Award, CheckCircle2, Compass, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { teamMembers } from '../data/siteData';

const values = [
  { title: 'Integrity', icon: ShieldCheck },
  { title: 'Accuracy', icon: CheckCircle2 },
  { title: 'Transparency', icon: Compass },
  { title: 'Professionalism', icon: Award },
  { title: 'Client Focus', icon: CheckCircle2 },
];

const history = [
  { year: '2001', title: 'Kontinue Consultancy established', description: 'The company began its consultancy journey with a focus on accounting and financial administration.' },
  { year: '2013', title: 'Kontinue International Consultancy B.V. incorporated', description: 'A separate legal entity was incorporated to support international consultancy activities where relevant.' },
  { year: 'Today', title: 'Continuing the consultancy journey', description: 'The business continues to support organisations with accounting administration and financial consultancy.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Kontinue Consultancy B.V." description="Kontinue Consultancy B.V. is an accounting and financial administration consultancy based in The Hague, Netherlands." />

      <section className="section">
        <div className="container story-grid">
          <div className="story-copy">
            <h2 className="heading heading--lg">A practical, client-focused approach to financial administration.</h2>
            <p>Kontinue Consultancy B.V. is an accounting and financial administration consultancy based in The Hague, Netherlands.</p>
            <p>Established in 2001, the company has developed its presence in the accounting, bookkeeping and financial advisory sector.</p>
            <p>We understand that every organisation has different financial and administrative requirements. Our focus is on helping businesses maintain structured financial records and receive the support they need to manage their financial responsibilities.</p>
            <p>We believe professional financial support should be accessible, understandable and built around the needs of each client.</p>
          </div>
          <div className="card story-image">
            <img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80" alt="Consultancy desk" style={{ borderRadius: 20, height: 500, objectFit: 'cover', width: '100%' }} />
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading title="Our history" subtitle="A timeline of continuity, service and professional financial support." />
          <div className="steps-grid">
            {history.map((item) => (
              <div className="step-card" key={item.year}>
                <div className="step-number" style={{ background: 'var(--forest-green)' }}>{item.year}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Vision & Mission" subtitle="Clear direction, transparent service, and a focus on strong financial foundations." />
          <div className="values-grid">
            <div className="value-box">
              <span>Vision</span>
              <h3>To be a trusted financial and administrative consultancy that helps businesses build stronger financial foundations.</h3>
            </div>
            <div className="value-box">
              <span>Mission</span>
              <h3>To provide professional financial administration and consultancy support through accuracy, transparency and a client-focused approach.</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading title="Core values" subtitle="The principles that guide our work and client relationships." />
          <div className="values-grid">
            {values.map(({ title, icon: Icon }) => (
              <div className="value-box" key={title}>
                <div className="list-icon" style={{ marginBottom: 12 }}><Icon size={18} /></div>
                <h3>{title}</h3>
                <p>Professional conduct grounded in trust, consistency and responsible service.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Our team" subtitle="Professional team profiles will be added when confirmed by the client." />
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div className="team-card" key={member.name}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 18 }} />
                <h3>{member.name}</h3>
                <p style={{ fontWeight: 700, color: '#315c50' }}>{member.designation}</p>
                <p>{member.background}</p>
                <p style={{ marginTop: 12 }}><strong>Qualifications:</strong> {member.qualifications}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
