/* Site-wide behaviour: theme toggle, mobile nav, active link, footer year.
   Default theme is dark; a saved choice in localStorage wins. */

(function () {
  // Apply saved theme as early as possible to avoid a flash.
  var saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function syncThemeIcon() {
    if (!themeToggle) return;
    var isLight = root.getAttribute('data-theme') === 'light';
    var icon = themeToggle.querySelector('i');
    if (icon) icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  }
  syncThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
      syncThemeIcon();
    });
  }

  // Mobile nav toggle
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      var icon = navToggle.querySelector('i');
      if (icon) icon.className = open ? 'fas fa-times' : 'fas fa-bars';
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Highlight the current page in the nav
  if (nav) {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (here === '') here = 'index.html';
    nav.querySelectorAll('a').forEach(function (link) {
      var target = (link.getAttribute('href') || '').toLowerCase();
      if (target === here) link.setAttribute('aria-current', 'page');
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
