# Independent hosting

The main application uses Node 24, React/Vite and SQLite. It needs one persistent process and disk. It does not need Emergent, MongoDB, Stripe, PostHog or Sites to run. Images and fonts are served locally.

The private Sites review is a static copy of the frontend. Its form and owner login are deliberately inactive and labelled. `.openai/hosting.json` controls only that review copy. `npm start` instead serves the real application, writes enquiries to SQLite, and enables the protected dashboard when the owner sets a password.

## Run locally

Install Node 24, then run from this repository:

```sh
npm ci
npm run build
npm run admin:password
npm start
```

Open `http://localhost:3000`. Use `/admin` for enquiries and contact/price updates. The password helper creates `.env` from `.env.example` and stores only a salted password hash. It never prints the password. Do not commit `.env` or a database. `npm run check` builds and runs the integration checks.

## Option 1: Render

The supplied `render.yaml` defines one Docker web service in Singapore with a persistent 1 GB disk at `/var/data`. It uses the currently documented `0.5c-512mb` plan identifier. A paid service is required for a persistent disk; review the [current price](https://render.com/pricing) in your account before creating resources. See the [Blueprint reference](https://render.com/docs/blueprint-spec) and [disk documentation](https://render.com/docs/disks).

1. Connect the GitHub repository to your own Render account and select the reviewed branch. Create a Blueprint using `render.yaml`, or create an equivalent Docker web service manually.
2. Generate a fresh owner hash locally with `npm run admin:password -- --print`. Copy the entire generated hash into the secret `ADMIN_PASSWORD_HASH` field in Render. Do not paste the password or hash into GitHub or chat.
3. Set `APP_ORIGIN` to the service's exact HTTPS origin, with no path or trailing slash. Set `DATABASE_PATH=/var/data/serendib.sqlite` and keep `INDEXING_ENABLED=false` while reviewing. Confirm the mounted disk is writable by the image's `node` user. The database needs that disk to survive redeployments.
4. Deploy. The health endpoint is `/api/health`. Test an enquiry, dashboard access, a price update and persistence after a restart. Check the dashboard daily unless email alerts are configured. Automatic deployments are off so changes can be reviewed first.
5. When the business details are approved, add the chosen domain in Render and use its exact DNS instructions in the registrar account. Preserve unrelated email/MX records. Render verifies the domain and provisions HTTPS. [Custom domain instructions](https://render.com/docs/custom-domains).
6. Change `APP_ORIGIN` to the final HTTPS domain and redeploy. Requests and sign-in must use that origin. After the launch checklist is complete, set `INDEXING_ENABLED=true`; submit `/sitemap.xml` through your search-console account.

One instance only: this SQLite setup is not designed for multiple replicas or ephemeral/serverless filesystems. The configured proxy setting trusts the nearest forwarded IP only; expose the application through the hosting provider's trusted proxy, not directly to untrusted clients that can set their own forwarding header.

## Option 2: a Docker-capable VPS

Use current Docker Compose with support for `env_file.format: raw` (Compose 2.30+), which preserves the dollar signs in the password hash. Copy `.env.example` to `.env`, configure the password and exact HTTPS origin, then run:

```sh
docker compose up -d --build
```

The app listens on the server's loopback port 3000. Put your trusted HTTPS reverse proxy in front of it, forward the real client IP correctly, and set `TRUST_PROXY=1` only for that setup. The named `serendib_data` volume holds the database; do not remove it during updates. The container runs as a non-root user. Use your provider's firewall and normal server-update process. The app can also run under any process manager supporting Node 24 and a persistent directory.

## Optional owner email alerts

Create your own Resend account, verify a sending domain, and set `RESEND_API_KEY`, `EMAIL_FROM` and `NOTIFICATION_TO` as host secrets. The alert includes only the enquiry reference, service type and dashboard URL. Customer details stay in the dashboard. Delivery failures are visible on the enquiry; there is no automatic retry queue, so the dashboard remains the source of truth. No test email was sent during development.

## Backups and moving host

`npm run backup` creates a consistent SQLite snapshot under `backups/`; an optional path can be supplied with `npm run backup -- /private/path/backup.sqlite`. This works with a live database. On a deployed container use the same script with `DATABASE_PATH` pointing to the mounted volume. Back up daily and before upgrades, then copy backups to a separate private location. Backups contain personal data; limit access and retention.

To restore, stop the application, preserve the current database and its WAL/SHM files, place a tested backup at `DATABASE_PATH` with owner-only permissions, and restart. Check an enquiry and settings after restoring. Never overwrite a running SQLite database. To migrate, move the source, environment configuration and a fresh snapshot to another Node/Docker host; update the domain only after the replacement works.

## Leaving the original platform

The draft database is not automatically imported. If it contains real enquiries, export only the necessary data from your own account, keep it private, and migrate after reviewing the fields. Old public test files contained draft admin credentials: rotate any reused credentials. Deleting current files does not erase Git history. Keep the original service until the new enquiry workflow, domain, notifications and backups are verified, then disconnect/cancel it in your own account.
