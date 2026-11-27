import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorNotice, SuccessNotice } from '../../../components/portal/PortalStates';
import { FormField } from '../../../components/forms/requestForm';
import { useAuth } from '../../../context/AuthContext';
import { friendlyError } from '../../../utils/errors';
import { supabase } from '../../../lib/supabaseClient';
import { isPhone, requireFields } from '../../../utils/validation';

export default function PortfolioProfile() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name, phone: profile.phone, address: profile.address });
  }, [profile]);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const fieldErrors = requireFields(form, { full_name: 'Full name', phone: 'Phone', address: 'Address' });
    if (form.phone && !isPhone(form.phone)) fieldErrors.phone = 'Enter a valid phone number.';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSaving(true);
    setStatus({ type: '', message: '' });
    // Only these three columns are sent; role/email changes are blocked in the database.
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name.trim(), phone: form.phone.trim(), address: form.address.trim() })
      .eq('id', profile.id);
    setSaving(false);
    if (error) return setStatus({ type: 'error', message: friendlyError(error) });
    await refreshProfile();
    setStatus({ type: 'success', message: 'Your profile has been updated.' });
    return undefined;
  };

  return (
    <div className="portal-stack">
      <div className="portal-section-head"><h2>Profile</h2></div>
      <form className="portal-card form-grid profile-form" onSubmit={handleSubmit} noValidate>
        {status.type === 'error' ? <ErrorNotice>{status.message}</ErrorNotice> : <SuccessNotice>{status.message}</SuccessNotice>}
        <FormField id="profile-email" label="Email">
          <input id="profile-email" value={profile?.email || ''} disabled />
        </FormField>
        <FormField id="profile-name" label="Full Name" required error={errors.full_name}>
          <input id="profile-name" name="full_name" value={form.full_name} onChange={handleChange} autoComplete="name" />
        </FormField>
        <FormField id="profile-phone" label="Phone" required error={errors.phone}>
          <input id="profile-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" />
        </FormField>
        <FormField id="profile-address" label="Address" required error={errors.address}>
          <textarea id="profile-address" name="address" rows={2} value={form.address} onChange={handleChange} autoComplete="street-address" />
        </FormField>
        <div className="profile-form__actions">
          <button type="submit" className="button button-navy" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          <Link to="/forgot-password" className="card-link">Change password</Link>
        </div>
      </form>
    </div>
  );
}
