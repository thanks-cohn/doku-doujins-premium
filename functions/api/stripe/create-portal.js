import { json, requiredEnv } from "../_shared/access.js";
import { getSubscription, requireUser } from "../_shared/supabase.js";
import { stripeRequest } from "../_shared/stripe.js";
export async function onRequestPost({ request, env }) {
  try {
    requiredEnv(env, ["SITE_URL"]); const auth = await requireUser(request, env); if (auth.response) return auth.response;
    const subscription = await getSubscription(env, auth.user.id);
    if (!subscription?.stripe_customer_id) return json({ error: "No subscription customer exists." }, 404);
    const session = await stripeRequest(env, "billing_portal/sessions", { customer: subscription.stripe_customer_id, return_url: env.SITE_URL });
    return json({ url: session.url });
  } catch { return json({ error: "The subscription portal could not be opened." }, 500); }
}
