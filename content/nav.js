/* ==========================================================================
   STRATA — the site's own sections, in one place.

   The homepage numbers its sections 01 Manifesto through 06 Contact, and the
   menu has to say the same thing. It used to be written out twice — five items
   in the menu, six on the page — so the menu opened on "01 Selected Work"
   while the page called the same block "02", and the Manifesto could not be
   reached from the menu at all.

   build.js renders the overlay and the footer menu from this list, so the
   numbering has exactly one source and cannot drift again.
   ========================================================================== */

/* `id` is the element id on the homepage; `href` is built from it, so a link is
   a same-document link on the homepage (no reload, no curtain) and a real
   cross-page link everywhere else. */
const sections = [
  { id: "manifesto", num: "01", label: "Manifesto" },
  { id: "work", num: "02", label: "Selected Work" },
  { id: "drawing", num: "03", label: "The Drawing" },
  { id: "approach", num: "04", label: "Our Approach" },
  { id: "studio", num: "05", label: "The Studio" },
  { id: "contact", num: "06", label: "Contact" },
];

/* The homepage treats its own sections as history entries rather than as
   navigations; every other page has to name the file it is going back to. */
const sectionHref = (section, onHome) =>
  onHome ? `#${section.id}` : `index.html#${section.id}`;

module.exports = { sections, sectionHref };