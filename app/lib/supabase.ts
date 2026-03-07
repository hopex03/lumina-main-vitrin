import { createClient } from '@supabase/supabase-js';

// .env.local derdini atladık, şifreleri direkt buraya yazdık:
const supabaseUrl = 'https://ozqwmcorufpvldzhqfzt.supabase.co';
const supabaseAnonKey = 'sb_publishable__kqCwArMzPxmBtTI4daG1Q_tfaeQ6ST';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
