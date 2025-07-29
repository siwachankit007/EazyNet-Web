// Swiper Setup
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
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
});

// Contact Form Handling
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector('#contact form');
  if (!contactForm) return;

  const toast = document.querySelector('#form-toast');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);

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
        showToast('Thanks for your message! 🎉', "success");
        contactForm.reset();
      } else {
        showToast('Oops! Something went wrong. ❌', "error");
      }
    } catch (err) {
      showToast('Network error. Please try again. ⚠️', 'error');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message';
  });

  function showToast(message, type = 'success') {
    const colors = {
      success: "linear-gradient(to right, #4f46e5, #6366f1)",
      error: "linear-gradient(to right, #f43f5e, #fb7185)",
    };

    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: colors[type] || colors.success,
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

// Lightbox for features section
const lightbox = GLightbox({
  selector: '.swiper-slide a.glightbox'
});
