(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');

  // Theme: graphite (dark, default) or silver (light); remembered per visitor.
  const themeBtn = document.querySelector('#theme');
  const applyTheme = theme => {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    themeBtn.querySelector('span').textContent = dark ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to silver theme' : 'Switch to graphite theme');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#0e1012' : '#e8ebed';
  };
  applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
  themeBtn.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    try { localStorage.setItem('theme', root.dataset.theme); } catch { /* works without storage */ }
  });

  document.querySelector('#year').textContent = new Date().getFullYear();

  // Mobile menu
  const menu = document.querySelector('#links'), burger = document.querySelector('#burger');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.nav')) setMenu(false); });

  // Scroll progress + nav border
  const nav = document.querySelector('#nav'), bar = document.querySelector('#progress');
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? root.scrollTop / max * 100 : 0) + '%';
    nav.classList.toggle('scrolled', root.scrollTop > 10);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Screenshot galleries
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const slides = [...gallery.querySelectorAll('.gallery-stage figure')];
    const count = gallery.querySelector('.count');
    let i = 0;
    const pad = n => String(n).padStart(2, '0');
    const show = step => {
      slides[i].hidden = true;
      i = (i + step + slides.length) % slides.length;
      slides[i].hidden = false;
      count.textContent = pad(i + 1) + ' / ' + pad(slides.length);
    };
    gallery.querySelector('[data-prev]').addEventListener('click', () => show(-1));
    gallery.querySelector('[data-next]').addEventListener('click', () => show(1));
  });

  if ('IntersectionObserver' in window) {
    // Highlight the current section in the menu
    const links = [...menu.querySelectorAll('a')];
    const spy = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => {
        const on = a.hash === '#' + entry.target.id;
        a.classList.toggle('active', on && !a.classList.contains('nav-cta'));
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }), { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

    // Gentle reveal on scroll
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        reveal.unobserve(entry.target);
      }), { threshold: .12 });
      document.querySelectorAll('.head,.spotlight>*,.app>*,.perf,.services article,.about>*,.post,.process li,.contact>*').forEach((el, n) => {
        el.classList.add('reveal');
        if (el.matches('.services article,.post,.process li')) el.style.transitionDelay = ([...el.parentElement.children].indexOf(el) % 3) * 80 + 'ms';
        reveal.observe(el);
      });
    }
  }

  // Contact form: prepares an email draft (no server)
  const form = document.querySelector('#form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    for (const name of ['name', 'message']) {
      const f = form.elements.namedItem(name);
      f.setCustomValidity(f.value.trim() ? '' : 'Please fill out this field.');
    }
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const subject = 'Odoo project enquiry from ' + d.get('name').trim();
    const body = d.get('message').trim() + '\n\nName: ' + d.get('name').trim() + '\nEmail: ' + d.get('email') + '\nBudget: ' + d.get('budget');
    location.href = 'mailto:abbas031911@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    document.querySelector('#note').textContent = 'Your email draft is ready. If no email app opens, write to abbas031911@gmail.com.';
  });
  form.querySelectorAll('input, textarea').forEach(f => f.addEventListener('input', () => f.setCustomValidity('')));
})();
