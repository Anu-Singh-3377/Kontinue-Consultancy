import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorNotice, PortalLoading } from '../../../components/portal/PortalStates';
import { friendlyError } from '../../../utils/errors';
import { formatDateTime } from '../../../services/requestService';
import { supabase } from '../../../lib/supabaseClient';

// All responses from Kontinue across the user's requests (RLS limits to their own).
export default function PortfolioMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('request_updates')
      .select('id, consultation_id, contact_id, message, created_at')
      .eq('kind', 'response')
      .order('created_at', { ascending: false })
      .then(({ data, error: loadError }) => {
        if (cancelled) return;
        if (loadError) setError(friendlyError(loadError));
        setMessages(data || []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <PortalLoading label="Loading messages…" />;

  return (
    <div className="portal-stack">
      <div className="portal-section-head"><h2>Responses</h2></div>
      <ErrorNotice>{error}</ErrorNotice>
      {messages.length === 0 ? (
        <EmptyState title="No responses yet">
          <p>When our team responds to one of your requests, the message appears here.</p>
        </EmptyState>
      ) : (
        <ul className="message-list">
          {messages.map((message) => {
            const type = message.consultation_id ? 'consultation' : 'contact';
            const requestId = message.consultation_id || message.contact_id;
            return (
              <li key={message.id} className="portal-card">
                <div className="message-list__head">
                  <strong>Kontinue Consultancy Team</strong>
                  <time dateTime={message.created_at}>{formatDateTime(message.created_at)}</time>
                </div>
                <p>{message.message}</p>
                <Link to={`/my-portfolio/requests/${type}/${requestId}`} className="card-link">
                  View {type === 'consultation' ? 'consultation' : 'contact'} request
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
