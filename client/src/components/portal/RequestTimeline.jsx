import { formatDateTime, statusLabel } from '../../services/requestService';

const ROLE_NAMES = { admin: 'Kontinue', service: 'Kontinue consultant', user: 'You', system: 'Kontinue' };

function describe(update, viewer) {
  switch (update.kind) {
    case 'submitted':
      return 'Request submitted';
    case 'status':
      return `Status changed to ${statusLabel(update.status)}`;
    case 'assignment':
      return update.message || 'Consultant assigned';
    case 'response':
      return viewer === 'client' ? 'Kontinue responded' : `Response from ${ROLE_NAMES[update.author_role] || 'staff'}`;
    default:
      return update.kind;
  }
}

// Chronological history built from request_updates rows.
export default function RequestTimeline({ updates, viewer = 'client' }) {
  if (!updates?.length) return <p className="text-muted">No activity yet.</p>;

  return (
    <ol className="timeline-list">
      {updates.map((update) => (
        <li key={update.id} className={`timeline-list__item timeline-list__item--${update.kind}`}>
          <span className="timeline-list__dot" aria-hidden="true" />
          <div className="timeline-list__body">
            <div className="timeline-list__head">
              <strong>{describe(update, viewer)}</strong>
              <time dateTime={update.created_at}>{formatDateTime(update.created_at)}</time>
            </div>
            {update.kind === 'response' && update.message && (
              <blockquote className="timeline-list__message">{update.message}</blockquote>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
