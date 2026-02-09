import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration
// Replace these with your actual Supabase URL and anon key from your project settings
const supabaseUrl = 'https://lfossaslokotatfpajnh.supabase.co'; // e.g., https://xxxxx.supabase.co
const supabaseAnonKey = 'sb_publishable_GqXBlgVUixoKpuRxJksq_g_vi7JJ3Yd'; // Your public anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);