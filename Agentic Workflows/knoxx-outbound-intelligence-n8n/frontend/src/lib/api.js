import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const backendConnected = Boolean(url && key);
const client = backendConnected ? createClient(url, key) : null;

async function invoke(name, body) {
  if (!client) return null;
  const { data, error } = await client.functions.invoke(name, { body });
  if (error) throw error;
  return data;
}

export const api = {
  startResearch: (input) => invoke('start-account-research', input),
  approveSequence: (input) => invoke('approve-sequence', input),
  recordEvent: (input) => invoke('outreach-event', { ...input, provider: 'manual_demo' }),
};
