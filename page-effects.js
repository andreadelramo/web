export function pageDestination(href, current) {
  try {
    const source = new URL(current);
    const target = new URL(href, source);
    if (!['http:', 'https:'].includes(target.protocol) || target.origin !== source.origin) return null;
    if (!target.pathname.endsWith('/') && !target.pathname.endsWith('.html')) return null;
    const canonical = path => path.replace(/index\.html$/, '');
    if (canonical(source.pathname) === canonical(target.pathname) && source.search === target.search) return null;
    return target.href;
  } catch { return null; }
}

function initPageEffects() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let navigating = false;

  // Keep native links, browser history, and document loading intact.
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || preference.matches) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = pageDestination(link.getAttribute('href'), location.href);
    if (!destination) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    document.documentElement.classList.add('is-leaving');
    window.setTimeout(() => location.assign(destination), 180);
  });

  // Back/Forward may restore the outgoing document directly from the browser cache.
  window.addEventListener('pageshow', () => {
    navigating = false;
    document.documentElement.classList.remove('is-leaving');
  });

  if (!document.body.classList.contains('about-page')) return;
  initScrollReveals(document, [
    '.portrait-stage', '.biography > *', '.cv-label', '.cv-section > summary',
    '.cv-section[open] .cv-item', '.contact .section-heading',
    '.contact-bottom > .wordmark', '.contact-links > a', '.colophon'
  ]);
}

// Both full pages and project dialogs use the same progressive entrance.
export function initScrollReveals(scope, selectors, { root = null, initialDelay = 420 } = {}) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return () => {};
  const pending = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
      if (!entry.target.style.getPropertyValue('--reveal-delay')) {
        entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 90}ms`);
      }
      reveal(entry.target);
    });
  }, { root, threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  function reveal(node, { immediate = false } = {}) {
    node.classList.remove('reveal-pending');
    node.classList.add('is-revealed');
    if (immediate) node.style.animation = 'none';
    pending.delete(node);
    observer.unobserve(node);
  }

  let visibleIndex = 0;
  const viewportBottom = root ? root.getBoundingClientRect().bottom : window.innerHeight;
  scope.querySelectorAll(selectors.join(',')).forEach(node => {
    const bounds = node.getBoundingClientRect();
    // Keep content above a restored scroll position visible; animate current and upcoming blocks.
    if (bounds.bottom < 0) return;
    if (bounds.top < viewportBottom - 24) {
      node.style.setProperty('--reveal-delay', `${initialDelay + Math.min(visibleIndex++, 3) * 90}ms`);
    }
    node.classList.add('scroll-reveal', 'reveal-pending');
    pending.add(node);
    observer.observe(node);
  });

  // Keyboard navigation must never land on a transparent control or paragraph.
  function onFocus(event) {
    const node = event.target.closest('.reveal-pending');
    if (node) reveal(node, { immediate: true });
  }
  function onPreferenceChange() {
    if (preference.matches) {
      [...pending].forEach(node => reveal(node, { immediate: true }));
      observer.disconnect();
    }
  }
  scope.addEventListener('focusin', onFocus);
  preference.addEventListener('change', onPreferenceChange);
  return () => {
    observer.disconnect();
    [...pending].forEach(node => reveal(node, { immediate: true }));
    scope.removeEventListener('focusin', onFocus);
    preference.removeEventListener('change', onPreferenceChange);
  };
}

if (typeof document !== 'undefined') initPageEffects();
