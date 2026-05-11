// LOADER
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');
  loader.style.display = 'none';
  content.style.display = 'block';
  loader.addEventListener('transitionend', () => {
    loader.style.display = 'none';
  });
  setTimeout(() => {
    content.classList.add('show');
  }, 100);
});
