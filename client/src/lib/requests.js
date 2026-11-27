import { supabase } from './supabaseClient';
import { serviceCatalog } from '../data/siteData';

export const REQUEST_TYPES = {
  consultation: { table: 'consultation_requests', fk: 'consultation_id', label: 'Consultation Request' },
  contact: { table: 'contact_requests', fk: 'contact_id', label: 'Contact Request' },
};

export const CONSULTATION_STATUSES = ['pending', 'under_review', 'contacted', 'scheduled', 'completed', 'cancelled', 'rejected'];
export const CONTACT_STATUSES = ['new', 'in_progress', 'contacted', 'resolved', 'closed'];
export const SERVICE_ALLOWED_STATUSES = ['under_review', 'contacted', 'scheduled', 'completed'];

export const statusesFor = (type) => (type === 'consultation' ? CONSULTATION_STATUSES : CONTACT_STATUSES);

const STATUS_LABELS = {
  pending: 'Pending',
  under_review: 'Under Review',
  contacted: 'Contacted',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  new: 'New',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const statusLabel = (status) => STATUS_LABELS[status] || status;

// Groups used for summary cards and badge colours.
export function statusGroup(status) {
  if (['pending', 'new'].includes(status)) return 'pending';
  if (['under_review', 'contacted', 'scheduled', 'in_progress'].includes(status)) return 'review';
  if (['completed', 'resolved', 'closed'].includes(status)) return 'done';
  return 'stopped';
}

// Services offered on the website, plus a catch-all.
export const SERVICE_OPTIONS = [...serviceCatalog.map((service) => service.title), 'Other enquiry'];

export const formatDate = (value) => (value
  ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  : '—');

export const formatDateTime = (value) => (value
  ? new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—');

export const formatTime = (value) => (value ? String(value).slice(0, 5) : '—');

export async function fetchRequest(type, id) {
  const { table } = REQUEST_TYPES[type];
  return supabase.from(table).select('*').eq('id', id).maybeSingle();
}

export async function fetchUpdates(type, id) {
  const { fk } = REQUEST_TYPES[type];
  return supabase.from('request_updates').select('*').eq(fk, id).order('created_at', { ascending: true });
}

export async function fetchNotes(type, id) {
  const { fk } = REQUEST_TYPES[type];
  return supabase.from('request_notes').select('*').eq(fk, id).order('created_at', { ascending: true });
}

export async function addResponse(type, id, message) {
  const { fk } = REQUEST_TYPES[type];
  return supabase.from('request_updates').insert({ [fk]: id, kind: 'response', message, author_role: 'system' });
}

export async function addNote(type, id, note, authorId) {
  const { fk } = REQUEST_TYPES[type];
  return supabase.from('request_notes').insert({ [fk]: id, note, author_id: authorId });
}

export async function updateRequest(type, id, changes) {
  const { table } = REQUEST_TYPES[type];
  return supabase.from(table).update(changes).eq('id', id);
}

// Fire-and-forget email notification through the existing Express API.
// The request is already saved in Supabase, so failures here are ignored.
export function notifyByEmail(endpoint, payload) {
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
