---
name: Talpiot Mail
description: Hebrew RTL back-office for Talpiot Family Office; status emails, directories, and mailing, built as a White City building.
colors:
  plaster: "#f4f5f2"
  plaster-2: "#eceee9"
  plaster-3: "#e3e6e0"
  plaster-band: "#fafaf8"
  panel: "#ffffff"
  line: "#dadfd6"
  line-soft: "#e9ebe6"
  ink: "#2e3033"
  ink-2: "#484c50"
  muted: "#61665f"
  faint: "#8a8e88"
  core: "#2e3033"
  core-2: "#383b3f"
  core-3: "#45484c"
  core-ink: "#e4e6e1"
  core-muted: "#a3a79f"
  gold: "#c99a4b"
  gold-hi: "#e9c77a"
  gold-deep: "#7f5a1f"
  gold-wash: "#fbf5e9"
  gold-wash-2: "#f4e7cc"
  shade: "#8fa3ae"
  shade-wash: "#e8eef1"
  shade-ink: "#3f5966"
  ok: "#3f7350"
  ok-wash: "#e3efe6"
  warn: "#b4532a"
  warn-wash: "#f7e5dc"
  warn-ink: "#8f3d1b"
typography:
  display:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.15
  numeral:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.1
    fontFeature: "tnum"
  title:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.15
  title-sm:
    fontFamily: "Rubik, Assistant, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Assistant, Segoe UI, Arial Hebrew, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Assistant, Segoe UI, Arial Hebrew, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.5
  caption:
    fontFamily: "Assistant, Segoe UI, Arial Hebrew, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  pane: "2px"
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "20px"
  s6: "24px"
  s8: "32px"
  s10: "40px"
  s12: "48px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "#1f2022"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "#d4a75a"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "42px"
  button-dark-hover:
    backgroundColor: "#3b3e42"
  button-ghost:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "42px"
  button-ghost-hover:
    backgroundColor: "{colors.plaster-2}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    height: "42px"
  button-danger:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.warn-ink}"
    rounded: "{rounded.md}"
    height: "42px"
  button-danger-solid:
    backgroundColor: "{colors.warn}"
    textColor: "{colors.panel}"
    rounded: "{rounded.md}"
    height: "42px"
  button-sm:
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "34px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "42px"
  search:
    backgroundColor: "{colors.plaster}"
    rounded: "{rounded.md}"
    padding: "0 12px 0 40px"
    height: "40px"
  chip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "34px"
  chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
  tag:
    backgroundColor: "{colors.plaster-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: "0 9px"
    height: "24px"
  tag-gold:
    backgroundColor: "{colors.gold-wash-2}"
    textColor: "{colors.gold-deep}"
  ribbon:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
  ribbon-pane:
    padding: "16px 20px"
  ribbon-pane-active:
    backgroundColor: "{colors.gold-wash-2}"
    textColor: "{colors.gold-deep}"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
    padding: "20px"
  rail:
    backgroundColor: "{colors.core}"
    textColor: "{colors.core-ink}"
    width: "252px"
  rail-link:
    textColor: "{colors.core-ink}"
    rounded: "{rounded.sm}"
    padding: "9px 12px"
  rail-link-active:
    backgroundColor: "{colors.core-2}"
    textColor: "{colors.panel}"
  modal:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
    width: "480px"
  sheet:
    backgroundColor: "{colors.panel}"
    width: "520px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  thermo-core:
    backgroundColor: "{colors.core}"
    rounded: "{rounded.lg}"
    padding: "16px"
  pane-sent:
    backgroundColor: "{colors.gold}"
    rounded: "{rounded.pane}"
    height: "22px"
  pane-failed:
    backgroundColor: "{colors.warn}"
    rounded: "{rounded.pane}"
    height: "22px"
---

# Design System: Talpiot Mail

## Overview

**Creative North Star: "White City Plaster"**

The office is a Tel Aviv White City building. Work happens on lime-white plaster: a pale ground with pure white panels drawn by crisp one-pixel stone hairlines. A charcoal stair core runs down the right edge (the rail, in RTL), and Talpiot gold is the sun that lights it. Gold falls only where light means something: the current place, the primary action, progress, and selection. Everything else is plaster, charcoal ink, and a balcony-shadow blue-grey for secondary data.

Density is operational, not editorial. Pages open on a 44px Rubik title with actions at the far end, a ribbon-window strip of counts, then a single table panel with search, a sticky guide-words band, and a sortable sticky header. Records open in a side sheet from the left edge while the workspace recedes behind a charcoal scrim; centered modals are kept for confirmations. The signature is the thermometer window: a charcoal core of small panes that light gold one by one as emails send, terracotta where a send failed.

Motion is a short sunlight sweep: 150 to 260ms, ease-out, rows settling 4px on first data arrival only, dialogs rising 8px and fading, one gold sweep across the core when a run completes. Under reduced motion, movement goes and fades stay.

**Key Characteristics:**
- Plaster ground, white panels, 1px stone hairlines; no grey sidebar plus blue accent admin template.
- Charcoal core (rail, thermometer, home "today" block, login facade) as the building's spine.
- Gold as light, never as decoration.
- Rubik for titles and numerals, Assistant for all UI text; every figure tabular.
- Soft corners (10 to 14px) and soft, downward-only shadows.
- Hebrew RTL throughout; physical directions in this file are given for RTL.

## Colors

A warm near-neutral plaster palette on a charcoal spine, with one gold accent and two narrow state hues.

### Primary
- **Talpiot Sun Gold** (gold): Primary button fill, done stations and the progress line, sent panes, switch on, focus rings (2px outline, and a 3px 18% gold halo on inputs), active rail bar.
- **Window Light** (gold-hi): The lit side of every gold gradient (the sun gradient runs gold-hi to gold, top to bottom); active rail icon; toast info icon; counts that sit on charcoal.
- **Brass Shadow** (gold-deep): Gold as text: links, caret, pressed ribbon label, gold tags and manager letter tiles.
- **Sun Wash** (gold-wash, gold-wash-2): Selection surfaces. gold-wash for a selected table row, chosen program card, and gold notices; gold-wash-2 for a pressed ribbon pane, gold tags, and `::selection`.

### Secondary
- **Balcony Shade** (shade, shade-wash, shade-ink): Secondary data and information. shade-ink for muted ribbon counts; shade-wash with shade-ink for info notices and shade tags; shade for info dots in the activity feed.

### Tertiary
- **Terracotta** (warn, warn-wash, warn-ink): Errors and destructive actions only. Failed panes, error stations, warning ribbon counts, invalid input borders, danger buttons, warn tags and notices. warn-ink carries text on washes.
- **Cypress** (ok, ok-wash): Success only. Yes marks, ok tags, the done mark, success dots.

### Neutral
- **Lime Plaster** (plaster): The page ground; also the hover fill for rows, chips, and panes, and the resting fill of search and switch rows.
- **Plaster Shade** (plaster-2, plaster-3): Neutral tags, icon-button and ghost-button hover, skeletons, empty-state marks, the proportion strip trough.
- **Plaster Band** (plaster-band): The sticky bands inside panels: guide words, day bands in the activity log, and sheet and modal footers. Currently a literal in the code, not a custom property.
- **White Panel** (panel): Every work surface: panels, ribbon, inputs, sheets, modals.
- **Stone Hairline** (line, line-soft): line for panel, input, and chip borders and under table headers; line-soft for dividers inside panels (row rules, pane separators, toolbar and footer rules).
- **Charcoal Ink** (ink, ink-2): Primary text, dark buttons, active chips, toasts. ink-2 for secondary text and icons on plaster.
- **Mortar** (muted): Supporting text, column headers, placeholders, captions.
- **Pumice** (faint): Inactive icons only (search glass, sort arrows at rest, "no" marks, row chevrons). It is 3.3:1 on white, so it is not a text color.
- **Stair Core** (core, core-2, core-3, core-ink, core-muted): The charcoal spine. core is the rail, thermometer, today block, and login facade; core-2 is a hovered or current rail item; core-3 is dividers and unlit panes on charcoal; core-ink and core-muted are text on charcoal.

### Named Rules
**The Sunlight Rule.** Gold marks light: the current place, the primary action, progress, and selection or focus. Gold-wash tags (weekly status, manager letters) are the only resting gold. Never fill a panel, header, or block of text with gold.

**The One Sun Per View Rule.** Each page header has at most one gold primary button. Everything else in the header is ghost, dark, or quiet.

**The Terracotta Means Failure Rule.** Terracotta is reserved for errors and destruction. Do not use it for emphasis, counts that are merely notable, or decoration.

## Typography

**Display Font:** Rubik (with Assistant, system-ui), self-hosted via @fontsource, Hebrew and Latin subsets, weights 500 and 700.
**Body Font:** Assistant (with Segoe UI, Arial Hebrew, system-ui), self-hosted, weights 400, 600, and 700.

**Character:** Rubik's rounded geometry echoes Bauhaus balconies and carries every title and number; Assistant is a quiet, highly legible Hebrew UI face that does the work.

### Hierarchy
- **Display** (Rubik 700, 2.75rem/44px, 1.15, -0.01em): Page titles and the home greeting. Drops to 2rem below 900px. The login facade uses a larger clamp (2.5rem to 3.75rem, line-height 1.05).
- **Headline** (Rubik 700, 2rem/32px, 1.15): The home "today" headline, login card title, public unsubscribe title.
- **Numeral** (Rubik 500, 2rem/32px, 1.1, tabular): Ribbon counts and the thermometer counter. Drops to 1.5rem on narrow ribbons.
- **Title** (Rubik 700, 1.5rem/24px): Sheet and modal headings.
- **Title Small** (Rubik 500, 1.25rem/20px): Panel headings, section titles, program cards, home destination rows, legend counts.
- **Body** (Assistant 400, 0.9375rem/15px, 1.5): Everything readable. Page descriptions cap at 68ch, empty states at 44ch.
- **Label** (Assistant 700, 0.875rem/14px): Field labels, column headers, ribbon labels, chips, station labels, buttons (15px for full-size buttons).
- **Caption** (Assistant 700, 0.8125rem/13px): Rail group names, guide-words band, day bands, tags, hints, timestamps.

### Named Rules
**The Tabular Figures Rule.** Every number is tabular: table cells, counts, ranges, timestamps. Columns of figures must align without effort.

**The Two Voices Rule.** Rubik speaks titles and numbers; Assistant speaks everything else. Do not set body or labels in Rubik, and do not set a page title in Assistant.

**The No Tracking Rule.** Hebrew is set without letter-spacing or case tricks. The only tracked text is the Latin "FAMILY OFFICE" line in the brand lockup (0.22em, 11px), which reproduces the logo and is not a label style.

## Layout

The shell is a two-column grid: the charcoal rail (252px) on the right and the work area on the left, painted as one continuous background so the core runs full height. The work area pads 32px top and 48px on the sides, and the page column is centered at max 1360px. Pages stack in a fixed order: header row (title with description, actions at the far end), ribbon strip, then the table panel or forms. Two-column work uses a main column plus a 340px side column; the send run uses the thermometer plus a 300px legend.

Spacing is on a 4px base (4, 8, 12, 16, 20, 24, 32, 40, 48). Panels pad 20px; toolbar and footers pad 12px by 16 to 20px; table cells pad 11px by 20px; major page blocks separate by 24px.

Tables scroll inside their panel (max height = viewport minus 330px), and the guide-words band and column header both stay sticky. A soft shadow appears under the header only once the table has scrolled.

Responsive: at 1180px and below, split layouts, the thermometer, and two-column feeds collapse to one column, and program cards go to two columns. At 900px and below, the rail becomes an off-canvas drawer from the right behind a 56px charcoal top bar; the header stacks; the ribbon scrolls horizontally with 128px minimum panes; forms, programs, and the today block go to one column; cell padding tightens to 12px, and secondary columns hide while their data moves under the primary cell.

## Elevation & Depth

Mostly flat. Surfaces separate by tone (plaster ground, white panel, charcoal core) and by 1px hairlines. Shadows are soft, always cast downward, and never glow. Three kinds of element get a shadow: things that sit on a ledge (the ribbon, the public card), things that float (toasts, the today block), and things that take over the screen (sheets, modals, the mobile rail).

### Shadow Vocabulary
- **Balcony Ledge** (`box-shadow: 0 10px 18px -12px rgb(46 48 51 / 0.22)`): A soft ledge under ribbon strips and the public card.
- **Resting** (`box-shadow: 0 1px 2px rgb(46 48 51 / 0.06), 0 2px 6px rgb(46 48 51 / 0.04)`): Hover lift on program cards.
- **Floating** (`box-shadow: 0 6px 16px -4px rgb(46 48 51 / 0.12), 0 2px 4px rgb(46 48 51 / 0.05)`): Toasts and the home today block.
- **Overlay** (`box-shadow: 0 24px 48px -12px rgb(30 32 34 / 0.28), 0 8px 16px -8px rgb(30 32 34 / 0.12)`): Sheets, modals, the mobile rail drawer. Paired with a 38% charcoal backdrop.

### Named Rules
**The Sun Is Overhead Rule.** Shadows fall downward with negative spread. No glow halos, no colored shadows, and no hard offset blocks.

**The Recede Rule.** When a record or confirmation opens, the workspace dims behind a charcoal scrim (rgb(30 32 34 / 0.38)). Focus comes from the room dimming, not from a heavier shadow.

## Shapes

Corners are soft and consistent: 14px for containers (panels, ribbon, modals, program cards, the thermometer core), 10px for controls (buttons, inputs, search, notices, toasts, switch rows), 8px for small controls (small buttons, icon buttons, rail items), 6px for tags and letter tiles, and fully round for chips, switches, avatars, and yes/no marks. Window panes (thermometer, stairwell, today windows, the legend) are nearly square at 2px. They are the building's windows, and the contrast with the soft containers is deliberate. The side sheet is square-edged because it is flush to the viewport. Borders are always 1px stone hairlines; the one exception is the dashed rule above record metadata.

## Components

### Buttons
Solid and confident; they press in rather than lift.
- **Shape:** Gently rounded (10px), 42px tall, 20px inline padding, Assistant 700 at 15px, 18px icon with an 8px gap.
- **Primary:** Sun gold fill with near-black text, a faint inset top highlight, and a 1px brass under-shadow. Hover lightens to #d4a75a.
- **Dark:** Charcoal ink fill with white text, for decisive actions off the main sun: login and unsubscribe submits, starting a new send. Hover #3b3e42.
- **Ghost:** White with a hairline border; hover goes to plaster-2. This is the default secondary (export, cancel).
- **Quiet:** Transparent, ink-2 text.
- **Danger / Danger solid:** White with a pale terracotta border and warn-ink text (hover warn-wash), or a terracotta fill with white text for the final destructive confirmation.
- **Small:** 34px tall, 8px corners, 14px text.
- **Press / Disabled:** Scales to 0.97 on press (no scaling under reduced motion); disabled sits at 55% opacity.
- **Icon button:** 36px square, transparent, plaster-2 on hover.

### Chips
- **Style:** Pill, 34px, white with a hairline border, ink-2 label at 14px/700 with a muted count.
- **State:** Pressed chips invert to a charcoal fill with white text and a gold-hi count. Chips filter only where the ribbon cannot (employees by subject, activity by kind).

### Tags
- **Style:** 24px, 6px corners, caption type. Neutral plaster-2, plus gold, warn, ok, and shade variants, each a wash fill with its matching ink. Manager letter tiles use the gold variant in Rubik.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** White panel on plaster.
- **Shadow Strategy:** None at rest. The ribbon and public card take the Balcony Ledge.
- **Border:** 1px line; internal dividers use line-soft.
- **Internal Padding:** 20px body; head 16px by 20px with a Title Small heading.

### Inputs / Fields
- **Style:** 42px, white, 1px hairline, 10px corners, 12px inline padding. Labels 14px/700 in ink-2, hints 13px muted, errors 13px/700 warn-ink. Email fields run LTR.
- **Hover / Focus:** The border darkens to #c7ccc3 on hover. On focus, the border turns gold with a 3px gold halo at 18%.
- **Error:** Terracotta border.
- **Search:** 40px, plaster-filled with a leading glass icon; turns white with the gold focus ring on focus.
- **Switch row:** A plaster row (10px corners, line-soft border) holding bold label text, a muted description, and a 42×24 pill switch that turns gold when on.

### Navigation (the rail)
- **Style:** Charcoal core, 252px. At the top, a brand lockup (arch mark, "תלפיות" in Rubik 700, the Latin "FAMILY OFFICE" line). Three groups with 13px/700 core-muted names. User avatar, name, role, and log out at the foot.
- **Items:** 15px/600 core-ink with an 18px core-muted icon, 8px corners. Hover fills core-2.
- **Active (the lit window):** core-2 fill, white text, gold-hi icon, and a 4px sun-gradient bar on the inline-start edge. The lit item is the only location cue; there is no breadcrumb.
- **Mobile:** A 56px charcoal top bar with a menu button; the rail slides in from the right over a scrim.

### Ribbon Window
One white strip (14px corners, Balcony Ledge) split into equal panes by line-soft rules. Each pane holds a 14px/700 muted label over a Rubik 500 32px tabular count. Muted counts take shade-ink and warning counts take terracotta. When panes filter the table, they are buttons with `aria-pressed`: hover goes to plaster, and pressed goes to gold-wash-2 with a gold-deep label.

### Data Table
A sticky plaster-band guide-words row (first and last name in view, plus the visible range) sits over a sticky white header with 14px/700 muted column buttons. Sort arrows are hidden until hover or sort. Rows are 15px with line-soft rules. Hover gives a plaster fill on clickable rows, selection gives gold-wash, and focus gives a 2px inset gold outline. On first data arrival only, rows settle in 220ms, 30ms apart, capped at 12 rows. A footer bar holds counts.

### Record Sheet and Confirm Modal
Records open in a native `<dialog>` sheet, 520px wide, flush to the left edge, sliding in over 260ms on a drawer curve. It has a Title heading, a scrolling body, and a plaster-band footer with actions. Confirmations use a centered 480px modal (14px corners) that rises 8px from 98% scale over 200ms. Both use the Overlay shadow and the charcoal backdrop.

### Send Stations
A horizontal row of numbered 28px dots joined by 3px rails. Upcoming stations are hairline. The current station has an ink ring. Done stations fill gold, with gold rails behind them, and error stations fill terracotta.

### Thermometer Window (signature)
A charcoal core (14px corners, 16px padding) holding a Rubik count ("152 / 152") and a grid of 22px panes. Each pane is a 2px-cornered window: unlit core-3, sent in the sun gradient, failed in terracotta, no-email outlined in gold-hi, skipped in #5d6f78. Panes change over 240ms. When the run completes, one diagonal light sweep crosses the core. A 300px legend column beside it holds white rows with a pane swatch, a label, and a Rubik count. The same window motif repeats as the stairwell on the login facade and the lit windows on the home today block.

### Toasts
Charcoal, 10px corners, the Floating shadow, stacked at the bottom-left. They rise 12px when entering and leaving. The error toast is a deep terracotta (#7d3418). Icons are tinted per kind (success green, error pale terracotta, info gold-hi).

## Do's and Don'ts

### Do:
- **Do** keep the ground plaster and the work surfaces white, separated by 1px stone hairlines.
- **Do** reserve gold for place, primary action, progress, and selection or focus (The Sunlight Rule), with one gold primary per header.
- **Do** set every title in Rubik and every number in Rubik or tabular Assistant.
- **Do** put directory counts in one ribbon strip; make panes the filter when the strip is the filter.
- **Do** open records in the left side sheet and keep centered modals for confirmations.
- **Do** show sends as stations, an explicit confirm with counts, the thermometer window, and a final report of who was not reached.
- **Do** keep motion between 150 and 260ms with ease-out, and remove movement (but keep fades) under `prefers-reduced-motion`.
- **Do** use Lucide line icons (rendered SVG) at 18px (14px in tight cells, 20px in icon buttons), colored by the text they sit with.

### Don't:
- **Don't** add a grey sidebar, white cards, and a blue accent; the rail is charcoal and the accent is gold.
- **Don't** put a breadcrumb, eyebrow, or tracked label above page titles; the lit rail item carries location.
- **Don't** use pane-gold or terracotta as decoration, or terracotta for anything but failure and destruction.
- **Don't** cast glows, colored shadows, or hard offset shadows; shadows fall softly downward.
- **Don't** use faint (#8a8e88) for text; it is for inactive icons only.
- **Don't** replace the proportion strip with a donut or pie; proportions are a segmented strip with a table.
- **Don't** add letter-spacing or uppercase to Hebrew text.
