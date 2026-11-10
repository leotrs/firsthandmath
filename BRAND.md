# Firsthand Math: brand

Approved by Leo Torres, 2026-11-07. Follow this for anything made for the channel: the site,
videos, thumbnails, social profiles.

## Identity

- **What it is:** mathematics a researcher finds worth showing. Part of it (30 to 50%) is recent
  results digested; the rest is ideas the author likes and finds interesting.
- **Contribution:** each exploration turns an idea into figures you can move. For recent results,
  that digestion is research in its own right.
- **Standard:** exact and honest. Claims are checked, sources are cited, difficulty is not hidden.
- **Form:** the exploration is the main artifact. It lives on the site, surrounded by text that
  ranges from a short morsel to a full digestion, sometimes alongside other explorations. It
  reaches people through YouTube: mostly shorts, where the exploration plays, sometimes long
  videos; later, other channels.
- **Authorship:** Leo Torres, by name. His taste picks the topics.

## Voice

Set by the author, 2026-11-09. The register is that of the author's papers and of the About
page: a mathematician writing for a curious reader, in full, connected sentences.

- **Full sentences, joined by their logic.** Sentences carry a whole thought and are joined by
  words such as "namely", "furthermore", "however", "since" and "though". Never staccato: no runs
  of short sentences, and no fragments.
- **Never punchy.** No slogans, no teasers, no lines written to land. A sentence states the
  mathematics and stops.
- **No clause hung on a noun.** Never "the circle the figure shows has radius 1", and avoid long
  clauses introduced by "that". Write "the circle shown in the figure has radius 1", or, shorter,
  "the circle in the figure has radius 1".
- **No first person,** neither "I" nor "we", and the reader is not addressed or given
  instructions ("drag p", "now turn on").
- **Nothing that is not a person acts as one.** A figure, a readout, a proof or a page does not
  say, show, want, cost or know anything. Write "the product shown under the figure", not "the
  readout says".
- **Never tell the reader how to use a figure** (the author, 2026-11-09). No sentence says what
  can be dragged, clicked, toggled or chosen ("the point $P$ can be dragged", "the toggles add").
  The figure itself makes plain what can be acted on. Text and captions describe the mathematics
  ("as $P$ moves around $C$").
- **Shapes by their names, never by their colors** (the author, 2026-11-09). Page copy refers to a
  shape in a figure by its label ("the circle $C$"), never by its color ("the green circle").
  Where a color must be named, as for a page's own accents, it is called by its plain name, green
  or blue, never teal or indigo.
- **Specific:** name the actual object and the actual claim, in the usual mathematical terms
  ("fix", "let", "is its own inverse", "preserves angles").
- **Honest:** say what is hard, what is open and what is unknown, plainly and without an appeal
  to the reader.

Pages released before Firsthand Math, such as the Turán page, keep their own voice and are not
rewritten to match.

Samples, from the author's papers:

- "Consider a finite undirected unweighted graph G and add a new node to it arbitrarily
  connecting it to pre-existing nodes. We study the behavior of the Perron eigenvalue of the
  non-backtracking matrix of G before and after such a node addition." (The pages use the same
  register without "we".)
- "Much effort has been spent on characterizing the spectrum of the non-backtracking matrix of
  certain classes of graphs, with special emphasis on the leading eigenvalue or the second
  eigenvector."

## Content

- **Digestions:** long; a recent result taken apart.
- **Morsels:** short; one idea the author likes, and a figure to try it with.
- Every short video is one of these figures playing; the page puts the same figure in the
  reader's hands.
- Every exploration page carries the author and date at the top; sources and how to cite at the
  bottom; a link to its video when there is one.
- Topics start from the author's own field (networks, spectral graph theory, embeddings), then
  recent results worth digesting.
- Never: the classics done to death (Pythagoras, primes, Fibonacci), and not the sunflower
  (golden angle) example.

## Visual identity

**Firsthand Math has its own house style, distinct from mathterpiece's defaults** (the author,
2026-11-08): its own palette and its own look for controls and figures. mathterpiece's defaults
(its examples, its docs, a figure with no styling) must not look like Firsthand Math, so that
figures made with mathterpiece are not mistaken for the channel's, the mistake 3Blue1Brown made
with manim's defaults. The palette below began as mathterpiece's examples' house palette; since
2026-11-08 the examples use BRAIID's colors instead, so this palette is Firsthand's alone.


- **Own identity:** not Aris's brackets; BRAIID is an inspiration only.
- **Type:** Source Sans 3 semibold for headings and small interface text; Source Serif 4 for long
  text and for the logo (2026-11-08; Newsreader before).
- **Colors** (2026-11-09): the site and the figures share one color, terracotta, and otherwise
  keep apart, so a color on a page never means two things.
  - **Terracotta** is the main accent of both: the logo's dot, the period after every heading,
    the highlighted word, and in figures what matters most (p and q).
  - **Plum** is the site's own accent, never used in figures: keywords in proofs, links inside the
    text, the selected block and the sidebar. It is a scale of eleven shades, made from `#8e44ad`
    with tailwindcolor.tools; keywords use 600.
  - **Teal, saffron and indigo** are figure colors only.

| name | light | dark |
|---|---|---|
| paper (page) | `#fdfcf9` | `#17181c` |
| ink (text) | `#1f2a44` | `#ece6da` |
| soft | `#8a93a6` | `#8f97a8` |
| terracotta (accent) | `#e76f51` | `#f08a6c` |
| teal | `#2a9d8f` | `#4cc2b3` |
| saffron | `#e9c46a` | `#f2d27e` |
| indigo (figures) | `#3f4fb5` | `#9aa6f0` |
| plum (site, 600) | `#8741a5` | `#b784cc` |

- The paper was `#faf7f0` until 2026-11-09 and was made a little lighter so that soft and
  terracotta reach 3:1 contrast with the page, the minimum for lines and shapes (WCAG 1.4.11).
- **Color is never the only cue** (the author, 2026-11-09). The house palette stays as it is, and
  every figure stays readable without color: each curve, line and point that the text or another
  shape needs to tell apart is named on the figure, an image is dashed and its original solid, and
  a guide in soft is always dotted, so that it never looks like a dashed image under red-green
  color blindness. Page copy uses the names, never the colors. There is no alternative palette.
- Figures are transparent by default and sit on the page. Every color in a figure should be a
  house token so it follows light and dark mode (bead mtp-m34w.1).
- The page keeps its small accents (teal and plum labels for Digestions and Morsels).
- Figure controls are gray at rest and ink while in use, never BRAIID's blue (bead mtp-kwy2.1).

## The home page

- A magazine layout: the newest exploration as the hero, live; a short paragraph on what the
  site is; a gallery of explorations with one to three highlights.
- A quiet invitation to mathterpiece: "Make your own: these figures are made with mathterpiece",
  linking to the software.

## The site

Decided by the author, 2026-11-08.

- **Built by RSM.** Each page is an RSM document with Firsthand's theme CSS. Figures are mtp
  figures compiled to `.mtpc` and placed with `:html:` blocks of `<mtp-model>` and `<mtp-canvas>`
  tags. One `:html:` block with `:class: hide` loads mathterpiece's runtime once per page.
- **Layout:** not chosen yet (mockups made 2026-11-08).
- **Every page ends with a colophon** of three labelled rows: how to cite; source (the page's
  folder on GitHub, and that the page is written in RSM and the figures in mathterpiece); licence.
- **Licence:** text and figures CC BY-NC 4.0; build scripts and theme MIT.
- **Source:** this repository, public on GitHub under the author's own account (not Aris). Drafts
  are public too, on branches; only `main` is published.
- **Launch:** the site goes live first, quietly, and is checked on real phones; each short is
  published after, linking to its page.
- **Hosting:** Netlify. The site is built on the author's laptop (`just build`) and uploaded
  (`just deploy`); the built site is not committed.

## The mark

`logo/mark-light.svg` and `logo/mark-dark.svg`: a serif F (Source Serif 4, weight 600) with a
terracotta point beside it, on a tile with rounded corners.

- **Light mode:** ink tile `#1f2a44`, paper F `#fdfcf9`.
- **Dark mode:** paper tile `#efe7d8`, ink F `#1f2a44`.
- The point is always terracotta `#e76f51`.
- Geometry on a 64-unit tile: corner radius 14; F centered at x 28 with its baseline at y 49,
  size 44; the point a circle of radius 5.5 at (48, 45).
- The F and the wordmark "Firsthand Math" are Source Serif 4, weight 600 (2026-11-08; earlier
  Newsreader 500).
- The point means something: every heading, on the site and on the explorations, ends in a
  terracotta period, the same point (2026-11-08, after aris.pub). It is added by CSS, never typed.
- YouTube crops the avatar to a circle; the mark survives the crop.
- Animation: later.

## Names and handles

- The site's domain is `firsthandmath.com`, registered by the author on 2026-11-08 at Namecheap
  (with free domain privacy and auto-renew).
- YouTube: the channel "Firsthand Math", handle `@FirsthandMath`, created by the author on
  2026-11-08 as a Brand Account. Its profile picture is the light mark filled to a full square, so
  that YouTube's circle crop has no transparent corners. Its description:
  "Firsthand Math is a channel for people who want to do more than just nod along. Mathematics
  explained and explored, with every figure online at firsthandmath.com, ready to be poked at."
  Channel copy uses no first person and does not name the author.
- `firsthandmath.org` was free on 2026-11-07; registering it is the author's step.
