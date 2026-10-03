/* ==========================================================================
   STRATA — image variants (run once, or whenever a master photograph changes)

   The masters in this repository are 1408×768. That is fine for a thumbnail
   and wrong for everything else: a phone was downloading a 1408px photograph
   for a 342px slot, a desktop was upscaling one to 1584px, and the studio
   portrait — a 16:9 landscape — was being cropped to 3:4, which threw away
   about 59% of the frame.

   This script writes, from each master:

     <name>-640.jpg / <name>-900.jpg / <name>-1600.jpg   in proportion
     portrait-nadia-ostrow-studio-window-light-portrait.jpg   a real 1000×1250
       vertical crop, framed on the subject rather than on the middle

   No image library: Chrome renders each one and CDP captures it as a JPEG,
   which keeps the repository free of native dependencies. build.js only
   advertises variants that exist, so the site is honest with or without this
   having been run.

   Usage:   npm run images
   Requires puppeteer-core (see package.json). On this machine it lives in the
   sibling _qa folder, so:  $env:NODE_PATH='../_qa/node_modules'; npm run images
   ========================================================================== */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

let puppeteer;
try {
  puppeteer = require("puppeteer-core");
} catch (e) {
  try {
    puppeteer = require(path.join(ROOT, "..", "_qa", "node_modules", "puppeteer-core"));
  } catch (e2) {
    console.error(
      "puppeteer-core is not installed.\n" +
        "  cd STRATA-studio && npm install\n" +
        "or point NODE_PATH at the _qa folder:\n" +
        "  $env:NODE_PATH='e:\\portfolio_demo\\_qa\\node_modules'; npm run images",
    );
    process.exit(1);
  }
}

/* Chrome, because it renders the crop the same way the browser will. */
const CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];
const EXE = CANDIDATES.find((p) => fs.existsSync(p));
if (!EXE) {
  console.error("Chrome was not found; edit CANDIDATES in tools/images.js.");
  process.exit(1);
}

const MASTERS = [
  "hero-dim-double-height-concrete-interior.jpg",
  "project-ridgeline-residence-muskoka.jpg",
  "project-hensley-loft-toronto.jpg",
  "project-wren-and-salt-restaurant.jpg",
  "project-ashgrove-pavilion-king-city.jpg",
  "project-meridian-gallery-toronto.jpg",
  "project-alder-row-ottawa.jpg",
  "project-quarry-lane-workshop-hamilton.jpg",
  "project-morse-street-reading-room-toronto.jpg",
];

const WIDTHS = [640, 900, 1600];

/* The portrait: a 1000×1250 (4:5) crop, framed slightly above centre so the
   subject's head is not clipped by the top edge. */
const PORTRAIT = {
  file: "portrait-nadia-ostrow-studio-window-light.jpg",
  out: "portrait-nadia-ostrow-studio-window-light-portrait.jpg",
  width: 1000,
  height: 1250,
  position: "50% 28%",
};

/* A tiny render harness, written to disk for the duration of the run: a page
   created with setContent() lives at a data: URL, and a data: URL is not
   allowed to load file:// images. Reading the parameters from the hash keeps
   it to a single file and a single navigation per image. */
const HARNESS = "tools/.render.html";
const HARNESS_HTML = `<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;background:#000;overflow:hidden}
    img{display:block;object-fit:fill}
  </style><img id="i" alt="">
  <script>
    var p = new URLSearchParams(location.hash.slice(1));
    var i = document.getElementById("i");
    i.style.width = p.get("w") + "px";
    i.style.height = p.get("h") + "px";
    if (p.get("fit")) i.style.objectFit = p.get("fit");
    if (p.get("pos")) i.style.objectPosition = p.get("pos");
    i.src = p.get("src");
  </script>`;

(async () => {
  fs.writeFileSync(path.join(ROOT, HARNESS), HARNESS_HTML, "utf8");

  const browser = await puppeteer.launch({
    executablePath: EXE,
    headless: "new",
    protocolTimeout: 120000,
    args: ["--no-sandbox", "--allow-file-access-from-files", "--hide-scrollbars"],
  });

  const harnessUrl = "file:///" + path.join(ROOT, HARNESS).replace(/\\/g, "/");

  async function write(src, file, width, height, position, fit) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    const hash =
      "#src=" +
      encodeURIComponent(src) +
      "&w=" +
      width +
      "&h=" +
      height +
      (fit ? "&fit=" + encodeURIComponent(fit) : "") +
      (position ? "&pos=" + encodeURIComponent(position) : "");
    await page.goto(harnessUrl + hash, { waitUntil: "load" });
    await page
      .waitForFunction(
        () => {
          const i = document.getElementById("i");
          return i.complete && i.naturalWidth > 0;
        },
        { timeout: 20000 },
      )
      .catch(() => {});
    await page.screenshot({
      path: path.join(ROOT, file),
      type: "jpeg",
      quality: 82,
      clip: { x: 0, y: 0, width, height },
    });
    const kb = Math.round(fs.statSync(path.join(ROOT, file)).size / 1024);
    console.log(`  ${file}  ${width}×${height}  ${kb} KB`);
    await page.close();
  }

  for (const master of MASTERS) {
    const abs = path.join(ROOT, master);
    if (!fs.existsSync(abs)) {
      console.log("  (missing master, skipped: " + master + ")");
      continue;
    }
    const src = "file:///" + abs.replace(/\\/g, "/");
    /* Proportional variants: 1408×768 is 11:6, so height follows from width. */
    for (const w of WIDTHS) {
      const h = Math.round((w * 768) / 1408);
      await write(src, master.replace(/\.jpg$/, `-${w}.jpg`), w, h);
    }
  }

  const pAbs = path.join(ROOT, PORTRAIT.file);
  if (fs.existsSync(pAbs)) {
    await write(
      "file:///" + pAbs.replace(/\\/g, "/"),
      PORTRAIT.out,
      PORTRAIT.width,
      PORTRAIT.height,
      PORTRAIT.position,
      "cover",
    );
  }

  await browser.close();
  fs.unlinkSync(path.join(ROOT, HARNESS));
  console.log("Done. build.js will now include these in srcset.");
})();