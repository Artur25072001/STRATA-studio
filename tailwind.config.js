/* Tailwind configuration for STRATA.
 *
 * Two things happen here that did not happen when this demo loaded
 * cdn.tailwindcss.com (398 KB of JavaScript executed at runtime):
 *
 *  1. The palette is exposed as CSS custom properties, so a single
 *     [data-theme] attribute can swap the whole site between the midnight
 *     palette and the "paper" palette without duplicating a single class.
 *  2. The CSS is compiled ahead of time into assets/strata.css, so the first
 *     paint no longer waits for a 400 KB script to be downloaded, parsed and
 *     executed. See build.js.
 *
 * Values are written as `rgb(var(--token) / <alpha-value>)` so the existing
 * opacity modifiers in the markup (`text-paper/60`, `bg-ink/85`, ...) keep
 * working exactly as before, in both themes.
 */
module.exports = {
  content: ["./*.html", "./assets/*.js"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-deep": "rgb(var(--ink-deep) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        bronze: "rgb(var(--bronze) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      spacing: {
        13: "3.25rem",
      },
    },
  },
  plugins: [],
};