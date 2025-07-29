// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://slgpzdwzxnwcotragubz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZ3B6ZHd6eG53Y290cmFndWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDU3NTcsImV4cCI6MjA2ODQyMTc1N30.5JPpEcz24n31kpG1vx6JuEaNmBXT4uzMILDRIaYwz4c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
