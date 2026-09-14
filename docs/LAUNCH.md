# Before the public business launch

The owner has not yet confirmed the actual fleet/providers, operating costs, contact details or hosting/domain account. The site is therefore a private review, and the proposed prices are not a cost-approved sales offer.

- Confirm which vehicles and drivers can be provided, their capacity and availability, and requirements relevant to operating the service. Remove vehicle options you cannot arrange.
- Approve or adjust the USD 59 / 77 / 86 guide rates and the hours, distance and cost inclusions. Ensure every quote remains viable after all costs.
- Confirm that `hello@serendiblocal.com` and `+94716797971` are the correct monitored contacts; these were retained from the draft. Add the accurate business identity/address where appropriate. No invented information should be published.
- Decide the exact written booking, deposit/payment and cancellation conditions. The site presently takes enquiries only.
- Set a unique owner password, deploy with persistent storage, verify contact links, submit a test enquiry and confirm it in the owner dashboard. Check the enquiry remains after a restart.
- Configure email alerts or assign daily dashboard checks. Make and restore a backup. Remove development enquiries after checking.
- Review the pages on your phone and desktop, including menu, route selection and enquiry form. Automated server/API checks passed; a rendered mobile/desktop browser review is still outstanding.
- Connect the approved domain, verify HTTPS and the final `APP_ORIGIN`, then enable indexing. Only close the original platform after the replacement works.

## What was checked during implementation

The production build completed. The original seven integration tests covered server rendering and asset responses, missing-page handling, form validation, seat limits, server-calculated prices, private enquiry access, password hashing, login/logout, CSRF/origin protection, rate limiting, contact/price updates, deletion, and live-database backup restoration. The production dependency audit reported no known vulnerabilities at the time of testing.

No live payments, customer enquiries, email delivery, domain change, paid hosting purchase, Docker image execution or production data migration were performed. The private review deploy is separate from the independent Node application's deployment.

The additional SEO tests and final-domain indexing steps are documented in [SEO-LAUNCH.md](SEO-LAUNCH.md). Public launch still requires confirmed business details; private review access has not been changed.
