/* Report every non-ASCII character in a file, with line numbers, so damage
   can be assessed precisely instead of guessed at.
   Run: node tools/scan-nonascii.js build.js */
const fs = require("fs");
const file = process.argv[2];
const lines = fs.readFileSync([file][0], "utf8").split(/\r?\n/);
let n = 0;
lines.forEach((line, i) => {
  const bad = [];
  for (const ch of line) {
    if (ch.charCodeAt(0) > 126) bad.push("U+" + ch.charCodeAt(0).toString(16).toUpperCase());
  }
  if (bad.length) {
    n++;
    console.log(
      (i + 1) + ": [" + bad.join(",") + "] " + line.trim().slice(0, 90),
    );
  }
});
console.log(n + " line(s) with non-ASCII");