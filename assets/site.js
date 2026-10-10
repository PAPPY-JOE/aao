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
