/* ==========================================================================
   STRATA — build script

   There is no framework here on purpose: the site is static HTML, and this
   script is the only "build" it needs. It does three things:

     1. Compiles Tailwind (src/tailwind.css → assets/strata.css), so the page
        no longer downloads and executes 400 KB of Play CDN JavaScript before
        it can paint.
     2. Generates index.html and the eight project case studies from one
        document shell, so the header, footer, meta tags and scripts can never
        drift apart between pages.
     3. Renders the project deck, the navigation index, the material swatches,
        the studio numbers, the recognition row and the line drawings from
        ./content, which is the single source of truth for all of it.

   Usage:  npm run build
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const {
  projects,
  materials,
  stats,
  recognition,
} = require("./content/projects.js");
const drawings = require("./content/drawings.js");
const { sections, sectionHref } = require("./content/nav.js");

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/* --------------------------------------------------------------------------
   How many studies there are, said once.

   Every counter on this site used to be typed by hand — "05" in the deck, in
   the rail, in the case-study eyebrows, in the next-study link, and the word
   "five" in the menu, the footer and the meta description. Adding a project
   meant finding all of them. They all read from here now.
   -------------------------------------------------------------------------- */
const COUNT = projects.length;
const COUNT_2 = String(COUNT).padStart(2, "0");
const COUNT_WORD = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"][COUNT];
const write = (p, s) => {
  fs.writeFileSync(path.join(ROOT, p), s, "utf8");
  return `${p}  (${Math.round(s.length / 1024)} KB)`;
};
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* --------------------------------------------------------------------------
   The demo notice. Kept in one place so every page states the same thing
   about what this is: a portfolio sample for a business that does not exist.

   Two forms, because one paragraph of 290 characters is five or six lines on a
   phone — which is a great deal of the screen to spend before the hero. The
   long form is shown from 768px up, where it fits in two lines; below that the
   notice states the same thing in one line and keeps the detail one tap away.
   Both forms say what is invented; neither is hidden from a screen reader.
   -------------------------------------------------------------------------- */
const NOTICE = `<div class="notice" role="note">
      <p class="notice-wide">
        <strong>Demo website.</strong> A fictional business built as a portfolio sample by Artur Dymchevskyi. The company, its team, its photos, prices, contact details, reviews and testimonials are all invented, and this page is deliberately kept out of search results. <a href="https://portfolio-artur-dymchevskyi.netlify.app/" target="_blank" rel="noopener">See the author&rsquo;s portfolio</a>
      </p>
      <div class="notice-compact">
        <p>
          <strong>Demo website.</strong> A fictional business built as a portfolio sample. <a href="https://portfolio-artur-dymchevskyi.netlify.app/" target="_blank" rel="noopener">Author&rsquo;s portfolio</a>
        </p>
        <details class="notice-more">
          <summary>What is invented?</summary>
          <p>
            By Artur Dymchevskyi. The company, its team, its photos, prices, contact details,
            reviews and testimonials are all invented, and this page is deliberately kept out of
            search results.
          </p>
        </details>
      </div>
    </div>`;

const SKIP = `<a class="skip-link" href="#main">Skip to content</a>`;

const header = () => `
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="brand font-display font-light text-xl tracking-[0.22em] leading-none" aria-label="STRATA — home">STRATA<span class="text-bronze">.</span></a>
        <div class="flex items-center gap-1 sm:gap-3">
          <button type="button" class="theme-toggle" data-theme-toggle aria-pressed="false" aria-label="Switch to the daylight theme">
            <span data-theme-label>Daylight</span>
          </button>
          <button
            id="nav-open"
            type="button"
            class="icon-btn"
            aria-expanded="false"
            aria-controls="nav-overlay"
            aria-label="Open navigation"
          >
            <span id="nav-open-label">Menu</span>
            <span class="burger" aria-hidden="true"><span></span><span></span></span>
          </button>
        </div>
      </div>
    </header>`;

/* --------------------------------------------------------------------------
   The menu.

   Six sections and eight studies, and all of it has to be on one screen: a
   full-screen menu that scrolls is just a page with a dark background. The
   studies are therefore a grid — two columns on a phone, three on a laptop,
   four on a wide desk — and the display type is measured against the window's
   height as well as its width, so a short window shrinks the type instead of
   pushing the last study off the bottom. See section 5 of src/tailwind.css.
   -------------------------------------------------------------------------- */
const navOverlay = (active) => {
  const isHome = active === "home";
  const links = sections
    .map(
      (s) => `            <li class="nav-mask">
              <a href="${sectionHref(s, isHome)}" data-section="${s.id}" class="nav-link nav-anim font-display font-light"${
                isHome && s.id === "work" ? ' aria-current="location"' : ""
              }><span class="nav-num">${s.num}</span>${s.label}</a>
            </li>`,
    )
    .join("\n");
  const indexLinks = projects
    .map(
      (p) =>
        `              <li><a href="${p.slug}.html"${
          active === p.slug ? ' aria-current="page"' : ""
        }><span class="idx">${p.index}</span>${esc(p.title)}<span class="nav-index-meta">${esc(p.place)} · ${esc(p.year)}</span></a></li>`,
    )
    .join("\n");

  return `
    <div id="nav-overlay" aria-hidden="true">
      <div class="nav-overlay-inner" data-lenis-prevent>
        <nav aria-label="Primary">
          <ul class="nav-sections">
${links}
          </ul>
          <div class="nav-studies">
            <p class="nav-studies-head">${COUNT_WORD} studies</p>
            <ol class="nav-index">
${indexLinks}
            </ol>
          </div>
        </nav>
        <div class="nav-foot">
          <span class="nav-mask"><span class="nav-anim block">Toronto, Ontario — projects across Southern Ontario</span></span>
          <div class="nav-foot-links">
            <span class="nav-mask"><a class="nav-anim block u-draw" href="mailto:studio@example.com">studio@example.com</a></span>
            <span class="nav-mask"><a class="nav-anim block u-draw" href="https://www.instagram.com/strata.studio" target="_blank" rel="noopener">Instagram</a></span>
            <span class="nav-mask"><a class="nav-anim block u-draw" href="https://www.linkedin.com/company/strata-studio" target="_blank" rel="noopener">LinkedIn</a></span>
          </div>
        </div>
      </div>
    </div>`;
};

/* --------------------------------------------------------------------------
   The rail. It sits on every page, and until now it announced "01 / 05" on all
   of them — including the case studies, which are not the deck at all, and on
   the last of the eight it still said there were five. It now starts honest:
   one of eight, on the project you actually opened, and the deck takes it over
   on the homepage from there.
   -------------------------------------------------------------------------- */
const rail = (active) => {
  const i = projects.findIndex((p) => p.slug === active);
  const current = i >= 0 ? projects[i].index : "01";
  const label = i >= 0 ? SHORT[projects[i].slug] || projects[i].title : SHORT[projects[0].slug];
  return `
    <div class="rail" aria-hidden="true">
      <span class="rail-count"><span data-rail-current>${current}</span><span class="sep"> / </span>${COUNT_2}</span>
      <span class="rail-progress"><span data-rail-bar></span></span>
      <span class="rail-count" data-rail-label>${esc(label)}</span>
    </div>`;
};

/* --------------------------------------------------------------------------
   Fixed layers.

   Every one of these lives OUTSIDE #smooth-content on purpose: ScrollSmoother
   puts a transform on the content, and a transform makes position: fixed
   behave as if it were absolute — anchored to the content, not the viewport.
   Fixed elements must stay outside the wrapper, so they are emitted here
   rather than in the page fragments.
   -------------------------------------------------------------------------- */
const fixedLayers = () => `
    ${SKIP}
    ${NOTICE}

    <div id="preloader" aria-hidden="true">
      <span class="pre-mask">
        <span
          class="font-display font-light text-[clamp(3rem,8vw,6rem)] leading-none tracking-[0.08em]"
          aria-label="STRATA"
        ><span class="pre-letter">S</span><span class="pre-letter">T</span><span class="pre-letter">R</span><span class="pre-letter">A</span><span class="pre-letter">T</span><span class="pre-letter">A</span></span>
      </span>
      <span class="pre-rule" aria-hidden="true"><span data-pre-rule></span></span>
      <span class="pre-sub text-[0.78rem] tracking-[0.26em] uppercase text-paper/75">Architecture &amp; Interior Design — Toronto</span>
    </div>

    <div id="light" aria-hidden="true"></div>
    <div id="cursor-dot" aria-hidden="true"></div>
    <div id="cursor-tag" aria-hidden="true"><span id="cursor-tag-text">View</span></div>
    <div id="grain" aria-hidden="true"></div>
    <div id="curtain" aria-hidden="true"></div>`;

const footer = () => `
    <footer class="px-6 md:px-10 pt-24 md:pt-32 pb-14 border-t border-paper/10">
      <div data-reveal>
        <p class="text-[0.78rem] tracking-[0.22em] uppercase text-paper/75 mb-6">
          STRATA — Architecture &amp; Interior Design Studio
        </p>
        <a href="index.html" class="block font-display font-light leading-none text-[clamp(4.5rem,15vw,13rem)] text-paper/95 transition-colors hover:text-bronze">
          STRATA<span class="text-bronze">.</span>
        </a>
      </div>

      <div class="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm" data-reveal>
        <nav aria-label="Footer">
          <p class="lbl">Menu</p>
          <ul class="mt-4 space-y-1 text-paper/75">
${sections
  .map(
    (s) =>
      `            <li><a href="${sectionHref(s, false)}" class="u-draw">${s.label}</a></li>`,
  )
  .join("\n")}
          </ul>
        </nav>
        <div>
          <p class="lbl">${COUNT_WORD} studies</p>
          <ul class="mt-4 space-y-1 text-paper/75">
            ${projects
              .map(
                (p) =>
                  `<li><a href="${p.slug}.html" class="u-draw">${p.index} — ${esc(p.title)}</a></li>`,
              )
              .join("\n            ")}
          </ul>
        </div>
        <div>
          <p class="lbl">Elsewhere</p>
          <ul class="mt-4 space-y-1 text-paper/75">
            <li><a href="https://www.instagram.com/strata.studio" target="_blank" rel="noopener" class="u-draw">Instagram — @strata.studio</a></li>
            <li><a href="https://www.linkedin.com/company/strata-studio" target="_blank" rel="noopener" class="u-draw">LinkedIn — STRATA Studio</a></li>
            <li><a href="mailto:studio@example.com" class="u-draw">studio@example.com</a></li>
            <li><a href="tel:+14165550120" class="u-draw">(416) 555-0120</a></li>
          </ul>
        </div>
        <div>
          <p class="lbl">Studio</p>
          <p class="mt-4 text-paper/75 leading-relaxed">
            Toronto, Ontario<br />
            Projects across Southern Ontario<br />
            Monday to Friday, 9 to 6
          </p>
          <a href="#main" class="u-draw mt-5 inline-block text-paper/75">Back to top &uarr;</a>
        </div>
      </div>

      <div class="mt-20 pt-6 border-t border-paper/10 flex flex-col sm:flex-row justify-between gap-3 text-[0.78rem] tracking-[0.08em] text-paper/70" data-reveal>
        <p>&copy; 2026 STRATA Architecture &amp; Interior Design Studio. A fictional studio, built as a demo.</p>
        <p>Designed in Toronto. Built with restraint.</p>
      </div>

      <!-- Honest provenance. The three most recent studies are illustrated with
           free-licence photographs rather than invented ones, and the one
           licence that requires a credit gets it here. -->
      <p class="mt-6 text-[0.78rem] leading-relaxed text-paper/65" data-reveal>
        Demo photography: Alder Row and Quarry Lane use photographs from Unsplash and Pexels
        (free licence, no attribution required); Morse Street uses
        <a href="https://commons.wikimedia.org/wiki/File:Statsbiblioteket_l%C3%A6sesalen-2.jpg" target="_blank" rel="noopener" class="u-draw">&ldquo;Statsbiblioteket l&aelig;sesalen&rdquo;</a>
        by Villy Fink Isaksen, via Wikimedia Commons, CC BY-SA 4.0. Every other image on this
        site is demonstration artwork.
      </p>
    </footer>`;

/* --------------------------------------------------------------------------
   One document shell for all nine pages: same notice, same header, same eight
   case studies in the menu, same script order. Only the fragment differs.
   -------------------------------------------------------------------------- */
const shell = ({
  title,
  desc,
  ogTitle,
  ogDesc,
  ogImage,
  body,
  active,
  page,
  extraHead = "",
}) => `<!doctype html>
<html lang="en" class="no-js">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Demo/preview site: a fictional business used as a portfolio sample by
         Artur Dymchevskyi. It is not a real company. The "noindex" directive
         below is what keeps these pages out of search results; see robots.txt. -->
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta name="theme-color" content="#100F0E" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="STRATA" />
    <meta property="og:title" content="${esc(ogTitle)}" />
    <meta property="og:description" content="${esc(ogDesc)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:locale" content="en_CA" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(ogTitle)}" />
    <meta name="twitter:description" content="${esc(ogDesc)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />

    <link rel="icon" type="image/png" href="favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <link rel="shortcut icon" href="favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="STRATA" />
    <link rel="manifest" href="site.webmanifest" />

    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": "STRATA",
        "description": "A demo architecture and interior design studio website built as a portfolio sample by Artur Dymchevskyi. The business, its address, phone number, prices, reviews and testimonials are all fictional, and these pages are deliberately kept out of search results.",
        "genre": "Website design demo",
        "inLanguage": "en-CA",
        "creator": {
          "@type": "Person",
          "name": "Artur Dymchevskyi",
          "jobTitle": "Fullstack Developer",
          "email": "arturdymschevskyi@gmail.com",
          "url": "https://github.com/Artur25072001"
        }
      }
    </script>

    <!-- Fonts: only the three weights actually used, so the two families cost
         roughly 110 KB instead of the 185 KB the five weight request cost. -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=Manrope:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
${extraHead}
    <link rel="stylesheet" href="assets/strata.css" />

    <!-- Theme before first paint: no flash of the wrong palette, and one
         honest class change that says whether JavaScript arrived at all. -->
    <script>
      (function () {
        var d = document.documentElement;
        d.classList.remove("no-js");
        try {
          if (localStorage.getItem("strata-theme") === "paper") {
            d.setAttribute("data-theme", "paper");
          }
        } catch (e) {}
      })();
    </script>
  </head>
  <body class="bg-ink text-paper font-body" data-page="${page}"${
    active && active !== "home" ? ` data-slug="${active}"` : ""
  }>
${fixedLayers()}
${header()}
${navOverlay(active)}
${rail(active)}

    <!-- ScrollSmoother puts a transform on this content, so nothing with
         position: fixed may live inside it. The fixed layers are above. -->
    <div id="smooth-wrapper">
      <div id="smooth-content">
${body}
${footer()}
      </div>
    </div>

    <!-- All of GSAP is free since 3.13, including the plugins that used to be
         Club-only: SplitText, ScrollSmoother, DrawSVG, Observer. -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollToPlugin.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/DrawSVGPlugin.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Observer.min.js"></script>
    <script src="assets/motion.js" defer></script>
  </body>
</html>
`;

/* --------------------------------------------------------------------------
   Image variants

   tools/images.js (run once, see its header) derives smaller JPEGs from each
   master and a real vertical crop for the portrait. build.js only advertises
   variants that actually exist, so the site is honest before and after that
   script has been run.
   -------------------------------------------------------------------------- */
const variant = (file, w) => file.replace(/\.jpg$/, `-${w}.jpg`);

const srcset = (file, widths) => {
  const sizes = widths
    .map((w) => variant(file, w))
    .filter((f) => fs.existsSync(path.join(ROOT, f)))
    .map((f) => `${f} ${f.match(/-(\d+)\.jpg$/)[1]}w`);
  return sizes.length ? ` srcset="${sizes.join(", ")}"` : "";
};

/* Short names for the mobile rail, so 01/08 has something to say. */
const SHORT = {
  "ridgeline-residence": "Ridgeline",
  "hensley-loft": "Hensley",
  "wren-and-salt": "Wren & Salt",
  "ashgrove-pavilion": "Ashgrove",
  "meridian-gallery": "Meridian",
  "alder-row": "Alder Row",
  "quarry-lane-workshop": "Quarry Lane",
  "morse-street-reading-room": "Morse Street",
};

/* --------------------------------------------------------------------------
   The deck.

   These are real links to real case studies, reachable by Tab and Enter. That
   matters more than any effect on this page: a studio that cannot show its
   work is a studio that cannot show its work.
   -------------------------------------------------------------------------- */
const deck = () => `          <ol class="wd-track" data-deck-track>
${projects
  .map(
    (p, i) => `            <li
              class="wd-card${i === 0 ? " is-current" : ""}"
              data-deck-card
              data-index="${p.index}"
              data-short="${esc(SHORT[p.slug] || p.title)}"
              data-count="${COUNT_2}"
            >
              <a class="wd-link" href="${p.slug}.html" data-cursor="Read study">
                <figure class="wd-figure">
                  <img
                    src="${p.image}"
                   ${srcset(p.image, [640, 900, 1600])}
                    sizes="(min-width: 768px) 38vw, 78vw"
                    width="1408"
                    height="768"
                    loading="lazy"
                    decoding="async"
                    alt="${esc(p.alt)}"
                  />
                </figure>
                <span class="wd-index">${p.index} / ${COUNT_2}</span>
                <h3 class="wd-title">${esc(p.title)}</h3>
                <p class="wd-facts">${esc(p.type)} · ${esc(p.place)} · ${esc(p.year)}</p>
                <p class="wd-note">${esc(p.note)}</p>
              </a>
            </li>`,
  )
  .join("\n")}
          </ol>`;

/* --------------------------------------------------------------------------
   Material swatches. Pressing one retints the whole page through --accent;
   nothing is loaded, nothing is fetched, and it can be undone.
   -------------------------------------------------------------------------- */
const materialChips = () => materials
  .map(
    (m, i) => `              <button
                type="button"
                class="mat-chip"
                style="--chip: ${m.swatch}"
                data-material="${m.id}"
                data-accent="${m.accent}"
                aria-pressed="${i === 0 ? "true" : "false"}"
              >
                <span class="mat-swatch" aria-hidden="true"></span>
                <span class="mat-name">${esc(m.name)}</span>
                <span class="mat-spec">${esc(m.spec)}</span>
              </button>`,
  )
  .join("\n");

/* Studio numbers, each one checkable against the five studies. */
const statsBlock = () => stats
  .map(
    (s) => `            <div class="stat" data-reveal>
              <span class="stat-num" data-count-to="${s.value}">0${s.unit ? `<span class="stat-unit">${s.unit}</span>` : ""}</span>
              <span class="stat-label">${esc(s.label)}</span>
              <p class="mt-2 text-sm text-paper/75">${esc(s.note)}</p>
            </div>`,
  )
  .join("\n");

const marquee = () => {
  const row = recognition
    .map((r) => `<span class="marquee-item">${esc(r)}</span>`)
    .join("");
  /* The row is duplicated so the loop has no seam; the copy is aria-hidden so
     a screen reader hears each credit once. */
  return `        <div class="marquee" data-reveal>
          <div class="marquee-track">
            ${row}
            <span aria-hidden="true" class="contents">${row}</span>
          </div>
        </div>`;
};

/* The plan/render slider shared by the homepage and every case study.

   Two honest layers, not two copies of one photograph: the photograph, and the
   project's own working drawing over it. The drawing is a white-line SVG on a
   dark ground, so the right-hand side reads as a drawing rather than as a
   photo-treatment — which is what the caption has always claimed it was. */
const slider = (p, drawingKey) => `              <div class="dwg-slider" data-slider>
                <img
                  src="${p.image}"
                  ${srcset(p.image, [900, 1600])}
                  sizes="(min-width: 1024px) 52vw, 92vw"
                  width="1408"
                  height="768"
                  loading="lazy"
                  decoding="async"
                  alt="${esc(p.alt)}"
                />
                <div class="dwg-study" aria-hidden="true">
                  ${drawings[drawingKey] || drawings[DRAWING_FOR[p.slug]]}
                </div>
                <button
                  type="button"
                  class="dwg-handle"
                  data-slider-handle
                  role="slider"
                  aria-label="Reveal the line study over the photograph, arrow keys move the handle"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow="50"
                  aria-orientation="horizontal"
                >
                  <span aria-hidden="true">&#8596;</span>
                </button>
              </div>`;

/* --------------------------------------------------------------------------
   Case study pages, generated from the same data as the deck.
   -------------------------------------------------------------------------- */
const DRAWING_FOR = {
  "ridgeline-residence": "ridgeline",
  "hensley-loft": "hensley",
  "wren-and-salt": "wren",
  "ashgrove-pavilion": "ashgrove",
  "meridian-gallery": "meridian",
  "alder-row": "alder",
  "quarry-lane-workshop": "quarry",
  "morse-street-reading-room": "morse",
};

const caseBody = (p) => {
  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];
  const drawing = drawings[DRAWING_FOR[p.slug]];
  const facts = [
    ["Type", `${p.type} · ${p.place}`],
    ["Completed", p.year],
    ...p.facts,
    ["Material", p.material],
  ]
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join("\n            ");

  return `    <main id="main">
      <article>
        <header class="px-6 md:px-10 pt-[calc(var(--chrome)+2.5rem)] pb-10">
          <p class="eyebrow"><span class="tick"></span><a href="index.html#work" class="u-draw">Selected Work</a> — ${p.index} / ${COUNT_2}</p>
          <h1 class="font-display font-light leading-[0.98] text-[clamp(2.6rem,7vw,6rem)] mt-6 max-w-[18ch]" data-split>
            ${esc(p.title)}
          </h1>
          <p class="mt-6 text-[0.78rem] tracking-[0.22em] uppercase text-paper/75">
            ${esc(p.type)} · ${esc(p.place)} · ${esc(p.year)}
          </p>
        </header>

        <figure class="case-hero mx-6 md:mx-10" data-reveal>
          <img
            src="${p.image}"
            ${srcset(p.image, [900, 1600])}
            sizes="100vw"
            width="1408"
            height="768"
            fetchpriority="high"
            decoding="async"
            alt="${esc(p.alt)}"
          />
          <div class="case-hero-veil" aria-hidden="true"></div>
        </figure>

        <section class="px-6 md:px-10 py-20 md:py-28" aria-label="The brief">
          <div class="grid md:grid-cols-12 gap-10 md:gap-12">
            <div class="md:col-span-6">
              <p class="font-display font-light text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.25] text-paper/90" data-reveal>
                ${esc(p.lede)}
              </p>
            </div>
            <div class="md:col-span-5 md:col-start-8 space-y-6 text-[0.98rem] leading-relaxed text-paper/80">
              ${p.body.map((par) => `<p data-reveal>${esc(par)}</p>`).join("\n              ")}
            </div>
          </div>
        </section>

        <section class="px-6 md:px-10 pb-20 md:pb-28" aria-label="Project facts">
          <dl class="facts max-w-3xl" data-reveal>
            ${facts}
          </dl>
        </section>

        <section class="px-6 md:px-10 pb-24 md:pb-32 border-t border-paper/10 pt-20 md:pt-28" aria-label="The drawing">
          <div class="max-w-3xl mb-14" data-reveal>
            <p class="eyebrow mb-6"><span class="tick"></span>The drawing</p>
            <h2 class="font-display font-light text-3xl md:text-5xl leading-[1.05]">Drawn before it was built.</h2>
            <p class="mt-6 text-[0.98rem] leading-relaxed text-paper/80">
              Every study in this studio starts as a plan, and the plan is where the argument is
              actually won or lost. This one is shown at the scale it was worked at.
            </p>
          </div>
          <div class="dwg" data-reveal>
            <div data-draw-scope data-dwg-zoom-scope>
            <div class="dwg-plan-wrap" tabindex="0" role="group" aria-label="Working drawing, ${esc(p.title)} at the scale it was drawn">
              ${drawing}
            </div>
            <button type="button" class="dwg-zoom" data-dwg-zoom aria-pressed="false">Full size</button>
            <p class="dwg-note">${esc(p.index)} — ${esc(p.title)}, working drawing</p>
          </div>
            <div>
              <p class="text-[0.78rem] tracking-[0.22em] uppercase text-paper/70 mb-4">Drawing over photograph</p>
              ${slider(p, DRAWING_FOR[p.slug])}
              <div class="dwg-legend"><span>Photograph</span><span>${esc(p.title)} — plan</span></div>
            </div>
          </div>
        </section>

        <section class="px-6 md:px-10 pb-24 md:pb-32" aria-label="Next study">
          <a class="next-project" href="${next.slug}.html" data-cursor="Next study">
            <figure>
              <img
                src="${next.image}"
                ${srcset(next.image, [640, 900])}
                sizes="(min-width: 768px) 46vw, 92vw"
                width="1408"
                height="768"
                loading="lazy"
                decoding="async"
                alt="${esc(next.alt)}"
              />
            </figure>
            <div>
              <p class="text-[0.78rem] tracking-[0.22em] uppercase text-paper/70">Next study — ${next.index} / ${COUNT_2}</p>
              <p class="font-display font-light text-3xl md:text-4xl mt-3">${esc(next.title)}</p>
              <p class="mt-3 text-paper/75 text-[0.95rem] leading-relaxed">${esc(next.note)}</p>
              <span class="u-draw mt-6 inline-block text-paper/90">Read the study &rarr;</span>
            </div>
          </a>
        </section>

        <section class="px-6 md:px-10 pb-24 md:pb-32 border-t border-paper/10 pt-20 md:pt-28" aria-label="Contact">
          <div class="max-w-3xl">
            <p class="eyebrow mb-6" data-reveal><span class="tick"></span>Start something</p>
            <h2 class="font-display font-light leading-[1.02] text-[clamp(2rem,4.5vw,3.6rem)]" data-reveal>
              Working on a project like this one?
            </h2>
            <p class="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-paper/80" data-reveal>
              Tell us about the site, the brief and the constraints. Every project is bespoke, so the
              first conversation is about how you actually want to live or work in the space.
            </p>
            <p class="mt-10 flex flex-wrap gap-4" data-reveal>
              <a href="index.html#contact" class="btn" data-cursor="Inquire">Send an inquiry <span aria-hidden="true">&rarr;</span></a>
              <a href="index.html#work" class="btn" data-cursor="Deck">All ${COUNT_WORD.toLowerCase()} studies</a>
            </p>
          </div>
        </section>
      </article>
    </main>`;
};

/* --------------------------------------------------------------------------
   Token replacement for the hand-written homepage fragment.

   The fragment stays readable HTML; build.js only substitutes the parts that
   come from ./content, so the deck, the swatches and the numbers can never
   disagree with the case studies.
   -------------------------------------------------------------------------- */
const tokens = {
  "{{DECK}}": deck(),
  "{{MATERIAL}}": materialChips(),
  "{{STATS}}": statsBlock(),
  "{{MARQUEE}}": marquee(),
  "{{DRAWING}}": drawings.ridgeline,
  "{{SLIDER}}": slider(projects[0], "ridgeline"),
  "{{HERO}}": "hero-dim-double-height-concrete-interior.jpg",
  /* The hero's own candidate set, built from whatever tools/images.js has
     produced, so the markup never points at a file that does not exist. */
  "{{HERO_SET}}": srcset("hero-dim-double-height-concrete-interior.jpg", [
    640,
    900,
    1600,
  ]).trim(),
  /* The portrait master is 16:9, which is wrong for a standing portrait: a 3:4
     frame shows 41% of the width. tools/images.js writes a real vertical crop
     at 1000×1250; until that has been run, the original is used. */
  "{{PORTRAIT}}": fs.existsSync(
    path.join(
      ROOT,
      "portrait-nadia-ostrow-studio-window-light-portrait.jpg",
    ),
  )
    ? "portrait-nadia-ostrow-studio-window-light-portrait.jpg"
    : "portrait-nadia-ostrow-studio-window-light.jpg",
};

const fill = (fragment) => {
  let out = fragment;
  for (const [k, v] of Object.entries(tokens)) out = out.split(k).join(v);
  return out;
};

/* --------------------------------------------------------------------------
   Pages: one homepage and eight case studies.
   -------------------------------------------------------------------------- */
const PAGES = [
  {
    file: "index.html",
    active: "home",
    page: "home",
    fragment: "content/index-body.txt",
    title: "STRATA — Architecture & Interior Design Studio · Toronto",
    desc: "STRATA is a Toronto architecture & interior design studio shaping spaces through light, material, and restraint. Bespoke residential, commercial, hospitality and cultural projects across Southern Ontario.",
    ogTitle: "STRATA — Architecture & Interior Design Studio · Toronto",
    ogDesc:
      `Spaces shaped by light, material, and restraint. ${COUNT_WORD} studies from a five-person Toronto studio, with the working drawings that got them built.`,
    ogImage: "hero-dim-double-height-concrete-interior.jpg",
  },
  ...projects.map((p) => ({
    file: `${p.slug}.html`,
    active: p.slug,
    page: "case",
    body: caseBody(p),
    title: `${p.title} — ${p.type}, ${p.place} · STRATA`,
    desc: p.lede,
    ogTitle: `${p.title} — STRATA`,
    ogDesc: p.note,
    ogImage: p.image,
  })),
];

/* Preload the one image that decides LCP, with the same candidate set the
   markup will use. html5 allows imagesrcset on <link rel=preload as=image>. */
const heroPreload = (file) => {
  const s = srcset(file, [640, 900, 1600]);
  const from = s.replace(" srcset=\"", " imagesrcset=\"");
  return `    <link rel="preload" as="image" href="${file}"${from} imagesizes="100vw" fetchpriority="high" />`;
};

const run = () => {
  const written = [];

  /* 1. Tailwind → assets/strata.css.
     Windows dislikes spawning a .cmd without a shell, so prefer the locally
     installed binary and fall back to npx through a shell. */
  const tailwindArgs = [
    "-c",
    "tailwind.config.js",
    "-i",
    "src/tailwind.css",
    "-o",
    "assets/strata.css",
    "--minify",
  ];
  const localBin = path.join(
    ROOT,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "tailwindcss.cmd" : "tailwindcss",
  );
  try {
    if (fs.existsSync(localBin)) {
      execFileSync(localBin, tailwindArgs, {
        cwd: ROOT,
        stdio: ["ignore", "ignore", "ignore"],
      });
    } else {
      execFileSync(
        process.platform === "win32" ? "npx.cmd" : "npx",
        ["--yes", "tailwindcss@3.4.17", ...tailwindArgs],
        { cwd: ROOT, stdio: ["ignore", "ignore", "ignore"], shell: true },
      );
    }
    written.push(
      `assets/strata.css  (${Math.round(
        fs.statSync(path.join(ROOT, "assets/strata.css")).size / 1024,
      )} KB, compiled ahead of time)`,
    );
  } catch (err) {
    console.error("Tailwind failed:", err.message);
    process.exitCode = 1;
  }

  /* 2. Pages */
  for (const pg of PAGES) {
    const body = pg.body !== undefined ? pg.body : fill(read(pg.fragment));
    written.push(
      write(
        pg.file,
        shell({
          title: pg.title,
          desc: pg.desc,
          ogTitle: pg.ogTitle,
          ogDesc: pg.ogDesc,
          ogImage: pg.ogImage,
          body,
          active: pg.active,
          page: pg.page,
          extraHead: heroPreload(pg.ogImage) + "\n",
        }),
      ),
    );
  }

  console.log(
    `Built ${written.length} artefacts:\n  ` + written.join("\n  "),
  );
};

run();