import { supabase } from '../config/supabase.js';


document.addEventListener('DOMContentLoaded', async () => {
  const trialSection = document.getElementById('trial-section');
  const session = await supabase.auth.getSession();
  const user = session.data?.session?.user;

  if (!user) {
    // Redirect unauthenticated users
    window.location.href = '../pages/auth.html';
    return;
  }
});