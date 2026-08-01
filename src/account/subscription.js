import { getAuthState } from "../auth/session.js";

async function api(path, options = {}) {
    const token = getAuthState().session?.access_token;

    if (!token) {
        console.error("[subscription-api] no authentication token", { path });
        throw new Error(
            "Authentication required. Please sign out and log in again."
        );
    }

    console.info("[subscription-api] request", {
        path,
        method: options.method || "GET",
        origin: location.origin
    });

    let response;

    try {
        response = await fetch(path, {
            ...options,
            headers: {
                ...options.headers,
                authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("[subscription-api] network failure", error);

        throw new Error(
            `Network request failed: ${error?.message || String(error)}`
        );
    }

    const raw = await response.text();
    let body = {};

    try {
        body = raw ? JSON.parse(raw) : {};
    } catch {
        body = { raw };
    }

    console.info("[subscription-api] response", {
        path,
        status: response.status,
        statusText: response.statusText,
        body
    });

    if (!response.ok) {
        const reason =
            body?.error ||
            body?.message ||
            body?.raw ||
            "Subscription request failed.";

        throw new Error(
            `${response.status} ${response.statusText}: ${reason}`
        );
    }

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
