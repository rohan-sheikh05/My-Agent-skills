# Phase 3: Product & design direction

Turn the brief and research into decisions the build can follow.

## Product decisions

- **Core loop:** trigger → action → reward → reason to return. Write it in one line.
- **MVP features**, ranked. Mark each *must / should / later*. Write down what's
  deliberately left out and why.
- **Time to the core action:** how many taps from first launch? Aim for under 60
  seconds. Delay the account wall if the core action can work without one (save
  locally, sync after sign-up).
- **Navigation:** a bottom tab bar (3–5 tabs) for phones, with a sidebar on
  tablet/desktop widths. Put the core action in an obvious place (the center tab
  or a FAB). A command menu (Ctrl/Cmd+K) is a nice extra on desktop.
- **Key screens:** list them, and give each one its main job and its empty, loading
  and error states.
- **Retention without manipulation:** gentle streaks (allow rest days), reminders
  the user controls, progress the user can see. No dark patterns.

## Visual direction

- Derive the tone from the users and the problem. A study or habit app wants
  calm and focus. A kids' app wants playful and very legible. Finance wants
  trustworthy and precise. A cultural audience may want local visual references
  (scripts, crafts, colors).
- When the direction isn't obvious, offer **2–3 distinct directions** (name,
  mood, palette, type pairing, one signature detail) and let the user choose. A
  quick mockup of one key screen per direction helps.
- **Themes** (light/dark + at least 3 styles) are part of the baseline; the rule
  is defined in "Themes" in [standard-features.md](standard-features.md). Here you
  only decide the styles: the chosen direction becomes the default style, and the
  runner-up directions become the alternative styles, **as token sets only**
  (palette, radius, maybe fonts). Layouts and components stay shared, so no style
  turns into a half-finished second design.
- Choose a **signature detail**: one memorable motif, used consistently (e.g. a
  stitch/ink motif, a mascot, a shape language). This is what makes an app feel
  designed rather than templated. It either works in every style, or has a small
  variant per style (e.g. stitches in one style, petals in another, a plain ring in
  the neutral one). Never leave a style with a detail that clashes.

## Design system before screens

Build in this order. **Gate only steps 1 and 3** (the tokens/direction, and the
first two or three real screens on a phone); the rest follows from them:

1. **Tokens:** color (with semantic success/warning/info/danger, plus chart
   colors), type scale and fonts (self-hosted, with the needed script coverage),
   radius, spacing, elevation, motion timing. Start from
   `templates/web/theme-tokens.css` and run `scripts/check-contrast.mjs` until
   every style × mode passes.
2. **App shell:** navigation, top bar, safe areas, route loading skeletons.
3. **Pages:** redesign or build each page with shared primitives.
4. **Native feel:** status bar and splash follow the theme, haptics, transitions,
   onboarding.
5. **Polish:** micro-interactions, celebration moments, a full accessibility pass.

Record the decisions in `design-system/MASTER.md`: tokens, components, motion
rules, do/don't. Update it whenever the design changes.

## Output: `docs/app-brief/03-direction.md`

Core loop, MVP table, navigation map, key screens, chosen visual direction (with
its rationale tied to the research), signature detail, and the skill plan from
Phase 4.
