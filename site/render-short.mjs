// Renders a short from a take recorded on its dev page (site/dev/short-inversion.html): the
// narration (NAME.webm) and the time of every step (NAME.json).
//
//   node site/render-short.mjs ~/Downloads/short-inversion-20261110-180000.json [URL]
//
// URL serves the built site (_site/, with `just site` run), http://localhost:8790 by default. The
// page is opened with ?render in a headless browser at a Short's size, 1080 by 1920, and moved
// frame by frame on a clock of its own, so every frame is drawn on time however long it takes to
// draw. The steps are replayed at the times they were pressed, each phrase is shown as captions
// timed across its step, and the narration is laid under the frames. The captions come from the
// dev page's own captionAt, so the frame on the dev page shows the same captions while you speak.
// The video is written to _shorts/NAME.mp4.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join } from "node:path";

const [takePath, url = "http://localhost:8790"] = process.argv.slice(2);
const take = JSON.parse(readFileSync(takePath, "utf8"));
const name = basename(takePath, ".json");
const audio = join(dirname(takePath), `${name}.webm`);
if (!existsSync(audio)) throw new Error(`no narration at ${audio}`);
const mtp = process.env.MATHTERPIECE ?? join(process.env.HOME, "aris/mathterpiece");
const { chromium } = createRequire(join(mtp, "web/package.json"))("playwright");

const FPS = 30;
// The figure stays on screen this long after the narration ends.
const TAIL = 1500;

mkdirSync("_shorts", { recursive: true });
const out = join("_shorts", `${name}.mp4`);

// The page is drawn at a phone's size, 405 by 720 points, at 8/3 pixels a point: 1080 by 1920
// pixels, with the figure's lines and labels at the size a phone shows them. Dark mode, so the
// white text and buttons that YouTube draws over a Short stay readable.
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 8 / 3, colorScheme: "dark" });
await page.addInitScript(() => {
  let now = 0;
  let next = 0;
  const waiting = new Map();
  performance.now = () => now;
  window.requestAnimationFrame = (callback) => {
    waiting.set(++next, callback);
    return next;
  };
  window.cancelAnimationFrame = (id) => waiting.delete(id);
  window.__advance = (ms) => {
    now += ms;
    const callbacks = [...waiting.values()];
    waiting.clear();
    for (const callback of callbacks) callback(now);
  };
});
await page.goto(`${url}/dev/short-inversion/?render`);
await page.waitForFunction(() => document.getElementById("short")?.runtime && document.querySelector('mtp-stepper [data-mtp-input="next"]'), null, { timeout: 20000 });
// The figure empties itself when it first comes into view; that takes a few frames.
await page.waitForTimeout(1000);
for (let i = 0; i < 10; i++) await page.evaluate(() => window.__advance(1000 / 30));
const ffmpeg = spawn("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-i", audio,
  "-map", "0:v", "-map", "1:a",
  "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
  out,
], { stdio: ["pipe", "inherit", "inherit"] });

const frames = Math.ceil(((take.duration + TAIL) / 1000) * FPS);
let done = 0;
for (let f = 0; f < frames; f++) {
  const t = (f * 1000) / FPS;
  while (done < take.steps.length && take.steps[done].t <= t) {
    const target = take.steps[done].step;
    await page.evaluate((target) => {
      const stepper = document.querySelector("mtp-stepper");
      const at = Number(stepper.getAttribute("data-mtp-step") ?? 0);
      // A take starts at step 0, and no input of the stepper leads back there, so a 0 is skipped.
      if (target === 0 || target === at) return;
      if (target === at + 1) stepper.querySelector('[data-mtp-input="next"]').click();
      else stepper.querySelector(`[data-mtp-input="dot-${target}"]`).click();
    }, target);
    done++;
  }
  await page.evaluate(([take, t]) => window.__showCaption(take, t), [take, t]);
  const jpeg = await page.screenshot({ type: "jpeg", quality: 95 });
  if (!ffmpeg.stdin.write(jpeg)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
  await page.evaluate((ms) => window.__advance(ms), 1000 / FPS);
  if (f % (FPS * 10) === 0) console.log(`${Math.round(t / 1000)} s of ${Math.round(frames / FPS)} s`);
}
ffmpeg.stdin.end();
await new Promise((r) => ffmpeg.on("close", r));
await browser.close();
console.log(out);
