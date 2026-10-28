import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { projects } from '../content.js';

const root = new URL('../', import.meta.url);
let references = 0;
const pages = new Map(await Promise.all(['index.html', 'sobre-mi.html'].map(async name => [name, await readFile(new URL(name, root), 'utf8')])));
const html = pages.get('index.html');
for (const [name, page] of pages) {
  const ids = new Set();
  for (const match of page.matchAll(/\bid="([^"]+)"/g)) {
    assert(!ids.has(match[1]), `Duplicate ID in ${name}: ${match[1]}`);
    ids.add(match[1]);
  }
  for (const [, attribute, value] of page.matchAll(/\b(src|href)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(value)) continue;
    if (value.startsWith('#')) assert(ids.has(value.slice(1)), `Missing anchor in ${name}: ${value}`);
    else {
      const [path, anchor] = value.split('#');
      await access(new URL(path, root));
      if (anchor && pages.has(path)) {
        const targetIds = [...pages.get(path).matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
        assert(targetIds.includes(anchor), `Missing cross-page anchor: ${value}`);
      }
      references++;
    }
  }
  for (const match of page.matchAll(/<img\b[^>]*>/g)) assert(/\balt="[^"]+"/.test(match[0]), `Image without alt in ${name}: ${match[0]}`);
}
assert.equal(projects.length, 4);
assert.equal(new Set(projects.map(project => project.id)).size, 4);
const projectLinks = [...html.matchAll(/data-project="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(projectLinks, projects.map(project => project.id));
for (const project of projects) {
  assert(project.paragraphs.length >= 4, `Incomplete case: ${project.id}`);
  assert(project.coverAlt && project.gallery.length === 2, `Missing image descriptions: ${project.id}`);
  const header = await readFile(new URL(project.header.src, root));
  assert.equal(header.subarray(1, 4).toString(), 'PNG', `Invalid header image: ${project.id}`);
  assert.equal(header.readUInt32BE(16), project.header.width, `Incorrect header width: ${project.id}`);
  assert.equal(header.readUInt32BE(20), project.header.height, `Incorrect header height: ${project.id}`);
  for (const item of [{ src: project.cover, alt: project.coverAlt }, { src: project.header.src, alt: project.coverAlt }, ...project.gallery]) {
    assert(item.alt, `Missing alternative text: ${item.src}`);
    await access(new URL(item.src, root));
    references++;
  }
}
const pdf = await readFile(new URL('assets/Andrea-del-Ramo-Portfolio.pdf', root));
assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
const css = await readFile(new URL('styles.css', root), 'utf8');
for (const [, asset] of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
  if (/^(https?:|data:)/.test(asset)) continue;
  const bytes = await readFile(new URL(asset, root));
  assert(bytes.length > 0, `Empty CSS asset: ${asset}`);
  references++;
}
for (const file of ['app.js', 'content.js', 'carousel-motion.js', 'page-effects.js', 'scripts/serve.mjs', 'scripts/check.mjs']) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(file, root))], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
console.log(`OK: 2 pages, 4 complete cases, ${references} local references, unique IDs, valid anchors, image descriptions, original PDF and JavaScript syntax.`);
console.log('Browser layout, keyboard focus and animations require a browser review.');
