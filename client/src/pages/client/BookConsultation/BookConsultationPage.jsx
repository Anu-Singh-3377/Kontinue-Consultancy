import { CalendarCheck, Clock, ShieldCheck } from 'lucide-react';
import ConsultationForm from '../../../components/forms/ConsultationForm';
import PageHero from '../../../components/common/PageHero';
import AuthPrompt from '../../../components/auth/AuthPrompt';
import { useAuth } from '../../../context/AuthContext';

const reassurance = [
  { icon: CalendarCheck, text: 'Choose a preferred date and time; we confirm the slot with you.' },
  { icon: Clock, text: 'We aim to respond within 1–2 business days.' },
  { icon: ShieldCheck, text: 'Your details are stored securely and only seen by our team.' },
];

// Public page. Only submitting the booking requires an account.
export default function BookConsultationPage() {
  const { user, loading, configured } = useAuth();

  return (
    <>
      <PageHero
        title="Book a Consultation"
        description="Tell us what your business needs and when suits you. We will review your request and confirm the next steps."
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container book-layout">
          <aside className="book-layout__aside">
            <h2 className="heading heading--md">What happens next</h2>
            <ul className="book-steps">
              {reassurance.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <span className="contact-item__icon"><Icon size={18} aria-hidden="true" /></span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="book-layout__main">
            {configured && !loading && !user && (
              <AuthPrompt next="/book-consultation" />
            )}
            <div className="form-card" id="book-consultation">
              <h3 style={{ marginTop: 0 }}>Your consultation request</h3>
              <ConsultationForm idPrefix="book" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
