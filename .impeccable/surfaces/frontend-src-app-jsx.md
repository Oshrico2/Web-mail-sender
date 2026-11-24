---
version: 1
slug: "frontend-src-app-jsx"
primary_target: "frontend/src/App.jsx"
related_targets: []
---

---
version: 1
slug: "frontend-src-app-jsx"
primary_target: "frontend/src/App.jsx"
related_targets: []
---

# Surface: Talpiot Mail — whole operator app (frontend/src)

Mode: Operate. Audience: Synergia back-office staff at Talpiot Family Office (Hebrew, RTL, desktop, several times a day); admins manage users and read the log. One public page: unsubscribe (`/agents/remove-mailing`), reached by insurance agents from email.

Jobs: send customer-status emails from a CRM Excel export (preview → choose program → confirm → send → report who was not reached); maintain agents, campaigns, employees, business-development managers; build the managers lead report; send rich-text mailing; review activity.

## Direction contract

THESIS: The office as a Tel Aviv White City building — lime-white plaster work areas, a charcoal stair-core rail, Talpiot gold as the sun. Refuses the grey-sidebar/white-card/blue-accent admin template.

OWN-WORLD: Plaster ground #F4F5F2 and pure white panels with crisp 1px stone hairlines; charcoal #2E3033 rail and primary ink; gold #C99A4B→#E9C77A only for sunlight jobs (active place, primary action, progress, selection wash); deep-shadow blue-grey #8FA3AE for secondary data; terracotta #B4532A for errors. Rubik display (geometric, rounded like balconies), Assistant for UI text; all figures tabular. Corners 10–14px, balcony shadow = a soft offset ledge under ribbon strips, never glow.

STORY: The operator knows where they are from the lit rail item, reads the state of the directory from one ribbon strip, finds a record by typing, and edits it in a focused dialog while the rest recedes. On sends, they never wonder what happens next: station line, explicit confirm with counts, a thermometer-window stack lighting gold per agent, and a final report of who was not reached.

FIRST VIEWPORT: Right charcoal rail 248px (gold arch mark, three groups: עבודה יומית / מאגרים / ניהול, user at foot). Left work area: crumb + 44px Rubik title with actions at the far end; ribbon-window strip of 4–5 counts beneath; then the table card with search + filter chips, guide-words band (first–last name in view), sortable sticky header. Primary action: gold "+ חדש" at title row.

FORM: White City Plaster, candidate 7 of 7 on the grounded list (1 private wealth statement, 2 registered mail, 3 banknote intaglio, 4 Jerusalem stone & brass directory, 5 policy document, 6 Hebrew letterpress, 7 White City Bauhaus). seed: none (unavailable). Raises kept: guide words on long lists (lexicon), send flow as stations with explicit states (transit), tabular column-aligned figures (datamatics), focus recedes the workspace when a record opens (streaming wall).
Signature interaction: the thermometer window — a vertical stack of panes in the charcoal core that lights gold pane-by-pane as statuses send, terracotta for failures. Motion grammar: sunlight sweeps — short (160–240ms) ease-out-quart reveals, staggered rows on first load only, dialogs rise 8px and fade; everything off under prefers-reduced-motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints
- API routes, Mongo data, Excel column names, and email output stay compatible (live production).
- `/agents/remove-mailing` must work logged-out.
- No invented data; local previews use synthetic fixtures that are never committed as seed data.

## Recorded adaptations (build)
- Directory filters live in the ribbon-window strip itself (pressable panes, `aria-pressed`) instead of separate chips; chips remain only where the ribbon is not a filter (employees by subject, activity by kind).
- "Focus recedes" is delivered as a side record panel (native `<dialog>` sliding from the left edge) rather than a centered dialog; centered modals are reserved for confirmations.
- No breadcrumb/eyebrow above page titles (craft-floor ban outranks the FIRST VIEWPORT crumb); the lit rail item carries location.
- Report proportions are a segmented strip on the charcoal core plus a table, not a donut.
