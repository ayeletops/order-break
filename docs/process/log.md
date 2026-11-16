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

**Second round of feedback:**
- **No bottom menu.** One menu, at the top, on each page's own grid.
- **Cover:** line breaks are responsive, not preset. Letter slots wrap by themselves as the screen narrows. Each slot's width is weighted by a day of birth (cycling through the 8), so the breaks fall where the days meet the screen.
- **Latent Field:** AI had misread "rhizomatic" as a network diagram with boxes and lines. I clarified: it should look like the first version (concentric age rings, crosshair, words), but the field is larger than the screen. As you move through it (drag or click), the chosen word becomes the centre of the circular grid. Rebuilt that way: the rings stay fixed, the words move underneath, and the word nearest the centre takes focus.

---

## First full draft (2026-11-15)

**My brief for the draft:** no Claude default web-design moves; every decision from the award-winning references (`docs/research/references.md`), never the average. Plus research into the Wix in-house motion studio's language (`docs/research/wix-motion.md`).

**My direction during the build:**
- Cover: name, changing type and symbols, @ayeletops and sella_vie. A slider sets the font size, and the grid re-breaks with it.
- Projects: not everything goes in. One strong sample panel on hover; a click opens the full PDF.
- Palette: mostly heavy black (cover letters, Black Holes, timeline). The circular grid is millennial pink and butter yellow. The hover highlight is a turquoise frame.

**What AI built, and where each move comes from:**
- **Cover** (`index.html`, `js/cover.js`): the 9 letters of *ayeletops* sit in slots weighted by days of birth, under heavy numbered rules.
  - Each letter keeps mutating between Bodoni 900, Bodoni italic, Zilla Slab, Courier Prime and a symbol drawn from my subjects (∿ ☣ ◎ ⌁ ⚕), then resolves. *Ref: Jo Iijima's mutating type inside a grid; Wix Playground's scramble-then-resolve.*
  - Hovering a slot shows a random gallery item. My own work appears as images. Tickets, bills, family, me and cats appear as **redacted cards** until each item is approved.
  - **The typology confronted:** on load, the AI-default hero (gradient, rounded card, 👋, "crafting meaningful digital experiences") appears, is redacted line by line with black bars, and is removed. It can be replayed from the stance section.
  - Stance section: my position, plus a placeholder for the 300–500 words I'll write.
- **Latent Field** (`field.html`, `js/field.js`): age rings as filled discs, alternating pink and butter, largest at the back. The words move underneath. Hover or focus shows one sample panel; a click opens the PDF. The Peres Center client deck is shown without a PDF until I confirm. Arrow keys travel too.
- **Work** (`work.html`): a horizontal timeline on the birth-year intervals, with a heavy black axis. Only what my files show is filled in (M.Des HIT; Wix with role and years marked "to fill"; software links). Everything else is a marked placeholder. AI did not invent CV content.
- **Black Holes** (`holes.html`, `js/holes.js`): a black page with a 12-month grid and five numbered voids. Each opens a key field. In-browser decryption (PBKDF2 600k + AES-GCM) is ready; there is no ciphertext yet. Still unresolved.
- **Assets:** web copies only (resized, metadata stripped) in `assets/img` and compressed PDFs in `assets/pdf`. AI removed a film frame with an Artlist (stock) watermark. Flagged: the *In the Zone* cover uses a still from someone else's film.
- **Wix-house clichés avoided:** no Madefor, no lime, no 3D interiors, no UI pop-ups as heroes. **Award clichés avoided:** no cursor theatre, no preloader counter, no WebGL, no smooth-scroll hijack. (Work converts vertical scrolling to sideways on that page only.)

**Vision board:** I asked whether the draft is designed yet. AI's answer: it's a first draft. The system is real, but it isn't art-directed. I asked for a vision board of the references to approve (the "LoRA"). Built as `docs/research/vision-board.html`: my own material, the decided palette and type, then the references grouped ENCOUNTER / ORDER / BREAK / WIX MOTION / AVOID, each with live thumbnails, what to take, and keep/drop buttons. My picks get pasted back as the approved reference set.

---

## Art direction round 1 (2026-11-15)

**White page:** I saw a blank page after pushing. AI loaded the live site and found it working with no errors: a cached old version or deploy lag. Fix: hard refresh.

**My picks and requests:**
- Favourite reference: **Julien von Schultzendorff**.
- My materials are missing photos.
- More fonts and weights for the titles: the main cover title, with the same language repeated smaller as each page's title.
- Symbols must come from the fonts used, not a separate set.
- Research blogs analysing Wix's motion brand language, and update the reference.

**What AI found and did:**
- **Schultzendorff, studied live:** the giant heavy words *are* the grid, stretched non-uniformly to fill their columns. Hovering widens a column and the letters squeeze and stretch live.
- **The new title language (`js/stretch.js`):** each letter is drawn stretched to fill its slot exactly; slot widths come from the page's own birthday grid. Hovering widens a slot and the neighbours squeeze. *The grid deforms the type: order acting on break.*
  - **Fonts it mutates across:** Bodoni Moda (400–900, italics), Abril Fatface, Zilla Slab (300–700, italic), Alfa Slab One, Courier Prime (400/700, italic), Special Elite.
  - **Symbols** are taken from the same fonts: & § ¶ † ‡ * @ # ?
  - Mutation always resolves back to the letter: a loop, not a drift (a Wix motion principle).
- **Cover:** *ayeletops* in stretch type on the day-columns. On hover, the image appears **inside the letterform only**, so private images are only ever seen through the letters. Documents are shown as redaction bars.
- **Page titles:** LATENT FIELD (on the ages), WORK (on the year gaps), BLACK HOLES (on the months, white on black). They wrap responsively, and the content below follows the title's real height.
- **Wix research:** almost no independent analysis exists. The useful material is Wix designers' own stated principles: strict structure buys freedom; handmade against generative; loops; design for silence. These were added to `docs/research/wix-motion.md`, along with new clichés to avoid. The vision board now has Julien as ★ favourite, plus the Enabler Grid and Designers in Motion.
- **Photos:** pending my choice (see the next step).

---

## Art direction round 2 (2026-11-15)

**My direction:**
- Cover: each letter fills its entire grid block. No images on the cover: only letters from the different fonts, and symbols from the same font sets.
- No landing page: the cover is the first thing you see.
- A mechanism to switch between *ayeletops* and *sella_vie*.
- Drop the colour palette: content is black and white only. The grids must be visible as thin red lines and circles on every page.
- Menu: Home (the cover) · ROI · Work · [last page title not decided].
- A short sentence on each page explains it.
- ROI (the rhizomatic map, previously "Latent Field"): the same fonts at random, click-drag navigation, and an ease-out when releasing.
- Propose images.

**What AI did:**
- **Cover:** letters drawn edge to edge in their blocks (no rules or numbers). Thin red outlines show the day-columns. The AI-default intro is removed from the start; the typology now opens only from "See the default" in the stance section (still exposed and redacted, but no longer a landing page).
- **Name switch:** *ayeletops ⇄ sella_vie* (both have 9 letters, so they share the same blocks). Click the cover or the switch; each letter flickers through faces and symbols, staggered, and lands on the new name.
- **Palette:** pink, butter and turquoise removed. Red (#e5332a) is used only for the grid and the hover frame: *red belongs to the system, never to content.*
- **ROI:** renamed (`roi.html`). Thin red age circles and crosshair. Each word takes a random face from the title family. Drag uses real momentum: on release the field keeps gliding and eases out, then settles on the nearest word.
- **Work:** red column lines, black content. **Last page:** red 12-month lines, white-outlined voids, still named "Black Holes" as a placeholder.
- **Explanatory lines** are drafted on each page and marked *[draft line]* for me to rewrite.
- **Images:** AI looked through my WhatsApp images folder locally. It excluded ID documents, health and payment screens, other people's video-call faces, software screenshots and political images. It made a private proposal sheet in `~/Downloads/ME/_proposals` (not in the repo), grouped as material/hand, cat and creature, me, family (minors' eyes to be barred) and receipts (barred). It flagged that a grave photo is mine to decide on.

**My decisions:** the last page is called **Event Horizon** (AI noticed that *EVENTHORIZON* has 12 letters, matching the page's 12-month grid). The images go in from group B (cat, creature) and group C (me, walking), not material/hand or family.
**AI:** renamed the page (`horizon.html`). Added 7 personal regions to ROI as underlined "life" words. Each shows one black-and-white photo and opens the full photo on click. The photos were converted to greyscale and stripped of all metadata, including GPS. AI flagged that the creature photo looks like a screenshot of a post, possibly someone else's photo; it cropped the caption off, and I need to confirm the photo is mine.

---

## Content and pages round (2026-11-15)

**My requests:**
- Draft the text for each page from what we discussed; I'll edit.
- A ~300-word stance: derived a bit from the brief, a bit philosophical, a bit *A Scanner Darkly*. Who am I? How can I use the machine without being devoured by it?
- The CV comes from my May 2026 CV file.
- ROI: projects as coloured dots in their region. A thumbnail opens with a smooth ease-in; clicking opens a gallery. Thumbnails well designed and cropped, with title and year beneath.
- Event Horizon should look like space: constellations, black holes with years only, and a line saying these are cataclysmic events. What they are is left unsaid.

**What AI did:**
- **Page lines:** drafted for Home, ROI, Work and Event Horizon.
- **Stance (~330 words):**
  - Opens with "Who am I, if the machine can describe me?"
  - Moves through the AI-default page (made, then blacked out), fifteen years of checking that images hold, and the scramble suit from *A Scanner Darkly* as the risk of dissolving into the machine's average.
  - Ends with the grid as a structure strict enough to push against: "What breaks through is me."
  - Marked as Claude's draft for me to edit.
- **Work:** rebuilt from the CV. Each role is a heavy black bar across its years, in stacked lanes on the red year-gap columns, with tool chips linking out. Phone and email are left out on purpose. The years of my B.Des and Jumpcut are marked "to confirm".
- **ROI:**
  - Projects are **red dots**; pieces of life are hollow red dots, placed in their regions.
  - Hovering or clicking a dot eases in a thumbnail card scaled from the dot (title in Bodoni 900, year in Courier). The card opens a full-screen gallery with arrows, keys and a PDF link.
  - AI rendered every page of each project and picked the strongest crop per project: 4:3, greyscale. The two text-only projects get typographic thumbnails in the stretch type instead of bad crops.
  - Vaccine Futures' gallery uses the 32 panels instead of the long strip.
  - AI re-cropped the Peres thumbnail to avoid children's faces.
- **Event Horizon:** redesigned as space: a slow starfield with lensing, thin red year lines, a constellation of eight stars (the people I love, positioned from shuffled grid values), and five black holes with only a year beside each. The encryption UI and code are removed. Details are deliberately not documented here.
- **Fix:** content below each page header now starts exactly where the header ends (it is measured, not estimated).

---

## Round: hover, titles, vast field, work categories (2026-11-15)

**My direction:**
- Cover hover makes the letter negative and keeps it on that font, and all the other letters switch to that font.
- Titles on the other pages: smaller, on a steady grid, aligned right.
- The rhizomatic map should be much larger and more extensive: latent fields (biology → microbiology → immune system…), wide and vast.
- Event Horizon needs to be subtle and look better.
- Work: more legible type hierarchy, with categories. The grid is "random", and the years should follow it even though that's not "right".

**What AI did:**
- **Cover:** the hovered block turns negative (black block, white letter) and holds its face. Every other letter takes that face; mutation pauses until the pointer leaves.
- **Page titles:** a steady grid with fixed widths from the page's numbers, no widening, no wrap. Set right, with the explanatory line on the left in a two-column header.
- **ROI as a vast latent field:**
  - Four regions, each with 5–6 fields and 4–5 terms per field.
  - Hybrid zones where regions meet (biopolitics, contagion of ideas, electromagnetic colonialism, the right to opt out, free radio, bodily autonomy), with "invisible systems" in the middle.
  - Hairline branches, plus dashed cross-links where terms talk across regions (the rhizome).
  - Projects and life items sit next to the term they're about.
  - Wheel/pinch zoom and +/− buttons. It opens zoomed out to show the scale, then settles into Biology. The HUD shows the path (region › field › term).
- **Event Horizon, subtle:** dim drifting stars with slight parallax, small true-black holes noticed mostly by absence (stars bend and vanish at the edge), hairline rings, small spaced years, faint red year lines and a faint constellation. The year brightens on hover.
- **Work:**
  - **Each year takes one column of the uneven birthday-gap grid**, so time is drawn to their scale, not the calendar's.
  - Category rows: education, editing & post, restoration, finishing & colour, video & AI, recognition. Sticky labels and filter toggles.
  - Hierarchy: year (mono), role (slab 700), organisation (Bodoni italic), description (mono).
  - Tools sit outside time, at the end of the track. Shift-scroll moves down.

---

## Round: circles, thinner grid, fit, no photos, targets (2026-11-15)

**My direction:** Event Horizon is only circles and bubbles (the events much bigger, plus bubbles for the people I love), with intersections flipping between black and white, a red background and an invisible grid. The grid should be thinner everywhere. Work is side-scroll only and must fit the screen height. Remove the photos altogether: projects only. In ROI the target grid should move and animate on every dot and grow when chosen; projects are larger red dots with a year. The gallery is a smaller window, not full screen.

**What AI did:**
- **Event Horizon:** a red page with no visible grid. Large event circles carry only their years. Small bubbles are sized and placed from the *relative* ages already in `css/grids.css`, with no labels, so no birth year is published. Overlaps use parity: odd layers black, even white. Everything drifts slowly, so the intersections keep changing.
- **Grid:** a single variable `--gw: .5px` now sets the grid and frame lines across the site.
- **Work:** rows size to the available height, so there is no vertical scrolling. Each entry shows year, role and organisation; the description and link open on hover. Tools sit in two columns at the end. Filters removed to save space.
- **Photos removed:** life images and thumbnails deleted from the site and the files. AI flagged that they remain in the public git history unless the history is rewritten (that needs a force-push; my decision).
- **ROI:** every point carries its own target (8 rings from the ages) that breathes with staggered timings. The point nearest the centre is chosen and its target grows into the large grid; projects can be chosen too. Projects are 20px red dots labelled with title and year. Clicking a project centres it and eases in its thumbnail. The gallery is a window over a light backdrop; click outside to close.

---

## Round: breathe, dictionary, headers (2026-11-15)

**My direction:**
- Event Horizon: the circles only breathe, they don't move. The grid should be different. Years appear only on hover, bigger and inside the circle. The text only says "Ask me in person. I might even answer."
- Work: categories in negative colour.
- ROI: one font for the topics and a different font for projects. Hovering a topic brings up its dictionary explanation in a pop-up box.
- Page titles aligned left, with a shorter page text under them.

**What AI did:**
- **Event Horizon:** the circles stay fixed and breathe (a slow scale pulse). AI read "a different grid" as snapping all centres to this page's own invisible grid: 12 month-columns (one per letter of EVENTHORIZON) by 4 rows. The year appears only on hover, set in Bodoni 900 inside the circle. The page text is exactly my line.
- **Work:** category labels are white on black.
- **ROI:** all topics are set in Bodoni Moda (900 for regions), projects in Zilla Slab. A dictionary box opens on hover (headword, part of speech, short definition). AI drafted about 140 entries in `js/roi-dict.js` for me to edit.
- **Headers on every page:** the title sits left on its steady grid, with one short line under it. The page texts were shortened, including Home's.

---

## Event Horizon as a bubble timeline (2026-11-15)

**My direction:** the large events must never overlap: it's a bubble timeline. The people become lines instead of bubbles; they start at their births and continue, except one that ends.
**AI questioned consent before building:** (1) a line ending at an event's year would let visitors infer that event's meaning; (2) line starts would make birth years readable against the event years.
**I decided:** keep the ending as it is, and blur the starts.
**Built:**
- Time runs left to right (compressed before 2007). The event circles sit by year on alternating rows, with radii grown as large as possible without touching, breathing in place.
- People are lines that fade in over a window around each birth. The window is offset by the secret seed, so exact years can't be read. Each line then runs on, and one ends.
- Where a line crosses a circle, black turns white.
- The data is generated into `js/horizon-data.js` from `secrets/` (fade windows and an end year only; no dates). Which line ends is recorded only in `secrets/lines.json`.

**Next:** the whole site pushed live for a full browser check.
**Then I asked for:** much larger circles and much thicker lines. **AI:** opened up the time axis (before 2007 squeezed to 12%). The layout now tries every arrangement of the five circles across three rows and keeps the one where they can be largest without ever touching. Lines are about 1/90 of the page height (at least 6px).
**Then:** lines as thick as a crosswalk (red/black), and circles may overlap rows but not columns (different years). **AI:** the people-lines are now bands exactly as thick as the gaps between them, filling the page. Each event gets its own column as wide as its circle, side by side. The years keep their order but not their spacing, like Work following its grid rather than the calendar. The time axis bends through the event centres so the lines still meet their years.
**Then:** thicker lines. **AI:** bands now take 72% of each slot, with 28% red gaps.
**Then:** on hover a circle turns solid black with its year in white. **AI:** done.

---

## Cover and stance, round 2 (2026-11-15)

**My report:** the cover isn't working as described (it still goes to a landing page, hover doesn't work, the sella_vie switch doesn't work). Remove the word "Stance" and the two texts on the right. The stance text is bad: make it far shorter and cryptic, use my earlier phrases, don't quote *A Scanner Darkly* (it was only an example). Say something about things that live only inside me and the gap I keep from the machine, with a *Ghost in the Shell* feeling. Two wide columns that also change with the title-size slider.
**AI tested the live site in the browser:** it opens directly on the cover, the switch swaps the name, and hover turns the letter negative and gives every letter its font. What I saw was most likely a cached old version (fix: hard refresh or a private window). It found one real fault: in *sella_vie* the underscore was stretched into a solid black block (and the l's into bars), which reads as broken.
**AI changed:**
- The underscore now stays a low bar.
- The "Stance" heading, the "See the default" aside and the bottom-right note are removed.
- The new stance is 6 short paragraphs in Bodoni, in two wide columns. The type size, and with it the columns, follow the size slider. It uses my line "The modernist is the system; the anarchist is the outcome" and my question "how do you use the machine without being devoured by it?". It ends "The shell can be read. What moves inside it cannot." and "Give it the grid. Keep the ghost." No quotes from either film.
- **Flag:** with the "See the default" link gone, the typology confrontation (required by the brief) has no visible home on the site. Still to decide.

---

## Round: Swiss ROI, red Work grid, black balls, Process page (2026-11-15)

**My direction:** ROI tighter, with less empty space, and really good, like a Swiss design poster. Work grid in red only. Event Horizon: lose the stripes, only big black balls for the events, turning white with the year on hover. A Process page.

**What AI did:**
- **ROI as a Swiss poster:** every point snaps to a 24px module. Each region is a block in its quadrant: the region name in Bodoni 900 at 72px, fields in two flush-left columns (Bodoni 700), terms listed one module apart beneath each field.
  - A cross of empty space runs through the middle, where the hybrid zones sit, with *invisible systems* at the centre.
  - Branches are square-cornered (down, then across). Cross-region links are dashed red.
  - Terms' targets are faint until chosen. Project labels sit to the left of their red dots.
- **Work:** all grid and frame lines are red; only content stays black.
- **Event Horizon:** the people-lines are removed (and their generated data with them). Only five black balls remain, each in its own column, breathing; on hover a ball turns white with its year in black Bodoni.
- **Process page** (`process.html`, in the menu on every page):
  - *The default*: the AI typology, rebuilt and redacted line by line, with Redact/Restore. This gives the brief's typology confrontation a home again.
  - *Taken from*: links to the vision board, the references, the Wix motion notes and the repository, plus the Phase 0 iteration image.
  - *Log*: this file, rendered live from `docs/process/log.md`.

**Then:** ROI should be rhizomatic and organic, not griddy, and Process should be a hidden button. **AI:**
- **ROI is organic again, but tighter:** fields fan out from each region at irregular angles (190–280px), terms sprout around them (78–130px), and a relaxation pass pushes overlapping labels apart, so the field is dense without collisions. Connections are soft curves, like roots; cross-region links stay dashed red. The type hierarchy is kept.
- **Process** is out of the menu. It's reached through a small hollow dot at the far right of the top bar, with no label, that fills on hover.
- **Checked before pushing:** all scripts valid, no missing files, nothing private in public files.
**Then:** project titles in ROI in red too. **AI:** done (title and year in the system red, like their dots).

---

## Am I really breaking the grid? (2026-11-15)

**I asked:** am I really breaking the system and the grid, and what can be added to do that?
**AI's honest answer:** not yet. The order is strong, but the break lives *inside* the system. The disorder (mutating fonts, stretching, the organic map) is generated by code, the grid is never actually violated, and the personal material has gone quiet. It proposed four things: (1) the event years buckle the grid on every page, (2) my hand drawn over the system, (3) the one "bad cut" I leave alone (my CV: "physically unable to leave a bad cut alone"), (4) my voice.
**I chose:** (1), made glitchy. Plus on the cover: hover pauses the current state instead of unifying fonts, and the mutation runs faster otherwise.

**What AI built (`js/rupture.js`):**
- **Home:** the blocks that fall on the five event years *slip*. The letter shifts out of line while its frame stays on the grid, dashed. That's also the bad cut, left alone.
- **Work:** the column of each event year is torn by a jagged red line, and every bar and label that crosses it is cut.
- **Every page:** at irregular intervals the page tears for a few frames (horizontal displacement and a jolt), like a dropped frame or a broken timecode, sometimes in clusters. On ROI the tear doesn't move the field; Event Horizon tears most often.
- **Cover:** hover now freezes everything exactly as it is, with only the hovered block going negative. Mutation is about 3× faster (every 0.26s, flicker 45ms).
**Then:** the torn Work grid doesn't work. Drop the glitch; use only the underlying circles, as a blow-up distortion like a magnifying glass. **AI:** removed the tears, the glitch bursts and the Home slips. `js/rupture.js` now places the five event circles invisibly under the pages as **lenses**: an SVG displacement filter whose map is drawn from the circles, so whatever sits inside one appears enlarged (strongest at the centre, nothing at the rim) and the red grid lines bulge around it.
- **Home:** five lenses placed across the cover by year.
- **Work:** a lens on each event year's column.
- **ROI:** the lenses are fixed over the field and the map slides beneath them.
- **Event Horizon:** none (the circles are visible there). Not documented: what the circles stand for.
**Then:** are the distortions aligned to the circles? They don't breathe. **AI (honestly):** no. The lenses had been placed by eye on each page and were static. Fixed: one shared layout for Event Horizon and every lens, lenses fixed to the screen (content scrolls beneath them), breathing in phase with the balls.
**Then:** smaller circles that follow the mouse, with billiard-ball collisions. **AI:** `js/rupture.js` is now one physics simulation of the five bodies, shared by every page. They are 46% of their former size, with mass ∝ r². They chase the pointer (heavier ones lag), collide elastically with each other (restitution .92), bounce off the screen edges, breathe, and drift back to their columns when the pointer leaves. On Event Horizon they're the black balls (white with the year on hover); on Home, Work and ROI they're the invisible lenses.
**Then:** hide the Event Horizon tab; make its button only a circle. **AI:** the menu item is now a 14px black circle, no label (it grows on hover).
**Then:** the intro text isn't good. It should sound dry and cynical, Matrix-like, eye-opening; ask questions to get it right. **AI asked; I answered:** first person, about the machine; the eye-opener is "the default is everywhere"; about 60 words; keep only "devoured". **New stance (58 words):** "The machine already knows what I look like. It has seen a million of me: a gradient, rounded corners, a hand waving hello. / The average won. It is everywhere now, and it is comfortable. / I use the machine every day. I just don't let it finish my sentences. / How do you use it without being devoured? Stay slightly wrong."
**Then:** drop the circle distortion entirely, bring back the Event Horizon tab, slow the cover's font switching. **AI:** lenses removed from Home, Work and ROI (`rupture.js` now only runs the physics of the Event Horizon balls). The menu shows "Event Horizon" as text again. The cover now mutates every 0.65s (flicker 70ms).

---

## People as the break (2026-11-16)

**My idea:** make the grid family classic, and let the *placement* be the chaos, derived from the secret file: "an unrandom randomness". Does that answer the brief?
**AI's assessment:** mostly yes, and better than before:
- A classic grid reads as conscious modernism and contrasts clearly with the typology.
- Data-derived placement is authored, specific and impossible for a model to reproduce.
- The encounter becomes the idea itself.
Two risks: (1) to a visitor, deterministic chaos looks like random chaos, so there has to be a way to show *that* a rule exists; (2) it's still code, so a non-computable trace (hand or voice) would make it unarguable. It also flagged a story shift: from "people are the order" to "people are the break".
**I chose:** snapping back to the grid (on a gesture). Event Horizon on a 120 BPM heartbeat that sets the rhythm for everything else; the cover stays the same. And it has to be award-level. Then I refined: not a snap but an offset, a prism breaking from the original place to the grid position.
**AI recommended press-and-hold** over hover (it fires constantly and doesn't exist on phones) and over click (already used). Hold is deliberate, works on a phone, and you have to *stay* to see the order. It triggers after one beat of stillness; moving turns it into a drag.

**Built:**
- **Placement data:** `tools/derive-grids.py` hashes the dates with the secret seed (SHA-256) into 128 offsets in [-1, 1] and a derived seed, written to `js/placement.js`. No dates are written.
- **ROI:** a true Swiss layout underneath (24px module). Every point is pushed off it by its offset (regions a little, terms a lot), then a deterministic relaxation keeps labels from colliding. Hold: red square ghosts split off each point and travel to their grid positions, with two echoes along the way, and the grid's right-angle structure draws in red. Release folds it back.
- **Work:** classic equal year columns (200px). Each role drifts by its offset. Hold: a red dashed ghost shows where each bar belongs.
- **Page titles:** equal slots (classic).
- **Heartbeat:** `--beat: 500ms`. The Event Horizon balls pulse lub-dub at 120 BPM, the ROI rings beat in sync (rippling outward 30ms apart), and transitions use beat multiples.
- **Colophon** on every page except the cover: "Grid 24 · Beat 120 · Seed ######### · Not random", the rule shown without the data.

**Then (my direction):**
- **Stance, my own words:** "The machine already knows what I look like. What I do eat think dream love. / The average won and it is comfortable. / I use the machine every day. How do you use it without being devoured? Keep secrets."
- **A button on ROI** to switch between grid view and rhizome view, and the same on Work (grid and chaos).
- **Don't write "grid" or "beat" anywhere:** the mechanism is invisible.
- **Event Horizon** is just five large black holes, showing a year on hover and beating at 120. The other page titles swap characters at the same rate.

**AI:**
- The stance is my text, verbatim.
- The colophon is removed, and the page notes no longer describe the mechanism.
- **ROI:** a Grid ⇄ Rhizome switch. All points move between their grid place and their secret-offset place over two beats, leaving three red after-images along the way (the prism). In grid view points become squares and links become right angles. Press-and-hold is replaced by the switch.
- **Work:** a Grid ⇄ Chaos switch. Bars glide over two beats, and a red dashed after-image stays at the old place and fades.
- **Event Horizon:** five large black holes with no mouse physics. They beat lub-dub at 120 BPM and show their year on hover. `rupture.js` is reduced to the shared layout and the heartbeat.
- **Page titles** (ROI, Work, Event Horizon, Process) swap a character every 500ms, in step with the beat. The cover is unchanged.

**Then (my direction):** bigger, more scattered balls that fill most of the screen, with a fading contour like a real black hole or eclipse. The cover text in one column, typographically good. ROI's rhizome navigation isn't good: the map centre should follow the mouse, and a click should open the data. The grid view is messy with the projects and needs a better layout. Work's grid is good, but chaos should be fully chaotic and grungy, overlapping, a mash-up of rhizome and black holes.
**AI:**
- **Event Horizon:** five big black holes scattered by the secret offsets, relaxed so their cores don't touch, together covering most of the screen. Each is an eclipse: a true-black core, an edge fading into the red, and a faint pale corona. They beat at 120 BPM; the year shows on hover.
- **Cover stance:** a single Bodoni column hung from the third grid column, with balanced lines, a red hairline above, the question in italic and "Keep secrets." in black italic. The size still follows the slider.
- **ROI:**
  - The map's centre drifts toward the mouse (with a small dead zone in the middle), eased; scroll zooms. Click a term and its dictionary entry pins open; click a project and its thumbnail opens, then the gallery. Click empty space to close.
  - In grid view, the projects form their own index column on the right, in year order, linked to their terms by red right-angle threads.
- **Work, chaos view:** roles are thrown far (up to 340px sideways and 1.5 rows vertically), rotated (±13°), scaled (±30%) and overlapping. The text and bars invert (difference blend) over five black holes at the event years. Bars have rough, displaced edges, a red dashed rhizome tangles the roles, and a grain overlay sits on top. Grid view is unchanged.
**Then:** I didn't see the fixes on the site. **AI:** they were live; my browser was caching the old files (GitHub Pages lets browsers keep them for about 10 minutes). Added `tools/stamp.py`, which stamps every css/js link with a version, so each push loads fresh. Seen live: Work's chaos grain was far too heavy, now reduced, and the inversion was made legible.

---

## Round: reading size, censor menu, scrapbook chaos, print-ready holes (2026-11-16)

**My direction:**
- **Cover:** text at reading size.
- **Menu:** the positions stay fixed; choosing a page redacts it with a black censor strip.
- **ROI:** hover focuses and highlights a node, click shows info. I didn't understand why text is sometimes black and sometimes faded.
- **Work chaos:** gritty, grungy, rock'n'roll, beating, rhizomatic, but *not* like ROI. More like a detective board or inspiration board, 90s scrapbook with textures. The circles as explosions or disruptions.
- **Event Horizon:** a subtle beat, the year moving with it, strict edges (the fade is bad), a more eased beat, and a better, print-ready composition.

**AI:**
- **Cover:** the stance is set at reading size (Bodoni 21/30, old-style figures), one column.
- **Menu:** identical on every page (Home · ROI · Work · Event Horizon) at fixed positions. The current page is covered by a black strip sized to its word. Clicking another page slides the strip over it (a quarter-beat) before leaving (`js/nav.js`). Process stays behind the hidden dot.
- **ROI:** hovering a node makes it the focus (its target opens), its label inverts to a black tag (red for projects), and its point grows. Click still opens the dictionary or the project. *Why the grey:* in the rhizome, points fade with distance from the centre, as depth. AI removed that in grid view: there, everything is full black.
- **Work chaos as a detective board:** photocopied paper scraps (hard black shadow, torn bottom edge, xerox displacement, tape), a red pin on each, ransom-note titles (each card in a different face from the type family), the year stamped in red typewriter type. Red string runs pin to pin with a slight sag. Black ink explosions (spiky splats with droplets, shaped from the secret offsets) sit at the event years and beat. The ground is halftone dots with xerox grain. Grid view is unchanged.
- **Event Horizon:** a fixed poster composition in a 1.6 × 1 frame (transposed on portrait screens): one dominant hole, the others stepping down, none touching. Strict edges, no fade or corona. A gentle, eased lub-dub (sin² curves, 1.6% scale). The year scales with its hole on hover.
- **The heartbeat** everywhere uses the same eased curve (CSS and JS).
**Then:** on hover the chosen ball grows and the others rearrange to keep a balanced composition; in the rhizome, what isn't focused fades and the focus turns black. **AI:** Event Horizon has five fixed slots (largest first); the hovered event takes the largest and the rest fill the remaining slots in their default order, over one eased beat, locked during the move to avoid chain reactions. ROI: the distance fade is replaced. Only the focus (hover or centre), its parent, its children and its linked terms are full black; everything else sits at 22%.

**Then (my direction):** cover text smaller, at running-text size, aligned left. Work grid view was broken: restore it. The order/chaos button should be a switch with no words anywhere. Work chaos looks bad: I want a different realm, a cork board with images, music, albums and layers. Drop the graphic explosion (it's ugly); keep a hint of the circles at their years, as a thin circle frame.
**AI:**
- **Grid bug:** the reset for grid view had been lost in an earlier edit, so cards kept their chaos rotation. Restored, and enforced.
- **Switch:** a wordless toggle on Work and ROI (knob slides; red in chaos/rhizome).
- **Cover:** the stance at 16/25 Bodoni, from the left edge, one column.
- **Work chaos as a cork board:** a procedural cork texture with an inner vignette. Roles become index cards (ruled lines, a red top rule, typewriter titles) held by glossy red pushpins. Twelve polaroids of my work (graphic-novel panels and project thumbnails, greyscale) are pinned in layers, with typewriter captions. Red string runs pin to pin, with a slight sag and a shadow. The board has a subtle mouse parallax by depth, so the layers separate. Each event year is marked only by a thin red circle. The explosions, halftone, grain and rough edges are removed.
- **Open:** music and albums. AI asked which ones; real album covers are copyrighted artwork, so it suggested typographic sleeves or my own photos of the records.

**Then:** messier, following my references (a collage journal, cut-outs, a detective board, a tour board with tickets and passes). Find relevant images online (film, cinema, college life) and take complete creative freedom; I said it won't be published.
**AI flagged:** the site *is* published (public repo, live on GitHub Pages), so copyrighted web images would be a real problem. It used two sources instead. (1) Public-domain film history, hotlinked from Wikimedia Commons after testing which files load: Muybridge's *Horse in Motion* (still and animated), Méliès' *A Trip to the Moon*, the Edison Kinetoscope, SMPTE bars. Modern photos and logos were left out because of uncertain licences. Credited on the Process page. (2) Ephemera drawn in code, owned by no one but me.
**Built (`js/board.js`)**, placed by the secret offsets:
- prints and polaroids of my work and of film history, and film strips of my panels
- red cinema tickets with notched edges, and countdown-leader circles
- EDL printouts with timecodes (my conform years)
- yellow and blue sticky notes ("?", "#4", "time?")
- ransom-note lettering of my own lines ("Physically unable to leave a bad cut alone", "Stay slightly wrong", "Keep secrets", "The average won")
- Permanent Marker notes ("the cut that lies", "QC → pass?")
- striped washi tape, a VHS label ("EDIT SUITE · REEL 03"), a mixtape cassette, ALL AREA and BACKSTAGE passes
All of it is joined by red string, with depth parallax; hovering lifts a scrap to the top.

**Then:** I couldn't push. The Work board is still too organised and machine-made. Use other images from across the web, not mine (it'll be deleted once submitted). Research MTV and 90s analogue, *Reality Bites*, and go wild. Plus: the switch always bottom left, consistent on every page, labelled "to be" (chaos, shown first) and "not to be" (the grid).
**AI:**
- **Push:** there was nothing to push; everything was already on GitHub.
- **Images:** AI won't place photos of real public figures (celebrities, VJs, film stars), even as links, and its web image sources (Openverse, Wikimedia Commons listings) were blocked from this session. It asked me to drop my own collected images into `~/Downloads/ME/board` to be processed.
- **Found a real bug:** the version stamps had stopped `board.js` from ever being added to the Work page, so the board never ran live. Fixed.
- **Messier, more 90s pass:**
  - Rotations up to ±26° and scale variety, denser and more overlapping, with hand-cut clip-path silhouettes.
  - Xerox treatment (crushed contrast and halftone dots), and camcorder frames with scanlines, colour fringing, "● REC" and orange VCR date stamps.
  - Day-Glo duotones (pink, yellow, green) and round neon stickers ("WHATEVER", "REWIND", "BE KIND").
  - Flickering TV-static screens, coffee rings, staples, and wobbly marker scribbles (circles, arrows, crosses) in red, black and pink.
  - Big red marker notes.
- **Switch:** one shared component, bottom left on ROI and Work: TO BE (chaos, default) | NOT TO BE (grid).

**Then:** no images from my school projects on the Work board at all. Movie references and quotes; directors' portraits (David Lynch, Kubrick, Lanthimos, Sofia Coppola); MTV Oddities and Alternative Nation. Make the string look like real string, not a graphic line. And it isn't working: run a pass to verify functionality before I push.
**AI:**
- **Functional test** (`tools/test-pages.js`, jsdom): loads every page with its scripts, clicks the controls and reports errors. It found the real bug: Work's switch condition was inverted, so "not to be" never switched. Fixed. Now all five pages pass with no script errors, and the switch flips both ways.
- **The board:** none of my images (verified: 0). Instead:
  - **Persons of interest** for Lynch, Kubrick, Lanthimos and Coppola: a generic silhouette (no photos of real people), the name, the films, a marker note.
  - Tickets for 14 films with their years, and TV-guide clippings (Alternative Nation, 120 Minutes, MTV Oddities, Headbangers Ball, Liquid Television).
  - Homage motifs drawn in code: a red curtain, a zig-zag floor, a one-point corridor.
  - "Quotes" are film titles or a public-domain proverb ("All work and no play makes Jack a dull boy"); no copyrighted dialogue.
  - Public-domain film history is now also used in the camcorder frames, duotones and film strip.
- **String:** twine with a dark core, a dashed spiral highlight (the twist), a blurred cast shadow, varied sag and a knot at each pin.

**Then:** more actual photos from the internet, nothing created graphically (the fake tickets are ugly). Everything should be images, the board and the string included, looking real like a 3D materials render. The circles should be black and target-like, not red. Use actual photos of the directors and films, actual tickets and movie scenes.
**AI:** it won't fetch or place photos of real people (the directors), and web image sources are blocked from this session. So the board is now photo-only and driven by images I choose: anything dropped into `assets/board/` is listed by `tools/board-manifest.py` and pinned as a real print (white border or polaroid, a slight 3D curl, a paper sheen, a layered cast shadow, a glossy pin; hovering lifts it flat). The materials are swappable: `materials/cork.jpg` becomes the background, `string.png` is laid along each string in rotated segments, and `pin.png` becomes the pushpin. Until those arrive, the fallbacks are a procedural cork, twisted twine and glossy pins, plus four public-domain photographs of early cinema. All code-drawn ephemera is removed. The circles are black targets.

**Then:** my own image boards (saved screenshots of collections), plus EGO, The End, the polaroid girl, a selfie with a poster, and two string photos (a yarn ball and a red cord).
**AI:** cut every tile out of the screenshots (53 prints, duplicates dropped), painted out the edit icons and set the pushpin over that corner. The cord photo became the string: one straight stretch, unwarped and keyed off its white ground, laid along each string. The cork is a real photograph (PAKUTASO, free for any use). Asked which personal photos go on the public board; I said all of them. The string was a red cage over everything, so now it is fewer and local: each card to a nearby photo, every fourth photo to a neighbour. An old polaroid rule was turning some prints grey; removed.

**Then:** too organized. Different sizes, different blending modes (overlay, darken, multiply), click to bring a photo to the front. Add the mess of real receipts, scanned tickets and papers, and handwriting, from actual images or scans, not generated. The pushpins look bad, and the red line should connect a lot more things: the lifespan of a maniac, a beautiful mind.
**AI:**
- **Paper:** 59 real scans from Wikimedia Commons (public domain / CC), chosen by eye from about 440 search results. They include ticket stubs from the 1920s–90s, concert tickets, receipts, telegrams, envelopes, matchbooks, diaries, letters, a recipe card, a shopping list and Darwin's first tree sketch. They are interleaved with my own images. Credits are in `docs/research/board-credits.md`.
- **Sizes and blends:** sizes now run from 64px to 660px, mostly small with a few huge. Each print blends into the cork as normal, multiply, darken or overlay. Rotations are wider, and scans sit bare as paper with no print border. Clicking brings a print or a card to the front.
- **Pins:** a real photographed pushpin (Commons), keyed off its white ground in the browser, sized and tilted per pin. The board rotates each print around its pin.
- **Cord:** the strings moved to a canvas, so there can be hundreds: each print to its neighbours, leaps across the years, every CV card to three prints, and the five event years as hubs pulling threads from everywhere. Parallax is gone, because the threads have to stay on their pins.

**Then:** lose the ugly red pushpins and use tacks or nails (two photos: an antique brass tack, black cobbler's nails on wood).
**AI:** cut the brass tack's round head out of its white ground and eight single nails out of the wood. Overlapping nails were left out. Most pins are now brass tacks, sized to their print with a tight shadow, as if pressed in. About two in five are black nails, at any angle with a longer shadow. The Commons pushpin is gone.

**Then:** darker string with no weird outline (photos of a thread spool, a loose red thread, a thread on paper). An effect for some images: the *Red Thread* poster look, a grainy two-ink red duotone. Smaller, darker tacks, mixed with red pushpins (a photo of four). Strings sometimes over and sometimes under. Clicking an image brings it to the front in a gallery view.
**AI:**
- **Cord:** the string is now a strip of real dark-red thread cut along the spool's wind. It has a rounded shade and a soft one-pixel edge, so there's no outline. The shadow is drawn alone, blurred (the line itself sits off-canvas), and the cord is thinner.
- **Red thread:** an SVG filter turns luminance plus grain into three inks: deep red, red, and skin. It's on one print in six.
- **Pins:** the tacks are darker aged brass and smaller (9–14px). The four pushpins were cut out of their white ground, with the fringe pulled toward red. The mix is about half tacks, a quarter nails and a quarter pushpins.
- **Weave:** the cord is on three layers. Two in five threads run under every print, one in five runs between the layers, and the rest run over everything.
- **Gallery:** clicking a print brings it to the front and opens it large, with its credit. The arrows or keys walk the whole board; Esc or a click outside closes it. A card click brings the card forward.
