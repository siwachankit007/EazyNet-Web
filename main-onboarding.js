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

