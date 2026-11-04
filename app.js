import { projects } from './content.js';
import { initCarouselMotion, wrapIndex } from './carousel-motion.js';
import { initScrollReveals } from './page-effects.js';

const detailedProjects = projects.filter(project => !project.comingSoon);
const projectCount = String(projects.length).padStart(2, '0');

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

function arrowIcon(className = '') {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [name, value] of Object.entries({
    class: `icon-arrow ${className}`, width: '16', height: '16', viewBox: '0 0 32 32',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5',
    'stroke-linecap': 'square', 'aria-hidden': 'true', focusable: 'false'
  })) arrow.setAttribute(name, value);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M6 6h20v20M26 6 6 26');
  arrow.append(path);
  return arrow;
}

function renderStory({ id, title, paragraphs, specimen, link, namespace = 'natural' }) {
  const story = element('section', `case-story${id ? ` ${namespace}-${id}` : ''}`);
  const label = element('h3', '', title);
  label.id = id ? `case-${namespace}-${id}-title` : 'case-story-title';
  story.setAttribute('aria-labelledby', label.id);
  const heading = element('div', 'case-section-heading');
  heading.append(label);
  if (specimen) {
    const sample = element('div', 'natural-specimen');
    sample.setAttribute('aria-label', 'Tres variantes de la letra A');
    for (let i = 1; i <= 3; i++) sample.append(element('span', `natural-variant-${i}`, 'A'));
    heading.append(sample);
  }
  if (link) {
    const visit = element('a', 'natural-visit', link.label);
    visit.href = link.href;
    visit.target = '_blank';
    visit.rel = 'noopener noreferrer';
    visit.append(arrowIcon('icon-arrow-right'));
    heading.append(visit);
  }
  const copy = element('div', 'case-paragraphs');
  paragraphs.forEach(text => copy.append(element('p', '', text)));
  story.append(heading, copy);
  return story;
}

function renderNaturalBody(project) {
  const moodboard = element('section', 'natural-moodboard');
  moodboard.setAttribute('aria-label', 'Moodboard de referencias');
  const composition = element('figure', 'natural-moodboard-stage');
  project.moodboard.forEach(item => {
    const image = projectImage(item.src, item.alt);
    image.className = 'natural-mood-item';
    const [x, y, width, height] = item.bounds;
    Object.assign(image.style, {
      left: `${x / 1319.063 * 100}%`, top: `${y / 897.547 * 100}%`,
      width: `${width / 1319.063 * 100}%`, height: `${height / 897.547 * 100}%`
    });
    composition.append(image);
  });
  composition.append(
    element('span', 'natural-moodboard-note', 'Pruebas de alternancia de glifos y variantes en Glyphs 3.'),
    element('figcaption', 'natural-moodboard-label', 'Moodboard')
  );
  moodboard.append(composition);

  const previews = element('section', 'natural-previews');
  previews.setAttribute('aria-label', 'Vistas de la web Natural Typography');
  const columns = [element('div', 'natural-preview-column natural-preview-side'), element('div', 'natural-preview-column'), element('div', 'natural-preview-column natural-preview-side')];
  project.previews.forEach(item => {
    const index = item.slot === 'statement' ? 0 : item.slot === 'description' ? 2 : 1;
    columns[index].append(projectImage(item.src, item.alt));
  });
  previews.append(...columns);
  const outcome = element('div', 'natural-outcome');
  outcome.append(previews, renderStory(project.sections[2]));
  return [renderStory(project.sections[0]), moodboard, renderStory(project.sections[1]), outcome];
}

function renderGithubBody(project) {
  const [overview, overviewContext, concept, challenge, recognition] = project.paragraphs;
  const [calendar, mobile, award] = project.gallery;

  const gallery = element('section', 'github-gallery');
  gallery.setAttribute('aria-label', 'Vistas de Maintainer Month en escritorio y móvil');
  const calendarFigure = element('figure', 'github-feature-image');
  calendarFigure.append(projectImage(calendar.src, calendar.alt));
  const mobileFigure = element('figure', 'github-phone-image');
  mobileFigure.append(projectImage(mobile.src, mobile.alt));
  gallery.append(calendarFigure, mobileFigure);

  const awardSection = element('section', 'github-award');
  awardSection.setAttribute('aria-label', 'Reconocimiento Webby Honoree 2023');
  const awardFigure = element('figure', 'github-award-visual');
  awardFigure.append(projectImage(award.src, award.alt));
  awardSection.append(awardFigure, element('p', 'github-award-copy', recognition));

  return [
    renderStory({ id: 'project', namespace: 'github', title: 'El proyecto', paragraphs: [overview, overviewContext] }),
    renderStory({ id: 'concept', namespace: 'github', title: 'Concepto', paragraphs: [concept] }),
    gallery,
    renderStory({ id: 'challenge', namespace: 'github', title: 'Reto principal', paragraphs: [challenge] }),
    awardSection
  ];
}

function renderProject(project) {
  content.classList.toggle('natural-case', project.detailLayout === 'natural');
  content.classList.toggle('github-case', project.detailLayout === 'github');
  const heading = element('header', 'case-heading');
  const meta = element('div', 'case-meta');
  meta.append(element('span', '', `${project.number} / ${project.client}`), element('span', '', project.discipline));
  const title = element('h2', '', project.title);
  title.id = 'case-title';
  title.tabIndex = -1;
  heading.append(meta, title, element('p', 'case-intro', project.intro));

  const cover = element('figure', 'case-cover');
  cover.style.setProperty('--case-color', project.color);
  const headerImage = projectImage(project.header.src, project.header.alt || project.coverAlt, true);
  headerImage.width = project.header.width;
  headerImage.height = project.header.height;
  cover.append(headerImage);

  let body;
  if (project.detailLayout === 'natural') body = renderNaturalBody(project);
  else if (project.detailLayout === 'github') body = renderGithubBody(project);
  else {
    const story = renderStory({ title: 'El proyecto', paragraphs: project.paragraphs });
    const gallery = element('div', 'case-gallery');
    project.gallery.forEach(item => {
      const figure = element('figure');
      figure.append(projectImage(item.src, item.alt), element('figcaption', '', item.caption));
      gallery.append(figure);
    });
    body = [story, gallery];
  }

  const next = detailedProjects[(detailedProjects.indexOf(project) + 1) % detailedProjects.length];
  const nextButton = element('button', 'case-next');
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', `Siguiente proyecto: ${next.client}, ${next.title}`);
  const nextLabel = element('span', 'case-next-label');
  nextLabel.append(element('span', 'eyebrow', `Siguiente proyecto / ${next.client}`), element('span', 'case-next-title', next.title));
  const arrow = element('span', 'case-next-arrow');
  arrow.setAttribute('aria-hidden', 'true');
  nextButton.append(nextLabel, arrow);
  nextButton.addEventListener('click', () => openProject(next.id, { replace: true }));

  content.replaceChildren(heading, cover, ...body, nextButton);
  counter.textContent = `${project.number} / ${projectCount}`;
  return title;
}

function openProject(id, { navigate = true, replace = false } = {}) {
  const project = detailedProjects.find(item => item.id === id);
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
    '.case-story h3', '.case-paragraphs > p', '.case-gallery > figure', '.case-next',
    '.github-gallery > figure', '.github-award-visual', '.github-award-copy',
    '.natural-specimen', '.natural-visit', '.natural-mood-item', '.natural-moodboard-label', '.natural-moodboard-note', '.natural-preview-column > img'
  ], { root: dialog });
}

function syncProjectFromUrl() {
  const id = location.hash.startsWith(projectPrefix) ? location.hash.slice(projectPrefix.length) : null;
  if (detailedProjects.some(project => project.id === id)) openProject(id, { navigate: false });
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

document.querySelectorAll('a[data-project]').forEach(link => {
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
  carouselPosition.textContent = `${project.number} / ${projectCount}`;
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

