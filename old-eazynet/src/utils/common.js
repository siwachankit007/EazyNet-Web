import { supabase } from '../config/supabase.js';

// Add this at the top of the file with other imports
const EMOJI_LIST = ['🦊', '🐱', '🐶', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🐬', '🦉', '🦋', '🐝'];

export function generateUserAvatar(email, existingAvatarUrl = null) {
    if (existingAvatarUrl) {
        return existingAvatarUrl;
    }

    // Create a consistent index based on email
    const emailHash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const emojiIndex = emailHash % EMOJI_LIST.length;
    
    // Create a canvas for the avatar
    const canvas = document.createElement('canvas');
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#3B82F6');  // Blue
    gradient.addColorStop(1, '#8B5CF6');  // Purple
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Add emoji
    ctx.font = '100px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(EMOJI_LIST[emojiIndex], size/2, size/2);

    return canvas.toDataURL('image/png');
}

// Dynamically load components (navbar/footer) and run a callback after injection
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Execute any scripts in the component
        const scripts = document.getElementById(elementId).getElementsByTagName('script');
        for (let script of scripts) {
            eval(script.innerHTML);
        }

        // Set up navbar dropdown logic if this is the navbar component
        if (elementId === 'navbar-placeholder') {
            setupNavbarDropdown();
        }
    } catch (error) {
        console.error(`Error loading component from ${componentPath}:`, error);
    }
}

// Navbar dropdown logic
function setupNavbarDropdown() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    const userMenu = document.getElementById('user-menu');
    const signOutButton = document.getElementById('sign-out-button');

    if (userMenuButton && userMenuDropdown) {
        userMenuButton.addEventListener('click', function (e) {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('hidden');
            setTimeout(() => userMenuDropdown.classList.toggle('show'), 10);
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (userMenu && !userMenu.contains(event.target) && userMenuDropdown) {
            userMenuDropdown.classList.remove('show');
            setTimeout(() => userMenuDropdown.classList.add('hidden'), 150);
        }
    });

    // Handle sign out
    if (signOutButton) {
        signOutButton.addEventListener('click', function (e) {
            e.preventDefault();
            
            console.log('signing out');
            
            // Show loader immediately for user feedback
            showLoader();
            
            // Safety timeout - ensure user never gets stuck
            const safetyTimeout = setTimeout(() => {
                console.warn('Sign-out taking too long, forcing redirect...');
                hideLoader();
                window.location.href = '/src/pages/auth.html';
            }, 1000); // 5 second safety net
            
            // Helper function to handle redirect with fallback
            const performRedirect = () => {
                clearTimeout(safetyTimeout); // Cancel safety timeout
                console.log('Performing redirect...');
                try {
                    if (window.EazyNavigation && typeof window.EazyNavigation.authRedirect === 'function') {
                        console.log('Using EazyNavigation for redirect');
                        EazyNavigation.authRedirect('/src/pages/auth.html');
                    } else {
                        console.log('EazyNavigation not available, using fallback');
                        setTimeout(() => {
                            window.location.href = '/src/pages/auth.html';
                        }, 300);
                    }
                } catch (navError) {
                    console.error('Navigation error:', navError);
                    console.log('Using fallback redirect');
                    hideLoader();
                    setTimeout(() => {
                        window.location.href = '/src/pages/auth.html';
                    }, 100);
                }
            };
            
            // Try to sign out with proper error handling
            supabase.auth.signOut()
                .then(({ error }) => {
                    console.log('signOut completed, error:', error);
                    performRedirect();
                })
                .catch(err => {
                    console.error('Exception during sign out:', err);
                    console.log('Redirecting despite error...');
                    performRedirect();
                });
        });
    }
}

function showLoader() {
  const loader = document.getElementById("loader-overlay");
  if (loader) {
    loader.style.display = "flex";
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.3s ease-in-out";
    
    // Trigger fade-in animation
    setTimeout(() => {
      loader.style.opacity = "1";
    }, 10);
  }
}

function hideLoader() {
  const loader = document.getElementById("loader-overlay");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 300);
  }
}

// Enhanced Navigation System with Smooth Transitions
window.EazyNavigation = {
  // Navigate with smooth transition
  navigateTo: function(url, options = {}) {
    const { 
      delay = 500, 
      showLoader: shouldShowLoader = true,
      fadeOut = true 
    } = options;
    
    return new Promise((resolve) => {
      // Show loader with smooth fade-in (only if not already showing)
      if (shouldShowLoader) {
        const loader = document.getElementById("loader-overlay");
        if (loader && loader.style.display !== "flex") {
          showLoader();
        }
      }
      
      // Optional fade-out of current page
      if (fadeOut) {
        document.body.style.transition = "opacity 0.3s ease-in-out";
        document.body.style.opacity = "0.8";
      }
      
      // Navigate after delay
      setTimeout(() => {
        window.location.href = url;
        resolve();
      }, delay);
    });
  },

  // Smooth redirect for auth/dashboard transitions
  authRedirect: function(url) {
    return this.navigateTo(url, { delay: 400, showLoader: true, fadeOut: true });
  },

  // Quick navigation for internal links
  quickNavigate: function(url) {
    return this.navigateTo(url, { delay: 250, showLoader: true, fadeOut: false });
  },

  // External redirect with loading
  externalRedirect: function(url) {
    showLoader();
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  },

  // Initialize smooth navigation for all internal links
  initSmoothNavigation: function() {
    // Handle all internal navigation links
    const internalLinks = document.querySelectorAll('a[href*="../pages/"], a[href*="./"], a[href^="/src/"]');
    
    internalLinks.forEach(link => {
      // Skip if already has smooth navigation
      if (link.hasAttribute('data-smooth-nav')) return;
      
      link.setAttribute('data-smooth-nav', 'true');
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip for external links, mailto, tel, and blank targets
        if (!href || href.includes('mailto:') || href.includes('tel:') || this.target === '_blank') {
          return;
        }
        
        // Handle anchor links within the same page or to index.html sections
        if (href.startsWith('#') || href.includes('#')) {
          const currentPage = window.location.pathname;
          const linkPath = href.split('#')[0];
          const anchor = href.split('#')[1];
          
          // If it's a same-page anchor or going to index.html sections from any page
          if (href.startsWith('#') || 
              (linkPath.includes('index.html') && currentPage.includes('index.html')) ||
              (linkPath.includes('index.html') && anchor)) {
            
            // If we're navigating to index.html from a different page
            if (linkPath.includes('index.html') && !currentPage.includes('index.html')) {
              e.preventDefault();
              EazyNavigation.quickNavigate(href);
              return;
            }
            
            // For same-page anchors, just scroll smoothly - don't show loader
            if (anchor) {
              const targetElement = document.getElementById(anchor);
              if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                return;
              }
            }
            return; // Let default behavior handle it
          }
        }
        
        // For actual page changes, use smooth navigation
        e.preventDefault();
        EazyNavigation.quickNavigate(href);
      });
    });

    // Handle navbar brand link
    const brandLinks = document.querySelectorAll('a[href="../pages/index.html"], a[href="index.html"]');
    brandLinks.forEach(link => {
      if (link.hasAttribute('data-smooth-nav')) return;
      link.setAttribute('data-smooth-nav', 'true');
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const currentPage = window.location.pathname;
        
        // If already on index page, don't reload
        if (currentPage.includes('index.html')) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        
        e.preventDefault();
        EazyNavigation.quickNavigate(href);
      });
    });
  }
};

// Enhanced page transition effects
window.EazyTransitions = {
  // Page entrance animation
  pageEnter: function() {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.4s ease-in-out";
    
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 50);
  },

  // Smooth fade transition between pages
  fadeTransition: function(callback) {
    document.body.style.transition = "opacity 0.3s ease-in-out";
    document.body.style.opacity = "0";
    
    setTimeout(() => {
      if (callback) callback();
    }, 300);
  }
};

// Update navbar based on auth state
async function updateNavbar() {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Elements to toggle
    const joinUsLink = document.getElementById('join-us-link');
    const dashboardLink = document.getElementById('dashboard-link');
    const userMenu = document.getElementById('user-menu');
    
    if (session) {
        // User is logged in
        if (joinUsLink) joinUsLink.classList.add('hidden');
        if (dashboardLink) dashboardLink.classList.remove('hidden');
        if (userMenu) {
            userMenu.classList.remove('hidden');
            
            // Update avatar
            const avatarImg = userMenu.querySelector('.user-avatar');
            if (avatarImg) {
                const { user_metadata, email } = session.user;
                avatarImg.src = generateUserAvatar(email, user_metadata?.avatar_url);
                if (!user_metadata?.avatar_url) {
                    avatarImg.classList.add('p-2');
                }
            }
        }
    } else {
        // User is logged out
        if (joinUsLink) joinUsLink.classList.remove('hidden');
        if (dashboardLink) dashboardLink.classList.add('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}

// --- Scroll To Top Button ---
function createGoToTopButton() {
  // Create the button element
  const goToTopBtn = document.createElement('button');
  goToTopBtn.id = 'go-to-top-btn';
    goToTopBtn.innerHTML = '↑';
    goToTopBtn.title = 'Scroll to top';
    goToTopBtn.className = 'go-to-top-btn fixed bottom-8 right-8 z-50 bg-blue-600 text-white rounded-full shadow-lg p-3 text-2xl opacity-0 pointer-events-none transition-all duration-300';
  document.body.appendChild(goToTopBtn);
  
  // Scroll to top functionality
  goToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Show/hide based on scroll
  function toggleButton() {
    if (window.scrollY > 200) {
      goToTopBtn.classList.add('visible');
    } else {
      goToTopBtn.classList.remove('visible');
    }
    }
    window.addEventListener('scroll', toggleButton);
    toggleButton();
}

// Initialize components and auth state
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize page entrance animation
    EazyTransitions.pageEnter();
    
    // Load navbar and footer
    await Promise.all([
        loadComponent('navbar-placeholder', '../components/navbar.html'),
        loadComponent('footer-placeholder', '../components/footer.html')
    ]);

    // Update navbar auth state
    await updateNavbar();

    // Initialize smooth navigation for all links
    EazyNavigation.initSmoothNavigation();

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            await updateNavbar();
      }
    });
createGoToTopButton();
});
 




