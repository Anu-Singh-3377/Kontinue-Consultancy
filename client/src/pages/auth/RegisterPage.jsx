import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorNotice, NotConfigured, PortalLoading, SuccessNotice } from '../../components/portal/PortalStates';
import { homeForRole, useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../lib/errors';
import { supabase } from '../../lib/supabaseClient';
import { isEmail, isPhone, passwordProblem, requireFields, safeRedirect } from '../../lib/validation';
import AuthShell from './AuthShell';

const FIELDS = [
  { name: 'fullName', label: 'Full Name', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { name: 'address', label: 'Address', autoComplete: 'street-address', multiline: true },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', hint: 'At least 8 characters, with upper- and lower-case letters and a number.' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', autoComplete: 'new-password' },
];

const empty = Object.fromEntries(FIELDS.map((field) => [field.name, '']));

export default function RegisterPage() {
  const { configured, user, role, loading } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = safeRedirect(params.get('next'), null);

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  if (!configured) return <NotConfigured />;
  if (loading) return <PortalLoading />;
  if (user && !submitting) return <Navigate to={next || homeForRole(role)} replace />;

  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : '';

  if (confirmationSent) {
    return (
      <AuthShell title="Check your email" subtitle={`We sent a confirmation link to ${form.email.trim()}.`}>
        <SuccessNotice>Confirm your email address, then log in to continue.</SuccessNotice>
        <Link to={`/login${nextQuery}`} className="button button-navy">Go to login</Link>
      </AuthShell>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const fieldErrors = requireFields(form, Object.fromEntries(FIELDS.map((field) => [field.name, field.label])));
    if (form.email && !isEmail(form.email)) fieldErrors.email = 'Enter a valid email address.';
    if (form.phone && !isPhone(form.phone)) fieldErrors.phone = 'Enter a valid phone number (at least 7 digits).';
    if (form.password) {
      const problem = passwordProblem(form.password);
      if (problem) fieldErrors.password = problem;
    }
    if (form.confirmPassword && form.confirmPassword !== form.password) {
      fieldErrors.confirmPassword = 'Passwords do not match.';
    }
    return fieldErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError('');
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSubmitting(true);
    try {
      // Role is never sent: the database always creates new profiles as 'user'.
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login${nextQuery}`,
        },
      });
      if (signUpError) throw signUpError;

      // Supabase hides existing accounts by returning a user with no identities.
      if (data.user && data.user.identities?.length === 0) {
        setError('An account with this email already exists. Please log in instead.');
        return;
      }

      if (data.session) {
        navigate(next || '/my-portfolio', { replace: true });
      } else {
        setConfirmationSent(true);
      }
    } catch (signUpError) {
      setError(friendlyError(signUpError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create an account"
      subtitle="Book consultations and follow every request in My Portfolio."
      footer={<>Already have an account? <Link to={`/login${nextQuery}`}>Log in</Link></>}
    >
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <ErrorNotice>{error}</ErrorNotice>
        {FIELDS.map((field) => {
          const id = `register-${field.name}`;
          const describedBy = [field.hint && `${id}-hint`, errors[field.name] && `${id}-error`].filter(Boolean).join(' ') || undefined;
          const shared = {
            id,
            name: field.name,
            value: form[field.name],
            onChange: handleChange,
            autoComplete: field.autoComplete,
            required: true,
            'aria-invalid': Boolean(errors[field.name]),
            'aria-describedby': describedBy,
          };
          return (
            <div className="field" key={field.name}>
              <label htmlFor={id}>{field.label} <span aria-hidden="true">*</span></label>
              {field.multiline ? <textarea rows={2} {...shared} /> : <input type={field.type || 'text'} {...shared} />}
              {field.hint && <span id={`${id}-hint`} className="field-hint">{field.hint}</span>}
              {errors[field.name] && <span id={`${id}-error`} className="field-error">{errors[field.name]}</span>}
            </div>
          );
        })}
        <button type="submit" className="button button-navy" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  );
}
