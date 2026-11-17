import { useState } from 'react';

const initialState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: 'Bookkeeping & Accounting',
  message: '',
  consent: false,
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!form.name || !form.email || !form.message || !form.consent) {
      setStatus({ type: 'error', message: 'Please complete the required fields and accept the privacy policy consent.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Unable to send your enquiry right now.');
      }

      setStatus({ type: 'success', message: payload.message || 'Your enquiry has been sent successfully.' });
      setForm(initialState);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      <div className="field">
        <label htmlFor="name">Full Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
      </div>
      <div className="field">
        <label htmlFor="company">Company Name</label>
        <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Company or business name" />
      </div>
      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Optional" />
      </div>
      <div className="field">
        <label htmlFor="service">Service Required</label>
        <select id="service" name="service" value={form.service} onChange={handleChange}>
          <option>Bookkeeping &amp; Accounting</option>
          <option>Annual Accounts</option>
          <option>Tax Advisory</option>
          <option>Financial Management</option>
          <option>Payroll Administration</option>
          <option>Other Enquiry</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your business needs" />
      </div>
      <label className="checkbox">
        <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
        <span>I consent to the processing of my information in accordance with the privacy policy.</span>
      </label>
      <button type="submit" className="button button-primary" disabled={loading}>
        {loading ? 'Sending…' : 'Send Enquiry'}
      </button>
      {status.message && (
        <div className={`form-status ${status.type === 'error' ? 'form-status--error' : 'form-status--success'}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}
