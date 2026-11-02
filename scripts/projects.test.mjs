import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../content.js';

test('Natural Typography is third and exposes the complete editorial detail', () => {
  assert.deepEqual(projects.map(project => project.id), ['github', 'exhibify', 'natural-typography', 'dokify', 'ctt']);
  const project = projects[2];
  assert(!project.comingSoon);
  assert.equal(project.title, 'Natural Typography');
  assert.equal(project.cover, project.header.src);
  assert(project.header.width >= 2600, 'The main image must support a sharp desktop presentation');
  assert.deepEqual(project.sections.map(section => section.id), ['origin', 'development', 'result']);
  assert.equal(project.sections[1].specimen, true);
  assert.equal(project.moodboard.length, 6);
  assert.equal(project.previews.length, 4);
  assert.equal(project.sections[2].link.href, 'https://andreadelramo.github.io/NaturalTypography/');
  assert.equal(projects.filter(project => !project.comingSoon).length, 5);
  assert.deepEqual(projects.map(project => project.number), ['01', '02', '03', '04', '05']);
});
