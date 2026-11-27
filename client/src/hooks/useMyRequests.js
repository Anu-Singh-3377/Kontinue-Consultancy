import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendlyError } from '../utils/errors';
import { supabase } from '../lib/supabaseClient';

const COLUMNS = 'id, reference, service, status, admin_response, created_at, updated_at';

// The signed-in user's own requests (RLS returns only their rows), newest first.
export default function useMyRequests() {
  const { user } = useAuth();
  const userId = user?.id;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const [consultations, contacts] = await Promise.all([
      supabase.from('consultation_requests').select(`${COLUMNS}, preferred_date, preferred_time`).eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('contact_requests').select(COLUMNS).eq('user_id', userId).order('created_at', { ascending: false }),
    ]);
    const failure = consultations.error || contacts.error;
    if (failure) {
      setError(friendlyError(failure));
      setRequests([]);
    } else {
      setRequests([
        ...consultations.data.map((row) => ({ ...row, type: 'consultation' })),
        ...contacts.data.map((row) => ({ ...row, type: 'contact' })),
      ].sort((a, b) => b.created_at.localeCompare(a.created_at)));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { requests, loading, error, reload: load };
}
