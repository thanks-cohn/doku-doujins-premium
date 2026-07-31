import { accessFor, BYPASS_ROLES, json, PREMIUM_STATUSES, requiredEnv } from "../_shared/access.js";
import { getRole, getSubscription, requireUser, upsertSubscription } from "../_shared/supabase.js";
import { stripeRequest } from "../_shared/stripe.js";
export async function onRequestPost({ request, env }) {
  try {
    requiredEnv(env, ["SITE_URL", "STRIPE_PREMIUM_PRICE_ID"]);
    const auth = await requireUser(request, env); if (auth.response) return auth.response;
    const role = await getRole(env, auth.user.id);
    if (BYPASS_ROLES.includes(role)) return json({ bypass: true, access: accessFor(role) });
    if (role !== "subscriber") return json({ error: "This account is not eligible for Checkout." }, 403);
    let subscription = await getSubscription(env, auth.user.id);
    if (PREMIUM_STATUSES.includes(subscription?.status)) return json({ alreadySubscribed: true, access: accessFor(role, subscription) });
    let customerId = subscription?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripeRequest(env, "customers", { "metadata[supabase_user_id]": auth.user.id, ...(auth.user.email ? { email: auth.user.email } : {}) });
      customerId = customer.id;
      await upsertSubscription(env, { user_id: auth.user.id, stripe_customer_id: customerId, status: subscription?.status || "inactive", updated_at: new Date().toISOString() });
    }
    const base = env.SITE_URL.replace(/\/$/, "");
    const session = await stripeRequest(env, "checkout/sessions", {
      mode: "subscription", customer: customerId, payment_method_collection: "always",
      "line_items[0][price]": env.STRIPE_PREMIUM_PRICE_ID, "line_items[0][quantity]": "1",
      "subscription_data[trial_period_days]": "7", "subscription_data[metadata][supabase_user_id]": auth.user.id,
      client_reference_id: auth.user.id, "metadata[supabase_user_id]": auth.user.id,
      success_url: `${base}/account/profile?checkout=success`, cancel_url: `${base}/account/profile?checkout=cancelled`
    });
    return json({ url: session.url });
  } catch { return json({ error: "Checkout could not be created." }, 500); }
}

