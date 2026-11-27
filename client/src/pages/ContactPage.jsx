import { Mail, MapPin, MessageSquareText, Phone } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import ConsultationForm from '../components/ConsultationForm';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

const contactDetails = [
  { icon: MapPin, label: 'Location', value: 'The Hague, Netherlands' },
  { icon: Mail, label: 'Email', value: 'Email enquiries available on request' },
  { icon: Phone, label: 'Phone', value: 'Phone number available on request' },
  { icon: MessageSquareText, label: 'Response', value: 'We aim to respond within 1–2 business days' },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact"
        description="Tell us about your business needs and we will discuss the right support for your financial administration."
        image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85"
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <SectionHeading title="Get in touch" subtitle="We welcome initial enquiries from business owners, founders and organisations seeking practical financial support." centered={false} />
            <div className="contact-list">
              {contactDetails.map(({ icon: Icon, label, value }) => (
                <div className="contact-item" key={label}>
                  <div className="contact-item__icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#14233b' }}>{label}</strong>
                    <span style={{ color: '#5b6576' }}>{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-card">
            <h3 style={{ marginTop: 0 }}>Send an enquiry</h3>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading title="Book a consultation" subtitle="Share your preferred date and time and we will follow up to arrange a suitable conversation." />
          <div className="form-card" style={{ maxWidth: 980, margin: '0 auto' }}>
            <ConsultationForm />
          </div>
        </div>
      </section>
    </>
  );
}
