(() => {
  'use strict';
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('#motion-toggle');
  let paused = false;
  try { paused = localStorage.getItem('motion-paused') === 'true'; } catch {}
  const update = () => {
    const stopped = paused || preference.matches;
    root.classList.toggle('motion-paused', stopped);
    toggle.disabled = preference.matches;
    toggle.textContent = preference.matches ? 'Reduced motion' : paused ? 'Play motion ▷' : 'Pause motion Ⅱ';
    toggle.setAttribute('aria-pressed', String(stopped));
    toggle.setAttribute('aria-label', preference.matches ? 'Animations disabled by your reduced motion preference' : paused ? 'Resume website animations' : 'Pause website animations');
    if (stopped) document.querySelectorAll('.motion-enter').forEach(el => el.classList.remove('motion-enter'));
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('motion-paused', String(paused)); } catch {}
    update();
  });
  preference.addEventListener('change', update);
  update();
  const visibility = () => root.classList.toggle('tab-hidden', document.hidden);
  document.addEventListener('visibilitychange', visibility);
  visibility();
  document.addEventListener('animationend', event => {
    if (event.animationName === 'section-arrive') event.target.classList.remove('motion-enter');
  });
  if (!('IntersectionObserver' in window)) return;
  const arrivals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!paused && !preference.matches) entry.target.classList.add('motion-enter');
      arrivals.unobserve(entry.target);
    });
  }, {threshold:.12});
  document.querySelectorAll('.section-heading,.project-visual,.project-copy,.performance,.services>article,.about-intro,.experience,.process>li,.contact-copy,.form').forEach(el => {
    if (el.matches('.services>article,.process>li')) el.style.setProperty('--arrival-delay', (Array.from(el.parentElement.children).indexOf(el) * 70) + 'ms');
    arrivals.observe(el);
  });
  const activeRegions = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target.id === 'home') root.classList.toggle('hero-away', !entry.isIntersecting);
      else entry.target.classList.toggle('offscreen', !entry.isIntersecting);
    });
  });
  activeRegions.observe(document.querySelector('#home'));
  activeRegions.observe(document.querySelector('.motion-strip'));
})();
