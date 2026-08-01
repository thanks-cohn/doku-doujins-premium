# Executive Summary

The repository snapshot itself builds and its existing 53 tests pass, but it does **not** contain the two frontend diagnostics described in the incident (`DOKU BUILD CHECK 2026-07-31-1953` and `[checkout] button clicked`). The current built bundle therefore cannot emit either diagnostic. It does contain `[router] rendering`, the checkout endpoint string, the offer copy, and the checkout implementation. This is direct evidence that at least one artifact being discussed during the incident came from source other than this clean commit.

The strongest confirmed historical cause of the homepage symptom is commit `fd2ac52`/its source commit `aace93b`: its router ran the premium access gate for **every authenticated route**, including `/` and reader routes. Current commit `d58fb28d2781eeb73f34cae04f510b6b600da978` limits the check to the three account routes. Thus any origin still serving the prior bundle will show the trial offer on the homepage for an authenticated nonpremium user, while the current source will not.

The “button does nothing / no Function request in tail” symptom occurs before Stripe when the browser is not running the expected bundle, when a current access render has not yet attached the final listener, or when the authenticated session/token is absent. The checked-in handler does attach to a real `type="button"`, calls `POST /api/stripe/create-checkout` with `Authorization: Bearer <access token>`, consumes `{ url }`, and shows a generic inline error on failure. However, it deliberately swallows the underlying exception, has no click diagnostic, request ID, or safe Function logging, and the Functions catch all server exceptions without logging them. Those choices make each pre-request and server-side failure indistinguishable in production.

A complete production comparison could not be performed from this environment: the checkout has no Git remote, Wrangler is unauthenticated, and the outbound proxy returned 403 before reaching both public domains. Consequently deployment IDs, production branch, custom-domain attachment, Worker-route conflicts, live headers, and live bundle filenames remain unknown rather than assumed.

# Confirmed Findings

## 1. Critical — the described build marker and checkout click diagnostic are absent

- **Affected system:** local source and freshly generated `dist/assets/main-B6YwXu-w.js`.
- **Evidence:** `rg -F` found no `DOKU BUILD CHECK` or `[checkout] button clicked` in source or `dist`. It did find `[router] rendering`, `/api/stripe/create-checkout`, and `Start my 7-day free trial` in `main-B6YwXu-w.js`.
- **Reproduction:** run `npm run build`, then run the five fixed-string searches documented under Test Results.
- **Impact:** this commit can never display the marker or click log. Absence of those messages in a browser is not, by itself, evidence that startup stopped. It does prove that a browser bundle containing those exact strings is not this freshly built artifact.

## 2. Critical — the previous premium gate replaced public pages for any signed-in nonpremium account

- **Affected file/system:** the parent of `d58fb28`, `src/page/page.js` at commit `fd2ac52`.
- **Evidence:** `git show d58fb28^:src/page/page.js` shows `if (state.status === "authenticated")` followed by `subscriptionView`, `fetchAccess`, and an early return when access is false, before the `home` and `legacy-reader` branches. Current `d58fb28` adds `premiumRequiredFor()` and gates only `account-profile`, `account-bookmarks`, and `account-settings`.
- **Reproduction:** build/deploy `fd2ac52`, restore an authenticated subscriber-role session whose subscription is inactive/missing, and visit `/` or `/?work=...&chapter=...`; the offer replaces the intended page. With current `d58fb28`, source inspection proves `Landing.start()` and `Reader.start()` occur without `fetchAccess()` on those routes.
- **Impact:** this exactly explains the reported premium page on `/` if production/custom-domain HTML refers to the old bundle.

## 3. High — local checkout chain is internally consistent, but client errors are intentionally opaque

- **Affected files:** `src/account/views.js`, `src/account/subscription.js`, and `functions/api/stripe/create-checkout.js`.
- **Evidence:** `subscriptionView()` inserts `.subscribe-button` with `type="button"`, queries it, and attaches one click listener. The listener calls `createCheckout()`. `api()` requires `getAuthState().session.access_token`, uses relative `fetch`, adds the bearer header, parses JSON, and throws on non-2xx. The Function returns `{ url: session.url }`; the browser reads `result.url` and calls `location.assign(result.url)`.
- **Reproduction:** inspect those three functions or run the existing checkout Function tests. The test “subscriber without a subscription receives a Checkout URL” passes.
- **Impact:** there is no response-shape mismatch. But `subscriptionView` catches without an error binding and exposes only “Checkout could not be opened”; `create-checkout.js` also catches without logging. Missing token, 401, 403, configuration failure, Supabase failure, Stripe failure, invalid JSON, and network failure look almost identical.

## 4. High — no frontend click event can appear in `wrangler pages deployment tail`

- **Affected system:** observability expectations.
- **Evidence:** `[router] rendering` is in browser code. Pages deployment tail observes Pages Function/Worker execution, not JavaScript executing in a visitor's browser. Build output is emitted by Vite, and deployment output by Wrangler; these are four separate log sources.
- **Reproduction:** open browser DevTools Console for frontend logs; tail a deployment while calling `/api/account/access` for Function logs. A click that never reaches `fetch` cannot create a Function invocation.
- **Impact:** lack of a POST in tail narrows the failure to the browser side, the wrong tailed deployment, or observation mismatch; it does not say whether a browser `console.log` executed.

## 5. High — production deployment state is not represented or queryable from this checkout

- **Affected system:** Git/Cloudflare provenance.
- **Evidence:** branch is `work` at `d58fb28`; `git remote -v`, tags, other branches, and tracked `dist` are empty. Wrangler reports “You are not authenticated”; project/deployment/secret listing commands fail for lack of `CLOUDFLARE_API_TOKEN`. Both public curls fail at the environment's CONNECT proxy with HTTP 403.
- **Reproduction:** run the Git, Wrangler, and curl commands in Test Results.
- **Impact:** this environment cannot prove what GitHub `main`, the newest Pages deployment, `pages.dev`, or `9127000.xyz` serves. The reported source/deployment mismatch remains plausible but not confirmed here.

## 6. High — `wrangler.jsonc` is a Workers-assets configuration, not valid Pages project configuration

- **Affected file/system:** `wrangler.jsonc` and Pages CLI configuration discovery.
- **Evidence:** it names `beep-boop-hentai`, uses `assets.directory: ./dist`, and configures SPA handling. `wrangler pages secret list` explicitly warns that Pages ignores it because `pages_build_output_dir` is missing.
- **Reproduction:** run `npx wrangler pages secret list --project-name=doku-doujins-premium`.
- **Impact:** `npx wrangler deploy` would target a differently named Worker architecture, whereas `wrangler pages deploy dist --project-name=doku-doujins-premium` targets Pages. Confusing these commands can produce an apparently successful upload that is unrelated to the custom-domain Pages project. The SPA setting in this file is not proof of production Pages fallback behavior.

## 7. Medium — current startup correctly waits for session restoration

- **Affected files:** `src/main.js`, `src/auth/session.js`, `src/auth/supabase.js`.
- **Evidence:** `boot()` awaits `initializeAuth()` before `Page.start()`. Initialization creates the singleton Supabase client, installs `onAuthStateChange`, awaits `auth.getSession()`, and publishes the resulting session. Client options explicitly enable `persistSession`, refresh, and URL-session detection. The expected Supabase project URL is present in the generated session chunk (the publishable value was not printed).
- **Reproduction:** inspect source and build output.
- **Impact:** current source does not make an initial protected-route decision while auth state is still loading. A slow restoration delays routing instead. Exceptions are caught and produce the visible startup error state. A deployed older/different bundle or origin-separated storage can still account for observed authentication behavior.

## 8. Medium — OAuth return origin and session storage are origin-dependent

- **Affected system:** `continueWithGoogle()` and browser storage.
- **Evidence:** OAuth `redirectTo` is constructed from `window.location.origin`; allowed paths are limited to the three account routes. Supabase's browser client persists the session using browser storage. `https://9127000.xyz` and `https://doku-doujins-premium.pages.dev` are different origins.
- **Reproduction:** inspect `oauthRedirectUrl()` and Supabase client options; in DevTools compare Application → Local Storage for each origin.
- **Impact:** a session established on `pages.dev` is not available to JavaScript on `9127000.xyz` because localStorage, cookies, and related browser state are origin-scoped. Mixing origins during a login test creates an apparent failed restoration even when both deployments are correct. Supabase must allow the exact redirect URL, and testing should use only the canonical custom domain.

## 9. Medium — the render-generation guard prevents stale access results from replacing newer routes

- **Affected file:** `src/page/page.js`.
- **Evidence:** every render increments `generation`; post-await access error/offer DOM updates occur only when `renderId === generation`. Auth subscription rerenders only when the user ID changes. Startup's immediate subscription notification has `identityChanged: false`.
- **Reproduction:** inspect `render()`, `rerender()`, and `Page.start()`.
- **Impact:** the specific conjecture “old access request finishes and overwrites a newer route” is guarded in current source. The offer is intentionally rendered twice on a normal unpaid account request—once while checking, once with the enabled button—but the final button receives a listener. A click during the preliminary request is impossible because the preliminary view is also a clickable offer when `verifying` is false; this preliminary button has a listener, but it can be replaced when `fetchAccess()` resolves. That creates a narrow interaction race: a click begun just as the node is replaced may operate on a detached button, although its already-dispatched handler still calls Checkout. No automated DOM test currently proves this behavior.

## 10. Medium — Pages Functions compile and the expected routes work locally

- **Affected system:** `functions/api` routing.
- **Evidence:** `npx wrangler pages dev dist --port 8788` reports “Compiled Worker successfully.” Local requests reached all four intended routes: unauthenticated `GET /api/account/access` returned JSON 401; POSTs reached checkout, portal, and webhook and returned their JSON 500 configuration errors because server env was intentionally not provided. `/`, `/login`, `/account/profile`, and reader paths returned SPA HTML 200.
- **Reproduction:** use the local commands in Test Results.
- **Impact:** file naming and import syntax do not prevent Function compilation. There is no `_routes.json` excluding `/api/*`, no static `/api` shadow, no `_redirects`, `_headers`, or service worker in the repository. Production presence still depends on deploying with Pages Functions included.

## 11. Medium — unsupported Function methods can fall through to SPA HTML

- **Affected system:** Pages routing/method handling.
- **Evidence:** only method-specific exports exist (`onRequestGet` or `onRequestPost`); local GET requests to each POST-only Stripe route returned `200 text/html` from SPA fallback, rather than JSON 405.
- **Reproduction:** `curl http://127.0.0.1:8788/api/stripe/create-checkout` while Pages dev runs.
- **Impact:** the real frontend uses POST, so this is not the reported click failure. It does make diagnostics and API contracts misleading and should be fixed with explicit method handlers or a shared API middleware/route policy.

## 12. Medium — server-side errors have no durable diagnostics

- **Affected files:** all four endpoint files.
- **Evidence:** every endpoint uses a bare `catch` and returns a generic JSON message. No endpoint logs request IDs, phase, upstream status, or safe Stripe error type.
- **Reproduction:** local POST to checkout without env returns generic 500, with no application diagnostic identifying `SITE_URL`/price configuration.
- **Impact:** even when tail is attached to the correct deployment, a reached endpoint provides little evidence beyond its status and generic response.

## 13. Medium — checkout eligibility has several intentional blockers

- **Affected file/system:** `create-checkout.js` and production data/config.
- **Evidence:** Checkout stops on missing `SITE_URL`/price (500), absent/invalid bearer user (401 after env validation), any role other than `subscriber` (403), premium statuses `trialing`/`active` (200 `alreadySubscribed`), missing service/Stripe configuration (500), Supabase failures (500), Stripe customer/session failure (500), or a returned Stripe session without URL (browser generic error). Staff/legacy roles return `bypass` rather than a URL.
- **Reproduction:** existing tests exercise subscriber, premium, inactive, unknown/missing role, invalid token, trial/payment fields, and response URL.
- **Impact:** role provisioning is a prerequisite. The migration does create subscriber roles via a trigger, but whether it ran in production was not verifiable.

## 14. Low — current build succeeds but emits bundle warnings

- **Affected system:** Vite output.
- **Evidence:** Vite transformed 1,535 modules and generated `main-B6YwXu-w.js` (1,703.76 kB; 318.28 kB gzip), with warnings about an ineffective dynamic import and a chunk larger than 500 kB.
- **Reproduction:** `npm run build`.
- **Impact:** these are performance/deployment warnings, not proof of the checkout failure. The large bundle can delay startup on slow clients but no syntax/build exception occurred.

# Likely Findings

The following are inferences, not facts proven against production.

1. **Most likely:** `9127000.xyz` served an older deployment containing the global premium gate. This matches the exact homepage behavior and the known difference between `fd2ac52` and `d58fb28`, but live assets could not be fetched.
2. **Very likely:** the incident mixed artifacts from different working trees/deployments. The claimed build marker was reportedly in some `dist`, but it is absent from the clean source and fresh `dist` here; there is no remote or tracked build artifact that ties that marker to a commit.
3. **Likely:** testing across both domains produced apparently missing auth. Supabase browser persistence does not cross origins, and OAuth constructs a return using the initiating origin.
4. **Possible:** the tail was attached to an older/non-serving deployment. Deployment IDs could not be listed, so this cannot be distinguished from “the browser never issued fetch.”
5. **Possible:** custom-domain routing points to another Pages project/Worker or cached HTML. The inconsistent `wrangler.jsonc` name increases operational risk, but DNS, Cloudflare routes, cache, and domain attachment were inaccessible.
6. **Possible:** production role/configuration prevents Checkout after a real POST. Those failures would return a visible generic error, not literally no browser request. They cannot explain absence of the request in a correctly attached tail unless tail selection is wrong.
7. **Less likely in current source:** startup/auth race, malformed source, or stripped logging. Build succeeds, startup awaits auth, console calls remain in production output, and imports are live. These could still characterize a different deployed bundle.

# Complete Request Flow

1. **HTML and startup:** Cloudflare Pages should return `index.html`; its module scripts load `session-*.js` and `main-*.js`. `src/main.js` starts ghost text, awaits authentication initialization, then awaits `Page.start()`, starts the footer, and marks the page ready. Startup exceptions are caught, logged in the browser, and replace the reader container with an error.
2. **Supabase initialization:** `getSupabase()` dynamically imports `@supabase/supabase-js` only when `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` were embedded at build time. It creates one client with persistence, token refresh, and URL detection. `initializeAuth()` subscribes to auth events and calls `getSession()` before routing.
3. **Login:** email login calls `signInWithPassword`. Google login calls `signInWithOAuth` (after signing out a durable existing user); its `redirectTo` is the current origin plus a safe account route. Supabase/Google return to that origin. The URL callback is processed by Supabase's URL detection during initialization. Current code does not explicitly strip callback parameters before initialization.
4. **Routing:** `resolveRoute()` recognizes `/`, auth pages, three account pages, `/account` redirect, and any query containing both `work` and `chapter` as a legacy reader. Unknown account paths and general unknown paths get distinct 404 views. Only account profile/bookmarks/settings are private and premium-required in current `page.js`.
5. **Access check:** on an authenticated premium-required route, `subscriptionView()` is rendered and `fetchAccess()` calls `GET /api/account/access` with the browser access token. The Function validates the user against Supabase Auth using service-role API access, reads `user_roles`, reads `subscriptions` only for subscribers, and computes premium access. Staff and legacy bypass Stripe; subscribers qualify only in `trialing` or `active`.
6. **Offer and click:** a false access result causes a final `subscriptionView()`. It creates `.subscribe-button`, `type="button"`, and attaches a direct click listener. Router click interception applies only to `a[data-route]`, so it does not intercept the button. CSS gives the button normal pointer behavior; no matching disabled overlay was found on account pages.
7. **Browser API call:** click disables the button, updates status, and invokes `createCheckout()` exactly once in that handler. `api()` verifies an access token exists, then performs relative-origin `POST /api/stripe/create-checkout` with the bearer header. Non-2xx or parse/network errors throw; the view re-enables the button and displays a generic error.
8. **Checkout Function:** it validates `SITE_URL` and `STRIPE_PREMIUM_PRICE_ID`, authenticates the token, requires role `subscriber` unless bypass, and returns `alreadySubscribed` for `trialing`/`active`. It loads/reuses a Stripe customer or creates one and upserts its ID. It creates a subscription Checkout Session with the configured price, quantity one, payment method always required, seven trial days, user metadata, success URL `/account/profile?checkout=success`, and cancellation URL `/account/profile?checkout=cancelled`. It returns `{ url }`.
9. **Stripe navigation:** browser `location.assign(result.url)` leaves the site for Stripe-hosted Checkout. Bypass/already-subscribed responses cause reload instead.
10. **Success return:** Stripe returns the browser to the configured canonical `SITE_URL`. The profile route sees `checkout=success`, shows verification, and polls `/api/account/access` up to ten times at 1.5-second intervals. Once premium is true, it removes the query by navigating to the pathname and renders profile. Cancellation is not specially displayed; it performs a regular access check and shows the offer again.
11. **Webhook:** Stripe independently POSTs the raw event to `/api/stripe/webhook`. The Function checks the timestamped HMAC signature (five-minute tolerance), validates shape, rejects already recorded IDs, retrieves authoritative subscription data when required, maps the Supabase user from metadata/client reference/customer, upserts customer/subscription/status/price/trial/period/cancellation fields, records the event ID, and returns `{ received: true }`.
12. **Premium unlock and portal:** `trialing` or `active` then unlocks account routes. Profile shows Manage Subscription only when `hasStripeCustomer`; portal POST validates the user, finds the customer, creates a Stripe Billing Portal session, and returns `{ url }` for navigation.

# Deployment Comparison

| Layer | Proven state | Missing evidence |
|---|---|---|
| Local source | Clean `work` branch initially at `d58fb28d2781eeb73f34cae04f510b6b600da978`; current premium-only-account patch committed. No marker/click diagnostic. | Whether this checkout equals the developer's `~/dev` checkout. The supplied environment path is `/workspace/doku-doujins-premium`. |
| GitHub `main` | Not queryable: no Git remote is configured. Commit history contains merged subscription work and the later local commit. | Remote main SHA and whether it includes `d58fb28`; intended `views.js` diagnostic changes cannot be confirmed. `d58fb28` changes `page.js`; its `views.js` is unchanged from parent. |
| Local `dist` | Fresh build references `preload-helper-CZgWQFsJ.js`, `session-B_9fpqxS.js`, `main-B6YwXu-w.js`, and `main-BQxn9zp9.css`. `dist` is gitignored/untracked. | It cannot establish what was previously uploaded. |
| Latest preview | Unknown; Wrangler credentials absent. | ID, commit, branch, URL, assets, Functions. |
| Latest production | Unknown; Wrangler credentials absent. | ID, production branch, commit, assets, Functions, variables/secrets. |
| `pages.dev` | Outbound CONNECT blocked with proxy 403 before origin. | Status from origin, headers, bundle, marker, redirects, cache. |
| `9127000.xyz` | Outbound CONNECT blocked with proxy 403 before origin. | DNS/TLS at origin, domain attachment, route conflicts, headers, bundle, marker, cache. |

Because `dist` is ignored, a local build can differ from both Git and every deployment without appearing in `git status`. The only reliable comparison is to record the commit before building, record the generated asset filename/hash, deploy that exact directory, obtain the deployment ID/URL, and fetch the HTML and asset independently through all hostnames.

# Test Results

- `git status --short`: initially clean; after build only ignored `dist`/`node_modules` existed; Wrangler temporarily created `.wrangler`, which was removed.
- `git branch --show-current`: `work`.
- `git log -n 10 --oneline --decorate`: HEAD `d58fb28`; subscription merge `fd2ac52`; subscription source `aace93b`; earlier auth/account commits listed.
- `git diff --stat` and `git diff`: empty initially.
- `git remote -v`: no output; no remote configured.
- `git tag --sort=-creatordate | head -n 10`: no tags.
- `node --version`: `v24.15.0`.
- `npm --version`: `11.4.2`, with warning that `http-proxy` npm config will be unsupported in a future major version.
- `npm ci`: passed; added 156 packages; 48 packages reported funding information.
- `npm test`: passed **53/53**, 0 failed/skipped/cancelled/todo, duration about 3.40 seconds.
- `npm run build`: passed; Vite 8.1.0 transformed 1,535 modules. It warned about the ineffective dynamic import in discussion Supabase code and the >500 kB main chunk.
- Bundle searches: marker absent; checkout-click diagnostic absent; router diagnostic, API path, and offer text present.
- `npx wrangler whoami`: command exited 0 but stated unauthenticated.
- Pages project/deployment/secret list commands: failed because no API token. Secret values were never requested or printed. Secret-list also proved the Pages config warning.
- Production curl/TLS/DNS attempts: blocked by the environment proxy (HTTP 403 CONNECT); no origin claim is made.
- `npx wrangler pages dev dist --port 8788`: passed compilation; all four Function route files compiled.
- Local SPA curls: `/`, `/login`, `/account/profile`, `/reader?work=A&chapter=chapter_1`, and root reader query returned HTML 200.
- Local API curls: access GET returned 401 JSON; the three POST routes returned generic JSON 500 because production env was intentionally not supplied; wrong-method GETs to POST endpoints fell through to SPA HTML 200.
- Browser automation: unavailable—no Chromium/Firefox executable and no Playwright/Puppeteer/jsdom package. No authenticated production browser claim is made.

The current suite proves backend access rules, Checkout `{ url }`, trial/payment parameters, webhook signature/status handling, route parsing, OAuth safe-return construction, and auth singleton ownership. It does **not** prove required cases A–G at the DOM/runtime level: authenticated unpaid `/` rendering, account offer rendering, exactly-one click call, actual location navigation, useful API error detail, auth rerender listener stability, and public reader rendering. Case H is partially proven by backend tests for successful `{ url }`, bypass, already-subscribed, 403, and 401 responses, but unsupported methods and untested server failures are not a single consistent schema/status contract.

# Root-Cause Ranking

1. **Older/wrong bundle on the custom domain**, specifically one with the pre-`d58fb28` global gate.
2. **Unproven artifact provenance** among source, ignored `dist`, branch/commit, Wrangler upload, and Pages production.
3. **Observation mismatch**: frontend console was expected in Pages Function tail and/or tail targeted a different deployment.
4. **Cross-origin authentication testing** between `pages.dev` and `9127000.xyz`.
5. **Opaque browser/server error handling**, hiding the exact checkout failure stage.
6. **Cloudflare project/config confusion** between Worker `beep-boop-hentai` config and Pages project `doku-doujins-premium`.
7. **Production role/env/Stripe/Supabase inconsistency** after a real POST (possible, not evidenced here).
8. **Current render race or startup exception** (not supported by static/build evidence, but missing browser DOM tests prevent total exclusion).

# Unknowns

- GitHub `main` SHA and contents, because no remote exists and public network access is blocked.
- Cloudflare production/preview IDs, branches, aliases, variables, secret names, domain attachments, Worker routes, and tail target, because Wrangler is unauthenticated.
- The latest generated deployment URL, so it could not be curled.
- Live HTML, bundle names/content, cache headers, redirects, DNS answers, or certificates for either public hostname, because the proxy denied CONNECT.
- Whether Supabase dashboard Site URL/redirect allowlist and Google provider callback are correct.
- Whether the production subscription migration ran, the user has role `subscriber`, and the subscription/customer rows are correct.
- Whether Stripe key, price, and webhook secret are all test-mode and from one account; dashboards/secrets were not accessed.
- Whether Stripe delivered production test webhook events successfully.
- Whether a Cloudflare Worker/wildcard route captures the custom hostname.
- Browser console/network evidence from the affected session. Automation was unavailable and no credentials were used.
- Whether the previously observed marker came from uncommitted work that is not in this checkout.
