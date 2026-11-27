import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../lib/errors';
import {
  addNote,
  addResponse,
  fetchNotes,
  fetchRequest,
  fetchUpdates,
  formatDate,
  formatDateTime,
  formatTime,
  REQUEST_TYPES,
  SERVICE_ALLOWED_STATUSES,
  statusesFor,
  statusLabel,
  updateRequest,
} from '../../lib/requests';
import { supabase } from '../../lib/supabaseClient';
import { EmptyState, ErrorNotice, PortalLoading, SuccessNotice } from './PortalStates';
import RequestTimeline from './RequestTimeline';
import StatusBadge from './StatusBadge';

const QUICK_ACTIONS = {
  consultation: [
    { status: 'completed', label: 'Mark completed', tone: 'navy' },
    { status: 'cancelled', label: 'Cancel', tone: 'outline' },
    { status: 'rejected', label: 'Reject', tone: 'danger' },
  ],
  contact: [
    { status: 'resolved', label: 'Mark resolved', tone: 'navy' },
    { status: 'closed', label: 'Close', tone: 'outline' },
  ],
};

// Staff view of one request. `role` is 'admin' or 'service'; the database
// enforces the same limits, this only hides controls a role cannot use.
export default function RequestManager({ type, id, role, backTo, backLabel }) {
  const { user } = useAuth();
  const isAdmin = role === 'admin';
  const isConsultation = type === 'consultation';

  const [request, setRequest] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [notes, setNotes] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState('');
  const [appointment, setAppointment] = useState({ date: '', time: '' });
  const [response, setResponse] = useState('');
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    const [requestResult, updatesResult, notesResult, teamResult] = await Promise.all([
      fetchRequest(type, id),
      fetchUpdates(type, id),
      fetchNotes(type, id),
      isAdmin && isConsultation
        ? supabase.from('profiles').select('id, full_name, email, is_active').eq('role', 'service').order('full_name')
        : Promise.resolve({ data: [] }),
    ]);
    const failure = requestResult.error || updatesResult.error || notesResult.error || teamResult.error;
    if (failure) setFeedback({ type: 'error', message: friendlyError(failure) });

    const row = requestResult.data;
    setRequest(row);
    setUpdates(updatesResult.data || []);
    setNotes(notesResult.data || []);
    setTeam(teamResult.data || []);
    if (row) {
      setStatus(row.status);
      setAssignee(row.assigned_to || '');
      setAppointment({ date: row.preferred_date || '', time: formatTime(row.preferred_time).replace('—', '') });
    }
    setLoading(false);
  }, [type, id, isAdmin, isConsultation]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (key, action, successMessage) => {
    if (busy) return;
    setBusy(key);
    setFeedback({ type: '', message: '' });
    const { error } = await action();
    setBusy('');
    if (error) {
      setFeedback({ type: 'error', message: friendlyError(error) });
      return;
    }
    setFeedback({ type: 'success', message: successMessage });
    await load();
  };

  if (!REQUEST_TYPES[type]) return <EmptyState title="Unknown request type" />;
  if (loading) return <PortalLoading label="Loading request…" />;
  if (!request) {
    return (
      <EmptyState title="Request not found">
        <p>It may have been removed, or you may not have access to it.</p>
        <Link to={backTo}>{backLabel}</Link>
      </EmptyState>
    );
  }

  const statusOptions = isAdmin
    ? statusesFor(type)
    : [...new Set([request.status, ...SERVICE_ALLOWED_STATUSES])];
  const canRespond = isAdmin || isConsultation;
  const assignedName = team.find((member) => member.id === request.assigned_to)?.full_name;

  return (
    <div className="portal-stack">
      <Link to={backTo} className="portal-back"><ArrowLeft size={16} aria-hidden="true" /> {backLabel}</Link>

      <div className="portal-section-head">
        <div>
          <h2 className="workspace__heading">{request.name}</h2>
          <p className="text-muted">{REQUEST_TYPES[type].label} · {request.reference} · submitted {formatDateTime(request.created_at)}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {feedback.type === 'error' ? <ErrorNotice>{feedback.message}</ErrorNotice> : <SuccessNotice>{feedback.message}</SuccessNotice>}

      <div className="detail-grid">
        <div className="portal-stack">
          <section className="portal-card">
            <h3>Client information</h3>
            <dl className="detail-list">
              <div><dt>Name</dt><dd>{request.name}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${request.email}`}><Mail size={14} aria-hidden="true" /> {request.email}</a></dd></div>
              <div><dt>Phone</dt><dd><a href={`tel:${request.phone.replace(/\s/g, '')}`}><Phone size={14} aria-hidden="true" /> {request.phone}</a></dd></div>
              <div><dt>Address</dt><dd>{request.address}</dd></div>
              {request.company && <div><dt>Company</dt><dd>{request.company}</dd></div>}
            </dl>
          </section>

          <section className="portal-card">
            <h3>Request</h3>
            <dl className="detail-list">
              <div><dt>Service</dt><dd>{request.service || 'General enquiry'}</dd></div>
              {isConsultation && (
                <>
                  <div><dt>Preferred date</dt><dd>{formatDate(request.preferred_date)}</dd></div>
                  <div><dt>Preferred time</dt><dd>{formatTime(request.preferred_time)}</dd></div>
                  {isAdmin && <div><dt>Assigned consultant</dt><dd>{assignedName || 'Unassigned'}</dd></div>}
                </>
              )}
            </dl>
            <h4>Message</h4>
            <p className="detail-message">{request.message}</p>
          </section>

          {canRespond && (
            <section className="portal-card">
              <h3>Respond to client</h3>
              <p className="text-muted">The client sees this in My Portfolio.</p>
              <label htmlFor="response" className="sr-only">Response to client</label>
              <textarea
                id="response"
                className="portal-textarea"
                rows={4}
                placeholder="Write response..."
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />
              <button
                type="button"
                className="button button-primary"
                disabled={!response.trim() || Boolean(busy)}
                onClick={() => run('response', async () => {
                  const result = await addResponse(type, id, response.trim());
                  if (!result.error) setResponse('');
                  return result;
                }, 'Response sent to the client.')}
              >
                {busy === 'response' ? 'Sending…' : 'Send Response'}
              </button>
            </section>
          )}

          <section className="portal-card">
            <h3>History</h3>
            <RequestTimeline updates={updates} viewer="staff" />
          </section>
        </div>

        <div className="portal-stack">
          <section className="portal-card">
            <h3>Status</h3>
            <div className="inline-form">
              <label htmlFor="status" className="sr-only">Status</label>
              <select id="status" value={status} onChange={(event) => setStatus(event.target.value)}>
                {statusOptions.map((option) => <option key={option} value={option}>{statusLabel(option)}</option>)}
              </select>
              <button
                type="button"
                className="button button-navy button--sm"
                disabled={status === request.status || Boolean(busy)}
                onClick={() => run('status', () => updateRequest(type, id, { status }), 'Status updated.')}
              >
                {busy === 'status' ? 'Saving…' : 'Update'}
              </button>
            </div>
            {isAdmin && (
              <div className="quick-actions">
                {QUICK_ACTIONS[type].filter((action) => action.status !== request.status).map((action) => (
                  <button
                    key={action.status}
                    type="button"
                    className={`button button--sm quick-actions__${action.tone}`}
                    disabled={Boolean(busy)}
                    onClick={() => run(action.status, () => updateRequest(type, id, { status: action.status }), `Marked as ${statusLabel(action.status)}.`)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          {isAdmin && isConsultation && (
            <section className="portal-card">
              <h3>Assign consultant</h3>
              {team.length === 0 ? (
                <p className="text-muted">No consultants yet. Add one under <Link to="/admin/service-team">Service Team</Link>.</p>
              ) : (
                <div className="inline-form">
                  <label htmlFor="assignee" className="sr-only">Consultant</label>
                  <select id="assignee" value={assignee} onChange={(event) => setAssignee(event.target.value)}>
                    <option value="">Unassigned</option>
                    {team.map((member) => (
                      <option key={member.id} value={member.id} disabled={!member.is_active}>
                        {member.full_name || member.email}{member.is_active ? '' : ' (inactive)'}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="button button-navy button--sm"
                    disabled={assignee === (request.assigned_to || '') || Boolean(busy)}
                    onClick={() => run('assign', () => updateRequest(type, id, { assigned_to: assignee || null }), 'Consultant assignment saved.')}
                  >
                    {busy === 'assign' ? 'Saving…' : 'Assign'}
                  </button>
                </div>
              )}
            </section>
          )}

          {isAdmin && isConsultation && (
            <section className="portal-card">
              <h3>Appointment</h3>
              <p className="text-muted">Adjust the date and time once agreed with the client.</p>
              <div className="inline-form inline-form--wrap">
                <label htmlFor="appt-date" className="sr-only">Date</label>
                <input id="appt-date" type="date" value={appointment.date} onChange={(event) => setAppointment({ ...appointment, date: event.target.value })} />
                <label htmlFor="appt-time" className="sr-only">Time</label>
                <input id="appt-time" type="time" value={appointment.time} onChange={(event) => setAppointment({ ...appointment, time: event.target.value })} />
                <button
                  type="button"
                  className="button button-navy button--sm"
                  disabled={!appointment.date || !appointment.time || Boolean(busy)}
                  onClick={() => run('appointment', () => updateRequest(type, id, {
                    preferred_date: appointment.date,
                    preferred_time: appointment.time,
                    ...(['pending', 'under_review', 'contacted'].includes(request.status) ? { status: 'scheduled' } : {}),
                  }), 'Appointment saved.')}
                >
                  {busy === 'appointment' ? 'Saving…' : 'Save & schedule'}
                </button>
              </div>
            </section>
          )}

          {(isAdmin || isConsultation) && (
            <section className="portal-card">
              <h3>Internal notes</h3>
              <p className="text-muted">Visible to Kontinue staff only.</p>
              {notes.length > 0 && (
                <ul className="note-list">
                  {notes.map((item) => (
                    <li key={item.id}>
                      <p>{item.note}</p>
                      <time dateTime={item.created_at}>{formatDateTime(item.created_at)}{item.author_id === user?.id ? ' · you' : ''}</time>
                    </li>
                  ))}
                </ul>
              )}
              <label htmlFor="note" className="sr-only">New internal note</label>
              <textarea id="note" className="portal-textarea" rows={3} placeholder="Add a note for the team..." value={note} onChange={(event) => setNote(event.target.value)} />
              <button
                type="button"
                className="button button-outline button--sm"
                disabled={!note.trim() || Boolean(busy)}
                onClick={() => run('note', async () => {
                  const result = await addNote(type, id, note.trim(), user.id);
                  if (!result.error) setNote('');
                  return result;
                }, 'Note added.')}
              >
                {busy === 'note' ? 'Saving…' : 'Add note'}
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
