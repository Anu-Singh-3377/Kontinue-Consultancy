import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../utils/errors';
import { notifyByEmail, SERVICE_OPTIONS } from '../../services/requestService';
import { supabase } from '../../lib/supabaseClient';
import { isEmail, isPhone, requireFields } from '../../utils/validation';
import AuthPrompt from '../auth/AuthPrompt';
import { FormField, fieldProps, useDraftForm, usePrefillFromProfile } from './requestForm';

const initialState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  service: '',
  preferredDate: '',
  preferredTime: '',
  message: '',
};

const REQUIRED = {
  name: 'Full name',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  service: 'Service',
  preferredDate: 'Preferred date',
  preferredTime: 'Preferred time',
  message: 'Message',
};

const today = () => new Date().toISOString().slice(0, 10);

export default function ConsultationForm({ idPrefix = 'consult' }) {
  const { configured, user, profile } = useAuth();
  const location = useLocation();
  const { form, setForm, saveDraft, clearDraft } = useDraftForm('kontinue:consultation-draft', initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [needsLogin, setNeedsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  usePrefillFromProfile(profile, setForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const fieldErrors = requireFields(form, REQUIRED);
    if (form.email && !isEmail(form.email)) fieldErrors.email = 'Enter a valid email address.';
    if (form.phone && !isPhone(form.phone)) fieldErrors.phone = 'Enter a valid phone number.';
    if (form.preferredDate && form.preferredDate < today()) fieldErrors.preferredDate = 'Choose today or a future date.';
    return fieldErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setStatus({ type: '', message: '' });

    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) {
      setStatus({ type: 'error', message: 'Please complete the highlighted fields.' });
      return;
    }

    if (!configured) {
      setStatus({ type: 'error', message: 'Online booking is not available yet. Please try again later.' });
      return;
    }

    if (!user) {
      saveDraft();
      setNeedsLogin(true);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .insert({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          company: form.company.trim() || null,
          service: form.service,
          preferred_date: form.preferredDate,
          preferred_time: form.preferredTime,
          message: form.message.trim(),
        })
        .select('id, reference')
        .single();
      if (error) throw error;

      notifyByEmail('/api/consultation', { ...form, reference: data.reference });
      clearDraft();
      setSubmitted(data);
      setForm({ ...initialState, name: form.name, email: form.email, phone: form.phone, address: form.address, company: form.company });
      setErrors({});
    } catch (error) {
      setStatus({ type: 'error', message: friendlyError(error) });
    } finally {
      setLoading(false);
    }
  };

  // Success state shown in place of the form, on the same page.
  if (submitted) {
    return (
      <div className="booking-success" role="status" aria-live="polite">
        <CheckCircle2 className="booking-success__icon" size={36} aria-hidden="true" />
        <h3>Consultation Request Submitted</h3>
        <p>Thank you. Your request has been submitted successfully. Our team will review it and contact you regarding the next steps.</p>
        <p className="booking-success__ref">Request ID: <strong>{submitted.reference}</strong></p>
        <p>You can track your request from My Portfolio.</p>
        <div className="booking-success__actions">
          <Link to={`/my-portfolio/requests/consultation/${submitted.id}`} className="button button-navy">View My Request</Link>
          <Link to="/my-portfolio" className="button button-outline">Go to My Portfolio</Link>
          <button type="button" className="booking-success__again" onClick={() => setSubmitted(null)}>Book another consultation</button>
        </div>
      </div>
    );
  }

  const id = (name) => `${idPrefix}-${name}`;
  const props = (name, required = true) => fieldProps(id(name), name, form, handleChange, errors, required);

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      <FormField id={id('name')} label="Full Name" required error={errors.name}>
        <input {...props('name')} autoComplete="name" placeholder="Your full name" />
      </FormField>
      <FormField id={id('company')} label="Company">
        <input {...props('company', false)} autoComplete="organization" placeholder="Company name (optional)" />
      </FormField>
      <FormField id={id('email')} label="Email" required error={errors.email}>
        <input {...props('email')} type="email" autoComplete="email" placeholder="Email address" />
      </FormField>
      <FormField id={id('phone')} label="Phone" required error={errors.phone}>
        <input {...props('phone')} type="tel" autoComplete="tel" placeholder="Phone number" />
      </FormField>
      <FormField id={id('address')} label="Address" required error={errors.address}>
        <input {...props('address')} autoComplete="street-address" placeholder="Street, city, postcode" />
      </FormField>
      <FormField id={id('service')} label="Service" required error={errors.service}>
        <select {...props('service')}>
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
        </select>
      </FormField>
      <FormField id={id('preferredDate')} label="Preferred Date" required error={errors.preferredDate}>
        <input {...props('preferredDate')} type="date" min={today()} />
      </FormField>
      <FormField id={id('preferredTime')} label="Preferred Time" required error={errors.preferredTime}>
        <input {...props('preferredTime')} type="time" />
      </FormField>
      <FormField id={id('message')} label="Message" required error={errors.message}>
        <textarea {...props('message')} placeholder="Tell us how we can help" />
      </FormField>

      {needsLogin && !user ? (
        <AuthPrompt next={location.pathname} showContinue={false} />
      ) : (
        <button type="submit" className="button button-primary" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Consultation Request'}
        </button>
      )}

      {status.message && (
        <div className={`form-status ${status.type === 'error' ? 'form-status--error' : 'form-status--success'}`} role="alert">
          {status.message}
        </div>
      )}
    </form>
  );
}
