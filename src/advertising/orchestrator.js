import { getCapabilities, subscribeCapabilities } from "../access/capabilities.js";

const slots = new Map();
const providers = new Map();
let subscribed = false;

function ensureSubscription() {
    if (subscribed) return;
    subscribed = true;
    subscribeCapabilities(capabilities => {
        if (!capabilities.shouldLoadAds) clearAdvertisements();
    });
}

export function loadProvider(src, { documentRef = document } = {}) {
    ensureSubscription();
    if (!getCapabilities().shouldLoadAds || !src) return Promise.resolve(null);
    if (providers.has(src)) return providers.get(src);
    const pending = new Promise(resolve => {
        const script = documentRef.createElement("script");
        script.src = src;
        script.async = true;
        script.dataset.adProvider = src;
        script.onload = () => resolve(script);
        script.onerror = () => { script.remove(); resolve(null); };
        documentRef.head.appendChild(script);
    });
    providers.set(src, pending);
    return pending;
}

export function mountIframeSlot({ id, src, title, width = 160, height = 600, documentRef = document }) {
    ensureSubscription();
    if (!getCapabilities().shouldLoadAds || !id || !src) return null;
    if (slots.has(id)) return slots.get(id).element;
    const element = documentRef.createElement("section");
    element.className = "site-block rail-ad-block";
    element.dataset.adSlot = id;
    const frame = documentRef.createElement("div");
    frame.className = "rail-ad-frame";
    const iframe = documentRef.createElement("iframe");
    iframe.className = "block-iframe rail-ad-iframe";
    iframe.title = title || "Sponsored content";
    iframe.width = width;
    iframe.height = height;
    iframe.loading = "lazy";
    iframe.scrolling = "no";
    iframe.setAttribute("frameborder", "0");
    iframe.addEventListener?.("error", () => removeSlot(id), { once: true });
    frame.appendChild(iframe);
    element.appendChild(frame);
    slots.set(id, { element, iframe });
    // Assign last: eligibility and deduplication are established before a request can start.
    iframe.src = src;
    return element;
}

export function removeSlot(id) {
    const slot = slots.get(id);
    slot?.element.remove?.();
    slots.delete(id);
}

export function clearAdvertisements() {
    for (const id of [...slots.keys()]) removeSlot(id);
    for (const pending of providers.values()) pending.then(script => script?.remove?.());
    providers.clear();
}

export function advertisementDiagnostics() {
    return { slots: slots.size, providers: providers.size };
}

