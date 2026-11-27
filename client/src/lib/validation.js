const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-().]{7,30}$/;

export const isEmail = (value) => EMAIL_RE.test(String(value).trim());

export const isPhone = (value) => {
  const text = String(value).trim();
  return PHONE_RE.test(text) && text.replace(/\D/g, '').length >= 7;
};

export function passwordProblem(password) {
  if (password.length < 8) return 'Use at least 8 characters.';
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) return 'Use both upper- and lower-case letters.';
  if (!/[0-9]/.test(password)) return 'Include at least one number.';
  return '';
}

// Returns { field: message } for empty required fields.
export function requireFields(values, labels) {
  const errors = {};
  Object.entries(labels).forEach(([field, label]) => {
    if (!String(values[field] ?? '').trim()) errors[field] = `${label} is required.`;
  });
  return errors;
}

// Only allow same-site relative redirects (prevents open redirects).
export function safeRedirect(path, fallback = '/my-portfolio') {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return fallback;
  return path;
}
