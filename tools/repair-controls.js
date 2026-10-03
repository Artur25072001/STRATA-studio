/* Repair the specific damage a PowerShell console round trip leaves behind on
   Windows: characters the console could not represent are replaced by U+FFFD
   and a stray control byte, and the file can pick up a stray BOM.

   This is deliberately narrow and verifiable: it only removes characters that
   cannot legitimately appear in these source files (C0 controls) and restores
   the handful of punctuation marks that were lost, by the control byte that
   followed them.

   Run: node tools/repair-controls.js [file ...]
*/
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const DEFAULTS = [
  "build.js",
  "assets/motion.js",
  "content/projects.js",
  "content/drawings.js",
  "content/index-body.txt",
  "index.html",
];

/* The byte that followed the replacement character identifies what was lost. */
const LOST = [
  ["\ufffd\u001d", "\u2014"], // em dash
  ["\ufffd\u0019", "\u2192"], // right arrow
  ["\ufffd", "\u2014"], // a lone replacement character is a dash in practice
];

function repair(text) {
  let out = text;
  if (out.charCodeAt(0) === 0xfeff || out.charCodeAt(0) === 0xfffd)
    out = out.slice(1);
  for (const [bad, good] of LOST) out = out.split(bad).join(good);
  /* No C0 control characters belong in these files except tab, CR and LF. */
  out = out.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  return out;
}

const files = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULTS;
for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const before = fs.readFileSync(p, "utf8");
  const after = repair(before);
  if (after !== before) {
    fs.writeFileSync(p, after, "utf8");
    console.log("  cleaned " + f + " (" + (before.length - after.length) + " char(s))");
  } else {
    console.log("  already clean: " + f);
  }
}