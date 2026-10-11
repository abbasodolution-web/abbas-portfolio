(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('#theme');
  const updateTheme = theme => {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101312' : '#f7f6f0';
  };
  try { updateTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark'); } catch { updateTheme('dark'); }
  themeButton.addEventListener('click', () => {
    updateTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    try { localStorage.setItem('theme', root.dataset.theme); } catch { /* Theme works without storage. */ }
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
  const menu = document.querySelector('#links'), burger = document.querySelector('#burger');
  const closeMenu = () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  };
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); burger.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.nav')) closeMenu(); });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        menu.querySelectorAll('a').forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const images = [...gallery.querySelectorAll('.screens img')];
    let index = 0;
    const show = step => {
      images[index].hidden = true;
      index = (index + step + images.length) % images.length;
      images[index].hidden = false;
      gallery.querySelector('.gallery-count').textContent = String(index + 1).padStart(2, '0') + ' / ' + String(images.length).padStart(2, '0');
    };
    gallery.querySelector('[data-prev]').addEventListener('click', () => show(-1));
    gallery.querySelector('[data-next]').addEventListener('click', () => show(1));
  });
  const form = document.querySelector('#form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const name of ['name', 'message']) {
      const field = form.elements.namedItem(name);
      field.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.');
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = 'Odoo project enquiry from ' + data.get('name').trim();
    const body = data.get('message').trim() + '\n\nName: ' + data.get('name').trim() + '\nEmail: ' + data.get('email') + '\nBudget: ' + data.get('budget');
    window.location.href = 'mailto:abbas031911@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    document.querySelector('#note').textContent = 'Your email draft is ready to open. If no email app opens, contact abbas031911@gmail.com directly.';
  });
  form.querySelectorAll('input, textarea').forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
})();
