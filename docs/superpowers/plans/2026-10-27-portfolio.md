# Portfolio Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Andrea's Spanish portfolio from her PDF, with immersive project photography and accessible project details.
**Architecture:** Static HTML/CSS/JS, local assets, native dialog project reader. No runtime dependencies or external service.
**Tech Stack:** HTML, CSS, JavaScript, Node.js for preview and validation; macOS PDFKit/Vision for source extraction.
**Spec:** `docs/superpowers/specs/2026-10-27-portfolio-design.md`

## Global Constraints

- Preserve PDF identity, text, attribution, four projects and contacts.
- Spanish UI; black, white and blue; responsive layout and reduced motion.
- No new routes, fake form, invented credentials or publication.

## Review Focus

- Project reader must restore focus and body scrolling after Escape or close.
- Direct project links and browser Back must remain consistent.
- A narrow viewport must retain readable text and reachable navigation.
- All assets, contact links and the downloadable PDF must resolve.
- Content remains readable with reduced motion or JavaScript disabled.

### Task 1: Source assets and content

Files: `scripts/extract-portfolio.swift`, `assets/*`, `content.js`.
- [x] Render/crop source images, attempt OCR PDF for transcription, copy original PDF.
- [x] Visually compare extracted images with PDF renders.
- [x] Store four projects, all case text, biography, experience, education and tools.

### Task 2: Presentation and interactions

Files: `index.html`, `styles.css`, `app.js`.
- [x] Build semantic landing page, oversized introduction, four large project entries, biography/CV and contact.
- [x] Implement native dialog with close, next project, project hash links and focus restoration; browser verification pending.
- [x] Add restrained reveal/hover transitions, responsive layout and reduced motion support.
- [x] Keep source content accessible without JavaScript via the original PDF.

### Task 3: Preview and verification

Files: `package.json`, `scripts/serve.mjs`, `scripts/check.mjs`, `README.md`.
- [x] Create dependency-free static preview server restricted to the project root.
- [x] Check JS syntax, HTML anchors, local image references, all projects/content and the source PDF.
- [x] Start local preview and verify HTTP responses.
- [x] Request fresh code review, address significant findings and rerun checks.
- [x] Document commands and browser-verification limits.

## Execution ledger

- User explicitly approved the design and instructed construction. Execute inline without another plan approval. Work in the provided checkout; no branch changes or publication needed.
- This is a reversible presentation build. Use appropriate validation rather than tests that mirror static markup.
- Task 1 complete: PDFKit extracted 13 JPEGs and source PDF copied; inspected cover, portrait and system images. Vision OCR failed with a Foundation error in this environment; source transcribed from the 12 visually inspected PDF renders instead.
- Tasks 2–3 complete: `npm run check` passed; HTTP returned 200 for landing, CSS, JavaScript, source PDF and a cover; 404 for repository metadata, helper scripts and unknown routes.
- Fresh read-only code review found one important issue: the mobile scroll link lacked an accessible name. Added an explicit aria-label. No critical findings. Layout, actual keyboard behavior and transitions remain unverified in a browser because no connected browser tool is available.
- Final state: files left in the supplied checkout, no commits, push or publication. Preview server remains running for the user at http://localhost:4173.
