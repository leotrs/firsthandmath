// Captures each widget of an exploration at its starting position, in light and in dark, for RSM's
// :static: and :dark: images (the picture in a reference's tooltip, and the figure without
// JavaScript).
//
//   node site/statics.mjs NAME URL
//
// URL serves the built site (_site/), with NAME built. For each figs/X.html of the exploration it
// writes figs/X-static.png and figs/X-static-dark.png, of the first canvas X.html places. A figure
// may also list other states in figs/X.states.json, as {"state": {"name": value, "canvas.attr":
// value}}: each is written as figs/X-state.png and figs/X-state-dark.png, of the figure with those
// values written into its model, for a still picture of a state the page itself does not show. A picture
// cannot be dragged, so the page's hands are left out; and "comes into view" never fires during the
// capture, so no figure's first nudge moves it from its starting position.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const [name, url] = process.argv.slice(2);
const mtp = process.env.MATHTERPIECE ?? join(process.env.HOME, "aris/mathterpiece");
const { chromium } = createRequire(join(mtp, "web/package.json"))("playwright");

const dir = join("explorations", name, "figs");
const figures = readdirSync(dir).filter((f) => f.endsWith(".html")).map((f) => {
  const html = readFileSync(join(dir, f), "utf8");
  const model = html.match(/<mtp-model id="([^"]+)" src="([^"]+)"/);
  const canvas = html.match(/<mtp-canvas model="([^"]+)" name="([^"]+)"/);
  const statesFile = join(dir, `${f.slice(0, -5)}.states.json`);
  const states = existsSync(statesFile) ? JSON.parse(readFileSync(statesFile, "utf8")) : {};
  return { stem: f.slice(0, -5), id: model[1], src: model[2], canvas: canvas[2], states };
});

const browser = await chromium.launch();

// Each figure is captured at the width its canvas has on the built page on a desktop screen, since a
// figure draws its lines, dots and labels at a fixed number of screen pixels: captured wider and
// shrunk to the page, they would come out thinner and smaller than in the live figure. A figure
// hidden on the page, as in a folded block, takes the width most of the others have.
const measure = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
await measure.goto(`${url}/${name}/`);
await measure.waitForFunction(() => [...document.querySelectorAll("mtp-canvas")].some((c) => c.querySelector("svg")), null, { timeout: 20000 });
await measure.waitForTimeout(500);
const onPage = await measure.evaluate(() =>
  Object.fromEntries([...document.querySelectorAll("mtp-canvas")].map((c) => [c.getAttribute("model"), c.getBoundingClientRect().width])),
);
await measure.close();
const shown = Object.values(onPage).filter((w) => w > 0).map(Math.round);
const usual = shown.sort((a, b) => shown.filter((w) => w === b).length - shown.filter((w) => w === a).length)[0];
const widthOf = (f) => (onPage[f.id] > 0 ? Math.round(onPage[f.id]) : usual);

// One page with every figure, beside the exploration's built page so that its assets resolve.
const page = `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light dark">
<link rel="stylesheet" href="/base.css"><script type="module" src="/mathterpiece.js"></script>
<style>body{background:var(--fm-paper);margin:0;padding:20px} mtp-canvas{display:block;margin-bottom:30px}</style>
</head><body>${figures.map((f) => `<mtp-model id="${f.id}" src="assets/${f.src}"></mtp-model><mtp-canvas model="${f.id}" name="${f.canvas}" style="width:${widthOf(f)}px"></mtp-canvas>`).join("\n")}</body></html>`;
mkdirSync(join("_site", name), { recursive: true });
writeFileSync(join("_site", name, "statics-capture.html"), page);

// Three times the screen's resolution, so that the picture stays sharp on any screen.
for (const scheme of ["light", "dark"]) {
  const p = await browser.newPage({ viewport: { width: 960, height: 1200 }, deviceScaleFactor: 3, colorScheme: scheme });
  await p.addInitScript(() => {
    window.IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} };
  });
  await p.goto(`${url}/${name}/statics-capture.html`);
  await p.waitForFunction(() => [...document.querySelectorAll("mtp-canvas")].every((c) => c.querySelector("svg")), null, { timeout: 20000 });
  await p.waitForTimeout(500);
  for (const f of figures) {
    const out = join(dir, `${f.stem}-static${scheme === "dark" ? "-dark" : ""}.png`);
    await p.locator(`mtp-canvas[model="${f.id}"]`).screenshot({ path: out, omitBackground: true });
    console.log(out);
  }
  for (const f of figures) {
    for (const [state, values] of Object.entries(f.states)) {
      await p.evaluate(([id, values]) => {
        const rt = document.getElementById(id).runtime;
        for (const [name, value] of Object.entries(values)) {
          const [obj, attr] = name.split(".");
          rt.write(rt.id(obj), attr ?? null, value);
        }
      }, [f.id, values]);
      await p.waitForTimeout(800);
      const out = join(dir, `${f.stem}-${state}${scheme === "dark" ? "-dark" : ""}.png`);
      await p.locator(`mtp-canvas[model="${f.id}"]`).screenshot({ path: out, omitBackground: true });
      console.log(out);
    }
  }
  await p.close();
}
await browser.close();
