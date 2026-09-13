const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuButton = $('.menu-button');
const navigation = $('#main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) navigation.querySelector('a')?.focus();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !navigation?.classList.contains('is-open')) return;
  navigation.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.focus();
});

navigation?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  navigation.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
});

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  $$('[data-reveal]').forEach((element) => observer.observe(element));
} else {
  $$('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
}

const toTop = $('.to-top');

if (toTop) {
  const updateToTop = () => toTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);

  updateToTop();
  window.addEventListener('scroll', updateToTop, { passive: true });

  toTop.addEventListener('click', () => {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    $('.wordmark')?.focus({ preventScroll: true });
  });
}

const form = $('#request-form');
const toast = $('.toast');
let toastTimer;

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;

  $$('.field', form).forEach((field) => {
    const control = $('input, textarea', field);
    const currentValid = control.checkValidity();
    field.classList.toggle('invalid', !currentValid);
    control.setAttribute('aria-invalid', String(!currentValid));
    if (!currentValid && valid) {
      control.focus();
      valid = false;
    }
  });

  if (!valid) return;
  form.reset();
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
});

form?.addEventListener('input', (event) => {
  const field = event.target.closest('.field');
  if (field && event.target.checkValidity()) {
    field.classList.remove('invalid');
    event.target.setAttribute('aria-invalid', 'false');
  }
});

$('#year').textContent = new Date().getFullYear();
