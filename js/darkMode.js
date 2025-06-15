function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved user preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  }

  darkModeToggle.addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

document.addEventListener('DOMContentLoaded', initDarkMode);