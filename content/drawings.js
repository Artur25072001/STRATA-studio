/* ==========================================================================
   STRATA — eight line drawings, one per project.

   These are hand-authored site/floor plans in SVG. They are the reason the
   "drawing" moment exists: a studio site that can draw its own plan reads as a
   studio, where a hero photograph reads as a hotel.

   Conventions, shared by all eight:
     .dwg-line        walls and heavy elements
     .dwg-line--fine  joinery, furniture, glazing, annotations
     .dwg-fill        poché (the solid parts of a wall)
     .dwg-mark        north point, survey marks
   Text is 11px uppercase Manrope at 0.18em tracking, in the paper colour.
   ========================================================================== */

const wrap = (body, aria, viewBox = "0 0 900 660") =>
  `<svg class="dwg-plan" viewBox="${viewBox}" role="img" aria-label="${aria}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

/* Shared annotations so every drawing reads as part of one set. */
const north = `
  <g class="dwg-line--fine">
    <line x1="806" y1="46" x2="806" y2="94" class="dwg-line" />
    <polyline points="800,62 806,46 812,62" class="dwg-line" />
  </g>
  <text x="806" y="110" text-anchor="middle">N</text>`;

const scalebar = `
  <g class="dwg-line--fine">
    <line x1="60" y1="610" x2="260" y2="610" />
    <line x1="60" y1="604" x2="60" y2="616" />
    <line x1="110" y1="604" x2="110" y2="616" />
    <line x1="160" y1="604" x2="160" y2="616" />
    <line x1="210" y1="604" x2="210" y2="616" />
    <line x1="260" y1="604" x2="260" y2="616" />
  </g>
  <text x="60" y="636">0</text>
  <text x="260" y="636" text-anchor="middle">10 m</text>`;

/* -------------------------------------------------------------------------
   01 — Ridgeline Residence. One long bar on the granite shelf: mass to the
   north, glass to the south, a single loaded corridor behind the glazing.
   ------------------------------------------------------------------------- */
const ridgeline = wrap(`
  <text x="60" y="32">Ridgeline Residence — ground plan · 1:200</text>

  <!-- walls -->
  <rect x="60" y="60" width="780" height="380" class="dwg-line" />
  <rect x="60" y="60" width="780" height="380" class="dwg-fill" />

  <!-- the north wall carries everything: mass, and a service corridor behind -->
  <rect x="60" y="60" width="780" height="76" class="dwg-line" />
  <line x1="60" y1="136" x2="840" y2="136" class="dwg-line" />

  <!-- partitions: sauna · bathing · sleeping · living -->
  <line x1="252" y1="136" x2="252" y2="440" class="dwg-line" />
  <line x1="404" y1="136" x2="404" y2="440" class="dwg-line" />
  <line x1="596" y1="136" x2="596" y2="440" class="dwg-line" />

  <!-- fireplace core, the only thing standing free in the room -->
  <rect x="636" y="196" width="52" height="120" class="dwg-fill" />
  <rect x="636" y="196" width="52" height="120" class="dwg-line" />

  <!-- south wall: glazing under the deep cedar soffit, drawn as a triple line -->
  <line x1="96" y1="440" x2="804" y2="440" class="dwg-line--fine" />
  <line x1="96" y1="434" x2="804" y2="434" class="dwg-line--fine" />
  <line x1="96" y1="446" x2="804" y2="446" class="dwg-line--fine" />
  <g class="dwg-line--fine">
    <line x1="180" y1="428" x2="180" y2="452" />
    <line x1="296" y1="428" x2="296" y2="452" />
    <line x1="412" y1="428" x2="412" y2="452" />
    <line x1="528" y1="428" x2="528" y2="452" />
    <line x1="644" y1="428" x2="644" y2="452" />
    <line x1="760" y1="428" x2="760" y2="452" />
  </g>

  <!-- door openings -->
  <g class="dwg-line--fine">
    <line x1="252" y1="300" x2="252" y2="372" />
    <path d="M252 300 A72 72 0 0 1 324 372" />
    <line x1="404" y1="300" x2="404" y2="372" />
    <path d="M404 300 A72 72 0 0 1 476 372" />
  </g>

  <!-- sauna benches and stove -->
  <rect x="76" y="152" width="160" height="34" class="dwg-line--fine" />
  <rect x="76" y="192" width="160" height="26" class="dwg-line--fine" />
  <circle cx="216" cy="404" r="20" class="dwg-mark" />
  <text x="216" y="392" text-anchor="middle">STOVE</text>

  <!-- beds -->
  <rect x="272" y="164" width="112" height="152" class="dwg-line--fine" />
  <rect x="424" y="164" width="112" height="152" class="dwg-line--fine" />

  <!-- living: low sofa and a long table -->
  <rect x="614" y="336" width="180" height="44" class="dwg-line--fine" />
  <rect x="700" y="180" width="120" height="60" class="dwg-line--fine" />

  <!-- terrace, then the lake -->
  <rect x="60" y="446" width="780" height="70" class="dwg-line--fine" />
  <g class="dwg-line--fine">
    <line x1="60" y1="536" x2="840" y2="536" />
    <line x1="60" y1="548" x2="840" y2="548" />
    <line x1="60" y1="560" x2="840" y2="560" />
    <line x1="60" y1="572" x2="840" y2="572" />
  </g>
  <line x1="748" y1="446" x2="748" y2="536" class="dwg-line" />
  <rect x="748" y="500" width="92" height="36" class="dwg-line--fine" />

  <text x="76" y="176">SAUNA</text>
  <text x="272" y="156">BED 01</text>
  <text x="424" y="156">BED 02</text>
  <text x="700" y="252" text-anchor="middle">LIVING</text>
  <text x="76" y="486">CEDAR DECK</text>
  <text x="400" y="600" text-anchor="middle">LAKE</text>
  <text x="748" y="492" text-anchor="middle">DOCK</text>
  ${north}
  ${scalebar}
`, "Line plan of the Ridgeline Residence: a single long bar with a service corridor along the north wall, four rooms divided by three partitions, full-height glazing along the south, and a cedar deck with a dock stepping down to the lake.");

/* -------------------------------------------------------------------------
   02 — The Hensley Loft. A 1908 warehouse left intact: the brick column grid
   is kept, the mezzanine is shown dashed above, and the new steel core sits
   clear of both so old and new are never in doubt.
   ------------------------------------------------------------------------- */
const hensley = wrap(`
  <text x="60" y="32">The Hensley Loft — floor plan, level 2 · 1:250</text>

  <!-- existing masonry envelope -->
  <rect x="60" y="60" width="780" height="380" class="dwg-line" />
  <rect x="60" y="60" width="780" height="380" class="dwg-fill" />

  <!-- window wall: eleven sash windows along the north elevation -->
  <g class="dwg-line--fine">
    <line x1="100" y1="60" x2="800" y2="60" />
    <line x1="100" y1="52" x2="800" y2="52" />
    <line x1="100" y1="68" x2="800" y2="68" />
    <line x1="100" y1="44" x2="100" y2="76" />
    <line x1="164" y1="44" x2="164" y2="76" />
    <line x1="228" y1="44" x2="228" y2="76" />
    <line x1="292" y1="44" x2="292" y2="76" />
    <line x1="356" y1="44" x2="356" y2="76" />
    <line x1="420" y1="44" x2="420" y2="76" />
    <line x1="484" y1="44" x2="484" y2="76" />
    <line x1="548" y1="44" x2="548" y2="76" />
    <line x1="612" y1="44" x2="612" y2="76" />
    <line x1="676" y1="44" x2="676" y2="76" />
    <line x1="740" y1="44" x2="740" y2="76" />
    <line x1="800" y1="44" x2="800" y2="76" />
  </g>

  <!-- existing brick columns, on a 6 m grid -->
  <g class="dwg-line">
    <rect x="180" y="150" width="26" height="26" class="dwg-fill" />
    <rect x="180" y="150" width="26" height="26" />
    <rect x="420" y="150" width="26" height="26" class="dwg-fill" />
    <rect x="420" y="150" width="26" height="26" />
    <rect x="660" y="150" width="26" height="26" class="dwg-fill" />
    <rect x="660" y="150" width="26" height="26" />
    <rect x="180" y="330" width="26" height="26" class="dwg-fill" />
    <rect x="180" y="330" width="26" height="26" />
    <rect x="420" y="330" width="26" height="26" class="dwg-fill" />
    <rect x="420" y="330" width="26" height="26" />
    <rect x="660" y="330" width="26" height="26" class="dwg-fill" />
    <rect x="660" y="330" width="26" height="26" />
  </g>

  <!-- new steel: stair, mezzanine edge above (dashed), service core -->
  <g class="dwg-line">
    <line x1="96" y1="268" x2="360" y2="268" />
    <line x1="96" y1="288" x2="360" y2="288" />
    <g class="dwg-line--fine">
      <line x1="140" y1="268" x2="140" y2="288" />
      <line x1="184" y1="268" x2="184" y2="288" />
      <line x1="228" y1="268" x2="228" y2="288" />
      <line x1="272" y1="268" x2="272" y2="288" />
      <line x1="316" y1="268" x2="316" y2="288" />
    </g>
  </g>
  <rect x="640" y="220" width="180" height="200" class="dwg-line" />
  <rect x="640" y="220" width="180" height="200" class="dwg-fill" />

  <!-- mezzanine above, dashed: the reading room -->
  <g class="dwg-line--fine" stroke-dasharray="10 8">
    <line x1="96" y1="120" x2="620" y2="120" />
    <line x1="96" y1="246" x2="96" y2="120" />
    <line x1="620" y1="120" x2="620" y2="200" />
  </g>
  <text x="120" y="112">MEZZANINE — READING ROOM</text>

  <!-- long oak tables, parallel to the window wall -->
  <g class="dwg-line--fine">
    <rect x="150" y="170" width="330" height="34" />
    <rect x="150" y="216" width="330" height="34" />
    <rect x="150" y="360" width="330" height="34" />
    <rect x="150" y="406" width="330" height="34" />
  </g>

  <text x="420" y="352" text-anchor="middle">OPEN STUDIO — 40 DESKS</text>
  <text x="730" y="410" text-anchor="middle">CORE</text>
  <text x="270" y="310" text-anchor="middle">STEEL STAIR</text>
  ${north}
  ${scalebar}
`, "Floor plan of the Hensley Loft: the existing masonry envelope with eleven sash windows, twelve existing brick columns on a six metre grid, four long oak work tables running parallel to the window wall, a steel stair, a mezzanine reading room shown dashed above, and a service core at the south east corner.");

/* -------------------------------------------------------------------------
   03 — Wren & Salt. Forty seats in one material story: banquettes to the
   west wall, a travertine bar facing an open pass, eight stools, and a
   vestibule that keeps the weather out of the room.
   ------------------------------------------------------------------------- */
const wren = wrap(`
  <text x="60" y="32">Wren &amp; Salt — seating plan · 1:100</text>

  <rect x="60" y="60" width="780" height="380" class="dwg-line" />
  <rect x="60" y="60" width="780" height="380" class="dwg-fill" />

  <!-- vestibule and the one door the weather gets through -->
  <rect x="60" y="356" width="150" height="84" class="dwg-line" />
  <g class="dwg-line--fine">
    <line x1="210" y1="372" x2="210" y2="436" />
    <path d="M210 372 A64 64 0 0 1 146 436" />
  </g>
  <text x="76" y="404">ENTRY</text>

  <!-- open kitchen and pass to the north -->
  <rect x="60" y="60" width="600" height="150" class="dwg-line" />
  <rect x="60" y="60" width="600" height="150" class="dwg-fill" />
  <line x1="60" y1="210" x2="660" y2="210" class="dwg-line" />
  <g class="dwg-line--fine">
    <rect x="90" y="88" width="120" height="46" />
    <rect x="240" y="88" width="120" height="46" />
    <rect x="390" y="88" width="120" height="46" />
    <rect x="520" y="150" width="110" height="44" />
  </g>
  <text x="76" y="246">KITCHEN</text>
  <text x="640" y="182" text-anchor="end">PASS</text>

  <!-- travertine bar with eight stools -->
  <rect x="484" y="238" width="300" height="58" class="dwg-line" />
  <rect x="484" y="238" width="300" height="58" class="dwg-fill" />
  <g class="dwg-line--fine">
    <circle cx="510" cy="222" r="14" />
    <circle cx="548" cy="222" r="14" />
    <circle cx="586" cy="222" r="14" />
    <circle cx="624" cy="222" r="14" />
    <circle cx="662" cy="222" r="14" />
    <circle cx="700" cy="222" r="14" />
    <circle cx="738" cy="222" r="14" />
    <circle cx="764" cy="222" r="14" />
  </g>
  <text x="760" y="272" text-anchor="end">TRAVERTINE BAR — 8</text>

  <!-- banquettes: built in, along the west wall -->
  <g class="dwg-line--fine">
    <rect x="90" y="246" width="60" height="190" />
    <rect x="156" y="246" width="60" height="190" />
  </g>

  <!-- eight four-tops and two twos: thirty-two plus eight = forty seats -->
  <g class="dwg-line--fine">
    <rect x="252" y="250" width="76" height="76" />
    <rect x="228" y="266" width="18" height="44" />
    <rect x="334" y="266" width="18" height="44" />
    <rect x="270" y="226" width="44" height="18" />
    <rect x="270" y="334" width="44" height="18" />

    <rect x="252" y="356" width="76" height="76" />
    <rect x="228" y="372" width="18" height="44" />
    <rect x="334" y="372" width="18" height="44" />
    <rect x="270" y="434" width="44" height="18" />

    <rect x="380" y="250" width="76" height="76" />
    <rect x="356" y="266" width="18" height="44" />
    <rect x="462" y="266" width="18" height="44" />
    <rect x="398" y="226" width="44" height="18" />
    <rect x="398" y="334" width="44" height="18" />

    <rect x="380" y="356" width="76" height="76" />
    <rect x="356" y="372" width="18" height="44" />
    <rect x="462" y="372" width="18" height="44" />
    <rect x="398" y="434" width="44" height="18" />

    <rect x="560" y="330" width="76" height="76" />
    <rect x="536" y="346" width="18" height="44" />
    <rect x="642" y="346" width="18" height="44" />
    <rect x="578" y="416" width="44" height="18" />

    <rect x="686" y="330" width="76" height="76" />
    <rect x="662" y="346" width="18" height="44" />
    <rect x="768" y="346" width="18" height="44" />
  </g>

  <!-- WC and back of house -->
  <rect x="484" y="308" width="150" height="132" class="dwg-line" />
  <rect x="484" y="308" width="150" height="132" class="dwg-fill" />
  <text x="559" y="380" text-anchor="middle">WC</text>

  <text x="380" y="300" text-anchor="middle">DINING — 32</text>
  ${north}
  ${scalebar}
`, "Seating plan of Wren and Salt: an open kitchen and pass along the north wall, a honed travertine bar with eight stools, built-in banquettes along the west wall, six four-top tables, the vestibule at the south west corner, and the washrooms behind the bar.");

/* -------------------------------------------------------------------------
   04 — Ashgrove Pavilion. The 1958 house is left as it was (dashed); the
   pavilion is set down on nine pad footings so the birch roots are untouched.
   ------------------------------------------------------------------------- */
const ashgrove = wrap(`
  <text x="60" y="32">Ashgrove Pavilion — site plan · 1:200</text>

  <!-- existing 1958 house, untouched -->
  <g class="dwg-line--fine" stroke-dasharray="12 8">
    <rect x="60" y="60" width="300" height="240" />
    <rect x="60" y="60" width="300" height="240" class="dwg-fill" />
    <line x1="232" y1="60" x2="232" y2="300" />
  </g>
  <text x="76" y="86">EXISTING 1958 HOUSE</text>
  <text x="76" y="104">(UNTOUCHED)</text>

  <!-- the one opening cut into the existing wall -->
  <line x1="360" y1="140" x2="360" y2="228" class="dwg-line" />

  <!-- new pavilion: nine pad footings, glazed on three sides -->
  <rect x="360" y="120" width="420" height="190" class="dwg-line" />
  <rect x="360" y="120" width="420" height="190" class="dwg-fill" />
  <g class="dwg-line--fine">
    <line x1="372" y1="132" x2="768" y2="132" />
    <line x1="372" y1="298" x2="768" y2="298" />
    <line x1="768" y1="132" x2="768" y2="298" />
  </g>
  <g class="dwg-mark">
    <rect x="386" y="146" width="12" height="12" />
    <rect x="492" y="146" width="12" height="12" />
    <rect x="598" y="146" width="12" height="12" />
    <rect x="704" y="146" width="12" height="12" />
    <rect x="386" y="272" width="12" height="12" />
    <rect x="492" y="272" width="12" height="12" />
    <rect x="598" y="272" width="12" height="12" />
    <rect x="704" y="272" width="12" height="12" />
    <rect x="560" y="206" width="12" height="12" />
  </g>
  <text x="400" y="112">PAVILION — NEW, 96 m²</text>

  <!-- limestone terrace -->
  <rect x="360" y="310" width="420" height="110" class="dwg-line--fine" />
  <text x="376" y="336">LIMESTONE TERRACE — 40 m²</text>

  <!-- ravine contours -->
  <g class="dwg-line--fine">
    <path d="M60 470 C 220 430, 380 500, 560 452 S 820 470, 860 440" />
    <path d="M60 506 C 220 466, 380 536, 560 488 S 820 506, 860 476" />
    <path d="M60 542 C 220 502, 380 572, 560 524 S 820 542, 860 512" />
    <path d="M60 578 C 220 538, 380 608, 560 560 S 820 578, 860 548" />
    <path d="M60 614 C 220 574, 380 644, 560 596 S 820 614, 860 584" />
  </g>
  <text x="700" y="632" text-anchor="end">RAVINE</text>

  <!-- birch grove: trunks, kept clear of every footing -->
  <g class="dwg-line--fine">
    <circle cx="420" cy="368" r="11" />
    <circle cx="470" cy="392" r="9" />
    <circle cx="530" cy="352" r="12" />
    <circle cx="590" cy="386" r="10" />
    <circle cx="652" cy="356" r="11" />
    <circle cx="712" cy="392" r="9" />
    <circle cx="770" cy="360" r="12" />
  </g>
  <text x="376" y="452">BIRCH GROVE — NO EXCAVATION</text>
  ${north}
  ${scalebar}
`, "Site plan of the Ashgrove Pavilion: the existing 1958 house shown dashed and unchanged, a single opening cut into its east wall, a new ninety six square metre pavilion on nine pad footings glazed on three sides, a limestone terrace, and a birch grove above ravine contours to the south.");

/* -------------------------------------------------------------------------
   05 — Meridian Gallery. Three wells cut into the roof, and every surface
   lit by the sky. The hatched squares are the wells; the dashed lines are
   the shafts overhead.
   ------------------------------------------------------------------------- */
const meridian = wrap(`
  <text x="60" y="32">Meridian Gallery — plan · 1:150</text>

  <rect x="60" y="60" width="780" height="380" class="dwg-line" />
  <rect x="60" y="60" width="780" height="380" class="dwg-fill" />

  <!-- the three light wells, hatched, with their shafts dashed overhead -->
  <g class="dwg-line">
    <rect x="150" y="150" width="120" height="120" />
    <rect x="390" y="150" width="120" height="120" />
    <rect x="630" y="150" width="120" height="120" />
  </g>
  <g class="dwg-line--fine">
    <line x1="150" y1="190" x2="190" y2="150" />
    <line x1="150" y1="230" x2="230" y2="150" />
    <line x1="150" y1="270" x2="270" y2="150" />
    <line x1="190" y1="270" x2="270" y2="190" />
    <line x1="230" y1="270" x2="270" y2="230" />

    <line x1="390" y1="190" x2="430" y2="150" />
    <line x1="390" y1="230" x2="470" y2="150" />
    <line x1="390" y1="270" x2="510" y2="150" />
    <line x1="430" y1="270" x2="510" y2="190" />
    <line x1="470" y1="270" x2="510" y2="230" />

    <line x1="630" y1="190" x2="670" y2="150" />
    <line x1="630" y1="230" x2="710" y2="150" />
    <line x1="630" y1="270" x2="750" y2="150" />
    <line x1="670" y1="270" x2="750" y2="190" />
    <line x1="710" y1="270" x2="750" y2="230" />
  </g>
  <g class="dwg-line--fine" stroke-dasharray="10 8">
    <rect x="132" y="132" width="156" height="156" />
    <rect x="372" y="132" width="156" height="156" />
    <rect x="612" y="132" width="156" height="156" />
  </g>
  <text x="210" y="292" text-anchor="middle">WELL 01</text>
  <text x="450" y="292" text-anchor="middle">WELL 02</text>
  <text x="690" y="292" text-anchor="middle">WELL 03</text>

  <!-- galleries: three bays, divided by freestanding partitions -->
  <g class="dwg-line">
    <line x1="320" y1="120" x2="320" y2="330" />
    <line x1="560" y1="120" x2="560" y2="330" />
  </g>
  <rect x="330" y="330" width="220" height="14" class="dwg-line--fine" />
  <rect x="570" y="330" width="180" height="14" class="dwg-line--fine" />
  <text x="440" y="322" text-anchor="middle">GALLERY B</text>
  <text x="660" y="322" text-anchor="middle">GALLERY C</text>
  <text x="190" y="322" text-anchor="middle">GALLERY A</text>

  <!-- reception, storage and services along the south wall -->
  <rect x="60" y="380" width="230" height="60" class="dwg-line" />
  <rect x="60" y="380" width="230" height="60" class="dwg-fill" />
  <rect x="96" y="392" width="150" height="22" class="dwg-line--fine" />
  <text x="76" y="404">RECEPTION</text>

  <rect x="300" y="380" width="260" height="60" class="dwg-line" />
  <rect x="300" y="380" width="260" height="60" class="dwg-fill" />
  <text x="430" y="416" text-anchor="middle">STORE — CLIMATE HELD</text>

  <rect x="570" y="380" width="270" height="60" class="dwg-line" />
  <rect x="570" y="380" width="270" height="60" class="dwg-fill" />
  <g class="dwg-line--fine">
    <line x1="660" y1="380" x2="660" y2="440" />
    <line x1="740" y1="380" x2="740" y2="440" />
  </g>
  <text x="590" y="416">WC</text>
  <text x="676" y="416">PLANT</text>
  <text x="756" y="416">OFFICE</text>

  <!-- the entry: the only place the floor is sealed to a sheen -->
  <path d="M60 500 L 200 500" class="dwg-line" />
  <g class="dwg-line--fine">
    <line x1="120" y1="500" x2="120" y2="470" />
    <line x1="164" y1="500" x2="164" y2="470" />
  </g>
  <text x="60" y="524">ENTRY — SEALED CONCRETE</text>
  ${north}
  ${scalebar}
`, "Plan of the Meridian Gallery: three hatched light wells with dashed shafts overhead, three gallery bays divided by freestanding partitions, reception, a climate held store, washroom and plant along the south wall, and the entry where the polished concrete is sealed to a sheen.");

/* -------------------------------------------------------------------------
   06 — Alder Row. A narrow infill house: a stair against the party wall, a
   galley kitchen across the rear, and the single steel window that is really
   the whole design decision.
   ------------------------------------------------------------------------- */
const alder = wrap(`
  <text x="60" y="32">Alder Row — rear kitchen and stair · 1:100</text>

  <rect x="60" y="60" width="780" height="380" class="dwg-line" />
  <rect x="60" y="60" width="780" height="380" class="dwg-fill" />

  <!-- the stair, hard against the party wall -->
  <g class="dwg-line--fine">
    <rect x="84" y="96" width="40" height="308" />
    <line x1="84" y1="140" x2="124" y2="140" />
    <line x1="84" y1="184" x2="124" y2="184" />
    <line x1="84" y1="228" x2="124" y2="228" />
    <line x1="84" y1="272" x2="124" y2="272" />
    <line x1="84" y1="316" x2="124" y2="316" />
    <line x1="84" y1="360" x2="124" y2="360" />
  </g>
  <text x="60" y="432">STAIR</text>

  <!-- service strip: coats, powder, pantry -->
  <rect x="180" y="96" width="120" height="308" class="dwg-line--fine" />
  <g class="dwg-line--fine">
    <line x1="180" y1="200" x2="300" y2="200" />
    <line x1="180" y1="304" x2="300" y2="304" />
  </g>
  <text x="190" y="160">COATS</text>
  <text x="190" y="264">POWDER</text>
  <text x="190" y="368">PANTRY</text>

  <!-- the island: one three metre slab, nothing either side of it -->
  <rect x="380" y="176" width="240" height="90" class="dwg-line" />
  <rect x="380" y="176" width="240" height="90" class="dwg-fill" />
  <text x="500" y="228" text-anchor="middle">ISLAND — 3.0 m</text>

  <!-- clear circulation either side, then the window run -->
  <g class="dwg-line--fine">
    <rect x="352" y="176" width="16" height="90" />
    <rect x="632" y="176" width="16" height="90" />
  </g>
  <text x="392" y="300">1852 CLEAR EACH SIDE</text>

  <!-- the counter, and the steel frame sitting on it -->
  <rect x="676" y="96" width="120" height="308" class="dwg-line" />
  <rect x="676" y="96" width="120" height="308" class="dwg-fill" />
  <line x1="700" y1="120" x2="700" y2="380" class="dwg-line" />
  <text x="712" y="448">STEEL WINDOW — ON THE COUNTER</text>

  <!-- the garden beyond, and the trees worth the window -->
  <g class="dwg-line--fine" stroke-dasharray="10 8">
    <rect x="60" y="470" width="780" height="60" />
    <circle cx="300" cy="500" r="18" />
    <circle cx="430" cy="500" r="14" />
  </g>
  <text x="700" y="556" text-anchor="end">GARDEN — NORTH LIGHT</text>
  ${north}
  ${scalebar}
`, "Plan of Alder Row: the stair and a service strip along the west party wall, a three metre kitchen island with 1852 mm of clear circulation either side, and the single black steel window sitting on the counter across the whole rear wall, opening onto the garden.");

/* -------------------------------------------------------------------------
   07 — Quarry Lane Workshop. The machines set the plan: four metres of clear
   feed either side of the saw, and everything else arranged around that line.
   ------------------------------------------------------------------------- */
const quarry = wrap(`
  <text x="60" y="32">Quarry Lane Workshop — machine plan · 1:150</text>

  <rect x="60" y="60" width="780" height="380" class="dwg-line" />
  <rect x="60" y="60" width="780" height="380" class="dwg-fill" />

  <!-- brick piers, repointed rather than covered -->
  <g class="dwg-line">
    <rect x="60" y="140" width="34" height="34" />
    <rect x="60" y="320" width="34" height="34" />
    <rect x="806" y="140" width="34" height="34" />
    <rect x="806" y="320" width="34" height="34" />
  </g>

  <!-- the saw: on the window axis, with its feed run left clear -->
  <rect x="300" y="230" width="150" height="70" class="dwg-line" />
  <rect x="300" y="230" width="150" height="70" class="dwg-fill" />
  <g class="dwg-line--fine" stroke-dasharray="12 8">
    <rect x="360" y="96" width="30" height="110" />
    <rect x="360" y="324" width="30" height="110" />
  </g>
  <text x="352" y="130">4 m FEED</text>
  <text x="352" y="416">4 m OUTFEED</text>
  <text x="306" y="272">TABLE SAW</text>

  <!-- assembly bench, tool wall and the timber racks -->
  <rect x="560" y="110" width="240" height="60" class="dwg-line" />
  <text x="574" y="148">ASSEMBLY BENCH</text>
  <rect x="560" y="330" width="240" height="60" class="dwg-line" />
  <text x="574" y="368">TIMBER RACKS</text>
  <rect x="560" y="212" width="240" height="24" class="dwg-line--fine" stroke-dasharray="10 6" />
  <text x="574" y="230">TOOL WALL</text>

  <!-- dust extraction, the first thing drawn -->
  <g class="dwg-line--fine">
    <rect x="90" y="96" width="90" height="110" />
    <line x1="180" y1="150" x2="300" y2="150" />
    <line x1="300" y1="150" x2="300" y2="230" />
  </g>
  <text x="96" y="128">DUST</text>
  <text x="96" y="146">EXTRACT</text>

  <!-- the roller door a two metre board walks through -->
  <path d="M84 440 L 236 440" class="dwg-line" />
  <g class="dwg-line--fine">
    <line x1="110" y1="440" x2="110" y2="404" />
    <line x1="210" y1="440" x2="210" y2="404" />
    <line x1="110" y1="404" x2="210" y2="404" />
  </g>
  <text x="84" y="470">ROLLER DOOR — 2.4 m</text>
  ${north}
  ${scalebar}
`, "Plan of the Quarry Lane Workshop: four repointed brick piers, a table saw on the window axis with four metres of clear feed on both sides, an assembly bench, the timber racks and tool wall, dust extraction along the west wall, and the 2.4 metre roller door a two metre board walks through.");

/* -------------------------------------------------------------------------
   08 — Morse Street Reading Room. One ash joinery system, repeated: shelf
   piers, tables, gallery, all from the same five components.
   ------------------------------------------------------------------------- */
const morse = wrap(`
  <text x="60" y="32">Morse Street Reading Room — hall plan · 1:200</text>

  <rect x="60" y="60" width="780" height="380" class="dwg-line" />
  <rect x="60" y="60" width="780" height="380" class="dwg-fill" />

  <!-- the ash shelf piers: the module the whole room is made of -->
  <g class="dwg-line">
    <rect x="140" y="140" width="30" height="220" />
    <rect x="400" y="140" width="30" height="220" />
    <rect x="660" y="140" width="30" height="220" />
  </g>

  <!-- reading tables between the piers, each with a lamp per reader -->
  <g class="dwg-line--fine">
    <rect x="196" y="170" width="70" height="160" />
    <circle cx="200" cy="200" r="6" />
    <circle cx="200" cy="250" r="6" />
    <circle cx="200" cy="300" r="6" />

    <rect x="456" y="170" width="70" height="160" />
    <circle cx="460" cy="200" r="6" />
    <circle cx="460" cy="250" r="6" />
    <circle cx="460" cy="300" r="6" />
  </g>
  <text x="200" y="352">TABLES — LAMP PER READER</text>

  <!-- the gallery above, shown dashed on both long sides -->
  <g class="dwg-line--fine" stroke-dasharray="12 8">
    <rect x="120" y="96" width="660" height="44" />
    <rect x="120" y="360" width="660" height="44" />
  </g>
  <text x="128" y="124">GALLERY — ABOVE</text>
  <text x="128" y="392">GALLERY — ABOVE</text>

  <!-- clerestories both sides: the light the brief asked for -->
  <g class="dwg-line--fine">
    <line x1="60" y1="92" x2="840" y2="92" />
    <line x1="60" y1="408" x2="840" y2="408" />
  </g>
  <text x="840" y="88" text-anchor="end">CLERESTORY NORTH</text>

  <!-- desk, returns, and the one quiet room -->
  <rect x="740" y="140" width="100" height="90" class="dwg-line" />
  <rect x="740" y="140" width="100" height="90" class="dwg-fill" />
  <text x="752" y="192">DESK</text>
  <rect x="740" y="280" width="100" height="80" class="dwg-line--fine" />
  <text x="752" y="326">STUDY</text>

  <!-- the entry, between two piers -->
  <path d="M300 440 L 420 440" class="dwg-line" />
  <g class="dwg-line--fine">
    <line x1="300" y1="440" x2="300" y2="404" />
    <line x1="420" y1="440" x2="420" y2="404" />
  </g>
  <text x="300" y="470">ENTRY — FROM MORSE STREET</text>
  ${north}
  ${scalebar}
`, "Plan of the Morse Street Reading Room: one ash joinery system repeated as three shelf piers, reading tables with a lamp per reader between them, a mezzanine gallery shown dashed on both long sides, clerestories north and south, the desk and returns, one quiet study room, and the entry from Morse Street.");

module.exports = {
  ridgeline,
  hensley,
  wren,
  ashgrove,
  meridian,
  alder,
  quarry,
  morse,
  wrap,
};