# Stripe premium subscription setup

## Production configuration

Cloudflare Production must define `SITE_URL`, `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. Store secret and service-role keys as **encrypted secrets**, never plaintext variables. None of these names may use the `VITE_` prefix. The browser still needs its existing `VITE_SUPABASE_URL` and publishable key.

Apply `supabase/migrations/202607310001_premium_subscriptions.sql` before enabling traffic. It creates subscriber defaults without replacing an existing role, subscription RLS, and webhook idempotency storage. A future invitation system belongs in trusted server code: validate dynamic, expiring, single-use codes and map each code to a predetermined staff role; never let a browser select the role.

After the first deployment, the exact endpoint is:

`https://beep-boop-hentai.pages.dev/api/stripe/webhook`

If `SITE_URL` uses a production custom domain, use that origin plus `/api/stripe/webhook` instead. The endpoint must use the same deployed Cloudflare Pages project; do not use a workers.dev URL for this Pages application. This implementation was not deployed from the development environment, so verify the chosen endpoint before registering it in Stripe.

In Stripe Workbench/Webhooks, create a destination for the exact production endpoint and select:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `invoice.paid`
- `invoice.payment_failed`

Reveal that destination's signing secret once, then add it to Cloudflare Production as the encrypted secret `STRIPE_WEBHOOK_SECRET` (Dashboard: Workers & Pages → project → Settings → Variables and Secrets → Add → Encrypt). Redeploy after adding it. Never paste it into source, logs, screenshots, tests, or frontend configuration.

## Test mode and local development

1. Use a recurring test-mode Price representing USD $5/month and set its ID only as `STRIPE_PREMIUM_PRICE_ID`.
2. Use test-mode `STRIPE_SECRET_KEY` and keep Stripe CLI output out of saved logs.
3. Run `npm install`, then `npm run build` and `npx wrangler pages dev dist` so Pages Functions and assets run together. Provide local secrets through an untracked `.dev.vars` file.
4. Forward Stripe CLI events to `http://localhost:8788/api/stripe/webhook`; put the temporary CLI signing secret in untracked `.dev.vars` as `STRIPE_WEBHOOK_SECRET`.
5. Sign in with a test Supabase user, begin Checkout, and use Stripe's standard success card `4242 4242 4242 4242`, any future expiry, any CVC, and a valid postal code. Confirm no immediate trial charge, then use Stripe test clocks/events to verify renewal and failure behavior.

## Billing Portal and deployment

In Stripe Dashboard test mode, configure the Billing Portal to allow payment-method changes and cancellation. Repeat that configuration separately in live mode. Deploy through the existing Cloudflare Pages project after building; verify the webhook route returns an HTTP signature error (not an asset/404) when called without a signature, then create the webhook destination and encrypted secret as above.

To switch safely to live mode, create/confirm the live $5 monthly Price, replace only Cloudflare's encrypted/live Production values (`STRIPE_SECRET_KEY`, `STRIPE_PREMIUM_PRICE_ID`, and the live endpoint's `STRIPE_WEBHOOK_SECRET`), configure the live Portal, redeploy, and perform one low-risk live Checkout. Test and live customers, Prices, endpoint secrets, and subscriptions are separate. Never expose secret keys or the Supabase service-role key.

The one-month grace period is intentionally not implemented; `grace_period_ends_at` is reserved for a later policy.
