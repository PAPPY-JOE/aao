const toggle = document.querySelector('[data-menu]');
const navigation = document.querySelector('#navigation');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
  navigation.classList.toggle('open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = 'Menu';
}));
const dialog = document.querySelector('#enquiry-preview');
document.querySelectorAll('[data-enquiry]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#enquiry-title').textContent = button.dataset.enquiry === 'speaking' ? 'Invite Anu to speak' : 'Explore mentorship';
  dialog.showModal();
}));
document.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

// A small, framework-independent preference switch for the cinematic concept.
const themeButton = document.querySelector('[data-theme-toggle]');
const isPreview = new URLSearchParams(location.search).has('preview');
if (themeButton) {
  const setTheme = light => {
    document.body.classList.toggle('light-mode', light);
    themeButton.querySelector('[data-theme-label]').textContent = light ? 'Dark mode' : 'Light mode';
    themeButton.querySelector('[data-icon-sun]').hidden = light;
    themeButton.querySelector('[data-icon-moon]').hidden = !light;
    themeButton.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    themeButton.setAttribute('aria-pressed', String(light));
  };
  let saved = null;
  try { saved = localStorage.getItem('aao-cinematic-theme'); } catch {}
  setTheme(!isPreview && saved === 'light');
  themeButton.addEventListener('click', () => {
    const light = !document.body.classList.contains('light-mode');
    setTheme(light);
    try { localStorage.setItem('aao-cinematic-theme', light ? 'light' : 'dark'); } catch {}
  });
}

// Content is visible by default. Only enable the entrance effect when supported.
if (!isPreview && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(element => {
    // An offscreen section can animate into view; initial viewport content remains visible.
    if (element.getBoundingClientRect().top > innerHeight) {
      element.classList.add('reveal-ready');
      observer.observe(element);
    }
  });
}

document.querySelectorAll('[data-photo-gallery]').forEach(gallery => {
  const rail = gallery.querySelector('.photo-rail');
  const previous = gallery.querySelector('[data-gallery-prev]');
  const next = gallery.querySelector('[data-gallery-next]');
  const status = gallery.querySelector('[data-gallery-status]');
  const cards = [...rail.children];
  const update = () => {
    const left = rail.getBoundingClientRect().left;
    const i = cards.reduce((nearest, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[nearest].getBoundingClientRect().left - left) ? index : nearest, 0);
    previous.disabled = rail.scrollLeft < 5;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 5;
    const label = `${i + 1} / ${cards.length}`;
    if (status && status.textContent !== label) status.textContent = label;
  };
  const move = direction => rail.scrollBy({ left: direction * (cards[0].getBoundingClientRect().width + 24), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  rail.addEventListener('scroll', update, { passive: true });
  update();
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(rail);
});

// Each comparison thumbnail shows the actual desktop concept at a smaller scale.
document.querySelectorAll('.mini-window').forEach(frame => {
  const scale = () => { frame.querySelector('iframe').style.transform = `scale(${frame.clientWidth / 1440})`; };
  scale();
  if ('ResizeObserver' in window) new ResizeObserver(scale).observe(frame);
});
