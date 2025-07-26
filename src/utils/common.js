import { supabase } from '../config/supabase.js';

// Dynamically load components (navbar/footer) and run a callback after injection
async function loadComponent(id, path, callback) {
  try {
    const res = await fetch(path);
    const html = await res.text();
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = html;

      // Wait a tick for DOM update
      setTimeout(() => {
        if (typeof callback === 'function') {
          callback();
        }
      }, 0);
    }
  } catch (err) {
    console.error(`Failed to load ${path}`, err);
  }
}

// Footer modal logic after footer loads
function setupFooterModalLogic() {
  const policyLinks = document.querySelectorAll('.policy-link');
  const modal = document.getElementById('policy-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModalBtn = document.getElementById('close-modal');

 // Content placeholders – replace these with your actual content
    const policyContents = {
      privacy: `
        <h2 class="text-2xl font-bold mb-4">Privacy Policy</h2>
<p class="text-gray-700 leading-relaxed mb-4">
  At EazyNet, your privacy is extremely important to us. This Privacy Policy outlines the types of information we collect, how we use it, and your rights regarding your personal data. By using EazyNet Tab Manager, you agree to the terms outlined below.
</p>

<h3 class="text-xl font-semibold mb-2 mt-6">1. Information We Collect</h3>
<ul class="list-disc list-inside text-gray-700 space-y-1">
  <li><strong>Non-Personal Data:</strong> We may collect anonymous usage statistics to improve the extension, such as how often a feature is used.</li>
  <li><strong>Personal Data (Pro Features):</strong> If you subscribe to Pro features, we may collect your email address, name, and payment details through secure third-party platforms.</li>
</ul>

<h3 class="text-xl font-semibold mb-2 mt-6">2. How We Use Your Information</h3>
<p class="text-gray-700 mb-2">We use the information we collect to:</p>
<ul class="list-disc list-inside text-gray-700 space-y-1">
  <li>Improve the user experience and core features of EazyNet</li>
  <li>Provide customer support</li>
  <li>Notify you about feature updates or product changes (only if you opt in)</li>
</ul>

<h3 class="text-xl font-semibold mb-2 mt-6">3. Data Sharing</h3>
<p class="text-gray-700">We do not sell, trade, or rent your personal information to third parties. Any third-party services (like payment gateways or analytics) we use are vetted and follow standard data protection practices.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">4. Cookies & Tracking</h3>
<p class="text-gray-700">EazyNet does not use cookies directly. However, our website or third-party services like analytics may use cookies to track basic metrics (non-personally identifiable).</p>

<h3 class="text-xl font-semibold mb-2 mt-6">5. Your Rights</h3>
<p class="text-gray-700">You have the right to access, update, or delete your data. If you have any concerns or requests, email us at <a href="mailto:eazynettabmanager@gmail.com" class="text-primary underline">eazynettabmanager@gmail.com</a>.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">6. Data Security</h3>
<p class="text-gray-700">We take data security seriously and implement safeguards to protect your information. However, no system is 100% secure.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">7. Updates to This Policy</h3>
<p class="text-gray-700">We may update this Privacy Policy from time to time. Continued use of the extension after updates constitutes your acceptance of those changes.</p>

<p class="text-gray-500 mt-6 text-sm">Last Updated: April 20, 2025</p>
`,
      terms: `
       <h2 class="text-2xl font-bold mb-4">Terms & Conditions</h2>
<p class="text-gray-700 leading-relaxed mb-4">
  By using EazyNet Tab Manager, you agree to abide by the following Terms & Conditions. These terms govern your use of our Chrome extension, website, and related services.
</p>

<h3 class="text-xl font-semibold mb-2 mt-6">1. Acceptance of Terms</h3>
<p class="text-gray-700">By installing and using EazyNet, you agree to these terms and our Privacy Policy. If you do not agree, please uninstall the extension immediately.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">2. License</h3>
<p class="text-gray-700">We grant you a limited, non-exclusive, non-transferable license to use EazyNet Tab Manager solely for personal and non-commercial purposes.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">3. Restrictions</h3>
<ul class="list-disc list-inside text-gray-700 space-y-1">
  <li>You may not reverse engineer, decompile, or resell the extension.</li>
  <li>You may not use the extension for any malicious, illegal, or unethical purpose.</li>
</ul>

<h3 class="text-xl font-semibold mb-2 mt-6">4. Pro Features & Subscriptions</h3>
<p class="text-gray-700">Some features of EazyNet are available only through a Pro subscription. All payments are handled securely by third-party providers. We are not responsible for issues caused by third-party payment systems.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">5. Intellectual Property</h3>
<p class="text-gray-700">All logos, trademarks, code, and designs associated with EazyNet are the property of the EazyNet team and are protected under applicable laws.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">6. Limitation of Liability</h3>
<p class="text-gray-700">We are not liable for any direct, indirect, or incidental damages resulting from your use of the extension, including but not limited to data loss or browser performance issues.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">7. Termination</h3>
<p class="text-gray-700">We reserve the right to terminate or suspend access to the extension without prior notice if you violate these terms.</p>

<h3 class="text-xl font-semibold mb-2 mt-6">8. Changes to Terms</h3>
<p class="text-gray-700">We may update these Terms from time to time. By continuing to use the extension after such updates, you accept the revised terms.</p>

<p class="text-gray-500 mt-6 text-sm">Last Updated: April 20, 2025</p>
 `
    };

  if (modal && modalContent && closeModalBtn && policyLinks.length > 0) {
    policyLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const type = link.getAttribute('data-type');
        modalContent.innerHTML = policyContents[type] || "<p>Content not available.</p>";
        modal.classList.remove('hidden');
      });
    });

    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
}

// Load components after DOM is ready
document.addEventListener("DOMContentLoaded", async() => {
  loadComponent("navbar-placeholder", "/src/components/navbar.html");  
  loadComponent("footer-placeholder", "/src/components/footer.html", setupFooterModalLogic);
  
  const upgradeBtns = document.querySelectorAll(".upgrade-pro-btn");
  upgradeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log("Upgrade button clicked");
      e.preventDefault();
      Toastify({
        text: "Stay Tuned! Pro version coming soon!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #4f46e5, #6366f1)",
        style: {
          borderRadius: "10px",
          fontWeight: "500"
        }
      }).showToast();
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.id === "contact-us") {
      window.location.href = "mailto:eazynettabmanager@gmail.com";
    }
  });

  // User profile handling
  const avatars = [
    "🧑‍💻", "👩‍🎨", "🧙‍♂️", "🧑‍🚀", "🧑‍🌾",
    "🦸‍♂️", "🧛‍♀️", "🧑‍🎤", "👨‍🏫", "👩‍🔬"
  ];

  const { data: { user } } = await supabase.auth.getUser();
  console.log("User session:", user);

  const joinUsBtn = document.getElementById("join-us-link");
  const actionContainer = document.getElementById("nav-action-buttons");

  if (user && joinUsBtn && actionContainer) {
    joinUsBtn.remove();

    const avatarEmoji = avatars[Math.floor(Math.random() * avatars.length)];

    const dropdown = document.createElement("div");
    dropdown.className = "relative inline-block text-left";

    dropdown.innerHTML = `
      <button id="user-dropdown-toggle" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 font-semibold shadow hover:shadow-md transition">
        <span class="text-xl">${avatarEmoji}</span>
        <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"/>
        </svg>
      </button>
      <div id="user-dropdown-menu" class="hidden absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
        <a href="../pages/profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
        <button id="logout-btn" class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">Logout</button>
      </div>
    `;

    actionContainer.appendChild(dropdown);

    const toggle = dropdown.querySelector('#user-dropdown-toggle');
    const menu = dropdown.querySelector('#user-dropdown-menu');
    toggle.addEventListener('click', () => menu.classList.toggle('hidden'));

    const logoutBtn = dropdown.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = '../pages/auth.html';
    });
  }

  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  // FAQ toggle logic (accordion style)
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', function () {
      const answer = btn.parentElement.querySelector('.faq-answer');
      if (answer) {
        const isOpen = !answer.classList.contains('hidden');
        // Close all answers
        document.querySelectorAll('.faq-answer').forEach((el) => el.classList.add('hidden'));
        // Open this one if it was closed
        if (!isOpen) answer.classList.remove('hidden');
      }
    });
  });
});




