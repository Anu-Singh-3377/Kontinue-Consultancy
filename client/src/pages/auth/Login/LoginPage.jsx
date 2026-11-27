import { Briefcase, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorNotice, NotConfigured, PortalLoading, SuccessNotice } from '../../../components/portal/PortalStates';
import { homeForRole, useAuth } from '../../../context/AuthContext';
import { friendlyError } from '../../../utils/errors';
import { supabase } from '../../../lib/supabaseClient';
import { isEmail, safeRedirect } from '../../../utils/validation';
import AuthShell from '../../../layouts/AuthShell';

const VARIANTS = {
  user: {
    title: 'Client login',
    subtitle: 'Access My Portfolio to book consultations and track your requests.',
    roles: ['user', 'service', 'admin'],
  },
  admin: {
    title: 'Admin login',
    subtitle: 'Restricted to Kontinue administrators.',
    roles: ['admin'],
    denied: 'This account does not have administrator access. Use Client login instead.',
  },
  service: {
    title: 'Consultant login',
    subtitle: 'For authorised Kontinue consultants.',
    roles: ['service'],
    denied: 'This account is not an authorised consultant account.',
  },
};

// The three login options shown on /login, /service/login and /admin/login.
const TABS = [
  { mode: 'user', label: 'Client', icon: UserRound },
  { mode: 'service', label: 'Consultant', icon: Briefcase },
  { mode: 'admin', label: 'Admin', icon: ShieldCheck },
];

// Which part of the site a "next" link belongs to.
const areaOf = (path) => (path.startsWith('/admin') ? 'admin' : path.startsWith('/service') ? 'service' : 'user');

export default function LoginPage({ variant = 'user' }) {
  const [mode, setMode] = useState(variant);
  const config = VARIANTS[mode];

  const { configured, user, role, loading, refreshProfile, signOut } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const requested = safeRedirect(params.get('next'), null);
  // Only follow a "next" link that belongs to the area being logged into.
  const next = requested && areaOf(requested) === mode ? requested : null;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resend, setResend] = useState('');

  if (!configured) return <NotConfigured />;
  if (loading) return <PortalLoading />;

  // Already signed in with a suitable role: go straight on.
  if (user && config.roles.includes(role) && !submitting) {
    return <Navigate to={next || homeForRole(role)} replace />;
  }

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setErrors({});
    setNeedsConfirmation(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError('');

    const fieldErrors = {};
    if (!isEmail(form.email)) fieldErrors.email = 'Enter a valid email address.';
    if (!form.password) fieldErrors.password = 'Enter your password.';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSubmitting(true);
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });
      if (signInError) throw signInError;

      const profile = await refreshProfile(signInData.user.id);
      const signedInRole = profile?.is_active ? profile.role : null;

      if (!config.roles.includes(signedInRole)) {
        await signOut();
        if (!profile) {
          setError('Your account profile could not be loaded. Please try again shortly or contact Kontinue.');
        } else if (!profile.is_active) {
          setError('This account has been deactivated. Please contact Kontinue.');
        } else {
          setError(config.denied || 'This account cannot be used here. Please contact Kontinue.');
        }
        return;
      }

      navigate(next || homeForRole(signedInRole), { replace: true });
    } catch (signInError) {
      const unconfirmed = String(signInError?.message || '').toLowerCase().includes('email not confirmed')
        || signInError?.code === 'email_not_confirmed';
      setNeedsConfirmation(unconfirmed);
      setError(friendlyError(signInError));
    } finally {
      setSubmitting(false);
    }
  };

  const resendConfirmation = async () => {
    if (resend === 'sending') return;
    setResend('sending');
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: form.email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/login${next ? `?next=${encodeURIComponent(next)}` : ''}` },
    });
    if (resendError) {
      setResend('');
      setError(friendlyError(resendError));
    } else {
      setResend('sent');
    }
  };

  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : '';

  const footer = (
    <>
      {mode === 'user' && (
        <p>New to Kontinue? <Link to={`/register${nextQuery}`}>Create an account</Link></p>
      )}
      {mode === 'service' && <p>Consultant accounts are set up by a Kontinue administrator.</p>}
      {mode === 'admin' && <p>Admin access is granted by an existing Kontinue administrator.</p>}
    </>
  );

  return (
    <AuthShell
      title={config.title}
      subtitle={config.subtitle}
      footer={footer}
    >
      <div className="login-tabs" role="group" aria-label="Choose login type">
        {TABS.map(({ mode: tabMode, label, icon: Icon }) => (
          <button
            key={tabMode}
            type="button"
            className={mode === tabMode ? 'is-active' : ''}
            aria-pressed={mode === tabMode}
            onClick={() => switchMode(tabMode)}
          >
            <Icon size={16} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <ErrorNotice>{error}</ErrorNotice>
        {needsConfirmation && (
          resend === 'sent' ? (
            <SuccessNotice>A new confirmation link has been sent to {form.email.trim()}. Check your inbox and spam folder.</SuccessNotice>
          ) : (
            <button type="button" className="button button-outline" onClick={resendConfirmation} disabled={resend === 'sending'}>
              {resend === 'sending' ? 'Sending…' : 'Resend confirmation email'}
            </button>
          )
        )}
        <div className="field">
          <label htmlFor="login-email">{{ admin: 'Admin email', service: 'Consultant email' }[mode] || 'Email'}</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
          {errors.email && <span id="login-email-error" className="field-error">{errors.email}</span>}
        </div>
        <div className="field">
          <div className="field__label-row">
            <label htmlFor="login-password">Password</label>
            <Link to="/forgot-password" className="field__link">Forgot Password?</Link>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
          />
          {errors.password && <span id="login-password-error" className="field-error">{errors.password}</span>}
        </div>
        <button type="submit" className="button button-navy" disabled={submitting}>
          {submitting ? 'Logging in…' : { admin: 'Login as Admin', service: 'Login as Consultant' }[mode] || 'Login'}
        </button>
        {mode === 'user' && (
          <Link to={`/register${nextQuery}`} className="button button-outline">Create Account</Link>
        )}
      </form>
    </AuthShell>
  );
}
