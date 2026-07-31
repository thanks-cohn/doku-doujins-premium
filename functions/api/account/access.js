import { accessFor, json } from "../_shared/access.js";
import { getRole, getSubscription, requireUser } from "../_shared/supabase.js";
export async function onRequestGet({ request, env }) {
  try {
    const auth = await requireUser(request, env); if (auth.response) return auth.response;
    const role = await getRole(env, auth.user.id);
    const subscription = role === "subscriber" ? await getSubscription(env, auth.user.id) : null;
    return json(accessFor(role, subscription));
  } catch { return json({ error: "Access could not be determined." }, 500); }
}

