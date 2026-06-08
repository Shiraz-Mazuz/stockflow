import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://flmrkhnxoxbdyncfeazm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gLzz2wdK1h3KaMjvmVt4ug_1bvRimD7';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
