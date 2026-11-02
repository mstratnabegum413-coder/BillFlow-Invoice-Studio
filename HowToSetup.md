# BillFlow setup and deployment

## Requirements
- Node.js 18 or newer (only for tests and the optional local server).
- Python 3.8 or newer (only for the zero-dependency local static server).
- A modern browser with JavaScript and localStorage enabled.

## Run locally
From the repository root:

```sh
npm start
```

Open http://localhost:8080. The static app is in `web-app/`; there is no build step and no npm install is required.

## Verify code and calculations
```sh
npm test
npm run check
```

## Load sample data
Open BillFlow and, when the dashboard has no invoices, choose **Load sample data**. Sample records are fictional and saved only in the current browser profile. To reset them, use Profile -> Erase all data.

## PWA and offline verification
1. Serve the app over localhost or HTTPS (service workers do not run on ordinary HTTP hosts).
2. Open the app once while online and wait for the service worker to install.
3. In Chrome DevTools -> Application -> Service Workers, enable **Offline**.
4. Reload the page. The application shell should still load; create/edit data to verify local storage.
5. Disable Offline and reload once to return to normal operation.

The manifest uses `start_url: "./"` and `scope: "./"`. `web-app/service-worker.js` precaches the complete shipped shell. Increment its `CACHE` name whenever any precached asset changes.

## GitHub Pages
1. Push this repository to GitHub.
2. In repository Settings -> Pages, choose **GitHub Actions** as the build/deployment source.
3. The included `.github/workflows/pages.yml` publishes the contents of `web-app/`.
4. Wait for the Pages workflow to finish, then open the URL shown in Settings -> Pages.
5. For a project site, the service worker and manifest are relative-path aware and run under the repository subpath.

## Render static site
1. Create a new **Static Site** in Render and connect this repository.
2. Set the build command to blank (no build required).
3. Set the publish directory to `web-app`.
4. Deploy. The included `render.yaml` describes the same static-site setup.

## VPS with nginx
Copy the contents of `web-app/` into `/var/www/billflow`, then configure nginx:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/billflow;
    index index.html;
    location / {
        try_files $uri $uri/ =404;
    }
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
}
```

Enable HTTPS (for example, with Certbot) before relying on PWA installation and service workers.

## Docker with nginx:alpine
Create a `Dockerfile` in the repository root:

```dockerfile
FROM nginx:alpine
COPY web-app/ /usr/share/nginx/html/
EXPOSE 80
```

Build and run:

```sh
docker build -t billflow .
docker run --rm -p 8080:80 billflow
```

## Branding
- Change the `--pri`, `--bg`, `--card`, `--ink`, `--mut`, and `--line` CSS variables in `web-app/styles.css`.
- Update the app name, short name, theme colour, and background colour in `web-app/manifest.webmanifest`.
- Replace `web-app/icon.svg` with your own square SVG icon and update the title/description in `web-app/index.html`.

## Data and access model
BillFlow is a client-only, single-user application. Invoices are stored in the visitor's browser localStorage and are not shared or synchronized between devices. There are no user accounts, server-side roles, WordPress admin panel, or authentication system. Anyone with access to the same browser profile can view and edit its local invoices. Buyers should export backups regularly. Do not describe this build as multi-user software.

## Monitoring with UptimeRobot
Create an HTTPS monitor for the deployed public URL and use an HTTP(s) keyword or status monitor. This checks that the static site responds; it does not monitor browser storage, offline behaviour, or user-specific data.
