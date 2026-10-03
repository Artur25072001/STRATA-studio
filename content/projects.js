/* ==========================================================================
   STRATA — one source of truth for the eight projects, the material palette,
   the studio numbers and the recognition row.

   Consumed by build.js (to render the homepage deck and the eight case-study
   pages) and mirrored into the markup as data-* attributes so assets/motion.js
   needs no extra fetch at runtime.

   Everything here is invented. This is a demo site for a fictional studio; see
   robots.txt and the noindex meta tag.
   ========================================================================== */

const projects = [
  {
    slug: "ridgeline-residence",
    index: "01",
    title: "Ridgeline Residence",
    type: "Private residence",
    place: "Muskoka, ON",
    year: "2024",
    image: "project-ridgeline-residence-muskoka.jpg",
    alt:
      "Low lakeside house of board-formed concrete and reclaimed cedar receding into a dark pine treeline at dusk, warm interior glow spilling through full-height glazing onto granite outcrop",
    note:
      "A long, low bar house laid against the granite shelf, so the treeline stays the tallest thing on the site.",
    lede:
      "The client asked for a house that would not compete with the lake. We answered with one long bar, set low on the granite shelf, with the whole south wall given to glass and the whole north wall given to mass.",
    body: [
      "Board-formed concrete holds the north side and the fireplace core; everything structural is in that wall, which let the south side be nothing but glazing under a deep cedar soffit. The overhang is sized to the summer sun: full shade in July, full sun in January, no blinds anywhere in the house.",
      "The plan is a single loaded corridor with the rooms strung west to east — sauna, sleeping, bathing, living — so guests arrive at the far end and walk the length of the water to reach anyone. Nothing is more than one room away from the lake.",
      "Reclaimed cedar was milled from a barn two concessions over. It is left unfinished and is already silvering where the spray reaches it.",
    ],
    facts: [
      ["Area", "312 m² (3,360 sq ft)"],
      ["Structure", "Board-formed concrete, glulam, reclaimed cedar"],
      ["Timeline", "22 months, completed spring 2024"],
      ["Team", "Nadia Ostrow, with K. Barry and L. Chen"],
    ],
    material: "Board-formed concrete, reclaimed cedar, blackened steel",
  },
  {
    slug: "hensley-loft",
    index: "02",
    title: "The Hensley Loft",
    type: "Commercial interior",
    place: "Toronto, ON",
    year: "2023",
    image: "project-hensley-loft-toronto.jpg",
    alt:
      "Century-old warehouse loft converted to office, exposed brick and heavy timber beams, blackened steel mezzanine, long oak work tables under rows of industrial sash windows",
    note:
      "A publishing house in a 1908 warehouse: the building already knew how to work, so we mostly got out of its way.",
    lede:
      "A 1908 brick warehouse with a good skeleton and a bad 1980s fit-out. The brief was an office for a publishing house; the honest answer was to strip the fit-out and let the building do the work.",
    body: [
      "We kept every timber beam and every sash window, then put the new work in one material — blackened steel — so that old and new are never in doubt. The mezzanine, the stair, the shelving and the door frames are all the same steel, all fabricated by one shop.",
      "Daylight was the design driver. The long oak tables run parallel to the window wall rather than facing it, which means nobody works with their back to the best thing in the room.",
      "Acoustics were solved with felt panels in the same geometry as the brick coursing, so the room sounds calm without looking treated.",
    ],
    facts: [
      ["Area", "740 m² (7,970 sq ft)"],
      ["Scope", "Interior architecture, furniture, wayfinding"],
      ["Timeline", "11 months, completed autumn 2023"],
      ["Team", "Nadia Ostrow, with M. Ferreira"],
    ],
    material: "Blackened steel, white oak, wool felt, existing brick",
  },
  {
    slug: "wren-and-salt",
    index: "03",
    title: "Wren & Salt",
    type: "Hospitality",
    place: "Toronto, ON",
    year: "2023",
    image: "project-wren-and-salt-restaurant.jpg",
    alt:
      "Intimate forty-seat restaurant dining room at night, blackened steel banquettes, honed travertine bar glowing under brass pendants, warm oak ceiling, candlelight pooling on set tables",
    note:
      "Forty seats, one material story, and a bar you can watch the whole kitchen from.",
    lede:
      "A forty-seat room with a chef who wanted to be visible and an owner who wanted it to feel like eleven at night even at six.",
    body: [
      "One material story, told three ways: blackened steel for everything you touch, honed travertine for the bar, warm oak overhead to pull the ceiling down to the tables. Nothing else was allowed in.",
      "Light is deliberately low and warm — 2200 K, never above the eye line — so the travertine glows and the faces stay soft. The pendants over the bar are the only bright objects in the room, because that is the view the chef is performing to.",
      "The banquettes are built in. Sitting in one, the room reads as eight metres deep and the pass is thirty seconds away, which is exactly what a small kitchen needs.",
    ],
    facts: [
      ["Area", "180 m² (1,940 sq ft)"],
      ["Scope", "Full interior, bar joinery, lighting design"],
      ["Timeline", "7 months, completed summer 2023"],
      ["Team", "Nadia Ostrow, with J. Alvarez"],
    ],
    material: "Travertine, blackened steel, warm oak, unlacquered brass",
  },
{
    slug: "ashgrove-pavilion",
    index: "04",
    title: "Ashgrove Pavilion",
    type: "Residential addition",
    place: "King City, ON",
    year: "2022",
    image: "project-ashgrove-pavilion-king-city.jpg",
    alt:
      "Glass-and-timber pavilion addition extending a low mid-century house toward a ravine at dawn, morning fog drifting through birch trees behind floor-to-ceiling glazing",
    note:
      "A glass pavilion that pushes a mid-century house out to the edge of its ravine, without touching the original roofline.",
    lede:
      "A 1958 house that had turned its back on its own ravine. The addition is a single glazed pavilion that walks the living space out toward the birch grove and stops before it becomes a room you have to heat in earnest.",
    body: [
      "The existing house is left almost untouched — one opening cut, one beam added. The pavilion is set down on nine pad footing pads so nothing had to be excavated inside the drip line of the mature birches.",
      "The glazing is triple, the frame is black-stained fir, and the reveal is 800 mm deep, which shades the glass in summer and lets low winter light land four metres in on the floor.",
      "Exterior roller screens turn the pavilion into a warm room on a February evening and a screened porch on a July afternoon.",
    ],
    facts: [
      ["Area", "96 m² (1,030 sq ft), plus 40 m² terrace"],
      ["Type", "Addition to a 1958 house"],
      ["Timeline", "14 months, completed autumn 2022"],
      ["Team", "Nadia Ostrow, with K. Barry"],
    ],
    material: "Black-stained fir, triple glazing, limestone terrace",
  },
  {
    slug: "meridian-gallery",
    index: "05",
    title: "Meridian Gallery",
    type: "Cultural",
    place: "Toronto, ON",
    year: "2022",
    image: "project-meridian-gallery-toronto.jpg",
    alt:
      "Minimal private art gallery with white lime-plaster walls and three carved skylight wells raking soft daylight across a single large canvas, polished concrete floor in shadow",
    note:
      "A private collection, lit by three wells cut into the roof so no canvas ever sees a spotlight.",
    lede:
      "A private collector with forty years of work and a rented space with the wrong light. The renovation is arranged entirely around three light wells and the way their daylight moves across a wall.",
    body: [
      "No fixtures, no track, no spotlights. Every surface is lit by the sky through one of three timber-lined wells, sized so that the deepest point of each gallery still reads at three in the afternoon in February.",
      "The walls are lime plaster on a mineral substrate — matte, breathable and repairable, which matters in a room where a canvas will hang for months at a time.",
      "The floor is polished concrete, aggregate left exposed at the entry and sealed to a sheen under the pictures, so the reflection grows as you walk in.",
    ],
    facts: [
      ["Area", "410 m² (4,410 sq ft)"],
      ["Scope", "Interior renovation, three structural light wells"],
      ["Timeline", "16 months, completed spring 2022"],
      ["Team", "Nadia Ostrow, with L. Chen"],
    ],
    material: "Lime plaster, Douglas fir, polished concrete",
  },
  {
    slug: "alder-row",
    index: "06",
    title: "Alder Row",
    type: "Private residence",
    place: "Ottawa, ON",
    year: "2024",
    image: "project-alder-row-ottawa.jpg",
    alt:
      "Rear kitchen of a narrow infill house opening onto a garden, pale oak cabinetry running the length of the room, dark stone counters, black steel window frames and a clerestory above drawing daylight across the floor",
    note:
      "Four and a half metres of rear wall, given almost entirely to one window sitting on the counter.",
    lede:
      "A narrow infill house with four and a half metres of rear wall and a garden worth looking at, so nearly all of that wall became one window set on the counter — no framing above, no blind, nothing between the room and the trees.",
    body: [
      "On a lot this narrow the rear wall is the whole project. The opening is a single black steel frame sitting on the counter line, with the top of the frame left open to the ceiling so the light lands on the floor rather than on the wall above the sink.",
      "The kitchen runs the full width under it: pale oak below, the counters in a dark honed stone, everything else in flat white so the trees are the only colour in the room. The cabinetry pulls back to twenty centimetres deep where the room is tightest.",
      "The old house gave us one good floor level and a bad rear addition, which came out. What is left is 1852 mm of clear circulation between the island and the window run, which is more than the street frontage suggests is possible.",
    ],
    facts: [
      ["Area", "142 m² (1,530 sq ft)"],
      ["Scope", "Rear addition, kitchen, single-storey infill"],
      ["Timeline", "13 months, completed summer 2024"],
      ["Team", "Nadia Ostrow, with M. Ferreira"],
    ],
    material: "White oak, honed stone, flat white plaster, black steel",
  },
  {
    slug: "quarry-lane-workshop",
    index: "07",
    title: "Quarry Lane Workshop",
    type: "Workplace",
    place: "Hamilton, ON",
    year: "2023",
    image: "project-quarry-lane-workshop-hamilton.jpg",
    alt:
      "Furniture workshop interior with a maker working at a saw bench, long timber racks and tools along the wall behind, brick piers between tall industrial windows, concrete floor swept clean around the machinery",
    note:
      "A furniture workshop where the machines set the plan and the daylight sets the day.",
    lede:
      "A cabinetmaker moving out of a garage and into a real workshop: three brick piers, two tall windows and a floor that had to stay clear enough to walk a two-metre board through.",
    body: [
      "The machines arrived before the drawings did. The table saw sits on the window axis with four metres of clear feed either side, and everything else — assembly benches, the tool wall, the timber racks — is arranged to keep that run free, because a workshop is only as good as its longest straight line.",
      "The change is mostly in the envelope: the brick piers were repointed rather than covered, the ceiling was stripped back and insulated to take the sawdust out of the air supply, and the lighting was replaced with continuous linear fittings over the benches only, so the glare never crosses a cutline.",
      "The timber racks are the studio-standard blackened steel and were made by the client, which is the honest way to fit out a workshop.",
    ],
    facts: [
      ["Area", "260 m² (2,800 sq ft)"],
      ["Scope", "Workshop fit-out, services, dust extraction"],
      ["Timeline", "9 months, completed autumn 2023"],
      ["Team", "Nadia Ostrow, with J. Alvarez"],
    ],
    material: "Exposed brick, blackened steel, polished concrete, oak",
  },
  {
    slug: "morse-street-reading-room",
    index: "08",
    title: "Morse Street Reading Room",
    type: "Institutional",
    place: "Toronto, ON",
    year: "2021",
    image: "project-morse-street-reading-room-toronto.jpg",
    alt:
      "Two-storey reading hall lined in pale ash joinery, long tables with reading lamps filling the floor between freestanding shelf piers, a mezzanine gallery above with a pale steel balustrade, daylight arriving from clerestories on both sides",
    note:
      "The library as furniture: one ash joinery system, and every table has a lamp and a view of a window.",
    lede:
      "A branch library whose brief could be written in one sentence: every seat must have daylight and a place to put a book. That sentence decided the whole plan.",
    body: [
      "The hall is arranged as a single room with a gallery, so a reader can see every other reader — which sounds like a loss of privacy and turns out to be the opposite, because the tables are set far enough apart that nobody is overlooked.",
      "All of the joinery is one ash system: the shelf piers, the tables, the desk surrounds and the gallery balustrade base. It was drawn as a kit of five components and repeated; nothing special was made for any single position, and the whole read of the room comes from the stacking of those five parts.",
      "Lighting is deliberately local — a lamp per reader at 3000 K, nothing overhead above 100 lux — so the hall stays bright at its edges, where the clerestories are, and settles into a working calm in the middle of the floor.",
    ],
    facts: [
      ["Area", "1,240 m² (13,350 sq ft)"],
      ["Scope", "Interior architecture, joinery system, lighting"],
      ["Timeline", "26 months, completed spring 2021"],
      ["Team", "Nadia Ostrow, with L. Chen and K. Barry"],
    ],
    material: "Ash joinery, pale steel, terrazzo, wool",
  },
];

/* Material palette. `accent` retints the whole site; `swatch` is the material
   itself. Both are kept dark enough for a 4.5:1 text ratio in either theme. */
const materials = [
  { id: "travertine", name: "Honed travertine", spec: "Wren & Salt, 2023", swatch: "214 198 175", accent: "184 147 95" },
  { id: "steel", name: "Blackened steel", spec: "Hensley Loft, 2023", swatch: "86 92 99", accent: "138 152 166" },
  { id: "plaster", name: "Lime plaster", spec: "Meridian Gallery, 2022", swatch: "223 217 206", accent: "146 137 116" },
  { id: "cedar", name: "Reclaimed cedar", spec: "Ridgeline, 2024", swatch: "150 116 84", accent: "182 124 68" },
  { id: "concrete", name: "Board-formed concrete", spec: "Ridgeline, 2024", swatch: "128 130 128", accent: "150 150 148" },
  { id: "oak", name: "Pale white oak", spec: "Alder Row, 2024", swatch: "196 166 126", accent: "161 122 74" },
  { id: "wool", name: "Wool and felt", spec: "Morse Street, 2021", swatch: "120 122 126", accent: "150 155 162" },
  { id: "brick", name: "Repointed brick", spec: "Quarry Lane, 2023", swatch: "166 118 96", accent: "176 118 88" },
];

/* Trust numbers. Each one is checkable against the eight studies above. */
const stats = [
  { value: 5, unit: "", label: "People in the studio", note: "No handoffs, no account managers" },
  { value: 42, unit: "", label: "Projects completed", note: "Since the studio opened in 2014" },
  { value: 11, unit: "", label: "Years of practice", note: "Residential, commercial, cultural" },
  { value: 9, unit: "", label: "Awards and shortlists", note: "Toronto Design Awards, ID Best of Year" },
];

const recognition = [
  "Featured in Azure Magazine",
  "Toronto Design Awards — Finalist 2024",
  "Interior Design Best of Year — Shortlist",
  "Ontario Association of Architects — Member",
  "Canadian Interiors — Best of Canada 2023",
  "Muskoka Build Awards — Custom Home 2024",
];

module.exports = { projects, materials, stats, recognition };