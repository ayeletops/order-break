# Process log — Order / Break

Each entry records what the AI proposed and how I responded.

---

## Pre-phase — research and concept (claude.ai chat, November 2026)

**Starting point.** I asked about cryptography methodologies for keeping privacy and originality in an LLM environment.

**AI proposed:** an overview of privacy techniques (on-device inference, confidential computing, differential privacy) and of provenance (hashing, timestamps, signed content credentials, process logs).
**I responded:** reframed "originality" as creativity and novelty, not authorship. Asked what provenance means.

**AI proposed:** provenance as evidence about process, not proof of originality; a hash-chained process log as the "order" anchoring handmade "break" material.
**I responded:** proposed my own system — the viewer answers private, emotional questions that prompt a memory; the answers drive a design system for the page, with the question→element mapping shuffled each visit plus a random element. "The modernist is the system, the anarchist is the outcome."

**AI proposed:** precedents (Gerstner's *Designing Programmes*; Posavec's *Updating Happiness*; Sollfrank's net.art generator; AI "brand interview" builders with the same pipeline). Warned that RNG disorder is not authored disorder and risks becoming a new default. Flagged that the personal material would be the viewer's, not mine.
**I responded:** moved my own secret material into the system — loved ones' birthdays as grid numbers — and proposed a selfie gate, with owner-only content and design shown only to me.

**AI proposed (push-back):** a face is an identifier, not a secret, so it can be spoofed, and client-side hidden content is visible in the source. Use the secret numbers as an encryption key instead. The camera gate contradicts my own deck (slide 8, being unreadable to the machine) and the privacy premise. Assessors will never see owner mode. Scope is growing.
**I responded:** accepted the comments. Decided: personal ID, not portfolio or CV; English; build step by step with git, parallel documentation, Wacom annotations per phase, and iterations visible on hover at the end.

**Open:** entry ritual (questions) and camera — keep, change or drop. Deadline year to confirm.

---

## Phase 0 — Setup (2026-11-15, Cowork session)

**AI proposed:** using the GitHub noreply address as the commit email, so a personal address stays out of a public repo.
**I decided:** to use ayeletops@gmail.com. Git name "Ayelet Sella", set for this folder only, not globally.

**AI proposed:** keeping the three course PDFs (the brief and two lesson decks) out of the public repo, because they're the lecturer's material and CLAUDE.md already summarises the brief.
**I decided:** to keep them out. `.gitignore` now ignores `*.pdf`. (Note: this also catches any PDF I add later, so un-ignore specific paths if process material is ever PDF.)

**Done:**
- `git init` on branch `main`. Remote: `github.com/ayeletops/order-break` (public).
- Renamed `gitignore` → `.gitignore` (without the dot, git was ignoring it). It ignores `secrets/`, `.env`, `.DS_Store` and `*.pdf`.
- First commit: CLAUDE.md, this log, .gitignore.
- Folder structure from CLAUDE.md: `index.html` (empty), `css/`, `js/`, `assets/`, `docs/process/annotations/`, `docs/iterations/`, `secrets/` (git-ignored). Empty folders hold a `.gitkeep`.
- Moved this log from the root to `docs/process/log.md` with history kept.

**Publishing detour:** the push from Terminal failed (the oh-my-zsh update prompt swallowed the `cd`; then GitHub asked for a token). I switched to GitHub Desktop, which created a second, empty local repo and published *that* as `order-break` (one auto commit, `.gitattributes`). AI merged that commit into the real folder instead of force-pushing, so Desktop's stored login could push without a token. Desktop is now pointed at the real folder. Lesson: check which folder a GUI tool is acting on.

**Closing Phase 0:**
- GitHub Pages turned on: deploy from `main`, root. Live at https://ayeletops.github.io/order-break/
- Removed the stray empty repo Desktop had created (`~/Documents/GitHub/Order-Break`). Before that, I deleted the real folder by mistake and restored it from the Trash. Nothing was lost.
- AI tried to install a headless browser for automatic phase screenshots. The sandbox network blocks it, so I take phase screenshots myself.
- `docs/iterations/phase-00.png`: the live site as a blank white page. The zero state: a URL, no decisions yet.
- **Tags:** AI proposed tagging `phase-00`. I decided against it: tagging starts only once the site has real content and drafts, since a bookmark on an empty page marks nothing. (Also learned: GitHub Desktop only pushes tags it created.)

**Next decision:** Phase 1 (Position).

---

## Phase 1 — Position (2026-11-15)

**Framing (mine):** the site is a self-portrait, an art project made of text, images and my creations. AI acts as a researcher: it may study my files to know me, but publishes, exposes or risks nothing without my explicit consent, and questions my consent when something is risky. Assets are never moved, only duplicated.

**Raw material:** AI ran a metadata-only pass (types, dates, counts, nothing opened) over my semester folders, junk folders, WhatsApp images, Documents and a family folder. The inventory stays private in `secrets/` (git-ignored). Personal and financial documents are excluded entirely. Material involving family and other people is used only as context or in abstracted form unless I approve an item as-is, item by item.

**AI found:** a graphic novel (*Vaccine Futures*), final decks and films (Transmissible Immunity, Electromagnetic Colonialism / Frequencies, Urban Healing, Peres Center, Calculating Empires), essays, small code tools, and the thesis *In the Zone* with its ambient/op-art material.
**I chose:** all four clusters feel like me: the graphic novel, Frequencies, Urban Healing + *In the Zone*, essays + small tools.

**AI proposed a reading:** "you design for things that spread invisibly between bodies and spaces, make the invisible system visible, and question who controls it."
**I responded:** accepted as is. This is the position for the page.

**Working space:** `~/Downloads/ME` is my private studio, outside the repo. AI copied (never moved) the chosen works there, grouped by project, and built a local contact sheet so I can see everything at once. Nothing in ME is public.

**AI proposed extra layers:** a metadata timeline (file dates as an unintended diary), family as the hidden grid, pets, hand + voice, reading trail, work clock.
**I chose:** family as the hidden grid · hand + voice · reading trail / work clock. **Not** the metadata timeline.

**References:** I asked for research on the most original portfolio sites (awards, Wix and others) as a "LoRA" for inspiration. AI explained that a LoRA is a trained image model, and proposed a written reference brief with a lens instead: take the decision, not the look. It also flagged that award sites form a second typology (WebGL, cursor theatre) next to the AI default. Saved as `docs/research/references.md`: 25 sites tagged ORDER / BREAK / ENCOUNTER / TYPOLOGY-TRAP, plus a list of clichés.

---

## Phase 2 — Order (2026-11-15)

**Dates:** I put 8 birthdays in `secrets/` (git-ignored). AI read them without ever printing them, and checked format (DD/MM/YY) and validity. I fixed one typo.

**AI proposed four date→grid mappings:** distances between birthdays · each person as a ratio · calendar as ruler · digit sequence. It flagged that "calendar" and "distances" leak the dates. I asked for whichever is most Swiss. AI recommended a regular 8-column grid with field proportion 134:61 (sum of days : sum of months), keeping uneven columns for a private break layer.
**I decided otherwise:** these are web grids. I like uneven columns, so not just sums: use days, months, years and ages, as a **family** of grids, one per page or chapter. The site map comes first, to know how many grids are needed.
**AI added:** shuffle person order per grid, so the public method can't re-link a day, month and year into a date.

**I dropped** the entry questionnaire and the camera: the site is the same for everyone. AI noted this also drops owner mode and encryption.

**Site map, my structure (replaces AI's 9-chapter proposal):**
1. **Cover:** my name in changing type and symbols (Bodoni, slab serif, typewriter), animated, with @ayeletops and sella_vie. Hovering each letter slot shows a random gallery: family, documents, tickets, me, cats.
2. **Latent Field:** a cloud map of regions (biology, governance, communication, freedom). Projects (title + one image) sit at their position in the field.
3. **Work:** my CV as a horizontal timeline with links to workplaces and software. The CV is part of my ID.
4. **Black Holes:** five defining personal events, encrypted. Only I decide who learns what they mean.

The typology confrontation, the stance text and the process documentation are folded into these pages, not given their own.

**AI questioned consent; I decided:**
- Documents and tickets appear only redacted, with thick black bars. Minors' eyes are also covered with black bars. AI: bars are burned into the pixels, metadata is stripped, unredacted originals never enter the repo. The black bar becomes part of the visual language.
- Black Holes: only encrypted text is committed; the key is a long passphrase only I hold. The events are not named in this public log.
- AI noted the brief says "not a CV". I decided the CV is part of my ID, framed as how I got here.

**Grid family built.** `tools/derive-grids.py` reads the dates and a random shuffle seed (both in `secrets/`) and writes only derived values to `css/grids.css`. Visual sheet: `docs/grids/grid-sheet.html`.
- **Cover, from days:** 8 uneven columns, each width in fr = one person's day of birth.
- **Latent Field, from ages:** 8 rings, radius = age as % of the oldest; the four regions as quadrants.
- **Work, from birth years:** 7 horizontal intervals = the gaps between sorted birth years. Their years measure mine.
- **Black Holes, from months:** a 12-column grid (the generic default) where each column is a month; birth months mark void positions and sizes.
- **Shared by the family:** baseline 24px (mean age ÷ 2), gutter 12px, margins 2vw/3vw (youngest : oldest), type-scale ratio 1.482 (√ of mean day : mean month).
- **Privacy:** the public values are unlinked sets of days, ages, year-gaps and months. Without the secret seed they can't be recombined into dates.

**My feedback on the grids, and the changes:**
- All four pages get navigation top and bottom. Each nav is set on its own page's grid (cover nav on the day-columns, work nav on the year-intervals, and so on).
- Cover: line breaks as an option. "ayelet / ops" puts "ops" on the next row, on the same columns. Toggles in the sheet for ayelet/ops, ayeletops, sella/_vie, ayelet/sella.
- Latent Field: made rhizomatic. Regions and projects form a network with no fixed centre. Clicking a node moves it to the centre and the age rings re-form around it. Project positions are placeholders for me to place.
- Work: kept as is.
- Black Holes: unresolved, left open.
