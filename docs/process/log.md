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
