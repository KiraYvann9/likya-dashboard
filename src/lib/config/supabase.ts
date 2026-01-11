import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

/*if (!supabaseUrl || !supabaseAnonKey) {
  // Non-fatal warning to help during dev
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are not set. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}*/

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
