import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/portal/StatusBadge';
import { formatDate, formatTime, REQUEST_TYPES } from '../../lib/requests';

export default function RequestCard({ request }) {
  return (
    <article className="request-card">
      <div className="request-card__head">
        <div>
          <p className="request-card__type">{REQUEST_TYPES[request.type].label}</p>
          <p className="request-card__ref">{request.reference}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <dl className="request-card__meta">
        <div><dt>Service</dt><dd>{request.service || 'General enquiry'}</dd></div>
        <div><dt>Requested</dt><dd>{formatDate(request.created_at)}</dd></div>
        {request.type === 'consultation' && (
          <div><dt>Preferred</dt><dd>{formatDate(request.preferred_date)} · {formatTime(request.preferred_time)}</dd></div>
        )}
        <div><dt>Last update</dt><dd>{formatDate(request.updated_at)}</dd></div>
      </dl>
      {request.admin_response && (
        <p className="request-card__response"><strong>Latest response:</strong> {request.admin_response}</p>
      )}
      <Link to={`/my-portfolio/requests/${request.type}/${request.id}`} className="card-link">
        View details <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
