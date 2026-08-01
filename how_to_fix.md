# Repair Strategy

Repair provenance and observability before changing behavior. First preserve the exact current source and deployment metadata. Next add focused tests that reproduce the required browser behaviors. Apply only the smallest routing/session/checkout diagnostics changes those tests require. Build once from a named commit, deploy that exact `dist` as a **Pages production** deployment, and compare the generated URL, `pages.dev`, and the custom domain byte-for-byte. Only after the frontend POST is visible should Stripe/Supabase production-test configuration be investigated.

Do not rotate, print, export, or commit secrets; do not edit production rows; and do not create a live-mode charge.

# Phase 1: Preserve Current State

Run from the real developer checkout. These commands do not reset or overwrite work:

```bash
cd ~/dev/doku-doujins-premium
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
git status --short | tee "../doku-status-$STAMP.txt"
git diff --binary > "../doku-worktree-$STAMP.patch"
git diff --cached --binary > "../doku-index-$STAMP.patch"
git ls-files --others --exclude-standard -z \
  | tar --null -T - -czf "../doku-untracked-$STAMP.tgz"
git branch "backup/production-diagnosis-$STAMP" HEAD
git tag -a "diagnosis-$STAMP" -m "State before production repair" HEAD
git rev-parse HEAD | tee "../doku-head-$STAMP.txt"
git log -n 10 --oneline --decorate | tee "../doku-log-$STAMP.txt"
```

If policy forbids adding backup refs, omit branch/tag creation but keep the external patch/archive. Capture Cloudflare state read-only (JSON files may contain account/deployment metadata, so store them outside Git and review before sharing):

```bash
npx wrangler whoami | tee "../cf-whoami-$STAMP.txt"
npx wrangler pages project list --json > "../cf-projects-$STAMP.json"
npx wrangler pages deployment list \
  --project-name=doku-doujins-premium --environment=production --json \
  > "../cf-production-$STAMP.json"
npx wrangler pages deployment list \
  --project-name=doku-doujins-premium --environment=preview --json \
  > "../cf-preview-$STAMP.json"
npx wrangler pages secret list \
  --project-name=doku-doujins-premium \
  > "../cf-secret-names-$STAMP.txt"
```

Also record screenshots of Pages → Custom domains, Pages → Deployments, and Workers & Pages → routes. Do not screenshot secret values.

# Phase 2: Source Fixes

No application fix was applied during diagnosis. Apply these as separate, reviewable commits after adding tests.

## 2.1 Lock the public/premium route policy with behavior tests

- **File/function:** `src/page/page.js`, `premiumRequiredFor()` and `render()`.
- **Reason:** current source has the correct narrow gate, but existing tests only test route parsing, not rendered behavior. Prevent regression to the old global gate.
- **Focused policy:** keep `premiumRequiredFor()` limited to the explicit account set. Do not fetch access merely because a visitor is authenticated.

```diff
 const PREMIUM_ROUTE_KINDS = new Set([
   "account-profile",
   "account-bookmarks",
   "account-settings"
 ]);
 const premiumRequiredFor = route => PREMIUM_ROUTE_KINDS.has(route.kind);
```

Use dependency injection or a small exported render-policy helper rather than a broad router rewrite. Tests must prove:

- authenticated/nonpremium `/` calls `Landing.start()` and never `fetchAccess()`;
- public legacy reader calls `Reader.start()` and never `fetchAccess()`;
- authenticated/nonpremium profile calls access and ends at the offer.

## 2.2 Avoid binding a transient checkout button before access resolves

- **File/function:** `src/page/page.js`, premium branch.
- **Reason:** current code calls the normal clickable `subscriptionView()` before `fetchAccess()` and then replaces the node after resolution. Generation guards stale completions, but a stable loading state is easier to reason about and test.
- **Focused diff:** render a non-clickable verifying/loading state during every access request; render the offer once only after a current false result.

```diff
- subscriptionView(root(), { verifying: checkoutReturn });
+ subscriptionView(root(), { verifying: true });
  const access = checkoutReturn ? await pollForPremium() : await fetchAccess();
  if (!access?.hasPremiumAccess && renderId === generation) {
    subscriptionView(root());
  }
```

Test that the final `.subscribe-button` node remains connected after access settles and after a same-identity auth notification; a stale request must not replace it.

## 2.3 Preserve useful frontend error information safely

- **File/function:** `src/account/subscription.js`, `api()`; `src/account/views.js`, `subscriptionView()`.
- **Reason:** all failures collapse to one message and lose status/request ID.
- **Focused replacement shape:** define `SubscriptionApiError` containing only status, safe server code, and request ID. Never retain or log the bearer token.

```js
const requestId = crypto.randomUUID();
const response = await fetch(path, {
  ...options,
  headers: {
    ...options.headers,
    authorization: `Bearer ${token}`,
    "x-request-id": requestId
  }
});
const body = await response.json().catch(() => ({}));
if (!response.ok) {
  throw new SubscriptionApiError(
    body.error || "Subscription request failed.",
    { status: response.status, code: body.code, requestId: body.requestId || requestId }
  );
}
```

In the view, show a useful category and short reference, for example: “Your session expired; log in again (reference ab12cd34)” for 401; eligibility for 403; retry for 5xx/network. Log only `{ status, code, requestId }`. Add tests for non-JSON, 401, 403, 500, and offline failure.

## 2.4 Make API methods explicit

- **Files/functions:** all endpoint files or `functions/api/_middleware.js`.
- **Reason:** wrong methods currently fall into SPA HTML 200 locally.
- **Focused implementation:** add `onRequest` dispatch or method-mismatch exports that return JSON 405 with `Allow`. Keep the existing GET/POST handlers unchanged.

```js
export function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ error: "Method not allowed.", code: "method_not_allowed" }, 405, {
      Allow: "POST"
    });
  }
  return createCheckout(context);
}
```

Extend `json()` to accept additional headers without losing `no-store`. Test every endpoint's allowed and rejected method/content type.

## 2.5 Add a build identity that is tied to Git

- **Files/functions:** Vite config and a minimal startup diagnostic/UI metadata location.
- **Reason:** a hand-written timestamp marker does not prove commit/deployment identity.
- **Focused design:** inject `VITE_BUILD_SHA`/`VITE_BUILD_ID` from CI or `git rev-parse --short=12 HEAD`; expose it as a meta tag and one production-safe console line. Do not put secrets or environment values in it.

```js
// vite.config.js
const buildSha = process.env.CF_PAGES_COMMIT_SHA || process.env.VITE_BUILD_SHA || "local";
export default defineConfig({ define: { __DOKU_BUILD_SHA__: JSON.stringify(buildSha) }, /* existing build */ });
```

```js
console.info("[build]", { sha: __DOKU_BUILD_SHA__ });
```

Test that `dist/index.html` or the main bundle contains the expected SHA supplied to the build.

# Phase 3: Authentication and Routing

1. Keep `/`, reader query URLs, login/signup/reset pages, and ordinary browsing public. Being authenticated must not imply premium gating.
2. Keep authentication required for `/account/profile`, `/account/bookmarks`, and `/account/settings`. If only some account features should be premium, refine this explicit set rather than introducing a global check.
3. Await `initializeAuth()` before `Page.start()` as current source does. Add a test with a deferred `getSession()` proving the router does not decide/redirect until it resolves.
4. Preserve `detectSessionInUrl: true`; do not call `history.replaceState`, router navigation, or callback cleanup until Supabase completes `getSession()` and emits the recovered session/error.
5. Canonicalize OAuth to the production origin. Prefer an injected public `VITE_SITE_URL=https://9127000.xyz` validated against an allowlist, or redirect noncanonical hosts before login. Do not silently return production users to whichever preview origin happened to initiate login.

```js
const CANONICAL_ORIGIN = import.meta.env.VITE_SITE_URL || window.location.origin;
export function oauthRedirectUrl(path) {
  return new URL(safeOAuthReturnPath(path), CANONICAL_ORIGIN).href;
}
```

6. In Supabase Authentication → URL Configuration set Site URL to `https://9127000.xyz`. Add exact required redirect URLs such as `https://9127000.xyz/account/profile`, bookmarks/settings if used, login confirmation, and reset password. Add `pages.dev` only for an intentional separate fallback test; never mix origins in one login run.
7. Remember: localStorage, IndexedDB, cookies, and service workers are origin-specific. A Supabase session saved under `pages.dev` is not readable under `9127000.xyz`. Sign out/clear storage on both origins, then test solely on the custom domain in a clean browser profile.
8. Map return URLs explicitly:
   - OAuth default: `/account/profile`;
   - email confirmation: `/login?next=/account/profile` (or another allowed account route);
   - password reset: `/reset-password`;
   - Checkout success: `/account/profile?checkout=success`;
   - Checkout cancel: `/account/profile?checkout=cancelled`.
9. Add a visible cancellation status rather than silently returning to the same offer.

# Phase 4: Checkout Diagnostics

Use one correlation ID end-to-end:

1. Browser generates UUID, sends `x-request-id`, and may log only event name, route, status, safe code, and truncated request ID. Never log authorization headers, access tokens, email, Stripe customer IDs, or response bodies containing sensitive fields.
2. The Function validates an inbound UUID or creates its own, returns it in `x-request-id` and JSON error bodies, and logs structured phase events:

```js
console.info(JSON.stringify({
  event: "checkout_request",
  requestId,
  phase: "stripe_session_created",
  status: 200
}));
```

3. Log failures as `{ event, requestId, phase, status, upstreamStatus, stripeType }`. Stripe's safe error `type`/HTTP status can be used; do not log raw Stripe messages, request bodies, keys, tokens, email, or IDs.
4. Recommended HTTP responses:
   - 400 malformed request/signature;
   - 401 missing/expired Supabase token;
   - 403 ineligible role;
   - 405 wrong method;
   - 409 already subscribed if the UI is changed to treat it explicitly (or retain 200 with the tested tagged union);
   - 422 invalid/mismatched configured price if safely detected;
   - 502 Stripe/Supabase upstream failure;
   - 500 missing server configuration/internal failure.
5. Use a documented tagged response contract:

```json
{ "kind": "checkout", "url": "https://checkout.stripe.com/...", "requestId": "..." }
{ "kind": "already_subscribed", "requestId": "..." }
{ "kind": "bypass", "requestId": "..." }
{ "error": "Checkout could not be created.", "code": "stripe_upstream", "requestId": "..." }
```

Validate that `url` is HTTPS and a Stripe Checkout hostname before navigation. Test each variant.
6. Add diagnostics at click entry **in the browser console**, request receipt **in Function logs**, and build/deployment identity separately. Never expect browser logs in `wrangler pages deployment tail`.

# Phase 5: Cloudflare Deployment

First resolve configuration ambiguity. For Pages CLI, use `pages_build_output_dir: "./dist"` in a Pages-appropriate config or deliberately use explicit flags and rename/remove the unrelated Worker config in a separately reviewed patch. Confirm the Pages project production branch in the dashboard (expected `main`). An explicit Pages deployment is:

```bash
git switch main
git pull --ff-only
git status --short
SHA=$(git rev-parse HEAD)
VITE_BUILD_SHA="$SHA" npm ci
VITE_BUILD_SHA="$SHA" npm test
VITE_BUILD_SHA="$SHA" npm run build
npx wrangler pages deploy dist \
  --project-name=doku-doujins-premium \
  --branch=main \
  --commit-hash="$SHA" \
  --commit-message="Production repair $SHA"
```

Check `npx wrangler pages deploy --help` against the installed version before relying on optional commit flags. `--branch=main` is production only when the Pages project's configured production branch is `main`; verify that setting rather than assuming it. A different branch produces preview.

After upload:

```bash
npx wrangler pages deployment list \
  --project-name=doku-doujins-premium --environment=production --json
```

Record deployment ID and generated URL. Compare exact HTML asset names:

```bash
for URL in \
  "https://<deployment-id>.doku-doujins-premium.pages.dev" \
  "https://doku-doujins-premium.pages.dev" \
  "https://9127000.xyz"; do
  echo "=== $URL ==="
  curl -fsSIL "$URL"
  HTML=$(mktemp)
  curl -fsSL "$URL" -o "$HTML"
  rg -o 'assets/[^" ]+\.js' "$HTML"
  rm "$HTML"
done
```

Fetch every referenced main script from each host and compare SHA-256 hashes and the injected build SHA:

```bash
curl -fsSL "https://9127000.xyz/assets/<main-file>.js" -o /tmp/custom-main.js
sha256sum dist/assets/<main-file>.js /tmp/custom-main.js
rg -F "$SHA" /tmp/custom-main.js
```

Confirm Pages → Custom domains attaches `9127000.xyz` to **doku-doujins-premium**, and review Workers Routes for `9127000.xyz/*` or wildcard zones that could supersede Pages. Purge Cloudflare cache only after proving stale cache, then hard-reload with DevTools Disable cache. Current repository contains no service worker; in DevTools Application → Service Workers verify none from an old deployment remains, and unregister if present. Keep HTML `Cache-Control: no-cache`/revalidate; hashed assets may be immutable.

Tail the exact newly recorded deployment if supported by the installed Wrangler version. Do not tail “latest” by guesswork.

# Phase 6: Stripe and Supabase Verification

## Supabase dashboard

- Authentication → URL Configuration: Site URL exactly `https://9127000.xyz`; exact redirect URLs include the OAuth/account and reset/confirmation returns actually used.
- Authentication → Providers → Google: enabled; Google client credentials belong to this project. Google's authorized redirect URI must be Supabase's provider callback URL, while Supabase's redirect allowlist contains the application return URLs.
- Project URL matches the expected project. Confirm only the public publishable key is embedded in Vite; service role exists only as an encrypted Cloudflare secret.
- Database migrations: verify premium tables, RLS, webhook event table, subscriber trigger, and role rows exist. Query read-only during diagnosis; do not hand-edit user roles/subscriptions to make a test pass.

## Stripe dashboard, test mode only

- Turn on **Test mode** before every check.
- The encrypted `STRIPE_SECRET_KEY` is a test key for the same Stripe account as the configured price.
- `STRIPE_PREMIUM_PRICE_ID` is a recurring USD $5/month test Price, active, in that account.
- Webhook endpoint is exactly `https://9127000.xyz/api/stripe/webhook` and subscribes to the events handled in code.
- Cloudflare `STRIPE_WEBHOOK_SECRET` is the signing secret for that exact test endpoint—not a Stripe CLI secret, live endpoint secret, old endpoint, or preview endpoint.
- Inspect a test delivery: request URL, timestamp, HTTP 200, `{ "received": true }`; on failure use the correlation ID and Function phase log. Retry the test event only after repair.
- Verify `SITE_URL` is exactly `https://9127000.xyz` and `SUPABASE_URL` is the intended project. Verify the three encrypted secret **names** and all three plain variable names in the **Production** Pages environment; preview values are separate.

# Phase 7: Smoke-Test Checklist

Use a clean browser context and only `https://9127000.xyz` for the main flow. Open DevTools with Preserve log and Disable cache.

- [ ] **Anonymous homepage:** `/` stays on the custom origin, renders Landing, has build SHA, no `/api/account/access`.
- [ ] **Anonymous reader:** a real `/?work=...&chapter=...` opens reader, no access request or trial offer.
- [ ] **Google login:** start at custom-domain `/login`; record Supabase/Google redirects; return to custom-domain account path; session appears after initialization with no repeated login.
- [ ] **Email login:** authenticate with a designated test account; return path is correct; never expose credentials in logs/screenshots.
- [ ] **Unpaid authenticated browsing:** `/` and a reader remain public; no forced offer.
- [ ] **Trial offer:** `/account/profile` issues one access GET and shows the enabled `.subscribe-button` only after false access.
- [ ] **Checkout click:** one click logs one browser correlation ID and creates exactly one POST in Network and exact Function tail.
- [ ] **Checkout response:** status 200 tagged response contains an HTTPS Checkout URL; browser navigates to Stripe test Checkout.
- [ ] **Checkout cancel:** cancel returns to custom-domain profile and shows cancellation state; no subscription unlock.
- [ ] **Checkout success:** use Stripe test payment method, not live data; return is `/account/profile?checkout=success`.
- [ ] **Webhook:** Stripe test delivery reaches the exact custom URL with 200 and matching correlation/event evidence.
- [ ] **Supabase row:** read-only verify the designated test user's subscription row becomes `trialing`, has expected test price, and no unrelated rows changed.
- [ ] **Premium unlock:** polling sees premium, removes checkout query, renders profile/bookmarks/settings.
- [ ] **Portal:** Manage Subscription creates one portal POST and navigates to a Stripe test portal; return goes to custom domain.
- [ ] **Sign out:** session clears and `/` remains public.
- [ ] **Hard refresh:** refresh `/`, reader, `/login`, and authenticated `/account/profile`; SPA HTML and routing work.
- [ ] **Custom-domain parity:** HTML references the recorded production asset and its SHA-256 equals the uploaded `dist` asset.
- [ ] **pages.dev fallback:** test separately in another clean context; confirm deployment parity. Do not use its session as evidence for custom-domain login.
- [ ] **Error path:** simulate a mocked/local 401 and 500; useful safe message/reference appears and button re-enables.
- [ ] **Race path:** deferred access plus auth notifications do not detach/replace the final active checkout node; exactly one request is emitted.

Manual DevTools evidence to capture when browser automation is unavailable: initial/final URL; Console errors and `[build]` line; Application storage origin and Supabase session presence (redact values); Network entries for access/checkout with authorization value hidden; status and safe response; Stripe navigation URL hostname; corresponding Function request ID. Never copy tokens.

# Rollback Plan

Rollback deployment separately from source. In Cloudflare Pages, select the preserved known-good production deployment and use the dashboard rollback action if available, then verify all three hostnames. Or rebuild/deploy the preserved commit:

```bash
cd ~/dev/doku-doujins-premium
git status --short
git switch --detach "diagnosis-$STAMP"
npm ci
VITE_BUILD_SHA=$(git rev-parse HEAD) npm test
VITE_BUILD_SHA=$(git rev-parse HEAD) npm run build
npx wrangler pages deploy dist \
  --project-name=doku-doujins-premium \
  --branch=main \
  --commit-hash="$(git rev-parse HEAD)" \
  --commit-message="Rollback to diagnosis-$STAMP"
```

Do not reset the repair branch. To restore preserved uncommitted content onto a new branch after confirming paths:

```bash
git switch -c "restore/production-diagnosis-$STAMP" "backup/production-diagnosis-$STAMP"
git apply "../doku-worktree-$STAMP.patch"
git apply --index "../doku-index-$STAMP.patch"
tar -xzf "../doku-untracked-$STAMP.tgz"
git status --short
```

If the tag/branch was not created, replace it with the SHA stored in `../doku-head-$STAMP.txt`. Do not change Stripe/Supabase secrets during a code rollback unless a separate, documented configuration rollback is required.

# Final Recommended Patch Order

1. Add DOM/runtime tests A–G and complete API contract/method tests H; make them fail for the correct reasons.
2. Preserve the explicit current premium route allowlist and loading/final-offer render behavior.
3. Add typed safe client errors, request IDs, structured Function phase logs, and explicit 405 JSON handling.
4. Add Git-derived build identity and provenance checks.
5. Clarify Pages configuration so Pages and Worker deployment commands cannot be confused.
6. Commit and push source; confirm remote `main` contains the exact patch.
7. Build once from that clean production commit; record asset filename and SHA-256.
8. Verify production variables/secret names and Stripe/Supabase test-mode dashboard configuration without exposing values.
9. Deploy explicitly to the configured Pages production branch; record deployment ID/generated URL.
10. Prove generated URL → `pages.dev` → `9127000.xyz` all reference the same bundle before testing auth.
11. Run the clean-context custom-domain checklist through test Checkout, webhook, premium unlock, and portal.
12. Keep the recorded prior deployment ready; rollback immediately if bundle parity or core public routes regress.
