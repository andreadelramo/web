import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceCarouselMotion, wheelDistance, wrapIndex, loopCardOffset, nearestLoopPosition } from '../carousel-motion.js';

test('position eases toward its target without overshooting', () => {
  const result = advanceCarouselMotion(0, 1000, 1, 1000 / 60);
  assert(result.position > 0 && result.position < 1000);
  assert(result.scale < 1 && result.scale >= 0.8);
  assert.equal(result.settled, false);
});

test('damping is independent of frame rate for the same elapsed time', () => {
  const first = advanceCarouselMotion(0, 1000, 1, 1000 / 120);
  const second = advanceCarouselMotion(first.position, 1000, first.scale, 1000 / 120);
  const full = advanceCarouselMotion(0, 1000, 1, 1000 / 60);
  assert(Math.abs(second.position - full.position) < 0.00001);
});

test('motion settles exactly at its destination and cards return to full scale', () => {
  let result = { position: 0, scale: 1 };
  for (let i = 0; i < 700; i++) result = advanceCarouselMotion(result.position, 500, result.scale, 1000 / 60);
  assert.equal(result.position, 500);
  assert.equal(result.scale, 1);
  assert.equal(result.settled, true);
});

test('reverse movement eases in the correct direction', () => {
  const result = advanceCarouselMotion(500, 0, 1, 16);
  assert(result.position > 0 && result.position < 500);
});

test('wheel input handles trackpads, line wheels and page units', () => {
  assert.equal(wheelDistance({ deltaX: 10, deltaY: -40, deltaMode: 0 }, 800), -40);
  assert.equal(wheelDistance({ deltaX: -80, deltaY: 5, deltaMode: 0 }, 800), -80);
  assert.equal(wheelDistance({ deltaX: 0, deltaY: 3, deltaMode: 1 }, 800), 48);
  assert.equal(wheelDistance({ deltaX: 0, deltaY: 1, deltaMode: 2 }, 800), 800);
  assert.equal(wheelDistance({ deltaX: NaN, deltaY: 0 }, 800), 0);
});

test('project indices wrap forward and backward across any number of laps', () => {
  assert.equal(wrapIndex(4, 4), 0);
  assert.equal(wrapIndex(-1, 4), 3);
  assert.equal(wrapIndex(402, 4), 2);
  assert.equal(wrapIndex(-402, 4), 2);
});

test('last-to-first navigation continues forward instead of reversing', () => {
  assert.equal(nearestLoopPosition(0, 300, 100, 4, 1), 400);
  assert.equal(nearestLoopPosition(3, 0, 100, 4, -1), -100);
  assert.equal(nearestLoopPosition(0, 1100, 100, 4, 1), 1200);
});

test('cards recycle only after leaving the viewport and repeat seamlessly', () => {
  assert.equal(loopCardOffset(0, 0, 100, 4), 0);
  assert.equal(loopCardOffset(0, 100, 100, 4), -100);
  assert.equal(loopCardOffset(0, 101, 100, 4), 299);
  for (const position of [-840, -120, 0, 30, 399, 820]) {
    for (let index = 0; index < 4; index++) {
      assert.equal(loopCardOffset(index, position, 100, 4), loopCardOffset(index, position + 400, 100, 4));
    }
  }
});

test('inertia crosses a full lap without clipping at the last project', () => {
  const result = advanceCarouselMotion(390, 600, 1, 1000 / 60);
  assert(result.position > 390);
  assert.equal(wrapIndex(Math.round(result.position / 100), 4), 0);
});

test('a card visible inside the left padding is not recycled early', () => {
  const stride = 592;
  const inset = 60;
  const width = 576;
  const offset = loopCardOffset(0, 593, stride, 4, inset);
  assert.equal(offset, -593);
  assert(inset + offset + width > 0);
  const beforeWrap = loopCardOffset(0, 652, stride, 4, inset);
  assert(inset + beforeWrap + width < 0);
  const afterWrap = loopCardOffset(0, 653, stride, 4, inset);
  assert(inset + afterWrap > 1440);
});
