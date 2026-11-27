import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EmptyState, ErrorNotice, PortalLoading, SuccessNotice } from '../../../components/portal/PortalStates';
import { useAuth } from '../../../context/AuthContext';
import { friendlyError } from '../../../utils/errors';
import { formatDate } from '../../../services/requestService';
import { supabase } from '../../../lib/supabaseClient';

const ROLE_LABELS = { user: 'Client', service: 'Consultant', admin: 'Admin' };

// Shared by Users (all accounts) and Service Team (consultants only).
// Role changes are re-checked by the database: only admins can make them.
export default function AdminUsers({ serviceOnly = false }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState(null);
  const [assigned, setAssigned] = useState({});
  const [query, setQuery] = useState('');
  const [promoteEmail, setPromoteEmail] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    const [profileResult, assignedResult] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      serviceOnly
        ? supabase.from('consultation_requests').select('assigned_to').not('assigned_to', 'is', null).not('status', 'in', '(completed,cancelled,rejected)')
        : Promise.resolve({ data: [] }),
    ]);
    const failure = profileResult.error || assignedResult.error;
    if (failure) setFeedback({ type: 'error', message: friendlyError(failure) });
    setProfiles(profileResult.data || []);
    const counts = {};
    (assignedResult.data || []).forEach(({ assigned_to: id }) => { counts[id] = (counts[id] || 0) + 1; });
    setAssigned(counts);
  }, [serviceOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    if (!profiles) return [];
    const needle = query.trim().toLowerCase();
    return profiles
      .filter((profile) => !serviceOnly || profile.role === 'service')
      .filter((profile) => !needle || [profile.full_name, profile.email, profile.phone]
        .some((value) => String(value || '').toLowerCase().includes(needle)));
  }, [profiles, query, serviceOnly]);

  const update = async (profile, changes, message) => {
    if (busy) return;
    setBusy(profile.id);
    setFeedback({ type: '', message: '' });
    const { error } = await supabase.from('profiles').update(changes).eq('id', profile.id);
    setBusy('');
    if (error) setFeedback({ type: 'error', message: friendlyError(error) });
    else {
      setFeedback({ type: 'success', message });
      await load();
    }
  };

  const changeRole = (profile, role) => {
    if (role === profile.role) return;
    const name = profile.full_name || profile.email;
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Change ${name}'s role to ${ROLE_LABELS[role]}?`)) return;
    update(profile, { role }, `${name} is now ${ROLE_LABELS[role]}.`);
  };

  const promote = async (event) => {
    event.preventDefault();
    const target = profiles.find((profile) => profile.email.toLowerCase() === promoteEmail.trim().toLowerCase());
    if (!target) {
      setFeedback({ type: 'error', message: 'No account with that email. Ask them to create an account on the website first.' });
      return;
    }
    if (target.role !== 'user') {
      setFeedback({ type: 'error', message: `${target.email} is already ${ROLE_LABELS[target.role]}.` });
      return;
    }
    await update(target, { role: 'service' }, `${target.email} has been added to the service team.`);
    setPromoteEmail('');
  };

  if (!profiles) return <PortalLoading label="Loading accounts…" />;

  return (
    <div className="portal-stack">
      <h2 className="workspace__heading">{serviceOnly ? 'Service Team' : 'Users'}</h2>
      {feedback.type === 'error' ? <ErrorNotice>{feedback.message}</ErrorNotice> : <SuccessNotice>{feedback.message}</SuccessNotice>}

      {serviceOnly && (
        <form className="portal-card inline-form inline-form--wrap" onSubmit={promote}>
          <div className="inline-form__text">
            <h2>Add a consultant</h2>
            <p className="text-muted">The person first creates a normal account on the website. Enter their email to grant consultant access.</p>
          </div>
          <label htmlFor="promote-email" className="sr-only">Account email</label>
          <input id="promote-email" type="email" placeholder="consultant@example.com" value={promoteEmail} onChange={(event) => setPromoteEmail(event.target.value)} />
          <button type="submit" className="button button-navy button--sm" disabled={!promoteEmail.trim() || Boolean(busy)}>Add to team</button>
        </form>
      )}

      <div className="table-toolbar">
        <label className="table-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search accounts</span>
          <input type="search" placeholder="Search name, email, phone…" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <span className="table-toolbar__count">{visible.length} accounts</span>
      </div>

      {visible.length === 0 ? (
        <EmptyState title={serviceOnly ? 'No consultants yet' : 'No accounts found'} />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                {!serviceOnly && <th scope="col">Address</th>}
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                {serviceOnly && <th scope="col">Open assignments</th>}
                <th scope="col">Created</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((profile) => {
                const isSelf = profile.id === user?.id;
                return (
                  <tr key={profile.id}>
                    <td><strong>{profile.full_name || '—'}</strong>{isSelf && <span className="text-muted"> (you)</span>}</td>
                    <td>{profile.email}</td>
                    <td>{profile.phone || '—'}</td>
                    {!serviceOnly && <td>{profile.address || '—'}</td>}
                    <td>
                      <label className="sr-only" htmlFor={`role-${profile.id}`}>Role for {profile.email}</label>
                      <select
                        id={`role-${profile.id}`}
                        value={profile.role}
                        disabled={isSelf || busy === profile.id}
                        onChange={(event) => changeRole(profile, event.target.value)}
                      >
                        {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${profile.is_active ? 'done' : 'stopped'}`}>
                        {profile.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {serviceOnly && <td>{assigned[profile.id] || 0}</td>}
                    <td>{formatDate(profile.created_at)}</td>
                    <td>
                      {!isSelf && (
                        <button
                          type="button"
                          className="button button-outline button--sm"
                          disabled={busy === profile.id}
                          onClick={() => update(profile, { is_active: !profile.is_active }, `${profile.email} ${profile.is_active ? 'deactivated' : 'reactivated'}.`)}
                        >
                          {profile.is_active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
