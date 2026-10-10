(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } } };

  // Theme: saved choice, else the system setting
  const root = document.documentElement;
  const saved = store.get('theme');
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  $('#theme').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  });

  // Loader, year, progress bar
  addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 250));
  $('#yr').textContent = new Date().getFullYear();
  const progress = $('#progress');
  const onScroll = () => {
    const h = document.documentElement;
    progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + '%';
    $('#nav').classList.toggle('hero-on', h.scrollTop < $('#home').offsetHeight - 90);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const burger = $('#burger'), links = $('#links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#links a').forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

  // Active nav link
  const sections = $$('main section[id]');
  const navObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('#links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObs.observe(s));

  // Reveal on scroll, counters and bars
  const countUp = el => {
    const target = +el.dataset.count, plus = el.dataset.plus ? '+' : '', t0 = performance.now(), dur = 1400;
    const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? plus : ''); if (p < 1) requestAnimationFrame(tick); };
    reduced ? (el.textContent = target + plus) : requestAnimationFrame(tick);
  };
  const revObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(countUp);
    $$('.track span', e.target).forEach(s => s.style.width = s.dataset.w + '%');
    revObs.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal').forEach(el => revObs.observe(el));

  // Hero slider
  const slides = $$('.slide'), dotsBox = $('#dots'), sp = $('#sp');
  const DELAY = 6500;
  let cur = 0, timer = null, paused = false, start = 0, left = DELAY;
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Slide ' + (i + 1));
    b.addEventListener('click', () => go(i, true)); dotsBox.appendChild(b);
  });
  const dots = $$('button', dotsBox);
  function go(i, user) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('active', k === cur); s.setAttribute('aria-hidden', k !== cur); });
    dots.forEach((d, k) => { d.classList.toggle('on', k === cur); d.setAttribute('aria-selected', k === cur); });
    left = DELAY; start = performance.now();
    if (user) paused = false;
  }
  function loop(t) {
    if (!paused && !reduced) {
      const p = Math.min(1, (t - start) / left);
      sp.style.width = p * 100 + '%';
      if (p >= 1) go(cur + 1);
    }
    requestAnimationFrame(loop);
  }
  go(0); start = performance.now(); requestAnimationFrame(loop);
  $('#prev').addEventListener('click', () => go(cur - 1, true));
  $('#next').addEventListener('click', () => go(cur + 1, true));
  const hero = $('#home');
  const pause = () => { if (!paused) { paused = true; left = Math.max(300, left - (performance.now() - start)); } };
  const resume = () => { if (paused) { paused = false; start = performance.now(); } };
  hero.addEventListener('mouseenter', pause); hero.addEventListener('mouseleave', resume);
  hero.addEventListener('focusin', pause); hero.addEventListener('focusout', resume);
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select')) return;
    const r = hero.getBoundingClientRect();
    if (r.bottom < 100 || r.top > innerHeight - 100) return;
    if (e.key === 'ArrowLeft') go(cur - 1, true);
    if (e.key === 'ArrowRight') go(cur + 1, true);
  });
  let sx = null;
  hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1), true);
  });
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());

  // Typing effect
  const phrases = ['Odoo Technical & Functional Developer', 'Python · XML · OWL · PostgreSQL', 'Custom modules, reports, integrations', 'Apps published on the Odoo Apps Store'];
  const typed = $('#typed');
  if (reduced) typed.textContent = phrases[0];
  else {
    let pi = 0, ci = 0, del = false;
    (function type() {
      const w = phrases[pi];
      typed.textContent = w.slice(0, ci += del ? -1 : 1);
      let t = del ? 28 : 55;
      if (!del && ci === w.length) { del = true; t = 1700; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; t = 350; }
      setTimeout(type, t);
    })();
  }

  // Magnetic buttons
  if (!reduced && matchMedia('(hover:hover)').matches) {
    $$('.magnet').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
  }

  // Windows: focus, drag, minimise, close, tabs, screenshot carousels
  const desk = $('#desk'), wins = $$('.window'), tabs = $$('.tabs [data-win]');
  let z = 10;
  const focusWin = w => { w.classList.remove('hidden', 'min'); w.style.zIndex = ++z; wins.forEach(o => o.classList.toggle('top', o === w)); tabs.forEach(t => t.classList.toggle('on', t.dataset.win === w.id)); };
  const isDesktop = () => matchMedia('(min-width:981px)').matches;
  wins.forEach(w => {
    w.addEventListener('pointerdown', () => focusWin(w));
    const bar = $('.titlebar', w);
    let sx, sy, ox, oy, drag = false;
    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('.dots3') || !isDesktop()) return;
      drag = true; bar.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY; ox = w.offsetLeft; oy = w.offsetTop;
    });
    bar.addEventListener('pointermove', e => {
      if (!drag) return;
      const mx = desk.clientWidth - 120, my = desk.clientHeight - 50;
      w.style.left = Math.max(-w.offsetWidth + 120, Math.min(mx, ox + e.clientX - sx)) + 'px';
      w.style.top = Math.max(0, Math.min(my, oy + e.clientY - sy)) + 'px';
    });
    bar.addEventListener('pointerup', () => drag = false);
    bar.addEventListener('dblclick', () => w.classList.toggle('min'));
    $('.x', w).addEventListener('click', e => { e.stopPropagation(); w.classList.add('hidden'); });
    $('.m', w).addEventListener('click', e => { e.stopPropagation(); w.classList.toggle('min'); });
    $('.z', w).addEventListener('click', e => { e.stopPropagation(); w.classList.remove('min'); focusWin(w); });
  });
  tabs.forEach(t => t.addEventListener('click', () => {
    const w = $('#' + t.dataset.win); focusWin(w);
    if (!isDesktop()) w.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  $('#reset').addEventListener('click', () => {
    wins.forEach((w, i) => { w.classList.remove('hidden', 'min'); w.style.left = ''; w.style.top = ''; w.style.zIndex = ''; });
    focusWin(wins[0]);
  });
  focusWin(wins[0]);

  $$('[data-carousel]').forEach(c => {
    const imgs = $$('img', c); let i = 0, t;
    const show = n => { imgs[i].classList.remove('on'); i = (n + imgs.length) % imgs.length; imgs[i].classList.add('on'); };
    $('.c-prev', c).addEventListener('click', e => { e.stopPropagation(); show(i - 1); });
    $('.c-next', c).addEventListener('click', e => { e.stopPropagation(); show(i + 1); });
    if (!reduced) {
      const auto = () => { t = setInterval(() => show(i + 1), 4200); };
      const vis = new IntersectionObserver(es => { clearInterval(t); if (es[0].isIntersecting) auto(); }); vis.observe(c);
    }
  });

  // Testimonials
  const tTrack = $('#tTrack'), tCards = $$('.t-card', tTrack), tDots = $('#tDots');
  let ti = 0, tt;
  tCards.forEach((_, i) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Testimonial ' + (i + 1)); b.addEventListener('click', () => tgo(i)); tDots.appendChild(b); });
  const tdb = $$('button', tDots);
  function tgo(i) { ti = (i + tCards.length) % tCards.length; tTrack.style.transform = `translateX(-${ti * 100}%)`; tdb.forEach((d, k) => d.classList.toggle('on', k === ti)); clearInterval(tt); if (!reduced) tt = setInterval(() => tgo(ti + 1), 6000); }
  tgo(0);

  // Contact form: validates, then opens the visitor's mail app (no server needed)
  const form = $('#form'), note = $('#note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach(f => {
      const msg = f.type === 'email' && f.value && !/^\S+@\S+\.\S+$/.test(f.value) ? 'Please enter a valid email.' : (!f.value.trim() ? 'This field is required.' : '');
      f.classList.toggle('invalid', !!msg); f.nextElementSibling.textContent = msg; if (msg) ok = false;
    });
    if (!ok) { note.textContent = ''; return; }
    const d = new FormData(form);
    const body = `${d.get('message')}\n\nName: ${d.get('name')}\nEmail: ${d.get('email')}\nBudget: ${d.get('budget')}`;
    location.href = 'mailto:abbas031911@gmail.com?subject=' + encodeURIComponent('Odoo project enquiry from ' + d.get('name')) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app. If nothing opens, write to abbas031911@gmail.com directly.';
  });
})();
