import test from 'node:test';
import assert from 'node:assert/strict';
import { pageDestination } from '../page-effects.js';

const home = 'http://localhost:4173/index.html';

test('transitions preserve the destination page and contact anchor', () => {
  assert.equal(pageDestination('sobre-mi.html#contacto', home), 'http://localhost:4173/sobre-mi.html#contacto');
  assert.equal(pageDestination('index.html#proyectos', 'http://localhost:4173/sobre-mi.html'), `${home}#proyectos`);
});

test('same-page anchors and the home alias retain native navigation', () => {
  assert.equal(pageDestination('#proyectos', home), null);
  assert.equal(pageDestination('index.html#inicio', 'http://localhost:4173/'), null);
  assert.equal(pageDestination('sobre-mi.html', 'http://localhost:4173/sobre-mi.html'), null);
});

test('downloads, external sites and email links are never intercepted', () => {
  assert.equal(pageDestination('assets/Andrea-del-Ramo-Portfolio.pdf', home), null);
  assert.equal(pageDestination('https://www.linkedin.com/in/andreadelramo/', home), null);
  assert.equal(pageDestination('mailto:andreadelramo@gmail.com', home), null);
  assert.equal(pageDestination('https://[invalid', home), null);
});
