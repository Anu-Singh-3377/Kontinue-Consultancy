import { ArrowRight, CalendarClock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorNotice, PortalLoading } from '../../../components/portal/PortalStates';
import StatusBadge from '../../../components/portal/StatusBadge';
import { useAuth } from '../../../context/AuthContext';
import { friendlyError } from '../../../utils/errors';
import { formatDate, formatTime } from '../../../services/requestService';
import { supabase } from '../../../lib/supabaseClient';

const CLOSED = ['completed', 'cancelled', 'rejected'];
const today = () => new Date().toISOString().slice(0, 10);

function ConsultationCard({ row }) {
  return (
    <article className="request-card">
      <div className="request-card__head">
        <div>
          <p className="request-card__type">{row.service}</p>
          <p className="request-card__ref">{row.reference}</p>
        </div>
        <StatusBadge status={row.status} />
      </div>
      <dl className="request-card__meta">
        <div><dt>Client</dt><dd>{row.name}</dd></div>
        <div><dt>Phone</dt><dd>{row.phone}</dd></div>
        <div><dt>Email</dt><dd>{row.email}</dd></div>
        <div><dt>Address</dt><dd>{row.address}</dd></div>
        <div><dt>Preferred</dt><dd>{formatDate(row.preferred_date)} · {formatTime(row.preferred_time)}</dd></div>
      </dl>
      <Link to={`/service/requests/${row.id}`} className="card-link">
        Open consultation <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

// Consultant landing page: summary, upcoming appointments and all assignments.
// RLS returns only consultations assigned to the signed-in consultant.
export default function ServiceDashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [showClosed, setShowClosed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('consultation_requests')
      .select('id, reference, name, email, phone, address, service, preferred_date, preferred_time, status')
      .eq('assigned_to', user.id)
      .order('preferred_date', { ascending: true })
      .order('preferred_time', { ascending: true })
      .then(({ data, error: loadError }) => {
        if (cancelled) return;
        if (loadError) setError(friendlyError(loadError));
        setRows(data || []);
      });
    return () => { cancelled = true; };
  }, [user.id]);

  if (!rows) return <PortalLoading label="Loading your consultations…" />;

  const open = rows.filter((row) => !CLOSED.includes(row.status));
  const upcoming = open.filter((row) => row.status === 'scheduled' && row.preferred_date >= today()).slice(0, 3);
  const visible = showClosed ? rows : open;

  const stats = [
    { label: 'Open assignments', value: open.length },
    { label: 'Awaiting review', value: rows.filter((row) => ['pending', 'under_review'].includes(row.status)).length },
    { label: 'Scheduled', value: rows.filter((row) => row.status === 'scheduled').length },
    { label: 'Completed', value: rows.filter((row) => row.status === 'completed').length },
  ];

  return (
    <div className="portal-stack">
      <h2 className="workspace__heading">Overview</h2>
      <ErrorNotice>{error}</ErrorNotice>

      <div className="stat-cards">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span className="stat-card__value">{stat.value}</span>
            <span className="stat-card__label">{stat.label}</span>
          </div>
        ))}
      </div>

      <section className="portal-card">
        <h2 className="portal-card__title"><CalendarClock size={18} aria-hidden="true" /> Upcoming appointments</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted">No scheduled appointments coming up.</p>
        ) : (
          <ul className="recent-list">
            {upcoming.map((row) => (
              <li key={row.id}>
                <Link to={`/service/requests/${row.id}`}>{row.name}</Link>
                <span className="text-muted">{row.service}</span>
                <span className="text-muted">{formatDate(row.preferred_date)} · {formatTime(row.preferred_time)}</span>
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="portal-section-head">
        <h2>My Assigned Consultations</h2>
        <label className="checkbox">
          <input type="checkbox" checked={showClosed} onChange={(event) => setShowClosed(event.target.checked)} />
          <span>Show completed and closed</span>
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No consultations assigned">
          <p>New assignments from the admin team will appear here.</p>
        </EmptyState>
      ) : (
        <div className="request-list request-list--grid">
          {visible.map((row) => <ConsultationCard key={row.id} row={row} />)}
        </div>
      )}
    </div>
  );
}
