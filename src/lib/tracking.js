import { supabase } from './supabase';

function generateSessionId() {
  return 'sid_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null;

  let sessionId = sessionStorage.getItem('diag_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('diag_session_id', sessionId);
  }
  return sessionId;
}

export async function trackVisit(step) {
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return;

  try {
    const { data: existing } = await supabase
      .from('visits')
      .select('id, current_step')
      .eq('session_id', sessionId)
      .single();

    if (existing) {
      await supabase
        .from('visits')
        .update({
          current_step: Math.max(existing.current_step, step),
          completed: step === 5,
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('visits').insert({
        session_id: sessionId,
        current_step: step,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
    }
  } catch (err) {
    console.warn('Tracking error:', err.message);
  }
}

export async function getVisitId() {
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return null;

  const { data } = await supabase
    .from('visits')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  return data?.id || null;
}
