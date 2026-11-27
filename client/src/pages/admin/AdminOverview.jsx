import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorNotice, PortalLoading } from '../../components/portal/PortalStates';
import StatusBadge from '../../components/portal/StatusBadge';
import { friendlyError } from '../../lib/errors';
import { formatDate } from '../../lib/requests';
import { supabase } from '../../lib/supabaseClient';

const count = (table, column, value) => {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  if (Array.isArray(value)) query = query.in(column, value);
  else if (column) query = query.eq(column, value);
  return query;
};

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all([
        count('profiles', 'role', 'user'),
        count('contact_requests', 'status', 'new'),
        count('consultation_requests', 'status', 'pending'),
        count('consultation_requests', 'status', 'scheduled'),
        count('consultation_requests', 'status', 'completed'),
        count('contact_requests', 'status', ['resolved', 'closed']),
        supabase.from('consultation_requests').select('id, name, service, status, created_at').order('created_at', { ascending: false }).limit(5),
      ]);
      if (cancelled) return;
      const failure = results.find((result) => result.error)?.error;
      if (failure) setError(friendlyError(failure));
      const [users, newContacts, pending, scheduled, completedConsults, closedContacts, latest] = results;
      setStats([
        { label: 'Total Users', value: users.count ?? 0, to: '/admin/users' },
        { label: 'New Contact Requests', value: newContacts.count ?? 0, to: '/admin/contact-requests' },
        { label: 'Pending Consultations', value: pending.count ?? 0, to: '/admin/consultation-requests' },
        { label: 'Scheduled Consultations', value: scheduled.count ?? 0, to: '/admin/consultation-requests' },
        { label: 'Completed Requests', value: (completedConsults.count ?? 0) + (closedContacts.count ?? 0) },
      ]);
      setRecent(latest.data || []);
    })();
    return () => { cancelled = true; };
  }, []);

  if (!stats) return <PortalLoading label="Loading dashboard…" />;

  return (
    <div className="portal-stack">
      <h2 className="workspace__heading">Overview</h2>
      <ErrorNotice>{error}</ErrorNotice>
      <div className="stat-cards stat-cards--five">
        {stats.map((stat) => {
          const content = (
            <>
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__label">{stat.label}</span>
            </>
          );
          return stat.to
            ? <Link to={stat.to} className="stat-card stat-card--link" key={stat.label}>{content}</Link>
            : <div className="stat-card" key={stat.label}>{content}</div>;
        })}
      </div>

      <section className="portal-card">
        <div className="portal-section-head">
          <h2>Latest consultation requests</h2>
          <Link to="/admin/consultation-requests" className="card-link">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted">No consultation requests yet.</p>
        ) : (
          <ul className="recent-list">
            {recent.map((row) => (
              <li key={row.id}>
                <Link to={`/admin/consultation-requests/${row.id}`}>{row.name}</Link>
                <span className="text-muted">{row.service}</span>
                <span className="text-muted">{formatDate(row.created_at)}</span>
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
