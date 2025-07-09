 document.addEventListener('DOMContentLoaded', () => {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector('.icon');
      const isOpen = !answer.classList.contains('hidden');

      // Close all answers
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
      document.querySelectorAll('.faq-question .icon').forEach(i => i.classList.remove('rotate-180'));

      // Toggle current
      if (!isOpen) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const upgradeBtn = document.getElementById("upgrade-pro-btn");
  if (upgradeBtn) {
    upgradeBtn.addEventListener("click", (e) => {
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
  }
});
