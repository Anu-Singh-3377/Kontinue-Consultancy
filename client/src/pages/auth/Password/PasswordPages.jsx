import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorNotice, NotConfigured, PortalLoading, SuccessNotice } from '../../../components/portal/PortalStates';
import { useAuth } from '../../../context/AuthContext';
import { friendlyError } from '../../../utils/errors';
import { supabase } from '../../../lib/supabaseClient';
import { isEmail, passwordProblem } from '../../../utils/validation';
import AuthShell from '../../../layouts/AuthShell';

export function ForgotPasswordPage() {
  const { configured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!configured) return <NotConfigured />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!isEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    // Same message whether or not the account exists, so emails can't be probed.
    if (resetError && Number(resetError.status) !== 400) setError(friendlyError(resetError));
    else setSent(true);
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email and we will send you a reset link."
      footer={<Link to="/login">Back to login</Link>}
    >
      {sent ? (
        <SuccessNotice>If an account exists for {email.trim()}, a password reset link is on its way.</SuccessNotice>
      ) : (
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <ErrorNotice>{error}</ErrorNotice>
          <div className="field">
            <label htmlFor="forgot-email">Email</label>
            <input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <button type="submit" className="button button-navy" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export function ResetPasswordPage() {
  const { configured, user, loading, setRecovering } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!configured) return <NotConfigured />;
  if (loading) return <PortalLoading />;

  if (!user) {
    return (
      <AuthShell title="Link expired" subtitle="This password reset link is invalid or has expired.">
        <Link to="/forgot-password" className="button button-navy">Request a new link</Link>
      </AuthShell>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const problem = passwordProblem(form.password);
    if (problem) return setError(problem);
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setError('');
    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: form.password });
    setSubmitting(false);
    if (updateError) return setError(friendlyError(updateError));
    setRecovering(false);
    navigate('/my-portfolio', { replace: true, state: { flash: 'Your password has been updated.' } });
    return undefined;
  };

  return (
    <AuthShell title="Choose a new password" subtitle="At least 8 characters, with upper- and lower-case letters and a number.">
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <ErrorNotice>{error}</ErrorNotice>
        <div className="field">
          <label htmlFor="reset-password">New password</label>
          <input id="reset-password" type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="reset-confirm">Confirm new password</label>
          <input id="reset-confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} />
        </div>
        <button type="submit" className="button button-navy" disabled={submitting}>
          {submitting ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  );
}
