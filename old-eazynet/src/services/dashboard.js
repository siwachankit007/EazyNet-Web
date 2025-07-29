import { supabase } from '../config/supabase.js';
import { generateUserAvatar } from '../utils/common.js';

async function loadUserData() {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
            EazyNavigation.authRedirect('../pages/auth.html');
            return;
        }

        const { user } = session;
        const { user_metadata, email } = user;

        // Update subscription status using session data
        updateSubscriptionUI(user_metadata);
        
        // Load session data immediately for instant display
        // Update user name in both places
        const userNameElements = document.querySelectorAll('#user-name, #sidebar-user-name');
        userNameElements.forEach(el => {
            if (el) el.textContent = user_metadata.name || 'User';
        });

        // Update email
        const userEmailEl = document.getElementById('sidebar-user-email');
        if (userEmailEl) userEmailEl.textContent = email;

        // Update avatar if it exists in the UI
        const avatarElements = document.querySelectorAll('.user-avatar');
        const avatarUrl = generateUserAvatar(email, user_metadata.avatar_url);
        avatarElements.forEach(avatar => {
            if (avatar) {
                avatar.src = avatarUrl;
                if (user_metadata.avatar_url) {
                    avatar.classList.remove('p-2');
                } else {
                    avatar.classList.add('p-2');
                }
            }
        });

        // Show all content after everything is loaded
        showContent(user_metadata);

    } catch (error) {
        console.error('Error loading user data:', error);
        // Handle error appropriately
    }
}

function showContent(userMetadata) {
    // Show CTA buttons
    const ctaContainer = document.getElementById('cta-container');
    if (ctaContainer) {
        ctaContainer.classList.remove('opacity-0');
    }
    
    // Show sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.classList.remove('opacity-0');
    }
    
    // Show pro benefits teaser (if not pro)
    const proTeaser = document.getElementById('pro-benefits-teaser');
    if (proTeaser && !userMetadata.isPro) {
        proTeaser.classList.remove('opacity-0');
    }
}

function updateSubscriptionUI(userMetadata) {
    const planEl = document.querySelector('.sidebar-plan');
    if (!planEl) return;

    if (userMetadata.isPro) {
        planEl.textContent = 'Pro Plan';
        planEl.className = 'sidebar-plan inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700';
        
        // Hide pro benefits teaser if it exists
        const proTeaser = document.getElementById('pro-benefits-teaser');
        if (proTeaser) proTeaser.style.display = 'none';
        
        // Update CTA buttons
        const ctaButtons = document.querySelector('.cta-buttons');
        if (ctaButtons) {
            ctaButtons.innerHTML = `
                <button class="inline-flex items-center px-6 py-2 rounded-full font-bold bg-blue-600 text-white shadow-lg border border-blue-700 hover:from-blue-700 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base">
                    Manage Subscription
                </button>
            `;
        }
    } else if (userMetadata.isTrial) {
        planEl.textContent = 'Trial Active';
        planEl.className = 'sidebar-plan inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700';
        
        // Show remaining trial days
        const trialEnds = new Date(userMetadata.trialendsat);
        const daysLeft = Math.ceil((trialEnds - new Date()) / (1000 * 60 * 60 * 24));
        
        // Update CTA buttons
        const ctaButtons = document.querySelector('.cta-buttons');
        if (ctaButtons) {
            ctaButtons.innerHTML = `
                <button class="inline-flex items-center px-6 py-2 rounded-full font-bold bg-blue-600 text-white shadow-lg border border-blue-700 hover:from-blue-700 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base">
                    Upgrade Now (${daysLeft} days left)
                </button>
            `;
        }
    } else {
        planEl.textContent = 'Free Plan';
        planEl.className = 'sidebar-plan inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700';
        
        // Update CTA buttons
        const ctaButtons = document.querySelector('.cta-buttons');
        if (ctaButtons) {
            ctaButtons.innerHTML = `
                <button class="px-4 py-2 bg-white text-black rounded-xl font-semibold shadow hover:bg-gray-100 transition-all">
                    Start Free Trial
                </button>
            `;
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', loadUserData);