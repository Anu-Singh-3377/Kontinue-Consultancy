import { statusGroup, statusLabel } from '../../lib/requests';

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${statusGroup(status)}`}>{statusLabel(status)}</span>;
}
