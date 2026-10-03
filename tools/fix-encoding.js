/* Encoding repair for files touched by Windows PowerShell.

   Why this exists: Get-Content reads UTF-8 as ANSI on Windows PowerShell 5.1,
   so an em dash becomes "â€”" and is then written back as UTF-8 — forever. This
   reverses that precisely: read the bytes, decode UTF-8 (giving the mangled
   string), re-encode as Latin-1 (giving the original bytes back), decode
   UTF-8.

   Usage:
     node tools/fix-encoding.js                 # every source file
     node tools/fix-encoding.js build.js        # just one

   It refuses to touch a file unless the repair strictly reduces the number of
   mojibake markers, so it is safe to run twice.
*/
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const MARKERS = /\u00e2\u20ac|\u00c2[\u00a0-\u00bf]|[\u00c3\u00d0\u00d1][\u0080-\u00bf]|\ufffd/g;

const DEFAULTS = [
  "build.js",
  "tailwind.config.js",
  "content/projects.js",
  "content/drawings.js",
  "content/index-body.txt",
  "assets/motion.js",
  "index.html",
  "robots.txt",
  "site.webmanifest",
  "_headers",
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith(".html")),
];

function count(s) {
  const m = s.match(MARKERS);
  return m ? m.length : 0;
}

function repair(bytes) {
  let text = bytes.toString("utf8");
  let before = count(text);
  if (before === 0) return { text, changed: false, before: 0, after: 0 };
  /* Each PowerShell round trip adds another layer: undo until it stops
     improving, so one call fixes a file that has been mangled twice. */
  for (let pass = 0; pass < 4; pass++) {
    const next = Buffer.from(text, "latin1").toString("utf8");
    const after = count(next);
    if (after >= before) break;
    text = next;
    before = after;
  }
  const after = before;
  return { text, changed: after < count(bytes.toString("utf8")), before: count(bytes.toString("utf8")), after };
}

const files = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULTS;
let repaired = 0;

for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const r = repair(fs.readFileSync(p));
  if (r.changed) {
    fs.writeFileSync(p, r.text, "utf8");
    repaired++;
    console.log("  repaired " + f + " (" + r.before + " \u2192 " + r.after + " markers)");
  }
}
console.log(repaired ? repaired + " file(s) repaired" : "nothing needed repairing");