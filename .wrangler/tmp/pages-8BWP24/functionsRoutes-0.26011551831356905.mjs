import { onRequestGet as __api_account_access_js_onRequestGet } from "/home/big-bro/dev/doku-doujins-premium/functions/api/account/access.js"
import { onRequestPost as __api_stripe_create_checkout_js_onRequestPost } from "/home/big-bro/dev/doku-doujins-premium/functions/api/stripe/create-checkout.js"
import { onRequestPost as __api_stripe_create_portal_js_onRequestPost } from "/home/big-bro/dev/doku-doujins-premium/functions/api/stripe/create-portal.js"
import { onRequestPost as __api_stripe_webhook_js_onRequestPost } from "/home/big-bro/dev/doku-doujins-premium/functions/api/stripe/webhook.js"

export const routes = [
    {
      routePath: "/api/account/access",
      mountPath: "/api/account",
      method: "GET",
      middlewares: [],
      modules: [__api_account_access_js_onRequestGet],
    },
  {
      routePath: "/api/stripe/create-checkout",
      mountPath: "/api/stripe",
      method: "POST",
      middlewares: [],
      modules: [__api_stripe_create_checkout_js_onRequestPost],
    },
  {
      routePath: "/api/stripe/create-portal",
      mountPath: "/api/stripe",
      method: "POST",
      middlewares: [],
      modules: [__api_stripe_create_portal_js_onRequestPost],
    },
  {
      routePath: "/api/stripe/webhook",
      mountPath: "/api/stripe",
      method: "POST",
      middlewares: [],
      modules: [__api_stripe_webhook_js_onRequestPost],
    },
  ]