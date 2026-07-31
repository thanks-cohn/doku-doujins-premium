import { json, requiredEnv } from "./access.js";

const headers = env => ({ apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "content-type": "application/json" });
async function request(env, path, options = {}) {
  requiredEnv(env, ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  const response = await fetch(`${env.SUPABASE_URL}${path}`, { ...options, headers: { ...headers(env), ...options.headers } });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
  return response.status === 204 ? null : response.json();
}
export async function authenticate(request_, env) {
  const value = request_.headers.get("authorization") || "";
  if (!/^Bearer \S+$/.test(value)) return null;
  requiredEnv(env, ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: value } });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id ? user : null;
}
export async function requireUser(request_, env) {
  const user = await authenticate(request_, env);
  return user ? { user } : { response: json({ error: "Authentication required." }, 401) };
}
export async function getRole(env, userId) {
  const rows = await request(env, `/rest/v1/user_roles?user_id=eq.${encodeURIComponent(userId)}&select=role&limit=1`);
  return rows?.[0]?.role ?? null;
}
export async function getSubscription(env, userId) {
  const rows = await request(env, `/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
  return rows?.[0] || null;
}
export async function findByCustomer(env, customerId) {
  const rows = await request(env, `/rest/v1/subscriptions?stripe_customer_id=eq.${encodeURIComponent(customerId)}&select=*&limit=1`);
  return rows?.[0] || null;
}
export async function upsertSubscription(env, row) {
  return request(env, "/rest/v1/subscriptions?on_conflict=user_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify(row) });
}
export async function webhookWasProcessed(env, eventId) {
  const rows = await request(env, `/rest/v1/stripe_webhook_events?event_id=eq.${encodeURIComponent(eventId)}&select=event_id&limit=1`);
  return Boolean(rows?.length);
}
export async function recordWebhook(env, eventId) {
  return request(env, "/rest/v1/stripe_webhook_events", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ event_id: eventId }) });
}
