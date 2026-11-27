import { Link, Navigate, useLocation } from 'react-router-dom';
import { homeForRole, useAuth } from '../../context/AuthContext';
import { NotConfigured, PortalLoading } from '../portal/PortalStates';

// Guards a private area. Public pages never use this.
// UI-level only: the database enforces the same rules with Row Level Security.
export default function RequireAuth({ roles, loginPath = '/login', redirectOtherRoles = false, children }) {
  const { configured, user, role, loading } = useAuth();
  const location = useLocation();

  if (!configured) return <NotConfigured />;
  if (loading) return <PortalLoading />;

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${loginPath}?next=${next}`} replace />;
  }

  if (roles && !roles.includes(role)) {
    // Staff opening the client portfolio go to their own dashboard instead.
    if (redirectOtherRoles && role) return <Navigate to={homeForRole(role)} replace />;
    return (
      <div className="portal-state">
        <h1>Access restricted</h1>
        <p>Your account does not have permission to view this area.</p>
        <Link to="/" className="button button-navy">Back to the website</Link>
      </div>
    );
  }

  return children;
}
