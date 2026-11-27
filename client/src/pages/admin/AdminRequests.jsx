import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorNotice, PortalLoading } from '../../components/portal/PortalStates';
import StatusBadge from '../../components/portal/StatusBadge';
import { friendlyError } from '../../lib/errors';
import { formatDate, formatTime, REQUEST_TYPES, statusesFor, statusLabel } from '../../lib/requests';
import { supabase } from '../../lib/supabaseClient';

const SORTS = {
  newest: (a, b) => b.created_at.localeCompare(a.created_at),
  oldest: (a, b) => a.created_at.localeCompare(b.created_at),
  name: (a, b) => a.name.localeCompare(b.name),
  preferred: (a, b) => `${a.preferred_date}${a.preferred_time}`.localeCompare(`${b.preferred_date}${b.preferred_time}`),
};

const truncate = (text, length = 70) => (text.length > length ? `${text.slice(0, length)}…` : text);

// Admin table for contact or consultation requests, with search, filter and sort.
export default function AdminRequests({ type }) {
  const isConsultation = type === 'consultation';
  const [rows, setRows] = useState(null);
  const [team, setTeam] = useState({});
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    (async () => {
      const [requests, consultants] = await Promise.all([
        supabase.from(REQUEST_TYPES[type].table).select('*').order('created_at', { ascending: false }).limit(1000),
        isConsultation ? supabase.from('profiles').select('id, full_name, email').eq('role', 'service') : Promise.resolve({ data: [] }),
      ]);
      if (cancelled) return;
      const failure = requests.error || consultants.error;
      if (failure) setError(friendlyError(failure));
      setRows(requests.data || []);
      setTeam(Object.fromEntries((consultants.data || []).map((member) => [member.id, member.full_name || member.email])));
    })();
    return () => { cancelled = true; };
  }, [type, isConsultation]);

  const visible = useMemo(() => {
    if (!rows) return [];
    const needle = query.trim().toLowerCase();
    return rows
      .filter((row) => status === 'all' || row.status === status)
      .filter((row) => !needle || [row.name, row.email, row.phone, row.address, row.service, row.message, row.reference, row.company]
        .some((value) => String(value || '').toLowerCase().includes(needle)))
      .sort(SORTS[sort]);
  }, [rows, query, status, sort]);

  if (!rows) return <PortalLoading label="Loading requests…" />;

  const base = isConsultation ? '/admin/consultation-requests' : '/admin/contact-requests';

  return (
    <div className="portal-stack">
      <h2 className="workspace__heading">{isConsultation ? 'Consultation Requests' : 'Contact Requests'}</h2>
      <ErrorNotice>{error}</ErrorNotice>

      <div className="table-toolbar">
        <label className="table-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search requests</span>
          <input type="search" placeholder="Search name, email, phone, message…" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            {statusesFor(type).map((option) => <option key={option} value={option}>{statusLabel(option)}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A–Z</option>
            {isConsultation && <option value="preferred">Preferred date</option>}
          </select>
        </label>
        <span className="table-toolbar__count">{visible.length} of {rows.length}</span>
      </div>

      {visible.length === 0 ? (
        <EmptyState title={rows.length ? 'No matching requests' : 'No requests yet'} />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">Address</th>
                <th scope="col">Service</th>
                {isConsultation ? (
                  <>
                    <th scope="col">Preferred Date</th>
                    <th scope="col">Preferred Time</th>
                  </>
                ) : (
                  <th scope="col">Message</th>
                )}
                <th scope="col">Status</th>
                {isConsultation && <th scope="col">Assigned Consultant</th>}
                <th scope="col">Submitted</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong><br /><span className="text-muted">{row.reference}</span></td>
                  <td>{row.phone}</td>
                  <td>{row.email}</td>
                  <td>{row.address}</td>
                  <td>{row.service || '—'}</td>
                  {isConsultation ? (
                    <>
                      <td>{formatDate(row.preferred_date)}</td>
                      <td>{formatTime(row.preferred_time)}</td>
                    </>
                  ) : (
                    <td className="data-table__message">{truncate(row.message)}</td>
                  )}
                  <td><StatusBadge status={row.status} /></td>
                  {isConsultation && <td>{team[row.assigned_to] || <span className="text-muted">Unassigned</span>}</td>}
                  <td>{formatDate(row.created_at)}</td>
                  <td><Link to={`${base}/${row.id}`} className="button button-outline button--sm">Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
