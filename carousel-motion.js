const FRAME = 1000 / 60;

export function wrapIndex(index, count) {
  return ((index % count) + count) % count;
}

export function loopCardOffset(index, position, stride, count, inset = 0) {
  const period = stride * count;
  return ((index * stride - position + stride + inset) % period + period) % period - stride - inset;
}

export function nearestLoopPosition(index, position, stride, count, direction = 0) {
  const period = stride * count;
  const base = wrapIndex(index, count) * stride;
  let next = base + Math.round((position - base) / period) * period;
  if (direction > 0 && next <= position + 0.5) next += period;
  if (direction < 0 && next >= position - 0.5) next -= period;
  return next;
}

export function wheelDistance({ deltaX = 0, deltaY = 0, deltaMode = 0 }, pageHeight) {
  const x = Number.isFinite(deltaX) ? deltaX : 0;
  const y = Number.isFinite(deltaY) ? deltaY : 0;
  const unit = deltaMode === 1 ? 16 : deltaMode === 2 ? pageHeight : 1;
  return (Math.abs(x) > Math.abs(y) ? x : y) * unit;
}

export function advanceCarouselMotion(position, target, scale, elapsed) {
  const frames = Math.max(0.25, Math.min(4, elapsed / FRAME));
  const damping = 1 - Math.pow(1 - 0.06, frames);
  const distance = target - position;
  const next = Math.abs(distance) <= 0.01 ? target : position + distance * damping;
  const speed = Math.abs(next - position) / frames;
  const desiredScale = 1 - Math.min(100, speed) * 0.002;
  const nextScale = scale + (desiredScale - scale) * damping;
  const settled = next === target && Math.abs(nextScale - 1) <= 0.0001;
  return { position: next, scale: settled ? 1 : nextScale, settled };
}

export function initCarouselMotion(track, stage) {
  const dockPreference = window.matchMedia('(min-width: 681px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [...track.querySelectorAll('[data-project]')];
  let position = 0;
  let target = 0;
  let stride = 1;
  let inset = 0;
  let scale = 1;
  let frame = 0;
  let lastTime = 0;
  let drag = null;
  let suppressClickUntil = 0;
  const blocked = () => document.hidden || document.body.classList.contains('case-open');

  function render() {
    slides.forEach((slide, index) => {
      const offset = loopCardOffset(index, position, stride, slides.length, inset) - index * stride;
      slide.style.transform = `translate3d(${offset}px, 0, 0)`;
    });
    track.style.setProperty('--carousel-scale', scale.toFixed(5));
    track.dispatchEvent(new Event('carouselchange'));
  }

  function releasePointer() {
    const previous = drag;
    drag = null;
    if (previous && track.hasPointerCapture(previous.id)) track.releasePointerCapture(previous.id);
    track.classList.remove('is-dragging');
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    target = position;
    scale = 1;
    render();
  }

  function animate(now) {
    if (blocked()) { stop(); return; }
    const state = advanceCarouselMotion(position, target, scale, lastTime ? now - lastTime : FRAME);
    lastTime = now;
    position = state.position;
    scale = dockPreference.matches ? state.scale : 1;
    // Rebase both coordinates together after many laps to preserve precision.
    const period = stride * slides.length;
    if (Math.abs(position) > period * 100) {
      const shift = Math.trunc(position / period) * period;
      position -= shift;
      target -= shift;
    }
    render();
    if (!(state.settled || (!dockPreference.matches && position === target))) frame = requestAnimationFrame(animate);
    else { frame = 0; lastTime = 0; }
  }

  function startMotion() {
    if (reducedMotion.matches) {
      position = target;
      scale = 1;
      render();
    } else if (!frame) frame = requestAnimationFrame(animate);
  }

  function toIndex(index, direction = 0) {
    if (blocked()) return;
    target = nearestLoopPosition(index, position, stride, slides.length, direction);
    startMotion();
  }

  function step(direction) {
    if (blocked()) return;
    target = (Math.round(target / stride) + direction) * stride;
    startMotion();
  }

  stage.addEventListener('wheel', event => {
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if ((!dockPreference.matches && !horizontal) || blocked() || drag || event.ctrlKey || event.metaKey || event.altKey) return;
    // The gallery loops indefinitely; scrolling over the introduction still moves the page.
    if (!event.target.closest('.carousel')) return;
    const bounds = stage.getBoundingClientRect();
    if (!horizontal && (bounds.top < -1 || bounds.bottom > window.innerHeight + 2)) return;
    const distance = wheelDistance(event, window.innerHeight);
    if (!distance) return;
    event.preventDefault();
    target += distance * 2;
    startMotion();
  }, { passive: false });

  track.addEventListener('pointerdown', event => {
    if (blocked() || !event.isPrimary || event.button !== 0) return;
    stop();
    drag = { id: event.pointerId, originX: event.clientX, originY: event.clientY, originScroll: position, x: event.clientX, time: performance.now(), velocity: 0, moved: false, touch: event.pointerType !== 'mouse' };
  });

  window.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (blocked()) { releasePointer(); stop(); return; }
    const distance = drag.originX - event.clientX;
    if (!drag.moved) {
      if (drag.touch && Math.abs(event.clientY - drag.originY) > Math.abs(distance)) { releasePointer(); return; }
      if (Math.abs(distance) < 5) return;
      drag.moved = true;
      track.setPointerCapture(drag.id);
      track.classList.add('is-dragging');
    }
    event.preventDefault();
    const now = performance.now();
    drag.velocity = (drag.x - event.clientX) / Math.max(1, now - drag.time);
    drag.x = event.clientX;
    drag.time = now;
    position = target = drag.originScroll + distance;
    if (dockPreference.matches) scale += (1 - Math.min(100, Math.abs(drag.velocity) * FRAME) * 0.002 - scale) * 0.3;
    render();
  }, { passive: false });

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const moved = drag.moved;
    const velocity = event.type === 'pointercancel' || performance.now() - drag.time > 80 || reducedMotion.matches ? 0 : drag.velocity;
    releasePointer();
    if (moved) {
      suppressClickUntil = performance.now() + 300;
      target = position + Math.max(-track.clientWidth, Math.min(track.clientWidth, velocity * 220));
      startMotion();
    }
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  track.addEventListener('lostpointercapture', event => {
    // Touch capture moves from the image/link to the track after a swipe starts.
    // Its bubbling loss event must not cancel the track's new capture.
    if (event.target !== track || !drag || event.pointerId !== drag.id) return;
    releasePointer();
    stop();
  });
  window.addEventListener('blur', () => { releasePointer(); stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { releasePointer(); stop(); } });
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('click', event => {
    if (event.detail && performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  track.addEventListener('focusin', event => {
    const slide = event.target.closest('[data-project]');
    if (!slide) return;
    const bounds = slide.getBoundingClientRect();
    const viewport = track.getBoundingClientRect();
    if (bounds.left < viewport.left || bounds.right > viewport.right) toIndex(slides.indexOf(slide));
  });

  function configure() {
    const fractionalIndex = position / stride;
    releasePointer();
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    stage.classList.toggle('has-carousel-motion', dockPreference.matches);
    track.classList.add('is-looping');
    const trackStyle = getComputedStyle(track);
    const gap = Number.parseFloat(trackStyle.columnGap) || 0;
    inset = Number.parseFloat(trackStyle.paddingLeft) || 0;
    stride = slides[0].offsetWidth + gap;
    position = target = fractionalIndex * stride;
    scale = 1;
    render();
  }
  dockPreference.addEventListener('change', configure);
  reducedMotion.addEventListener('change', configure);
  window.addEventListener('resize', configure);
  configure();
  return { toIndex, step, get activeIndex() { return wrapIndex(Math.round(position / stride), slides.length); } };
}
