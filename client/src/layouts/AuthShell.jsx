// Card layout for all login / register / password screens. Rendered inside the
// normal website (Header and Footer come from SiteLayout).
export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-card__title">{title}</h1>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="auth-card__footer">{footer}</div>}
      </div>
    </section>
  );
}
