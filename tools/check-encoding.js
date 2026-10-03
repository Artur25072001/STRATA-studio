/* Confirm that every source and generated file is clean UTF-8, so the repair
   above can be checked (and re-run) at any time.

   Run: node tools/check-encoding.js */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const FILES = [
  "index.html",
  "build.js",
  "tailwind.config.js",
  "content/index-body.txt",
  "content/projects.js",
  "content/drawings.js",
  "assets/motion.js",
  "assets/strata.css",
  "src/tailwind.css",
  "robots.txt",
  "site.webmanifest",
  "_headers",
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith(".html") && f !== "index.html"),
];
let bad = 0;
for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const s = fs.readFileSync(p, "utf8");
  const hits = s.match(/\u00e2\u20ac|\u00c2[\u00a0-\u00bf]|[\u00c3\u00d0\u00d1][\u0080-\u00bf]|\ufffd/g);
  if (hits) {
    bad++;
    console.log("  MOJIBAKE " + f + ": " + hits.length + " sequence(s)");
  }
}
console.log(bad ? bad + " file(s) need tools/fix-encoding.js" : "encoding clean");