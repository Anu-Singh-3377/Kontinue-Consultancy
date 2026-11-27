import { statusGroup, statusLabel } from '../../services/requestService';

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${statusGroup(status)}`}>{statusLabel(status)}</span>;
}
