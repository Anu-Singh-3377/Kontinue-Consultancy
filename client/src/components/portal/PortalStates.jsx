import { Link } from 'react-router-dom';

export function PortalLoading({ label = 'Loading…' }) {
  return (
    <div className="portal-state" role="status" aria-live="polite">
      <span className="portal-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function NotConfigured() {
  return (
    <div className="portal-state">
      <h1>Accounts are not available yet</h1>
      <p>Online accounts and booking are being set up. In the meantime, please browse the website or contact us.</p>
      <Link to="/" className="button button-navy">Back to the website</Link>
    </div>
  );
}

export function ErrorNotice({ children }) {
  if (!children) return null;
  return <div className="portal-alert portal-alert--error" role="alert">{children}</div>;
}

export function SuccessNotice({ children }) {
  if (!children) return null;
  return <div className="portal-alert portal-alert--success" role="status">{children}</div>;
}

export function EmptyState({ title, children }) {
  return (
    <div className="portal-empty">
      <p className="portal-empty__title">{title}</p>
      {children}
    </div>
  );
}
