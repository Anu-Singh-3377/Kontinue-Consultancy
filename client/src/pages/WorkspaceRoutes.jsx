import { CalendarDays, FileText, Inbox, LayoutDashboard, MessageSquare, UserCog, UserRound, Users } from 'lucide-react';
import { Navigate, Route, useLocation, useParams } from 'react-router-dom';
import RequestManager from '../components/portal/RequestManager';
import RequireAuth from '../components/portal/RequireAuth';
import WorkspaceLayout from '../components/portal/WorkspaceLayout';
import AdminOverview from './admin/AdminOverview';
import AdminRequests from './admin/AdminRequests';
import AdminUsers from './admin/AdminUsers';
import LoginPage from './auth/LoginPage';
import PortfolioMessages from './portfolio/PortfolioMessages';
import PortfolioOverview from './portfolio/PortfolioOverview';
import PortfolioProfile from './portfolio/PortfolioProfile';
import PortfolioRequestDetail from './portfolio/PortfolioRequestDetail';
import PortfolioRequests from './portfolio/PortfolioRequests';
import ServiceDashboard from './service/ServiceDashboard';

const portfolioLinks = [
  { to: '/my-portfolio', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/my-portfolio/requests', label: 'My Requests', icon: FileText },
  { to: '/my-portfolio/consultations', label: 'Consultations', icon: CalendarDays },
  { to: '/my-portfolio/responses', label: 'Responses', icon: MessageSquare },
  { to: '/my-portfolio/profile', label: 'Profile', icon: UserRound },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/consultation-requests', label: 'Consultation Requests', icon: CalendarDays },
  { to: '/admin/contact-requests', label: 'Contact Requests', icon: Inbox },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/service-team', label: 'Service Team', icon: UserCog },
];

const serviceLinks = [
  { to: '/service', label: 'Assigned Consultations', icon: CalendarDays, end: true },
];

function AdminRequestPage({ type }) {
  const { id } = useParams();
  const back = type === 'consultation' ? '/admin/consultation-requests' : '/admin/contact-requests';
  return <RequestManager type={type} id={id} role="admin" backTo={back} backLabel="All requests" />;
}

function ServiceRequestPage() {
  const { id } = useParams();
  return <RequestManager type="consultation" id={id} role="service" backTo="/service" backLabel="Assigned consultations" />;
}

// Old addresses keep working: /portfolio/... → /my-portfolio/...
function LegacyRedirect({ from, to }) {
  const { pathname, search } = useLocation();
  return <Navigate to={pathname.replace(from, to).replace('/messages', '/responses') + search} replace />;
}

// Route elements for the logged-in areas. They are placed inside AppLayout's
// <Routes>, so every one of these pages keeps the site's Header and Footer.
export const workspaceRoutes = (
  <>
    <Route
      path="/my-portfolio"
      element={(
        <RequireAuth roles={['user']} redirectOtherRoles>
          <WorkspaceLayout
            eyebrow="My Portfolio"
            subtitle="Manage your consultation requests and stay updated with the Kontinue team."
            links={portfolioLinks}
            label="My Portfolio"
          />
        </RequireAuth>
      )}
    >
      <Route index element={<PortfolioOverview />} />
      <Route path="requests" element={<PortfolioRequests />} />
      <Route path="requests/:type/:id" element={<PortfolioRequestDetail />} />
      <Route path="consultations" element={<PortfolioRequests type="consultation" />} />
      <Route path="responses" element={<PortfolioMessages />} />
      <Route path="profile" element={<PortfolioProfile />} />
    </Route>
    <Route path="/portfolio/*" element={<LegacyRedirect from="/portfolio" to="/my-portfolio" />} />
    <Route path="/dashboard" element={<Navigate to="/my-portfolio" replace />} />

    <Route path="/service/login" element={<LoginPage variant="service" />} />
    <Route
      path="/service"
      element={(
        <RequireAuth roles={['service']} loginPath="/service/login">
          <WorkspaceLayout
            eyebrow="Consultant Portal"
            subtitle="Your assigned consultations and upcoming appointments."
            links={serviceLinks}
            label="Consultant portal"
          />
        </RequireAuth>
      )}
    >
      <Route index element={<ServiceDashboard />} />
      <Route path="requests/:id" element={<ServiceRequestPage />} />
      <Route path="dashboard" element={<Navigate to="/service" replace />} />
    </Route>

    <Route path="/admin/login" element={<LoginPage variant="admin" />} />
    <Route
      path="/admin"
      element={(
        <RequireAuth roles={['admin']} loginPath="/admin/login">
          <WorkspaceLayout
            eyebrow="Admin"
            subtitle="Manage consultation and contact requests, clients and the service team."
            links={adminLinks}
            label="Admin"
          />
        </RequireAuth>
      )}
    >
      <Route index element={<AdminOverview />} />
      <Route path="dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="consultation-requests" element={<AdminRequests type="consultation" />} />
      <Route path="consultation-requests/:id" element={<AdminRequestPage type="consultation" />} />
      <Route path="contact-requests" element={<AdminRequests type="contact" />} />
      <Route path="contact-requests/:id" element={<AdminRequestPage type="contact" />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="service-team" element={<AdminUsers serviceOnly />} />
    </Route>
  </>
);
