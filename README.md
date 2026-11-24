# Talpiot Mail — customer-status emails for insurance agents

Internal tool for the Synergia team at Talpiot Family Office. It turns the CRM's Excel export into one personal email per insurance agent (their customers as a table plus an attached `.xlsx`), builds the business-development managers report, sends rich-text mailings to agents, and records every change in an activity log.

Hebrew, RTL. Express + MongoDB backend, React (Vite) frontend.

## Screens

| Route | What it does |
| --- | --- |
| `/` | Home: quick actions, directory counts, recent activity (admins) |
| `/send-mail` | Upload Excel → preview → choose daily / weekly / health / pension → confirm → live progress per agent → report of who was not reached |
| `/business-managers/report` | Assign every lead to a manager by the first letter of the agent's last name; optional summary email |
| `/mailing` | Rich-text mailing to every agent on the mailing list, with a test send first |
| `/agents` | Agent directory. The count strip doubles as filters (daily, weekly, no status, on/off the mailing list). Old links `/agents/add`, `/agents/per-week`, `/agents/confirmed-mailing` still work |
| `/campaigns`, `/employees`, `/business-managers` | Directories edited in a side panel |
| `/users`, `/users/history` | Admin only: users and the activity log |
| `/agents/remove-mailing` | Public unsubscribe page linked from every mailing (no login) |

## Running locally

```bash
npm install
npm install --prefix frontend
npm run dev                 # API on :4000 (node --watch)
npm run dev --prefix frontend   # UI on :3000, proxies /api to :4000
```

### Environment (`.env` at the repo root)

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Session signing secret (the server refuses to start without it) |
| `PASSWORD_TO_MAIL` | Password of `statusim@tlp-ins.co.il` (customer statuses) |
| `PASSWORD_TO_MAIL2` | Password of `sinergia@tlp-ins.co.il` (mailing and reports) |
| `PUBLIC_URL` | Optional. Base URL for the unsubscribe link (default `https://webmailsender.onrender.com`) |
| `NODE_ENV` | `production` makes Express serve `frontend/build` |

## Deploying (Render)

Render runs the root build script on every push to `master`:

```
npm run build   # installs root + frontend deps and builds frontend/build with Vite
npm start       # node backend/server.js
```

Vite and its React plugin are regular `dependencies` of the frontend on purpose: with `NODE_ENV=production`, `npm install` skips dev dependencies.
