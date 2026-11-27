// Turn Supabase / network errors into messages that are safe to show to users.
// Raw database errors are logged to the console for debugging, never displayed.
export function friendlyError(error) {
  if (!error) return '';
  const message = String(error.message || error.error_description || error).toLowerCase();
  const code = String(error.code || '');
  const status = Number(error.status || 0);

  if (code === 'PGRST205' || message.includes('schema cache')) {
    console.error('[Kontinue] Database tables missing: run supabase/migrations/0001_kontinue_portal.sql', error);
    return 'Online accounts are still being set up. Please try again later or contact us directly.';
  }
  if (message.includes('failed to fetch') || message.includes('network')) {
    return "We couldn't reach the server. Please check your connection and try again.";
  }
  if (message.includes('invalid login credentials')) return 'Email or password is incorrect.';
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email address first. Check your inbox for the confirmation link.';
  }
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'An account with this email already exists. Please log in instead.';
  }
  if (message.includes('jwt') || message.includes('session') || code === 'PGRST301' || status === 401) {
    return 'Your session has expired. Please log in again.';
  }
  if (status === 429 || message.includes('rate limit')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  if (message.includes('password') && message.includes('should')) {
    return 'Please choose a stronger password.';
  }
  if (code === '42501' || message.includes('row-level security') || message.includes('not allowed')) {
    return "You don't have permission to do that.";
  }

  console.error('[Kontinue]', error);
  return 'Something went wrong. Please try again.';
}
