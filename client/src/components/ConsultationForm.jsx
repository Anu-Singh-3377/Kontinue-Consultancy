import { useState } from 'react';

const initialState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: 'Bookkeeping & Accounting',
  preferredDate: '',
  preferredTime: '',
  message: '',
};

export default function ConsultationForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!form.name || !form.email || !form.preferredDate || !form.preferredTime) {
      setStatus({ type: 'error', message: 'Please complete your name, email and preferred consultation date/time.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'The consultation request could not be submitted.');
      }

      setStatus({ type: 'success', message: payload.message || 'Your consultation request has been received.' });
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
        <label htmlFor="consult-name">Name</label>
        <input id="consult-name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
      </div>
      <div className="field">
        <label htmlFor="consult-company">Company</label>
        <input id="consult-company" name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
      </div>
      <div className="field">
        <label htmlFor="consult-email">Email</label>
        <input id="consult-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" />
      </div>
      <div className="field">
        <label htmlFor="consult-phone">Phone</label>
        <input id="consult-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
      </div>
      <div className="field">
        <label htmlFor="consult-date">Preferred date</label>
        <input id="consult-date" name="preferredDate" type="date" value={form.preferredDate} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="consult-time">Preferred time</label>
        <input id="consult-time" name="preferredTime" type="time" value={form.preferredTime} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="consult-service">Service</label>
        <select id="consult-service" name="service" value={form.service} onChange={handleChange}>
          <option>Bookkeeping &amp; Accounting</option>
          <option>Annual Accounts</option>
          <option>Tax Advisory</option>
          <option>Financial Management</option>
          <option>Payroll Administration</option>
          <option>Other Enquiry</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="consult-message">Message</label>
        <textarea id="consult-message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help" />
      </div>
      <button type="submit" className="button button-primary" disabled={loading}>{loading ? 'Submitting…' : 'Submit Consultation Request'}</button>
      {status.message && (
        <div className={`form-status ${status.type === 'error' ? 'form-status--error' : 'form-status--success'}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}
