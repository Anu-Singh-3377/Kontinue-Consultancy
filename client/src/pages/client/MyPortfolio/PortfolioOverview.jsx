import { ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { EmptyState, ErrorNotice, PortalLoading, SuccessNotice } from '../../../components/portal/PortalStates';
import RequestCard from '../../../components/client/RequestCard';
import useMyRequests from '../../../hooks/useMyRequests';

export default function PortfolioOverview() {
  const { requests, loading, error } = useMyRequests();
  const location = useLocation();

  if (loading) return <PortalLoading label="Loading your requests…" />;

  const count = (statuses) => requests.filter((request) => statuses.includes(request.status)).length;
  const cards = [
    { label: 'Total Requests', value: requests.length },
    { label: 'Pending', value: count(['pending', 'new']) },
    { label: 'Under Review', value: count(['under_review', 'contacted', 'in_progress']) },
    { label: 'Scheduled', value: count(['scheduled']) },
    { label: 'Completed', value: count(['completed', 'resolved', 'closed']) },
  ];

  return (
    <div className="portal-stack">
      <SuccessNotice>{location.state?.flash}</SuccessNotice>
      <ErrorNotice>{error}</ErrorNotice>

      <div className="stat-cards stat-cards--five">
        {cards.map((card) => (
          <div className="stat-card" key={card.label}>
            <span className="stat-card__value">{card.value}</span>
            <span className="stat-card__label">{card.label}</span>
          </div>
        ))}
      </div>

      <div className="portal-section-head">
        <h2>Recent requests</h2>
        <Link to="/book-consultation" className="button button-primary button--sm button--arrow">
          Book a Consultation <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No requests yet">
          <p>When you book a consultation or send us a message, you can follow it here.</p>
        </EmptyState>
      ) : (
        <div className="request-list">
          {requests.slice(0, 3).map((request) => <RequestCard key={`${request.type}-${request.id}`} request={request} />)}
        </div>
      )}
    </div>
  );
}
