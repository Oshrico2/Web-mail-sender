# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Express + MongoDB (Mongoose) backend serving a React SPA from `frontend/build`. Deployed on Render (`webmailsender.onrender.com`), which runs the root `npm run build` on every push to `master`. Frontend migrated from Create React App to Vite (delegated: chosen because CRA is deprecated; output stays in `frontend/build` so the server and Render config are unchanged; build tools live in `dependencies` because Render's install runs with `NODE_ENV=production`).

## Users

Back-office staff of the Synergia team at Talpiot (תלפיות) Family Office, an Israeli insurance and family financial management agency. They work at desktop machines in the office, in Hebrew, and use the tool several times a day. Some users are admins who manage other users and review the activity log. A second, external audience: insurance agents who receive the emails, and who reach exactly one public page (unsubscribe from mailing).

## Product Purpose

Turn Excel exports from the agency's CRM into personal emails to each insurance agent, so every agent sees the status of the customers they referred without anyone emailing them by hand. Around that core: maintaining the agent directory and preferences (daily/weekly status, opted out, mailing consent), campaigns/committees to exclude, employees and their domains, business-development managers by last-name letter, a report that assigns leads to managers, a rich-text bulk mailing to agents, and an audit trail of who changed what.

Success: an operator uploads the morning file, checks the preview, sends, and knows which agents were not reached, confident that nothing was sent twice or to the wrong person.

## Positioning

An in-house tool built around Talpiot's own data shapes (Hebrew Excel column names such as `סוכן בכרטיס לקוח`, `שם מטפל`, `מקור לקוח`) and its rules (weekly vs daily agents, pension/health sent separately, campaigns excluded, managers split by surname letter). No off-the-shelf mailer does this.

## Operating Context

- Input: `.xlsx` exports from the CRM, uploaded in the browser and parsed client-side, then posted to the API.
- Output: emails from Outlook mailboxes (`statusim@tlp-ins.co.il` for statuses, `sinergia@tlp-ins.co.il` for mailing and reports), each with an attached Excel file and an HTML table.
- Sending is long-running (one email per agent); operators must not leave the page mid-send.
- Every mutation is written to a user-activity log shown to admins.

## Capabilities and Constraints

- Live production system with real data: API routes, Mongo schemas, Excel column contracts, and email content must stay backward compatible.
- Hebrew, RTL throughout.
- Auth: username/password, JWT in an httpOnly cookie, 24h session; admin flag gates user management and history.
- The unsubscribe page `/agents/remove-mailing` is linked from every mailing email sent so far, so that URL must keep working without login.

## Brand Commitments

Talpiot Family Office identity is binding: logo at `frontend/public/images/logo.jpg` (charcoal `#3A3B3D` wordmark and peaks, gold gradient arch and center peak running `#F0D383` → `#B87A30`), tagline "ניהול כלכלי משפחתי". Email signature "צוות סינרגיה" and the branch list are existing copy.

## Evidence on Hand

Real data lives only in production MongoDB; no fixtures exist in the repo. Screenshots of the old UI are linked from README.md. Any demo data used for local previews is synthetic and must never be committed as seed data.

## Product Principles

1. Never surprise the operator during a send: preview first, confirm explicitly, show progress, report exactly who was not reached.
2. Destructive actions are confirmed and recorded.
3. Compatibility with live data beats cleanliness; migrate, don't break.
4. The list is the workspace: find, scan, edit in place, export.

## Accessibility & Inclusion

Hebrew RTL with correct `dir`/`lang`; full keyboard operation of tables, dialogs, and menus; respect `prefers-reduced-motion`.
