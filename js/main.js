/* Finetunio website — page behavior: mobile nav, scroll reveal. */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Mobile nav toggle */
const toggle = document.querySelector('.site-nav__toggle');
const navList = document.getElementById('site-nav-list');
if (toggle && navList) {
  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('site-nav__list--open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  navList.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      navList.classList.remove('site-nav__list--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* Scroll-triggered reveal for section content */
const revealTargets = document.querySelectorAll(
  '.section__inner > *, .hero__copy > *, .cta__inner > *'
);
if (!prefersReducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i % 6, 4) * 40}ms`;
    observer.observe(el);
  });
  // Fail open: if the page is hidden (prerender, background tab, print),
  // IntersectionObserver may never fire — content must not stay invisible.
  const revealAll = () => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('reveal--visible'));
    observer.disconnect();
  };
  if (document.visibilityState === 'hidden') revealAll();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') revealAll();
  }, { once: true });
  window.addEventListener('beforeprint', revealAll);
}
