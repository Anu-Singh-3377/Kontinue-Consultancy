import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorNotice, PortalLoading } from '../../components/portal/PortalStates';
import RequestCard from './RequestCard';
import useMyRequests from './useMyRequests';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'consultation', label: 'Consultations' },
  { value: 'contact', label: 'Contact' },
];

// "My Requests" (all types) and "Consultations" (type fixed) share this page.
export default function PortfolioRequests({ type }) {
  const { requests, loading, error } = useMyRequests();
  const [filter, setFilter] = useState('all');
  const active = type || filter;

  if (loading) return <PortalLoading label="Loading your requests…" />;

  const visible = active === 'all' ? requests : requests.filter((request) => request.type === active);

  return (
    <div className="portal-stack">
      <div className="portal-section-head">
        <h2>{type === 'consultation' ? 'Consultations' : 'My Requests'}</h2>
        {!type && (
          <div className="segmented" role="group" aria-label="Filter requests">
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={filter === option.value ? 'is-active' : ''}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ErrorNotice>{error}</ErrorNotice>

      {visible.length === 0 ? (
        <EmptyState title="Nothing here yet">
          <p>
            {active === 'contact'
              ? <>Send us a message from the <Link to="/contact">Contact page</Link>.</>
              : <>Ready to talk? <Link to="/book-consultation">Book a consultation</Link>.</>}
          </p>
        </EmptyState>
      ) : (
        <div className="request-list">
          {visible.map((request) => <RequestCard key={`${request.type}-${request.id}`} request={request} />)}
        </div>
      )}
    </div>
  );
}
