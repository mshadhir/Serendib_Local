# Independent hosting

The main application uses Node 24, React/Vite and SQLite. It needs one persistent process and disk. It does not need Emergent, MongoDB, Stripe, PostHog or Sites to run. Images and fonts are served locally.

The private Sites review is a static copy of the frontend. Its form and owner login are deliberately inactive and labelled. `.openai/hosting.json` controls only that review copy. `npm start` instead serves the real application, writes enquiries to SQLite, and enables the protected dashboard when the owner sets a password.

## Your domain: serendiblocal.lk

The owner confirmed on 15 September 2026 that `serendiblocal.lk` was purchased through Register.lk. Keep that registration in the owner's account. Buying the domain does not establish whether the package includes compatible application hosting or a working email mailbox; confirm the purchased package before buying another service.

The proposed arrangement is Register.lk for the domain, the owner's GitHub repository for the source, and the owner's Render account for the complete application and enquiry database. The prepared Render service is in Singapore, with 0.5 CPU, 512 MB RAM and a 1 GB persistent disk. The current base compute and disk charges are USD 7 + USD 0.25 per month, before taxes, extra usage or any paid workspace plan. Confirm the amount shown in the account before purchase. [Render pricing](https://render.com/pricing), checked 15 September 2026. Domain renewal, a business mailbox and optional email delivery are separate costs unless an existing package covers them.

### Launch sequence for this repository

1. Confirm whether Register.lk supplied just the domain or hosting/email too. If hosting is included, check support for a persistent Node 24 process with `node:sqlite`, or Docker, before deciding whether to use it. A WordPress/PHP package alone does not establish compatibility with this application.
2. If using Render, create or sign in to the owner's account, connect GitHub, and use `mshadhir/Serendib_Local`, branch `codex/independent-launch`, with the root `render.yaml`. The updated website is in that branch; `main` still contains the original draft. Review the resource price before creating it. The Render integration can assist after the owner connects it; account credentials and billing stay in the owner's account.
3. Follow the Render setup below. Use the actual temporary service origin for `APP_ORIGIN` while testing. Verify the enquiry form, owner login, contact links, persistence after restart and a restorable backup. A Render web-service URL is public unless access protection is added; `INDEXING_ENABLED=false` only controls search indexing and is not password protection. The existing Sites review remains private.
4. Once the test deployment and launch details are approved, add `serendiblocal.lk` under Render's Custom Domains. Render also adds `www.serendiblocal.lk` and redirects it to the root domain. Inspect the current authoritative nameservers and DNS records before editing them. Use the DNS provider actually serving the domain; this may be Register.lk or a provider selected in its nameserver settings.
5. Apply the exact DNS values supplied for the deployed service, preserve existing mail records, and verify the domain and HTTPS in Render. Do not replace the whole DNS zone or switch nameservers just to add website records. See the table below for the expected record types, not a completed DNS change.
6. Set `APP_ORIGIN=https://serendiblocal.lk`, redeploy and test through that address. Confirm the actual business email and WhatsApp number. The draft still uses `hello@serendiblocal.com`; ownership of the `.lk` domain does not create `hello@serendiblocal.lk` or confirm access to the `.com` mailbox. Change the website contact only after the intended mailbox or forwarding service is working.
7. After the public launch checks pass, enable indexing, verify ownership in Google Search Console and submit `https://serendiblocal.lk/sitemap.xml`. Follow [SEO-LAUNCH.md](SEO-LAUNCH.md). Keep the previous service available until the replacement works.

### Expected website DNS records

| Name | Record | Value after the Render service exists |
| --- | --- | --- |
| `@` (root) | `A`, if the DNS provider does not offer an apex alias | Render currently documents `216.24.57.1`; confirm against the service's instructions before applying. |
| `www` | `CNAME` | The actual `onrender.com` hostname assigned to this service, without `https://` or a path. |

Providers supporting an apex `ALIAS`/`ANAME` or CNAME flattening can use Render's documented alternative. Cloudflare requires its own Render DNS instructions. Resolve conflicting website A/AAAA/CNAME records only for the names being connected; preserve unrelated subdomains and existing MX, SPF, DKIM and DMARC records. [Render DNS instructions](https://render.com/docs/configure-other-dns), [domain verification and HTTPS](https://render.com/docs/custom-domains).

Next owner inputs: the Register.lk package name or a screenshot of its services, a Render account connection if proceeding with Render, and the monitored business email/WhatsApp. A screenshot of the domain's DNS/nameserver settings is sufficient for guided setup. Never share account passwords, two-factor codes or API secrets in chat.

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
