import { getAuthState, subscribeAuth } from "../auth/session.js";

const listeners = new Set();
let state = capabilitiesFor("unresolved");
let request = null;
let requestIdentity = null;
let unsubscribeAuth = null;

export function capabilitiesFor(status, access = null, error = null) {
    const premium = ["premium-trialing", "premium-active", "premium-bypass"].includes(status);
    const resolved = status !== "unresolved";
    const publicAccess = ["logged-out", "free", "nonqualifying"].includes(status);
    return Object.freeze({
        status,
        access,
        error,
        isAccessResolved: resolved,
        hasPremiumAccess: premium,
        shouldLoadAds: resolved && publicAccess,
        mayUseContinuousReader: premium,
        mayViewPremiumCatalog: premium,
        mayComment: premium,
        shouldShowUpgradePrompt: resolved && publicAccess
    });
}

export function classifyAccess(access) {
    if (!access?.hasPremiumAccess) {
        return access?.role === "subscriber" && access?.subscriptionStatus && access.subscriptionStatus !== "inactive"
            ? "nonqualifying" : "free";
    }
    if (access.isStaff || access.isLegacy) return "premium-bypass";
    if (access.subscriptionStatus === "trialing") return "premium-trialing";
    return "premium-active";
}

function publish(next) {
    state = next;
    listeners.forEach(listener => listener(state));
}

async function requestAccess(identity, fetcher = fetch) {
    const response = await fetcher("/api/account/access", {
        headers: { authorization: `Bearer ${identity.token}` }
    });
    if (!response.ok) throw new Error(`Access request failed (HTTP ${response.status}).`);
    return response.json();
}

export function refreshAccess({ force = false, fetcher = fetch } = {}) {
    const auth = getAuthState();
    const userId = auth.user?.id || null;
    const token = auth.session?.access_token;

    if (auth.status === "loading") return Promise.resolve(state);
    if (auth.status !== "authenticated" || !userId || !token) {
        request = null;
        requestIdentity = null;
        publish(capabilitiesFor("logged-out"));
        return Promise.resolve(state);
    }
    if (!force && request && requestIdentity === userId) return request;
    if (!force && state.access && requestIdentity === userId) return Promise.resolve(state);

    const identity = { userId, token };
    requestIdentity = userId;
    publish(capabilitiesFor("unresolved"));
    const pending = requestAccess(identity, fetcher).then(access => {
        if (requestIdentity === identity.userId && getAuthState().user?.id === identity.userId) {
            publish(capabilitiesFor(classifyAccess(access), access));
        }
        return state;
    }).catch(error => {
        if (requestIdentity === identity.userId && getAuthState().user?.id === identity.userId) {
            // Fail closed for privileges and advertising for this page session.
            publish(capabilitiesFor("error", null, error));
        }
        return state;
    }).finally(() => {
        if (request === pending) request = null;
    });
    request = pending;
    return pending;
}

export function initializeAccess() {
    if (!unsubscribeAuth) {
        unsubscribeAuth = subscribeAuth((_auth, detail) => {
            if (detail.identityChanged) {
                request = null;
                requestIdentity = null;
                publish(capabilitiesFor("unresolved"));
                refreshAccess();
            }
        });
    }
    return refreshAccess();
}

export const getCapabilities = () => state;
export function subscribeCapabilities(listener) {
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
}

export function disposeAccess() {
    unsubscribeAuth?.();
    unsubscribeAuth = null;
    request = null;
    requestIdentity = null;
    state = capabilitiesFor("unresolved");
}

export const refreshAfterCheckout = options => refreshAccess({ ...options, force: true });
