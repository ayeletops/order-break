# Order / Break — personal ID web page

M.Des, HIT (Design for Technology-Rich Environments). Homework 1: "ID card — order and break".
Owner: Ayelet Sella. Page language: **English**.

## The brief (summary)

A personal web page that works as an ID card: who I am, what I do, how I think as a designer.
It must contain:

- **Order** — a real modernist layer (Swiss style, Müller-Brockmann): grid, systematic type, clear hierarchy. Every measure, font and ratio is chosen, never a default.
- **Break** — disorder, expression, handwork, personal material, disruption (Weingart, punk, Carson, primitive design). It must carry something personal the model could not have known, not just look messy.
- **The typology (טופסולוגיה)** — the AI default: rounded cards, gradients, centered hero, generic font, marketing copy. "Order without decision or ideology." The page must confront it visibly: distinguish it from real modernism, and disrupt / invert / expose / refuse it.
- **The encounter** — how order and break live together is the central creative decision. Their relationship must produce meaning, not sit side by side.

Deliverables: the page; short process documentation in this repo (including what the AI proposed and how I responded; hand sketches and raw material encouraged); a 300–500 word text on the site explaining my stance.

Assessed on: quality/consistency of order · how personal and unreproducible the break is · telling conscious modernism from the typology · depth of dialogue between the two · whether the break holds as a stance, not a style.

Deadline: brief says 10.11.27 — **to confirm**.

## Position

This is an ID, **not a portfolio or CV**. "What I do" should come through as ways of working, habits, obsessions, ways of seeing — not a list of projects or credits.

## Position statement (Phase 1, accepted)

"I design for things that spread invisibly between bodies and spaces, make the invisible system visible, and question who controls it."

Material clusters: Vaccine Futures (graphic novel) · Frequencies / EM colonialism · Urban Healing + *In the Zone* · essays + small tools.
Extra layers: family as hidden grid · hand + voice · reading trail / work clock. (Metadata timeline: declined.)
Private studio with copied assets: `~/Downloads/ME` (outside repo). Private inventory: `secrets/inventory-phase1.md`.
Privacy rules: never move originals, only copy · no personal or financial documents · family and other people only as context or abstracted, unless approved item by item · question consent when risky.
References: `docs/research/references.md`.

## Decisions so far

- Plain HTML / CSS / JS, no framework. Static, hosted on GitHub Pages. Everything runs client-side.
- **Order = a secret personal grid.** Grid proportions derive from birthdays of people I love (a personal Modulor). **Raw dates are never committed** — only derived ratios. The date→ratio mapping is a designed decision to document.
- **Dropped (Phase 2):** entry questionnaire, camera, owner-only mode. The site is the same for every visitor.
- **Grid family (Phase 2):** web grids (responsive CSS), uneven columns derived from days, months, years and ages of the 8 people; one grid per chapter, related as a family. Person order is shuffled per grid, so day/month/year can't be re-linked from the public method.
- **Site map (Phase 2):** Cover · Latent Field · Work (CV timeline) · Black Holes (5 encrypted events; topics only in `secrets/black-holes.md`, never in public files). Typology, stance text and process are folded into these pages. One grid per page.
- **Redaction:** documents and tickets get thick black bars over all data; minors' eyes get black bars. Burned into pixels, metadata stripped, originals never committed.
- **Encryption is back, for Black Holes only:** ciphertext committed, plaintext in `secrets/`, key = Ayelet's passphrase (not derived from dates).
- Watch scope: the brief rewards the order/break dialogue, not machinery.

## Working method (follow this every session)

1. Work **step by step**. One decision at a time. Ask Ayelet for content, data and decisions — don't fill personal content in yourself.
2. After each step, append to `docs/process/log.md`: date, what Claude proposed, what Ayelet decided or changed, and why.
3. Commit small and often with clear messages. **Ask before pushing.**
4. At the end of each phase: save a screenshot to `docs/iterations/phase-NN.png`. Tag `phase-NN` only once the site has real content and drafts (decided in Phase 0). Create tags in GitHub Desktop (History → right-click commit → Create Tag), because Desktop only pushes tags it made. These feed the final hover-to-see-iterations feature.
5. Wacom hand annotations go in `docs/process/annotations/phase-NN/` (PNG/SVG). Reference them in the log.
6. Never commit secrets (dates, keys, passphrases). Keep them in `secrets/` (git-ignored).

## Phases

0. Setup — repo, structure, log, conventions
1. Position — what "me" means without a CV; inventory of raw material
2. Order — birthday grid, type system, hierarchy
3. Break — handwork, personal material
4. Typology — generate the AI default on purpose, document it, decide how to act against it
5. Encounter — how they interact
6. Text — 300–500 words
7. Hover iterations + final documentation

**Palette:** heavy black dominant · circular grids millennial pink #f7cac9 + butter #fbe7a1 · hover = turquoise frame #08a8a0 (from Vaccine Futures). **Type:** Bodoni Moda (900 on cover), Zilla Slab, Courier Prime.

**Current status:** Phase 0 and Phase 1 done (2026-11-15). Repo: github.com/ayeletops/order-break, live at ayeletops.github.io/order-break (Pages, main, root). Phase 2: grid family done. First full draft built (2026-11-15), not yet pushed: it adds PDFs and images, so Ayelet approves before pushing. Open: Black Holes design, CV content, stance text, placing projects in the field, handles' platforms.

## Structure

```
index.html
css/
js/
assets/
docs/
  process/
    log.md
    annotations/
  iterations/
secrets/        (git-ignored)
```
