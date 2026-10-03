/* ==========================================================================
   STRATA — motion

   One engine for all seven pages. The rules it works by:

     · Reduced motion is a first-class path, not an afterthought: when the user
       asks for less, every effect is skipped and every element is put into its
       finished state, so nothing is ever left invisible or unreachable.
     · Fixed layers (notice, header, cursor, rail, curtain) live outside
       #smooth-content, because ScrollSmoother transforms the content and a
       transform turns position: fixed into position: absolute.
     · Touch devices keep the browser's own scrolling and momentum. The pinned,
       scrubbed deck is a desktop-only luxury, and every control it offers
       (Tab, Enter, arrow keys) works without it.
     · If a plugin is missing, the feature it drives degrades to a static but
       complete page rather than failing to render.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var page = body.getAttribute("data-page") || "home";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";

  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);
  if (hasST && window.ScrollToPlugin) window.gsap.registerPlugin(window.ScrollToPlugin);
  if (hasST && window.SplitText) window.gsap.registerPlugin(window.SplitText);
  if (hasST && window.DrawSVGPlugin) window.gsap.registerPlugin(window.DrawSVGPlugin);
  if (hasST && window.Observer) window.gsap.registerPlugin(window.Observer);
  if (hasST && window.ScrollSmoother) window.gsap.registerPlugin(window.ScrollSmoother);

  var smoother = null;
  var splits = [];

  function $(sel, ctx) {
    return (ctx || doc).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  }
  function on(el, type, fn, opts) {
    if (el) el.addEventListener(type, fn, opts || false);
  }
  /* Scroll to a position on the page, whichever scroll engine is running. */
  function scrollToY(y) {
    if (smoother) smoother.scrollTo(Math.max(0, y), true, "top top");
    else if (hasGsap && window.ScrollToPlugin)
      window.gsap.to(window, {
        scrollTo: Math.max(0, y),
        duration: 0.9,
        ease: "power3.inOut",
      });
    else window.scrollTo(0, Math.max(0, y));
  }
  function scrollToEl(el, offset) {
    var y = el.getBoundingClientRect().top + window.pageYOffset - (offset || 0);
    scrollToY(y);
  }

  /* ------------------------------------------------------------------------
     Theme: midnight and daylight. One attribute on <html>, one token set, and
     the whole page follows — including the accent, which the swatches share.
     ------------------------------------------------------------------------ */
  function initTheme() {
    var btn = $("[data-theme-toggle]");
    var label = $("[data-theme-label]");
    if (!btn) return;
    /* The browser's own chrome has to follow the theme too, or a light page
       keeps a black address bar. */
    var meta = doc.querySelector('meta[name="theme-color"]');

    function apply(mode, persist) {
      if (mode === "paper") root.setAttribute("data-theme", "paper");
      else root.removeAttribute("data-theme");
      if (meta) meta.setAttribute("content", mode === "paper" ? "#EDE8E0" : "#100F0E");
      btn.setAttribute("aria-pressed", mode === "paper" ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        mode === "paper"
          ? "Switch to the midnight theme"
          : "Switch to the daylight theme",
      );
      if (label) label.textContent = mode === "paper" ? "Midnight" : "Daylight";
      if (persist) {
        try {
          localStorage.setItem("strata-theme", mode);
        } catch (e) {}
      }
      if (hasST) window.ScrollTrigger.refresh();
    }

    apply(root.getAttribute("data-theme") === "paper" ? "paper" : "ink", false);
    on(btn, "click", function () {
      apply(root.getAttribute("data-theme") === "paper" ? "ink" : "paper", true);
    });
  }

  /* ------------------------------------------------------------------------
     The material palette, as a control. Each swatch carries an accent and the
     page reads it from --accent, so one press retints everything on screen.
     ------------------------------------------------------------------------ */
  function initMaterials() {
    var chips = $$("[data-material]");
    if (!chips.length) return;
    chips.forEach(function (chip) {
      on(chip, "click", function () {
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        root.style.setProperty("--accent", chip.getAttribute("data-accent"));
        if (navigator.vibrate) navigator.vibrate(6);
      });
    });
  }
/* ------------------------------------------------------------------------
     Hold to dim. Light is this studio's material, so the visitor gets to move
     it: press and hold anywhere in the hero (or press the button) and the room
     drops into shadow while the light itself stays lit. It works with a
     finger, which is the point — it is the hero effect that survives on a
     phone, where a custom cursor cannot exist at all.
     ------------------------------------------------------------------------ */
  function initDim() {
    var hold = $("[data-dim-hold]") || $("[data-dim-surface]");
    var btn = $("[data-dim-toggle]");
    var label = $("[data-dim-label]");
    if (!hold) return;
    var locked = false;
    var held = false;
    var origin = null;

    function render() {
      var active = locked || held;
      root.classList.toggle("is-dim", active);
      if (label)
        label.textContent = active ? "Raise the light" : "Dim the room";
      if (btn) btn.setAttribute("aria-pressed", active ? "true" : "false");
    }

    /* The button is a switch, and now says so. It used to be a toggle that
       claimed to be a hold, which is the kind of small lie that makes a whole
       site feel unreliable. */
    on(btn, "click", function () {
      locked = !locked;
      render();
    });

    /* Holding anywhere in the hero dims the room — the whole section, not just
       the photograph, so the effect is visible on a phone. A drag cancels it, so
       it does not fire while someone is selecting text, and a press that starts
       on a link or a control is left alone. */
    on(hold, "pointerdown", function (e) {
      if (e.target.closest && e.target.closest("a, button, input, select, textarea, label")) return;
      origin = { x: e.clientX, y: e.clientY };
      held = true;
      render();
    });
    on(hold, "pointermove", function (e) {
      if (!held || !origin || e.pointerType === "touch") return;
      if (Math.abs(e.clientX - origin.x) > 8 || Math.abs(e.clientY - origin.y) > 8) {
        held = false;
        origin = null;
        render();
      }
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) {
      on(hold, t, function () {
        held = false;
        origin = null;
        render();
      });
    });
    on(doc, "keydown", function (e) {
      if (e.key === "Escape" && (locked || held)) {
        locked = false;
        held = false;
        render();
      }
    });
  }

  /* ------------------------------------------------------------------------
     The menu. It is a dialog in all but name: focus goes in on open, comes
     back to the button on close, Escape closes it, and the aria-hidden state
     is honest about what is on screen.
     ------------------------------------------------------------------------ */
  function initNav() {
    var overlay = $("#nav-overlay");
    var btn = $("#nav-open");
    var label = $("#nav-open-label");
    if (!overlay || !btn) return;
    var open = false;
    var lastFocus = null;

    function set(openNow) {
      open = openNow;
      overlay.classList.toggle("is-open", open);
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      btn.classList.toggle("is-active", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      if (label) label.textContent = open ? "Close" : "Menu";
      doc.body.classList.toggle("no-scroll", open);
      if (smoother) smoother.paused(open);
      if (navigator.vibrate) navigator.vibrate(open ? 8 : 4);

      if (open) {
        lastFocus = doc.activeElement;
        var first = $("a, button", overlay);
        if (first) first.focus();
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
      }
    }

    on(btn, "click", function () {
      set(!open);
    });
    on(doc, "keydown", function (e) {
      if (!open) return;
      if (e.key === "Escape") {
        set(false);
        return;
      }
      /* Keep Tab inside the overlay while it is open. */
      if (e.key === "Tab") {
        var items = $$("a[href], button", overlay).filter(function (el) {
          return el.offsetParent !== null;
        });
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && doc.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && doc.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    $$("a", overlay).forEach(function (link) {
      on(link, "click", function () {
        if (open) set(false);
      });
    });

    if (hasGsap) {
      window.gsap.set(".nav-anim", { yPercent: reduced ? 0 : 120 });
      overlay.addEventListener("transitionend", function () {
        if (!open && hasGsap && !reduced)
          window.gsap.set(".nav-anim", { yPercent: 120 });
      });
    }
    btn.addEventListener("click", function () {
      if (open && hasGsap && !reduced)
        window.gsap.fromTo(
          ".nav-anim",
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.05,
            overwrite: true,
            delay: 0.05,
          },
        );
    });
  }

  /* ------------------------------------------------------------------------
     Smooth scrolling, the luxury version: ScrollSmoother on desktop pointers
     only. Touch devices keep native scrolling, which is faster and better than
     anything we could fake.
     ------------------------------------------------------------------------ */
  function initSmooth() {
    if (!canSmooth()) return;
    window.gsap.matchMedia().add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", function () {
      smoother = window.ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1,
        effects: true,
        smoothTouch: false,
        normalizeScroll: false,
      });
      root.setAttribute("data-smooth", "on");
      return function () {
        if (smoother) smoother.kill();
        smoother = null;
        root.removeAttribute("data-smooth");
      };
    });
  }
  function canSmooth() {
    return hasST && typeof window.ScrollSmoother !== "undefined" && !reduced;
  }
/* ------------------------------------------------------------------------
     The loader. It waits for the hero photograph to decode rather than for a
     stopwatch, so the first thing the visitor sees is never a half-painted
     room. The CSS rule is a fallback: if this script never runs, the loader
     still removes itself after 3.6 seconds.
     ------------------------------------------------------------------------ */
  function initLoader(done) {
    var loader = $("#preloader");
    var rule = $("[data-pre-rule]");
    var hero = $(".hero-figure img");
    if (!loader) {
      done();
      return;
    }
    var finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      doc.body.classList.remove("no-scroll");
      if (hasGsap && !reduced) {
        window.gsap
          .timeline()
          .to(loader, {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
          })
          .add(function () {
            loader.classList.add("is-done");
            done();
          }, "-=0.35");
      } else {
        loader.classList.add("is-done");
        done();
      }
    }

    doc.body.classList.add("no-scroll");
    if (hasGsap && !reduced) {
      loader.style.animation = "none";
      var tl = window.gsap.timeline({ onComplete: finish });
      tl.from(".pre-letter", {
        yPercent: 130,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.9,
        ease: "power4.out",
      })
        .from(
          ".pre-sub",
          { autoAlpha: 0, y: 10, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .to({}, { duration: 0.35 });
      if (rule)
        tl.to(rule, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0.35);
    } else {
      finish();
      return;
    }

    /* Photograph first, then the lift — whichever comes first wins. */
    var waited = 0;
    (function poll() {
      var ready = !hero || (hero.complete && hero.naturalWidth > 0);
      if (ready || (waited += 120) > 2600) {
        tl.progress(1);
      } else {
        window.setTimeout(poll, 120);
      }
    })();
  }

  /* ------------------------------------------------------------------------
     The custom cursor and the roaming light. Desktop pointers only — there is
     no such thing as a hover on a phone, which is exactly why the hero also
     has hold-to-dim. The tag on the cursor always says what the thing does.
     ------------------------------------------------------------------------ */
  function initCursor() {
    if (!fine || reduced || !hasGsap) return;
    var dot = $("#cursor-dot");
    var tag = $("#cursor-tag");
    var tagText = $("#cursor-tag-text");
    var light = $("#light");
    if (!dot) return;

    root.classList.add("cursor-on");
    var tx = window.innerWidth / 2;
    var ty = window.innerHeight / 2;
    var dx = tx;
    var dy = ty;
    var sx = tx;
    var sy = ty;
    var lx = 50;
    var ly = 40;

    window.gsap.set([dot, tag], { xPercent: -50, yPercent: -50 });
    on(
      window,
      "pointermove",
      function (e) {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true },
    );

    window.gsap.ticker.add(function () {
      dx += (tx - dx) * 0.24;
      dy += (ty - dy) * 0.24;
      sx += (tx - sx) * 0.11;
      sy += (ty - sy) * 0.11;
      window.gsap.set(dot, { x: dx, y: dy });
      window.gsap.set(tag, { x: sx, y: sy });
      if (light) {
        lx += ((tx / window.innerWidth) * 100 - lx) * 0.08;
        ly += ((ty / window.innerHeight) * 100 - ly) * 0.08;
        light.style.setProperty("--lx", lx.toFixed(2) + "%");
        light.style.setProperty("--ly", ly.toFixed(2) + "%");
      }
    });

    window.gsap.to(dot, { opacity: 1, duration: 0.4 });
    root.classList.add("light-on");

    var targets =
      "a[href], button, [data-cursor], input, select, textarea, [role=slider], .wd-card";
    $$(targets).forEach(function (el) {
      on(el, "pointerenter", function () {
        var label = el.getAttribute("data-cursor");
        if (label) {
          if (tagText) tagText.textContent = label;
          window.gsap.to(dot, { scale: 0, duration: 0.3, overwrite: "auto" });
          window.gsap.to(tag, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.32,
            ease: "power3.out",
            overwrite: "auto",
          });
        } else {
          window.gsap.to(dot, {
            scale: 2.4,
            duration: 0.32,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      });
      on(el, "pointerleave", function () {
        window.gsap.to(tag, {
          autoAlpha: 0,
          scale: 0.8,
          duration: 0.28,
          overwrite: "auto",
        });
        window.gsap.to(dot, {
          scale: 1,
          duration: 0.32,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    });
  }

/* ------------------------------------------------------------------------
     Scroll reveals. Deliberately cheap: a short lift and fade, once per
     element, and never on anything the visitor needs in order to understand
     the page.
     ------------------------------------------------------------------------ */
  function initReveals() {
    if (!hasST || reduced) return;
    $$("[data-reveal]").forEach(function (el) {
      /* Opacity, not autoAlpha: autoAlpha sets visibility: hidden, which takes
         the element out of the accessibility tree and makes any control inside
         it unfocusable until the tween runs. Content fades; it never vanishes. */
      window.gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });
  }

  /* ------------------------------------------------------------------------
     Headings, split into lines and raised out of a mask. SplitText's autoSplit
     re-splits when the fonts land or the window changes, so lines never break
     the way hand-made spans would. aria: "auto" keeps the heading readable to
     a screen reader as one sentence.
     ------------------------------------------------------------------------ */
  function initSplits() {
    if (!hasST || !window.SplitText || reduced) return;
    $$("[data-split]").forEach(function (el) {
      splits.push(
        window.SplitText.create(el, {
          type: "lines, words",
          mask: "lines",
          aria: "auto",
          autoSplit: true,
          onSplit: function (self) {
            return window.gsap.from(self.words, {
              yPercent: 110,
              opacity: 0,
              duration: 1,
              ease: "power4.out",
              stagger: 0.035,
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          },
        }),
      );
    });
  }

  /* ------------------------------------------------------------------------
     The manifesto, read at the speed you scroll it. This is the one paragraph
     on the site that is worth pacing rather than skimming.
     ------------------------------------------------------------------------ */
  function initManifesto() {
    var el = $("[data-manifesto]");
    if (!el || !hasST || !window.SplitText || reduced) return;
    window.SplitText.create(el, {
      type: "words",
      aria: "auto",
      autoSplit: true,
      onSplit: function (self) {
        return window.gsap.fromTo(
          self.words,
          { opacity: 0.22 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.4,
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: "bottom 55%",
              scrub: true,
            },
          },
        );
      },
    });
  }

  /* ------------------------------------------------------------------------
     The numbers. They count once, when they arrive, and they stop where the
     data in ./content says they stop — no decorative rounding up.
     ------------------------------------------------------------------------ */
  function initCounters() {
    var els = $$("[data-count-to]");
    if (!els.length || !hasST || reduced) return;
    els.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
      var unit = el.querySelector(".stat-unit");
      var suffix = unit ? unit.outerHTML : "";
      var state = { v: 0 };
      window.gsap.to(state, {
        v: target,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: function () {
          el.innerHTML = Math.round(state.v) + suffix;
        },
        onComplete: function () {
          el.innerHTML = target + suffix;
        },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });
  }
/* ------------------------------------------------------------------------
     The deck: eight projects, eight real links.

     Desktop: the viewport is pinned and the track translated by page scroll,
     with drag thrown in because some people will try to drag it.
     Touch: the browser's own horizontal scrolling with scroll-snap, which is
     smoother and cheaper than anything we could write by hand.
     Either way: Tab and Enter reach every card, and the arrow keys move a
     focused deck one project at a time.
     ------------------------------------------------------------------------ */
  function initDeck() {
    var viewport = $("[data-deck-viewport]");
    var track = $("[data-deck-track]");
    var railBar = $("[data-rail-bar]");
    var railCurrent = $("[data-rail-current]");
    var railLabel = $("[data-rail-label]");
    var counter = $("[data-deck-count]");
    var bar = $("[data-deck-bar]");
    var rail = $(".rail");
    if (!viewport || !track) {
      if (rail) rail.style.display = "none";
      return;
    }
    var cards = $$("[data-deck-card]", track);
    var count = cards.length;
    var index = 0;
    var pinTrigger = null;

    function pad(n) {
      return (n < 10 ? "0" : "") + n;
    }
    function setBar(v) {
      if (bar && hasGsap) window.gsap.set(bar, { scaleX: v });
      if (railBar && hasGsap) window.gsap.set(railBar, { scaleX: v });
    }

    function setIndex(i, fromScroll) {
      index = Math.max(0, Math.min(count - 1, i));
      if (counter) counter.textContent = pad(index + 1);
      if (railCurrent) railCurrent.textContent = pad(index + 1);
      if (railLabel)
        railLabel.textContent = cards[index].getAttribute("data-short") || "";
      cards.forEach(function (c, n) {
        c.classList.toggle("is-current", n === index);
      });
      refreshButtons();
      if (fromScroll) return;
      if (pinTrigger) {
        var range = pinTrigger.end - pinTrigger.start;
        scrollToY(pinTrigger.start + (range * index) / Math.max(1, count - 1));
      } else {
        var card = cards[index];
        viewport.scrollTo({
          left: card.offsetLeft - (viewport.clientWidth - card.clientWidth) / 2,
          behavior: reduced ? "auto" : "smooth",
        });
      }
    }

    /* Touch and narrow screens: native scrolling drives the readout. */
    if (window.matchMedia("(max-width: 767px)").matches || !hasST) {
      on(
        viewport,
        "scroll",
        function () {
          var mid = viewport.scrollLeft + viewport.clientWidth / 2;
          var best = 0;
          var bestDist = Infinity;
          cards.forEach(function (c, i) {
            var d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
            if (d < bestDist) {
              bestDist = d;
              best = i;
            }
          });
          setBar((best + 1) / count);
          setIndex(best, true);
        },
        { passive: true },
      );
    }
/* Desktop: pin the deck and scrub the track sideways. */
    if (hasST && !reduced) {
      window.gsap.matchMedia().add("(min-width: 768px)", function () {
        viewport.classList.add("is-pinned");
        var distance = function () {
          return Math.max(0, track.scrollWidth - viewport.clientWidth);
        };
        var tween = window.gsap.to(track, {
          x: function () {
            return -distance();
          },
          ease: "none",
          scrollTrigger: {
            trigger: viewport,
            start: "center center",
            /* Slightly shorter than the track is long, so eight cards scrub at a
               brisk pace instead of pinning the page for two whole screens. The
               tween still translates the full distance, so nothing is skipped. */
            end: function () {
              return "+=" + Math.round(distance() * 0.85);
            },
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              setBar(self.progress);
              var i = Math.round(self.progress * (count - 1));
              if (i !== index) setIndex(i, true);
            },
          },
        });
        pinTrigger = tween.scrollTrigger;

        /* Drag: throw the deck with the mouse. */
        var dragging = false;
        var startX = 0;
        var startProgress = 0;
        viewport.classList.add("is-draggable");
        on(viewport, "pointerdown", function (e) {
          if (e.pointerType === "touch") return;
          dragging = true;
          startX = e.clientX;
          startProgress = pinTrigger.progress;
          viewport.classList.add("is-dragging");
        });
        on(window, "pointermove", function (e) {
          if (!dragging || !pinTrigger) return;
          var range = pinTrigger.end - pinTrigger.start;
          var next = startProgress - (e.clientX - startX) / range;
          next = Math.max(0, Math.min(1, next));
          var y = pinTrigger.start + range * next;
          if (smoother) smoother.scrollTop(y);
          else window.scrollTo(0, y);
        });
        ["pointerup", "pointercancel"].forEach(function (t) {
          on(window, t, function () {
            dragging = false;
            viewport.classList.remove("is-dragging");
          });
        });

        return function () {
          viewport.classList.remove("is-pinned", "is-draggable", "is-dragging");
          pinTrigger = null;
        };
      });
    }

    /* Keyboard: arrows move the deck, Home and End go to the ends. The handler
     listens on the document but only acts when the deck is on screen, so a
     visitor can steer the eight studies without having to focus anything —
     which is the only way this works on every browser, given that a tabindex
     region inside transformed content cannot always be focused. */
    var onScreen = true;
    if (window.IntersectionObserver) {
      onScreen = false;
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
      }).observe(viewport);
    }
    function keyStep(e) {
      if (!onScreen) return;
      var tag = (e.target && e.target.tagName) || "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      var map = {
        ArrowRight: index + 1,
        ArrowLeft: index - 1,
        Home: 0,
        End: count - 1,
      };
      if (!(e.key in map)) return;
      e.preventDefault();
      setIndex(map[e.key], false);
    }
    on(viewport, "keydown", keyStep);
    on(doc, "keydown", function (e) {
      if (doc.activeElement === viewport) return; /* already handled above */
      keyStep(e);
    });

    /* Buttons: the same two moves, as real controls. */
    var prev = $("[data-deck-prev]");
    var next = $("[data-deck-next]");
    on(prev, "click", function () {
      setIndex(index - 1, false);
    });
    on(next, "click", function () {
      setIndex(index + 1, false);
    });
    function refreshButtons() {
      /* Not disabled: pressing "previous" on the first project should simply
         stay put, rather than removing a button from the tab order. */
      if (prev)
        prev.setAttribute("aria-disabled", index <= 0 ? "true" : "false");
      if (next)
        next.setAttribute("aria-disabled", index >= count - 1 ? "true" : "false");
    }

    /* If a card link takes focus, the deck follows it. */
    cards.forEach(function (card, i) {
      var link = card.querySelector("a");
      on(link, "focus", function () {
        if (i !== index) setIndex(i, true);
      });
    });

    setIndex(0, true);
    setBar(1 / count);
  }

  /* ------------------------------------------------------------------------
     The working drawing: every line draws itself, then the poché fades in, in
     the order the architect would have drawn it. SVG paths only — no image,
     no library beyond DrawSVG, and the drawing is artwork that is readable
     with the motion switched off.
     ------------------------------------------------------------------------ */
  function initDrawing() {
    var scope = $("[data-draw-scope]");
    if (!scope || !hasST || !window.DrawSVGPlugin || reduced) return;
    var lines = $$(".dwg-line, .dwg-line--fine", scope);
    var fills = $$(".dwg-fill", scope);
    if (!lines.length) return;
    window.gsap.set(fills, { opacity: 0 });
    var tl = window.gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 78%", once: true },
    });
    tl.from(lines, {
      drawSVG: "0%",
      duration: 1.1,
      ease: "power2.inOut",
      stagger: { each: 0.012, from: "start" },
    }).from(fills, { opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.05 }, "-=0.6");
  }

  /* ------------------------------------------------------------------------
     Drawing over photograph. A real slider: pointer drag, arrow keys, Home and
     End, an aria-valuenow that tracks the handle, and a CSS variable doing the
     clipping so the compositor does the work.
     ------------------------------------------------------------------------ */
  function initSlider() {
    var slider = $("[data-slider]");
    var handle = $("[data-slider-handle]");
    if (!slider || !handle) return;
    var value = 50;
    var dragging = false;

    function apply(v) {
      value = Math.max(0, Math.min(100, v));
      slider.style.setProperty("--reveal", value + "%");
      handle.setAttribute("aria-valuenow", Math.round(value));
      handle.setAttribute(
        "aria-valuetext",
        Math.round(value) + " per cent line study",
      );
    }
    function fromEvent(e) {
      var rect = slider.getBoundingClientRect();
      return ((e.clientX - rect.left) / rect.width) * 100;
    }

    on(handle, "pointerdown", function (e) {
      dragging = true;
      handle.setPointerCapture && handle.setPointerCapture(e.pointerId);
      apply(fromEvent(e));
    });
    on(slider, "pointerdown", function (e) {
      dragging = true;
      apply(fromEvent(e));
    });
    on(window, "pointermove", function (e) {
      if (dragging) apply(fromEvent(e));
    });
    ["pointerup", "pointercancel"].forEach(function (t) {
      on(window, t, function () {
        dragging = false;
      });
    });
    on(handle, "keydown", function (e) {
      var step = e.shiftKey ? 10 : 2;
      if (e.key === "ArrowLeft") apply(value - step);
      else if (e.key === "ArrowRight") apply(value + step);
      else if (e.key === "Home") apply(0);
      else if (e.key === "End") apply(100);
      else return;
      e.preventDefault();
    });

    apply(50);
  }
/* ------------------------------------------------------------------------
     Fit / full size for the drawing sheet. The sheet is fitted to its column by
     default; this measures how much it would have to be multiplied by to reach
     the 620px it used to demand, offers that as a real button, and remembers
     nothing. On a wide screen the factor is 1 and the button stays out of the
     way, because there is nothing to choose.
     ------------------------------------------------------------------------ */
  function initDrawingZoom() {
    var scopes = $$("[data-dwg-zoom-scope]");
    if (!scopes.length) return;

    var MIN_READABLE = 620;

    scopes.forEach(function (scope) {
      var wrap = $(".dwg-plan-wrap", scope);
      var btn = $("[data-dwg-zoom]", scope);
      if (!wrap || !btn) return;
      var factor = 1;

      function measure() {
        var width = wrap.clientWidth;
        if (!width) return;
        factor = Math.max(1, Math.min(2.4, MIN_READABLE / width));
        var worthIt = factor > 1.02;
        scope.classList.toggle("has-zoom", worthIt);
        if (!worthIt) {
          wrap.style.setProperty("--dwg-zoom", "1");
          btn.setAttribute("aria-pressed", "false");
          btn.textContent = "Full size";
        }
      }

      on(btn, "click", function () {
        var zoomed = btn.getAttribute("aria-pressed") === "true";
        if (zoomed) {
          wrap.style.setProperty("--dwg-zoom", "1");
          btn.setAttribute("aria-pressed", "false");
          btn.textContent = "Full size";
          wrap.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" });
        } else {
          wrap.style.setProperty("--dwg-zoom", String(factor));
          btn.setAttribute("aria-pressed", "true");
          btn.textContent = "Fit width";
        }
      });

      measure();
      on(window, "resize", measure);
      if (window.ResizeObserver) new ResizeObserver(measure).observe(wrap);
    });
  }

  /* ------------------------------------------------------------------------
     In-page anchors, through whichever scroll engine is running.
     ------------------------------------------------------------------------ */
  function chromeHeight() {
    /* Measured, not parsed. --chrome is a calc() of two other custom
       properties, and a custom property's computed value keeps its token
       stream, so parseFloat("calc(...)") is NaN — this silently fell back to
       96px and every anchor landed with its heading under the notice and the
       header. The two fixed bars are the truth, and they are right there. */
    var bottom = 0;
    [$(".notice"), $(".site-header")].forEach(function (el) {
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.height > 0 && r.bottom > bottom) bottom = r.bottom;
    });
    return bottom > 0 ? Math.round(bottom) : 96;
  }

  function initAnchors() {
    /* Same-document links on any page — on the homepage the menu emits plain
       "#work", and the footer or a case study may link to "#main". */
    $$('a[href^="#"], a[href*=".html#"]').forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href === "#") return;
      var parts = href.split("#");
      var id = parts[1];
      if (!id) return;
      if (parts[0]) {
        /* A different page: only the hash needs handling when it is this one. */
        var here = location.pathname.split("/").pop() || "index.html";
        if (parts[0] !== here) return;
      }
      on(a, "click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        var target = doc.getElementById(id);
        if (!target) return;
        e.preventDefault();
        scrollToEl(target, chromeHeight() + 16);
        if (history.pushState) history.pushState(null, "", "#" + id);
      });
    });

    /* The back button, and any jump that did not go through the handler above. */
    on(window, "hashchange", function () {
      var el = location.hash ? doc.getElementById(location.hash.slice(1)) : null;
      if (el) scrollToEl(el, chromeHeight() + 16);
    });

    /* Landing on a deep link, e.g. index.html#work. */
    if (location.hash) {
      var el = doc.getElementById(location.hash.slice(1));
      if (el)
        window.setTimeout(function () {
          scrollToEl(el, chromeHeight() + 16);
        }, 600);
    }
  }

  /* ------------------------------------------------------------------------
     Between pages. Chrome, Edge and Safari 18.2+ do this natively from the
     @view-transition rule in the stylesheet, with no JavaScript at all. Where
     that is missing, the curtain covers the screen and then navigates, so a
     page change never becomes a hard flash of white.
     ------------------------------------------------------------------------ */
  function initTransitions() {
    var curtain = $("#curtain");
    var native = "startViewTransition" in doc;
    if (!curtain || native || reduced || !hasGsap) return;

    doc.addEventListener("pageshow", function () {
      window.gsap.set(curtain, { yPercent: 101 });
    });

    $$('a[href$=".html"], a[href*=".html#"]').forEach(function (a) {
      var url = a.getAttribute("href");
      if (!url || a.target === "_blank" || a.hasAttribute("download")) return;
      /* A link to the page you are already on, with a hash — the menu does this
         on the homepage — is a jump, not a navigation. Running the curtain over
         it and then assigning location.href reloaded the document, which lost
         the hash and made every menu item look dead. */
      var here = location.pathname.split("/").pop() || "index.html";
      if (url.split("#")[0] === here || url.indexOf("#") === 0) return;
      on(a, "click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        window.gsap.fromTo(
          curtain,
          { yPercent: 101 },
          {
            yPercent: 0,
            duration: 0.42,
            ease: "power3.inOut",
            onComplete: function () {
              window.location.href = url;
            },
          },
        );
      });
    });
  }
/* ------------------------------------------------------------------------
     The hero, in WebGL.

     One triangle, one shader, no library: the photograph, a light blade that
     follows the pointer, a slow drift so the room breathes, dusk as you scroll
     down, and the same grain the DOM overlay uses. It starts only if WebGL is
     present, the pointer is fine, the visitor has not asked for less motion
     and the connection is not in data-saver mode. If anything fails the plain
     photograph stays exactly where it is: the shader is a bonus, never the
     content, and the canvas is revealed only after the first frame has been
     drawn, so nobody ever sees a black rectangle.
     ------------------------------------------------------------------------ */
  function initHeroGL() {
    var canvas = $("#hero-gl");
    var img = $(".hero-figure img");
    if (!canvas || !img || reduced || !fine) return;
    if (navigator.connection && navigator.connection.saveData) return;

    var gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    var VERT =
      "attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}";
    var FRAG = [
      "precision highp float;",
      "uniform sampler2D uTex;uniform vec2 uRes;uniform float uTime;",
      "uniform vec2 uMouse;uniform float uScroll;uniform float uHasTex;",
      "varying vec2 vUv;",
      "float hash(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}",
      "void main(){",
      "vec2 uv=vUv;",
      "vec2 d=uv-uMouse;float r=length(d);",
      "uv+=normalize(d+0.00001)*0.022*smoothstep(0.62,0.0,r);",
      "uv+=vec2(sin(uTime*0.05)*0.004,cos(uTime*0.04)*0.004);",
      "vec3 col=uHasTex>0.5?texture2D(uTex,uv).rgb:vec3(0.05,0.05,0.045);",
      "float blade=smoothstep(0.36,0.0,abs((uv.x*0.75+uv.y*0.55)-(uMouse.x*0.75+uMouse.y*0.55)));",
      "col+=vec3(1.0,0.79,0.52)*blade*smoothstep(1.15,0.12,r)*(0.28+0.12*sin(uTime*0.35));",
      "col*=mix(1.0,0.7,uScroll);",
      "col*=0.34+0.66*smoothstep(1.35,0.3,length(vUv-0.5));",
      "col+=(hash(vUv*uRes+uTime)-0.5)*0.022;",
      "gl_FragColor=vec4(col,1.0);",
      "}",
    ].join("\n");

    function shader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var vs = shader(gl.VERTEX_SHADER, VERT);
    var fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var u = {
      tex: gl.getUniformLocation(prog, "uTex"),
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      scroll: gl.getUniformLocation(prog, "uScroll"),
      has: gl.getUniformLocation(prog, "uHasTex"),
    };
    gl.uniform1i(u.tex, 0);

    var st = {
      mx: 0.5,
      my: 0.5,
      tx: 0.5,
      ty: 0.5,
      has: 0,
      t0: performance.now(),
    };
    var running = false;
var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(Math.max(1, canvas.clientWidth) * dpr);
      canvas.height = Math.round(Math.max(1, canvas.clientHeight) * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function frame(now) {
      if (!running) return;
      st.mx += (st.tx - st.mx) * 0.06;
      st.my += (st.ty - st.my) * 0.06;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, (now - st.t0) / 1000);
      gl.uniform2f(u.mouse, st.mx, 1 - st.my);
      gl.uniform1f(
        u.scroll,
        Math.min(1, Math.max(0, (window.pageYOffset || 0) / window.innerHeight)),
      );
      gl.uniform1i(u.has, st.has ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(frame);
    }

    function start() {
      if (!running) {
        running = true;
        requestAnimationFrame(frame);
      }
    }

    on(
      window,
      "pointermove",
      function (e) {
        st.tx = e.clientX / window.innerWidth;
        st.ty = e.clientY / window.innerHeight;
      },
      { passive: true },
    );
    on(window, "resize", resize);
    resize();

    var source = new Image();
    source.crossOrigin = "anonymous";
    source.onload = function () {
      try {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          source,
        );
        st.has = 1;
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform1i(u.has, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        root.classList.add("gl-on");
        start();
      } catch (err) {
        /* Keep the photograph. */
      }
    };
    source.src = img.getAttribute("src");

    /* Stop drawing when the hero leaves the screen: phones get warm that way. */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) start();
        else running = false;
      }).observe(canvas);
    }
  }
/* ------------------------------------------------------------------------
     The hero's opening: the header drops in, the eyebrow rises, and the three
     headline lines come up out of their masks. It runs as the loader lifts, so
     the first move the visitor sees is the page assembling itself.
     ------------------------------------------------------------------------ */
  function initHeroIntro() {
    if (!hasGsap || reduced) return;
    var tl = window.gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".site-header", { y: -20, autoAlpha: 0, duration: 0.8 })
      .from('[data-hero="eyebrow"]', { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.5")
      .from(".hero-line", { yPercent: 115, duration: 1.1, stagger: 0.1 }, "-=0.45")
      .from(".hero-sub", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.6")
      .from(".hold-hint", { autoAlpha: 0, duration: 0.6 }, "-=0.45")
      .from('[data-hero="cue"]', { autoAlpha: 0, duration: 0.6 }, "-=0.45");
  }

  /* ------------------------------------------------------------------------
     The demo form. Nothing is transmitted anywhere and there is no endpoint,
     because this is a portfolio sample and not a business: the form says so
     out loud instead of pretending. The CSP in _headers also sets
     form-action 'none', so the browser enforces the same promise even if this
     script never runs.
     ------------------------------------------------------------------------ */
  function initForm() {
    var message =
      "Thanks \u2014 this is a demo form, so nothing was actually sent. On a live site your message would reach the studio.";
    $$("form[data-demo-form]").forEach(function (form) {
      on(form, "submit", function (e) {
        e.preventDefault();
        var status = form.querySelector("[data-demo-form-status]");
        if (status) {
          status.textContent = message;
          status.style.display = "block";
        }
        form.reset();
      });
    });
  }

  /* ------------------------------------------------------------------------
     Boot. Order matters: the smoother is created before anything that pins, so
     the pinned deck lives inside the transformed content the way GSAP expects.

     Each feature is wrapped separately. If one of them fails — an unusual
     device, a blocked CDN, a plugin that did not load — the rest of the page
     still runs, and the failure is recorded on window.__strataFailures for the
     QA probe to read rather than being swallowed.
     ------------------------------------------------------------------------ */
  var failures = [];
  window.__strataFailures = failures;

  function safe(name, fn) {
    try {
      fn();
    } catch (err) {
      failures.push(name + ": " + (err && err.message));
      if (window.console && console.warn)
        console.warn("STRATA motion — " + name + " was skipped:", err && err.message);
    }
  }

  function boot() {
    safe("chrome", initChrome);
    safe("theme", initTheme);
    safe("nav", initNav);
    safe("materials", initMaterials);
    safe("dim", initDim);
    safe("cursor", initCursor);
    safe("smooth", initSmooth);
    safe("reveals", initReveals);
    safe("splits", initSplits);
    safe("manifesto", initManifesto);
    safe("counters", initCounters);
    safe("deck", initDeck);
    safe("drawing", initDrawing);
    safe("drawingZoom", initDrawingZoom);
    safe("slider", initSlider);
    safe("anchors", initAnchors);
    safe("transitions", initTransitions);
    safe("heroGL", initHeroGL);
    safe("form", initForm);

    safe("loader", function () {
      initLoader(function () {
        safe("heroIntro", initHeroIntro);
        if (hasST)
          window.setTimeout(function () {
            window.ScrollTrigger.refresh();
          }, 150);
      });
    });
  }

  /* The two bars at the top of the page are the notice and the header, and the
     header has to sit below the notice whatever the notice's text does at any
     width. So the notice is measured rather than assumed, and the result is
     published as --notice-h for the header and for the content's top padding.

     --chrome — what the page's top padding, the anchor scroll margin and the
     full-screen menu all clear with — used to be the sum of two constants: the
     notice's real height plus a --header-h of 3.6rem, while the header is
     actually about 4.45rem tall (a 44px wordmark row plus 0.85rem of padding
     above and below it). Everything that trusted it sat 12px under the header,
     and the menu's first item cleared it by nothing at all. It is measured from
     the bars themselves now, so it cannot drift again when either changes. */
  function initChrome() {
    var notice = $(".notice");
    var header = $(".site-header");
    if (!notice) return;

    function measure() {
      var n = notice.getBoundingClientRect();
      /* Rounded up: a fractional height would otherwise leave a sub-pixel of
         the bar showing through the padding that is meant to clear it. */
      var h = Math.ceil(n.height);
      if (h > 0) root.style.setProperty("--notice-h", h + "px");
      var bottom = Math.ceil(
        Math.max(n.bottom, header ? header.getBoundingClientRect().bottom : 0),
      );
      if (bottom > 0) root.style.setProperty("--chrome", bottom + "px");
    }

    measure();
    on(window, "resize", measure);
    if (window.ResizeObserver) {
      new ResizeObserver(measure).observe(notice);
      if (header) new ResizeObserver(measure).observe(header);
    }
    /* The notice and the wordmark both change height when the display face
       arrives, which is after this first measurement. */
    if (doc.fonts && doc.fonts.ready)
      doc.fonts.ready.then(measure)["catch"](function () {});
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();