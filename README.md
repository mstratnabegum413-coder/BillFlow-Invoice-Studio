# BillFlow – Invoice Studio

A lightweight, offline-ready invoice maker for freelancers and small businesses. Create invoices, track paid/outstanding/overdue totals, print to PDF, and export/import JSON backups.

## Product model
BillFlow is a **client-only, single-user static web app**. It has no backend, accounts, authentication, roles, WordPress integration, or `wp-admin`. All invoice data stays in the current browser's localStorage. It is not a multi-user marketplace or cloud invoicing service.

## Features
- Live invoice editor and paper preview.
- Dashboard totals grouped by currency.
- Tax, discount, invoice status and automatic overdue detection.
- Eight currencies: USD, EUR, GBP, BDT, INR, AED, CAD and AUD.
- Business profile, duplicate/delete, print-to-PDF.
- JSON backup and restore with validation and duplicate-ID protection.
- Installable PWA with offline application-shell cache.
- Fictional sample data for evaluation.
- Light/dark appearance follows the operating-system colour preference.

## Privacy and data safety
No account, server, analytics, third-party scripts, API keys or external runtime dependencies. Data is stored locally in the browser under `billflow.v1`. Clearing browser/site data removes invoices. Data does not sync between devices. Anyone using the same browser profile can access its data. Export backups regularly.

## Requirements and commands
- Node.js 18+ for tests and syntax checks.
- Python 3.8+ for the local static server.
- Zero npm dependencies; no install/build step.

```sh
npm start
npm test
npm run check
```

See [HowToSetup.md](HowToSetup.md) for GitHub Pages, Render, nginx, Docker, PWA offline checks, branding and monitoring.

## Project structure
- `web-app/` – deployable static application.
- `web-app/js/config.js` – shared configuration.
- `web-app/js/invoice-calc.js` – tested calculation, numbering and summary logic.
- `web-app/js/storage.js` – versioned localStorage migration and persistence.
- `web-app/js/backup.js` – JSON backup validation/import/export.
- `web-app/js/sample-data.js` – demo fixtures.
- `web-app/js/dashboard.js` – dashboard view and filters.
- `tests/` – automated calculation tests.
- `.github/workflows/pages.yml` – GitHub Pages deployment.
- `render.yaml` – Render static-site configuration.

## Release
Version 1.0.3. Zero runtime dependencies. No credentials are required.
