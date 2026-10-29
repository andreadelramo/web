import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../content.js';

test('Natural Typography is third in the carousel and has no project detail', () => {
  assert.deepEqual(projects.map(project => project.id), ['github', 'exhibify', 'natural-typography', 'dokify', 'ctt']);
  const upcoming = projects[2];
  assert.equal(upcoming.comingSoon, true);
  assert.equal(upcoming.title, 'Natural Typography');
  assert.equal(upcoming.paragraphs, undefined);
  assert.deepEqual(projects.map(project => project.number), ['01', '02', '03', '04', '05']);
});
