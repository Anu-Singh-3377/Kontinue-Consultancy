import { useState } from 'react';
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
  message: '',
  consent: false,
};

const REQUIRED = { name: 'Full name', email: 'Email', phone: 'Phone', address: 'Address', message: 'Message' };

export default function ContactForm() {
  const { configured, user, profile } = useAuth();
  const location = useLocation();
  const { form, setForm, saveDraft, clearDraft } = useDraftForm('kontinue:contact-draft', initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [needsLogin, setNeedsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  usePrefillFromProfile(profile, setForm);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const fieldErrors = requireFields(form, REQUIRED);
    if (form.email && !isEmail(form.email)) fieldErrors.email = 'Enter a valid email address.';
    if (form.phone && !isPhone(form.phone)) fieldErrors.phone = 'Enter a valid phone number.';
    if (!form.consent) fieldErrors.consent = 'Please accept the privacy policy consent.';
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
      setStatus({ type: 'error', message: 'Online requests are not available yet. Please try again later.' });
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
        .from('contact_requests')
        .insert({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          company: form.company.trim() || null,
          service: form.service || null,
          message: form.message.trim(),
        })
        .select('id, reference')
        .single();
      if (error) throw error;

      notifyByEmail('/api/contact', { ...form, reference: data.reference });
      clearDraft();
      setForm({ ...initialState, name: form.name, email: form.email, phone: form.phone, address: form.address });
      setErrors({});
      setStatus({
        type: 'success',
        message: `Your message has been submitted successfully. Our team will review your request and get back to you. Reference: ${data.reference}`,
        id: data.id,
      });
    } catch (error) {
      setStatus({ type: 'error', message: friendlyError(error) });
    } finally {
      setLoading(false);
    }
  };

  const props = (id, name, required = false) => fieldProps(id, name, form, handleChange, errors, required);

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      <FormField id="name" label="Full Name" required error={errors.name}>
        <input {...props('name', 'name', true)} autoComplete="name" placeholder="Your name" />
      </FormField>
      <FormField id="company" label="Company Name">
        <input {...props('company', 'company')} autoComplete="organization" placeholder="Company or business name (optional)" />
      </FormField>
      <FormField id="email" label="Email Address" required error={errors.email}>
        <input {...props('email', 'email', true)} type="email" autoComplete="email" placeholder="you@example.com" />
      </FormField>
      <FormField id="phone" label="Phone Number" required error={errors.phone}>
        <input {...props('phone', 'phone', true)} type="tel" autoComplete="tel" placeholder="+31 …" />
      </FormField>
      <FormField id="address" label="Address" required error={errors.address}>
        <input {...props('address', 'address', true)} autoComplete="street-address" placeholder="Street, city, postcode" />
      </FormField>
      <FormField id="service" label="Service of Interest">
        <select {...props('service', 'service')}>
          <option value="">Select a service (optional)</option>
          {SERVICE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
        </select>
      </FormField>
      <FormField id="message" label="Message" required error={errors.message}>
        <textarea {...props('message', 'message', true)} placeholder="Tell us about your business needs" />
      </FormField>
      <label className="checkbox">
        <input
          type="checkbox"
          name="consent"
          checked={form.consent}
          onChange={handleChange}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
        />
        <span>I consent to the processing of my information in accordance with the privacy policy.</span>
      </label>
      {errors.consent && <span id="consent-error" className="field-error">{errors.consent}</span>}

      {needsLogin && !user ? (
        <AuthPrompt
          title="Log in to send your message"
          text="Please log in or create an account to submit your request. Your message will be kept."
          next={`${location.pathname}#contact-form`}
          showContinue={false}
        />
      ) : (
        <button type="submit" className="button button-primary" disabled={loading}>
          {loading ? 'Submitting…' : 'Send Enquiry'}
        </button>
      )}

      {status.message && (
        <div className={`form-status ${status.type === 'error' ? 'form-status--error' : 'form-status--success'}`} role={status.type === 'error' ? 'alert' : 'status'}>
          {status.message}
          {status.type === 'success' && (
            <> <Link to={`/my-portfolio/requests/contact/${status.id}`}>Track it in My Portfolio</Link></>
          )}
        </div>
      )}
    </form>
  );
}
