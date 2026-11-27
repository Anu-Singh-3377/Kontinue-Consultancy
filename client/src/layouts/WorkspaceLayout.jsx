import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Logged-in area (client portfolio, consultant, admin) rendered as a normal page
// of the Kontinue website: it sits between the site's own Header and Footer
// (provided by SiteLayout) and adds only a welcome banner and section tabs.
export default function WorkspaceLayout({ eyebrow, subtitle, links, label }) {
  const { profile } = useAuth();
  const firstName = (profile?.full_name || '').split(' ')[0];

  return (
    <section className="workspace">
      <div className="workspace__banner">
        <div className="container">
          <p className="eyebrow eyebrow--light">{eyebrow}</p>
          <h1 className="heading heading--lg">Welcome{firstName ? `, ${firstName}` : ''}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="container">
        <nav className="workspace__tabs" aria-label={label}>
          {links.map(({ to, label: text, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `workspace__tab ${isActive ? 'is-active' : ''}`}>
              <Icon size={17} aria-hidden="true" />
              <span>{text}</span>
            </NavLink>
          ))}
        </nav>
        <div className="workspace__content">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
