import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kontinu-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem(STORAGE_KEY);
    setVisible(value === null);
  }, []);

  const accept = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <strong>Cookie preferences</strong>
      <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.82)' }}>
        We use cookies to improve the website experience and understand usage. Your choice is respected.
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="button button-primary" onClick={() => accept('accept')}>Accept</button>
        <button type="button" className="button button-light" onClick={() => accept('reject')}>Reject</button>
        <button type="button" className="button button-ghost" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }} onClick={() => accept('manage')}>Manage Preferences</button>
      </div>
    </div>
  );
}
