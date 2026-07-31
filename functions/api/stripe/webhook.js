import { json, requiredEnv } from "../_shared/access.js";
import { findByCustomer, recordWebhook, upsertSubscription, webhookWasProcessed } from "../_shared/supabase.js";
import { stripeGet, verifyStripeSignature } from "../_shared/stripe.js";

const handled = new Set([
  "checkout.session.completed", "customer.subscription.created", "customer.subscription.updated",
  "customer.subscription.deleted", "customer.subscription.trial_will_end", "invoice.paid", "invoice.payment_failed"
]);
const seconds = value => value ? new Date(value * 1000).toISOString() : null;
const customerId = object => typeof object.customer === "string" ? object.customer : object.customer?.id;
function subscriptionId(object) {
  if (typeof object.subscription === "string") return object.subscription;
  return object.parent?.subscription_details?.subscription || object.subscription?.id || null;
}
async function resolveUser(env, object, subscription) {
  const direct = subscription?.metadata?.supabase_user_id || object.metadata?.supabase_user_id || object.client_reference_id;
  if (direct) return direct;
  const customer = customerId(subscription || object);
  return customer ? (await findByCustomer(env, customer))?.user_id || null : null;
}
async function authoritativeSubscription(env, event) {
  const object = event.data.object;
  if (event.type.startsWith("customer.subscription.")) return object;
  const id = subscriptionId(object);
  return id ? stripeGet(env, `subscriptions/${encodeURIComponent(id)}`) : null;
}
export async function onRequestPost({ request, env }) {
  let raw;
  try {
    requiredEnv(env, ["STRIPE_WEBHOOK_SECRET"]);
    raw = await request.text();
    if (!await verifyStripeSignature(raw, request.headers.get("stripe-signature"), env.STRIPE_WEBHOOK_SECRET)) return json({ error: "Invalid signature." }, 400);
    const event = JSON.parse(raw);
    if (!event?.id || !event?.type || !event?.data?.object) return json({ error: "Invalid event." }, 400);
    if (await webhookWasProcessed(env, event.id)) return json({ received: true, duplicate: true });
    if (handled.has(event.type)) {
      const object = event.data.object;
      const subscription = await authoritativeSubscription(env, event);
      const userId = await resolveUser(env, object, subscription);
      if (!userId) throw new Error("Webhook user mapping unavailable.");
      if (subscription) {
        const deleted = event.type === "customer.subscription.deleted";
        await upsertSubscription(env, {
          user_id: userId, stripe_customer_id: customerId(subscription) || customerId(object), stripe_subscription_id: subscription.id,
          status: deleted ? "canceled" : subscription.status, price_id: subscription.items?.data?.[0]?.price?.id || null,
          trial_end: seconds(subscription.trial_end), current_period_end: seconds(subscription.current_period_end),
          cancel_at_period_end: Boolean(subscription.cancel_at_period_end), updated_at: new Date().toISOString()
        });
      } else if (event.type === "checkout.session.completed") {
        await upsertSubscription(env, { user_id: userId, stripe_customer_id: customerId(object), status: "inactive", updated_at: new Date().toISOString() });
      }
    }
    await recordWebhook(env, event.id);
    return json({ received: true });
  } catch { return json({ error: "Webhook processing failed." }, 500); }
}

