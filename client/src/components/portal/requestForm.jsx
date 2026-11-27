import { useEffect, useState } from 'react';

// Form state that survives the login round-trip: a signed-out visitor's input is
// kept in sessionStorage (this tab only) and restored when they come back.
// Cleared after a successful submission and on logout.
export function useDraftForm(storageKey, initialState) {
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
    } catch {
      return initialState;
    }
  });

  const saveDraft = () => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(form));
    } catch {
      // storage unavailable: the visitor re-enters their details
    }
  };

  const clearDraft = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // nothing to clear
    }
  };

  return { form, setForm, saveDraft, clearDraft };
}

// Fill empty contact fields from the signed-in user's profile (never overwrites).
export function usePrefillFromProfile(profile, setForm) {
  useEffect(() => {
    if (!profile) return;
    setForm((current) => ({
      ...current,
      name: current.name || profile.full_name || '',
      email: current.email || profile.email || '',
      phone: current.phone || profile.phone || '',
      address: current.address || profile.address || '',
    }));
  }, [profile, setForm]);
}

export function FormField({ id, label, required, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="field-required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <span id={`${id}-error`} className="field-error">{error}</span>}
    </div>
  );
}

// Props for an input/select/textarea wired to the form state and error message.
export function fieldProps(id, name, form, onChange, errors, required) {
  return {
    id,
    name,
    value: form[name],
    onChange,
    required,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${id}-error` : undefined,
  };
}
