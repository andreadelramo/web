import test from 'node:test';
import assert from 'node:assert/strict';
import { initCarouselMotion } from '../carousel-motion.js';

function mobileCarousel(t) {
  function target() {
    const listeners = new Map();
    const classes = new Set();
    return {
      style: { setProperty() {} },
      classList: {
        add: name => classes.add(name), remove: name => classes.delete(name),
        contains: name => classes.has(name), toggle() {}
      },
      addEventListener(type, listener) {
        if (!listeners.has(type)) listeners.set(type, []);
        listeners.get(type).push(listener);
      },
      dispatchEvent(event) { this.emit(event.type, event); },
      emit(type, properties = {}) {
        const event = { type, target: this, preventDefault() {}, ...properties };
        for (const listener of listeners.get(type) ?? []) listener(event);
      }
    };
  }
  const window = target();
  window.matchMedia = () => ({ matches: false, addEventListener() {} });
  const document = Object.assign(target(), { hidden: false, body: target() });
  const slides = Array.from({ length: 4 }, () => Object.assign(target(), { offsetWidth: 312 }));
  const track = Object.assign(target(), {
    clientWidth: 390, querySelectorAll: () => slides,
    setPointerCapture() {}, hasPointerCapture: () => false, releasePointerCapture() {}
  });
  const globals = { window, document, getComputedStyle: () => ({ columnGap: '12px', paddingLeft: '22px' }), cancelAnimationFrame() {}, requestAnimationFrame: () => 1 };
  for (const [name, value] of Object.entries(globals)) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
    t.after(() => descriptor ? Object.defineProperty(globalThis, name, descriptor) : delete globalThis[name]);
  }
  initCarouselMotion(track, target());
  const pointer = { pointerId: 1, isPrimary: true, button: 0, pointerType: 'touch', clientX: 300, clientY: 500 };
  track.emit('pointerdown', pointer);
  return { track, window, slides, pointer };
}

test('mobile swipe continues when a child transfers implicit pointer capture to the track', t => {
  const { track, window, slides, pointer } = mobileCarousel(t);
  window.emit('pointermove', { ...pointer, clientX: 288 });
  track.emit('lostpointercapture', { ...pointer, target: slides[0] });
  window.emit('pointermove', { ...pointer, clientX: 160 });
  assert.equal(slides[0].style.transform, 'translate3d(-140px, 0, 0)');
  assert(track.classList.contains('is-dragging'));
});

test('losing capture on the track itself stops the active drag', t => {
  const { track, window, slides, pointer } = mobileCarousel(t);
  window.emit('pointermove', { ...pointer, clientX: 288 });
  track.emit('lostpointercapture', pointer);
  window.emit('pointermove', { ...pointer, clientX: 160 });
  assert.equal(slides[0].style.transform, 'translate3d(-12px, 0, 0)');
  assert(!track.classList.contains('is-dragging'));
});

test('vertical mobile gestures leave page scrolling available', t => {
  const { track, window, slides, pointer } = mobileCarousel(t);
  let prevented = false;
  window.emit('pointermove', { ...pointer, clientX: 298, clientY: 450, preventDefault() { prevented = true; } });
  assert.equal(prevented, false);
  assert.equal(slides[0].style.transform, 'translate3d(0px, 0, 0)');
  assert(!track.classList.contains('is-dragging'));
});
