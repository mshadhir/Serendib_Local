# Railway deployment and replacement of the existing draft

The owner selected Railway on 16 September 2026 and confirmed that `serendiblocal.lk` already serves the previous draft. Keep the existing service running until the replacement has passed live checks. This document and `railway.json` prepare deployment; no Railway resources, DNS changes or production migration have been performed.

## Deploy the replacement first

1. Connect the owner's Railway account and GitHub repository `mshadhir/Serendib_Local`. Use branch `codex/independent-launch`, repository root, and `railway.json`. Do not deploy `main`, which still contains the old draft. Disable automatic deployments while staging the migration.
2. Use one service instance in an available suitable region, preferably Singapore. Review the Hobby plan and usage budget in the account. USD 5 is a minimum with included usage, not a maximum bill. Avoid additional database services: this application already uses SQLite. Configure usage alerts; a hard spending limit may stop the site when reached.
3. Attach a persistent volume at `/var/data` before accepting enquiries. Begin with the smallest practical capacity (1 GB is ample for initial text enquiries); monitor usage and backups. `railway.json` does not create a volume or set account secrets.
4. Set the following service variables. Keep the Dockerfile's start command; do not run the static preview as the production application.

| Variable | Initial value |
| --- | --- |
| `PORT` | `3000` |
| `DATABASE_PATH` | `/var/data/serendib.sqlite` |
| `RAILWAY_RUN_UID` | `0`, Railway's documented override for its root-owned volume |
| `APP_ORIGIN` | The exact HTTPS origin of the generated Railway service domain, without a trailing slash |
| `ADMIN_PASSWORD_HASH` | Owner-generated secret from `npm run admin:password -- --print`; enter only in the host's secret settings |
| `INDEXING_ENABLED` | `false` during review |
| `TRUST_PROXY` | `1` when served through Railway's trusted proxy |

Railway mounts volumes as root; the runtime override above is specific to this provider. The default Docker image still uses its non-root user elsewhere. Verify volume write permissions during the first deployment. Keep one replica for SQLite and do not enable multi-region replicas. [Volume documentation](https://docs.railway.com/volumes).

5. Generate a Railway domain targeting port 3000, update `APP_ORIGIN` to that exact origin, and redeploy. A generated service URL is public; `noindex` does not provide access protection. The existing private Sites preview is separate.
6. Check `/api/health`, homepage and route pages; review mobile and desktop layouts; submit a synthetic enquiry and verify it in `/admin`; check login/logout, contact links, estimates and persistence after restart. Confirm a backup can be restored separately. Delete only the synthetic test record. Real historical enquiries require a separate reviewed export/import from the old platform; DNS changes do not migrate records.
7. Confirm the actual monitored business email, WhatsApp, available vehicles, rates and booking terms before inviting customer enquiries. Email alerts require the separately documented email-service configuration. Assign daily dashboard checks if alerts are not enabled.

## Domain switch

Public DNS checked on 16 September 2026 returned these authoritative nameservers:

```
ns-765.awsdns-31.net
ns-1961.awsdns-53.co.uk
ns-153.awsdns-19.com
ns-1088.awsdns-08.org
```

These are an observation, not a complete zone backup. No MX answer was returned in that lookup; inspect the full account configuration before assuming there are no email or verification records.

Railway requires CNAME flattening or dynamic ALIAS support for an apex domain; its documentation lists Route 53 as unsupported. Use Cloudflare DNS if no supported provider is already available, retaining Register.lk as registrar. Add root and `www` domains in Railway and use the exact assigned routing and verification records. Do not reuse the earlier Render IP. [Railway domain instructions](https://docs.railway.com/networking/domains/working-with-domains).

Before switching, export the full existing DNS zone and record the old hosting destination, nameservers, TTLs and any DNSSEC delegation. Preserve mail and verification records. Do not pin the old site's rotating CDN IPs as a durable replacement for its original hostname. If changing nameservers, prepare and verify the new zone first; coordinate DNSSEC according to the DNS providers' migration instructions. Keep the old service and zone intact for rollback.

After the Railway test succeeds, configure its domain records, complete verification and HTTPS, set `APP_ORIGIN=https://serendiblocal.lk`, and test the root and `www` addresses. Check enquiry submission on the final origin. Enable `INDEXING_ENABLED=true` only after the public launch review; verify canonical URLs, redirects and the sitemap. DNS propagation can make visitors reach either deployment temporarily. Keep both available through that transition and reconcile any enquiries received by the old service.

If the new site fails, restore the recorded previous routing/delegation and investigate on the Railway test URL; rollback also depends on DNS caches. Do not promise an instant or zero-downtime DNS switch. Cancel the previous hosting only after the replacement, data preservation and domain have been verified.

## Ongoing operation

Create SQLite snapshots using `npm run backup -- /var/data/backups/backup.sqlite` with a unique dated filename for each backup, and copy them to a separate private location. Schedule and verify backups after the hosting account is connected; a script alone is not an automatic backup service. Review usage, enquiries and delivery failures regularly.

Configuration fields were checked against the [Railway configuration reference](https://docs.railway.com/config-as-code/reference). Railway deployment, volume permissions, email delivery and final-domain acceptance checks remain pending account connection. [Pricing](https://railway.com/pricing).
