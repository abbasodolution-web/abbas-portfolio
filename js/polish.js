(() => {
  'use strict';
  const root = document.documentElement;
  const nav = document.querySelector('.nav');
  const meter = document.querySelector('#scroll-meter');
  const theme = document.querySelector('#theme');
  const updateChrome = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    meter.style.width = (max > 0 ? doc.scrollTop / max * 100 : 0) + '%';
    nav.classList.toggle('scrolled', doc.scrollTop > 12);
  };
  const updateThemeIcon = () => {
    const dark = root.dataset.theme === 'dark';
    theme.textContent = dark ? '☀' : '☾';
    theme.title = dark ? 'Use light theme' : 'Use dark theme';
  };
  new MutationObserver(updateThemeIcon).observe(root, {attributes:true, attributeFilter:['data-theme']});
  updateThemeIcon();
  updateChrome();
  addEventListener('scroll', updateChrome, {passive:true});
  addEventListener('resize', updateChrome, {passive:true});
})();
