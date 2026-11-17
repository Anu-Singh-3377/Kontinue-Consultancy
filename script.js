document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach((faq) => faq.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
