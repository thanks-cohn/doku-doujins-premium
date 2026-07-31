export const STAFF_ROLES = Object.freeze(["owner", "platform_operations_manager", "senior_content_editor", "content_editor"]);
export const BYPASS_ROLES = Object.freeze([...STAFF_ROLES, "legacy"]);
export const PREMIUM_STATUSES = Object.freeze(["trialing", "active"]);

export function accessFor(role, subscription = null) {
  const isStaff = STAFF_ROLES.includes(role);
  const isLegacy = role === "legacy";
  const hasPremiumAccess = isStaff || isLegacy || (role === "subscriber" && PREMIUM_STATUSES.includes(subscription?.status));
  return {
    role: typeof role === "string" ? role : null,
    isStaff,
    isLegacy,
    subscriptionStatus: subscription?.status || "inactive",
    hasPremiumAccess,
    mustSubscribe: !hasPremiumAccess,
    hasStripeCustomer: Boolean(subscription?.stripe_customer_id)
  };
}

export const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

export function requiredEnv(env, names) {
  for (const name of names) if (!env[name]) throw new Error(`Server configuration is missing ${name}.`);
}

