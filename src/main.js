document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper('.swiper-container', {
      loop: true,
      spaceBetween: 30,
      slidesPerView: 1,
      navigation: {
        nextEl: '.custom-next',
    prevEl: '.custom-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector('#contact form');
    const toast = document.querySelector('#form-toast');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
  
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
  
      // Show spinner + disable button
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg> Sending...`;
  
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
  
        if (res.ok) {
          showToast('Thanks for your message! 🎉 Our team will get back to you shortly', "success");
          contactForm.reset();
        } else {
          showToast('Oops! Something went wrong. ❌', "error");
        }
      } catch (err) {
        showToast('Network error. Please try again. ⚠️', 'bg-red-600');
      }
  
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message';
    });
  
    function showToast(message, type = 'success') {
        const colors = {
            success: "linear-gradient(to right, #4f46e5, #6366f1)", // indigo
            error: "linear-gradient(to right, #f43f5e, #fb7185)",   // rose-red
            
        };
      
        Toastify({
          text: message,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: colors[type] || colors.success,
          className: "toastify-custom",
          style: {
            borderRadius: "10px",
            padding: "14px 20px",
            fontWeight: "500",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            fontSize: "15px",
          }
        }).showToast();
      }
      
      
  });
  document.addEventListener("DOMContentLoaded", () => {
    // Select all policy links (footer anchor tags)
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
<p class="text-gray-700">You have the right to access, update, or delete your data. If you have any concerns or requests, email us at <a href="mailto:support@eazynet.app" class="text-primary underline">support@eazynet.app</a>.</p>

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
  
    // Add click event listener on each policy link
    policyLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const contentType = link.getAttribute('data-type');
        // Populate the modal with the corresponding content
        modalContent.innerHTML = policyContents[contentType] || "<p>Content not available.</p>";
        // Show the modal
        modal.classList.remove('hidden');
      });
    });
  
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  
    // Optionally: Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
  const lightbox = GLightbox({
    selector: '.swiper-slide a.glightbox'
  });
  
  document.getElementById("contact-us").addEventListener("click", function() {
    var email = "siwachankit008" + "@" + "gmail.com";
    window.location.href = "mailto:" + email;
  });
  
  
  
  