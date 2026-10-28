import { projects } from './content.js';
import { initCarouselMotion, wrapIndex } from './carousel-motion.js';
import { initScrollReveals } from './page-effects.js';

const dialog = document.querySelector('#case-dialog');
const content = document.querySelector('#case-content');
const counter = document.querySelector('#case-counter');
const projectPrefix = '#proyecto-';
let activeProject = null;
let returnFocus = null;
let returnHash = '#proyectos';
let cleanupProjectReveals = () => {};

// Use DOM text nodes for source copy, so text never becomes executable HTML.
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function projectImage(src, alt, eager = false) {
  const img = element('img');
  img.src = src;
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  return img;
}

function renderProject(project) {
  const heading = element('header', 'case-heading');
  const meta = element('div', 'case-meta');
  meta.append(element('span', '', `${project.number} / ${project.client}`), element('span', '', project.discipline));
  const title = element('h2', '', project.title);
  title.id = 'case-title';
  title.tabIndex = -1;
  heading.append(meta, title, element('p', 'case-intro', project.intro));

  const cover = element('figure', 'case-cover');
  cover.style.setProperty('--case-color', project.color);
  const headerImage = projectImage(project.header.src, project.coverAlt, true);
  headerImage.width = project.header.width;
  headerImage.height = project.header.height;
  cover.append(headerImage);

  const story = element('section', 'case-story');
  const storyLabel = element('h3', '', 'El proyecto');
  storyLabel.id = 'case-story-title';
  story.setAttribute('aria-labelledby', storyLabel.id);
  const paragraphs = element('div', 'case-paragraphs');
  project.paragraphs.forEach(text => paragraphs.append(element('p', '', text)));
  story.append(storyLabel, paragraphs);

  const gallery = element('div', 'case-gallery');
  project.gallery.forEach(item => {
    const figure = element('figure');
    figure.append(projectImage(item.src, item.alt), element('figcaption', '', item.caption));
    gallery.append(figure);
  });

  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const nextButton = element('button', 'case-next');
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', `Siguiente proyecto: ${next.client}, ${next.title}`);
  const nextLabel = element('span');
  nextLabel.append(element('span', 'eyebrow', `Siguiente proyecto / ${next.client}`), element('span', 'case-next-title', next.title));
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.setAttribute('class', 'icon-arrow case-next-arrow');
  arrow.setAttribute('viewBox', '0 0 32 32');
  arrow.setAttribute('fill', 'none');
  arrow.setAttribute('stroke', 'currentColor');
  arrow.setAttribute('stroke-width', '2.5');
  arrow.setAttribute('stroke-linecap', 'square');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.setAttribute('focusable', 'false');
  const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowPath.setAttribute('d', 'M6 6h20v20M26 6 6 26');
  arrow.append(arrowPath);
  nextButton.append(nextLabel, arrow);
  nextButton.addEventListener('click', () => openProject(next.id, { replace: true }));

  content.replaceChildren(heading, cover, story, gallery, nextButton);
  counter.textContent = `${project.number} / 04`;
  return title;
}

function openProject(id, { navigate = true, replace = false } = {}) {
  const project = projects.find(item => item.id === id);
  if (!project || typeof dialog.showModal !== 'function') return;
  if (dialog.open && activeProject === id) return;

  if (!dialog.open) {
    returnFocus = document.activeElement;
    if (!location.hash.startsWith(projectPrefix)) returnHash = location.hash || '#proyectos';
  }
  if (navigate) {
    const hash = `${projectPrefix}${id}`;
    if (replace) history.replaceState(history.state, '', hash);
    else history.pushState({ portfolioProject: true }, '', hash);
  }

  activeProject = id;
  cleanupProjectReveals();
  const title = renderProject(project);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('case-open');
  dialog.scrollTop = 0;
  title.focus({ preventScroll: true });
  cleanupProjectReveals = initScrollReveals(content, [
    '.case-story h3', '.case-paragraphs > p', '.case-gallery > figure', '.case-next'
  ], { root: dialog });
}

function syncProjectFromUrl() {
  const id = location.hash.startsWith(projectPrefix) ? location.hash.slice(projectPrefix.length) : null;
  if (projects.some(project => project.id === id)) openProject(id, { navigate: false });
  else if (dialog.open) dialog.close();
}

function closeProject() {
  if (!dialog.open) return;
  if (history.state?.portfolioProject) history.back();
  else {
    history.replaceState(null, '', returnHash);
    syncProjectFromUrl();
  }
}

document.querySelectorAll('[data-project]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    openProject(link.dataset.project);
  });
});

document.querySelectorAll('[data-close-project]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    closeProject();
  });
});

dialog.addEventListener('cancel', event => { event.preventDefault(); closeProject(); });
dialog.addEventListener('close', () => {
  cleanupProjectReveals();
  activeProject = null;
  document.body.classList.remove('case-open');
  if (returnFocus instanceof HTMLElement && returnFocus !== document.body) returnFocus.focus({ preventScroll: true });
  else document.querySelector('#work-title').focus({ preventScroll: true });
});
window.addEventListener('popstate', syncProjectFromUrl);
window.addEventListener('hashchange', syncProjectFromUrl);
syncProjectFromUrl();

// Native scrolling keeps touch/trackpad navigation available without JavaScript.
const track = document.querySelector('#project-track');
const carouselMotion = initCarouselMotion(track, document.querySelector('.home-intro'));
const slides = [...track.querySelectorAll('[data-project]')];
const previousSlide = document.querySelector('[data-carousel-prev]');
const nextSlide = document.querySelector('[data-carousel-next]');
const carouselPosition = document.querySelector('.carousel-position');
let slideIndex = 0;
let scrollFrame = null;

function updateCarousel() {
  slideIndex = carouselMotion.activeIndex;
  const project = projects.find(item => item.id === slides[slideIndex].dataset.project);
  carouselPosition.textContent = `${project.number} / 04`;
  previousSlide.setAttribute('aria-disabled', 'false');
  nextSlide.setAttribute('aria-disabled', 'false');
}

function goToSlide(index, { focus = false, direction = 0 } = {}) {
  const wrapped = wrapIndex(index, slides.length);
  if (focus) slides[wrapped].focus({ preventScroll: true });
  carouselMotion.toIndex(wrapped, direction);
}

previousSlide.addEventListener('click', () => carouselMotion.step(-1));
nextSlide.addEventListener('click', () => carouselMotion.step(1));
track.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const index = slides.indexOf(document.activeElement);
  const current = index >= 0 ? index : slideIndex;
  const target = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 }[event.key];
  if (target === undefined) return;
  event.preventDefault();
  goToSlide(target, { focus: true, direction: event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0 });
});
track.addEventListener('carouselchange', () => {
  if (scrollFrame !== null) return;
  scrollFrame = requestAnimationFrame(() => { updateCarousel(); scrollFrame = null; });
}, { passive: true });
window.addEventListener('resize', updateCarousel);
document.querySelector('.carousel-controls').hidden = false;
updateCarousel();

