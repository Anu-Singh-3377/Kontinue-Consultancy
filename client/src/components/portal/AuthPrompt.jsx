import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Shown when a signed-out visitor tries to book or submit a request.
export default function AuthPrompt({
  title = 'Book Your Consultation',
  text = 'To request a consultation, please log in or create an account.',
  next,
  showContinue = true,
}) {
  const query = next ? `?next=${encodeURIComponent(next)}` : '';
  return (
    <div className="auth-prompt" role="region" aria-label={title}>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="auth-prompt__actions">
        <Link to={`/login${query}`} className="button button-navy">
          <LogIn size={17} aria-hidden="true" /> Login
        </Link>
        <Link to={`/register${query}`} className="button button-outline">
          <UserPlus size={17} aria-hidden="true" /> Create an Account
        </Link>
        {showContinue && (
          <Link to="/services" className="auth-prompt__continue">Continue Browsing</Link>
        )}
      </div>
    </div>
  );
}
