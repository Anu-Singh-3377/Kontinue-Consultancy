import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import RequestTimeline from '../../../components/portal/RequestTimeline';
import { EmptyState, ErrorNotice, PortalLoading, SuccessNotice } from '../../../components/portal/PortalStates';
import StatusBadge from '../../../components/portal/StatusBadge';
import { friendlyError } from '../../../utils/errors';
import { fetchRequest, fetchUpdates, formatDate, formatDateTime, formatTime, REQUEST_TYPES } from '../../../services/requestService';

export default function PortfolioRequestDetail() {
  const { type, id } = useParams();
  const location = useLocation();
  const [request, setRequest] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const validType = Boolean(REQUEST_TYPES[type]);

  useEffect(() => {
    if (!validType) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [requestResult, updatesResult] = await Promise.all([fetchRequest(type, id), fetchUpdates(type, id)]);
      if (cancelled) return;
      const failure = requestResult.error || updatesResult.error;
      if (failure) setError(friendlyError(failure));
      setRequest(requestResult.data);
      setUpdates(updatesResult.data || []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [type, id, validType]);

  if (!validType) return <EmptyState title="Request not found" />;
  if (loading) return <PortalLoading label="Loading request…" />;
  if (!request) {
    return (
      <EmptyState title="Request not found">
        <ErrorNotice>{error}</ErrorNotice>
        <p><Link to="/my-portfolio/requests">Back to My Requests</Link></p>
      </EmptyState>
    );
  }

  const responses = updates.filter((update) => update.kind === 'response');
  const latestResponse = responses[responses.length - 1];
  const isConsultation = type === 'consultation';

  const fields = [
    ['Request ID', request.reference],
    ['Request Type', REQUEST_TYPES[type].label],
    ['Service', request.service || 'General enquiry'],
    ['Name', request.name],
    ['Email', request.email],
    ['Phone', request.phone],
    ['Address', request.address],
    ...(request.company ? [['Company', request.company]] : []),
    ...(isConsultation ? [['Preferred Date', formatDate(request.preferred_date)], ['Preferred Time', formatTime(request.preferred_time)]] : []),
    ['Submitted', formatDateTime(request.created_at)],
  ];

  return (
    <div className="portal-stack">
      <SuccessNotice>{location.state?.flash}</SuccessNotice>
      <Link to="/my-portfolio/requests" className="portal-back"><ArrowLeft size={16} aria-hidden="true" /> My Requests</Link>

      <div className="portal-section-head">
        <h2>{REQUEST_TYPES[type].label}</h2>
        <StatusBadge status={request.status} />
      </div>

      <div className="detail-grid">
        <div className="portal-card">
          <h3>Request details</h3>
          <dl className="detail-list">
            {fields.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          <h4>Message</h4>
          <p className="detail-message">{request.message}</p>
        </div>

        <div className="portal-stack">
          <div className="portal-card portal-card--response">
            <h3>Kontinue response</h3>
            {latestResponse ? (
              <>
                <blockquote className="response-quote">{latestResponse.message}</blockquote>
                <p className="text-muted response-meta">— Kontinue Consultancy Team · {formatDateTime(latestResponse.created_at)}</p>
              </>
            ) : (
              <p className="text-muted">Our team will respond here. You can check back at any time.</p>
            )}
          </div>

          <div className="portal-card">
            <h3>Timeline</h3>
            <RequestTimeline updates={updates} viewer="client" />
          </div>
        </div>
      </div>
    </div>
  );
}
