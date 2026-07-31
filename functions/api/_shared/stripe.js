import { requiredEnv } from "./access.js";
export async function stripeRequest(env, path, values) {
  requiredEnv(env, ["STRIPE_SECRET_KEY"]);
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST", headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(values)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`Stripe request failed (${response.status}): ${result?.error?.type || "unknown"}.`);
  return result;
}
export async function stripeGet(env, path) {
  requiredEnv(env, ["STRIPE_SECRET_KEY"]);
  const response = await fetch(`https://api.stripe.com/v1/${path}`, { headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } });
  const result = await response.json();
  if (!response.ok) throw new Error(`Stripe request failed (${response.status}).`);
  return result;
}
const encoder = new TextEncoder();
const hex = bytes => [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2, "0")).join("");
export async function verifyStripeSignature(raw, signature, secret, now = Date.now()) {
  if (!signature || !secret) return false;
  const parts = Object.fromEntries(signature.split(",").map(part => part.split("=", 2)));
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(now / 1000 - timestamp) > 300 || !parts.v1) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = hex(await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${raw}`)));
  if (digest.length !== parts.v1.length) return false;
  let different = 0; for (let i = 0; i < digest.length; i++) different |= digest.charCodeAt(i) ^ parts.v1.charCodeAt(i);
  return different === 0;
}
