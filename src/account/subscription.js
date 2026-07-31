import { getAuthState } from "../auth/session.js";

async function api(path, options = {}) {
  const token = getAuthState().session?.access_token;
  if (!token) throw new Error("Authentication required.");
  const response = await fetch(path, { ...options, headers: { ...options.headers, authorization: `Bearer ${token}` } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Subscription request failed.");
  return body;
}
export const fetchAccess = () => api("/api/account/access");
export const createCheckout = () => api("/api/stripe/create-checkout", { method: "POST" });
export const createPortal = () => api("/api/stripe/create-portal", { method: "POST" });
export async function pollForPremium({ attempts = 10, delay = 1500 } = {}) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const access = await fetchAccess();
    if (access.hasPremiumAccess) return access;
    if (attempt < attempts - 1) await new Promise(resolve => setTimeout(resolve, delay));
  }
  return null;
}
