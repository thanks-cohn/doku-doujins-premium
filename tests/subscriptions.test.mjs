import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import { accessFor } from "../functions/api/_shared/access.js";
import { onRequestPost as checkout } from "../functions/api/stripe/create-checkout.js";
import { onRequestPost as webhook } from "../functions/api/stripe/webhook.js";

if (!globalThis.crypto) globalThis.crypto = webcrypto;
const env = { SUPABASE_URL:"https://db.test", SUPABASE_SERVICE_ROLE_KEY:"service-test-placeholder", STRIPE_SECRET_KEY:"stripe-test-placeholder", STRIPE_PREMIUM_PRICE_ID:"price_from_environment", SITE_URL:"https://premium.test", STRIPE_WEBHOOK_SECRET:"webhook-test-placeholder" };
const response = value => new Response(JSON.stringify(value), {status:200,headers:{"content-type":"application/json"}});
const authRequest = () => new Request("https://premium.test/api/stripe/create-checkout", {method:"POST",headers:{authorization:"Bearer valid-test-token"}});

for (const role of ["owner","platform_operations_manager","senior_content_editor","content_editor","legacy"]) {
  test(`${role} explicitly bypasses Stripe`, () => assert.equal(accessFor(role).hasPremiumAccess, true));
}
test("unknown and missing roles never bypass Stripe", () => {
  assert.equal(accessFor("surprise_admin").hasPremiumAccess, false);
  assert.equal(accessFor(null).hasPremiumAccess, false);
});
test("subscriber access follows only qualifying Stripe statuses", () => {
  assert.equal(accessFor("subscriber", {status:"trialing"}).hasPremiumAccess, true);
  assert.equal(accessFor("subscriber", {status:"active"}).hasPremiumAccess, true);
  for (const status of ["inactive","canceled","unpaid","incomplete","incomplete_expired"]) assert.equal(accessFor("subscriber", {status}).hasPremiumAccess, false);
});

async function runCheckout(role, status = null) {
  const calls = []; const original = globalThis.fetch;
  globalThis.fetch = async (url, options={}) => {
    calls.push({url:String(url), options});
    if (String(url).endsWith("/auth/v1/user")) return response({id:"00000000-0000-4000-8000-000000000001",email:"member@example.test"});
    if (String(url).includes("/user_roles?")) return response(role ? [{role}] : []);
    if (String(url).includes("/subscriptions?user_id")) return response(status ? [{status,stripe_customer_id: status === "inactive" ? "cus_existing" : "cus_paid"}] : []);
    if (String(url).includes("/rest/v1/subscriptions")) return response([]);
    if (String(url).endsWith("/v1/customers")) return response({id:"cus_new"});
    if (String(url).endsWith("/v1/checkout/sessions")) return response({url:"https://checkout.stripe.test/session"});
    throw new Error(`unexpected ${url}`);
  };
  try { const result = await checkout({request:authRequest(),env}); return {status:result.status,body:await result.json(),calls}; }
  finally { globalThis.fetch = original; }
}
test("subscriber without a subscription receives a Checkout URL", async () => assert.equal((await runCheckout("subscriber")).body.url, "https://checkout.stripe.test/session"));
for (const status of ["trialing","active"]) test(`subscriber with ${status} bypasses Checkout`, async () => assert.equal((await runCheckout("subscriber",status)).body.alreadySubscribed,true));
test("inactive subscriber does not bypass Checkout", async () => assert.ok((await runCheckout("subscriber","inactive")).body.url));
test("unknown and missing role are rejected by Checkout", async () => {
  assert.equal((await runCheckout("unknown")).status,403); assert.equal((await runCheckout(null)).status,403);
});
test("invalid Supabase token is rejected", async () => {
  const original=globalThis.fetch; globalThis.fetch=async()=>new Response("{}",{status:401});
  try { assert.equal((await checkout({request:authRequest(),env})).status,401); } finally { globalThis.fetch=original; }
});
test("Checkout requires payment information and applies a seven-day trial", async () => {
  const {calls}=await runCheckout("subscriber"); const call=calls.find(item=>item.url.endsWith("/v1/checkout/sessions")); const form=new URLSearchParams(call.options.body);
  assert.equal(form.get("payment_method_collection"),"always"); assert.equal(form.get("subscription_data[trial_period_days]"),"7"); assert.equal(form.get("line_items[0][price]"),env.STRIPE_PREMIUM_PRICE_ID);
});

function signedEvent(type,status) {
  const object={id:"sub_1",customer:"cus_1",status,metadata:{supabase_user_id:"00000000-0000-4000-8000-000000000001"},items:{data:[{price:{id:"price_server"}}]},trial_end:1800000000,current_period_end:1801000000,cancel_at_period_end:false};
  const raw=JSON.stringify({id:`evt_${type}_${status}`,type,data:{object}}); const timestamp=Math.floor(Date.now()/1000); const signature=createHmac("sha256",env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${raw}`).digest("hex");
  return new Request("https://premium.test/api/stripe/webhook",{method:"POST",headers:{"stripe-signature":`t=${timestamp},v1=${signature}`},body:raw});
}
async function runWebhook(type,status) {
  const writes=[]; const original=globalThis.fetch;
  globalThis.fetch=async (url,options={})=>{ if ((options.method||"GET")==="POST") writes.push(JSON.parse(options.body)); return response([]); };
  try { const result=await webhook({request:signedEvent(type,status),env}); return {result,writes}; } finally { globalThis.fetch=original; }
}
for (const status of ["trialing","active"]) test(`webhook stores ${status} status`,async()=>{
  const {result,writes}=await runWebhook("customer.subscription.updated",status); assert.equal(result.status,200); assert.ok(writes.some(row=>row.status===status));
});
test("subscription deletion removes subscriber premium access",async()=>{
  const {writes}=await runWebhook("customer.subscription.deleted","active"); const row=writes.find(value=>value.user_id); assert.equal(row.status,"canceled"); assert.equal(accessFor("subscriber",row).hasPremiumAccess,false);
});
test("invalid Stripe webhook signature is rejected",async()=>{
  const request=new Request("https://premium.test/api/stripe/webhook",{method:"POST",headers:{"stripe-signature":"t=1,v1=bad"},body:"{}"}); assert.equal((await webhook({request,env})).status,400);
});
test("subscriber trigger preserves manually assigned roles",async()=>{
  const sql=await readFile(new URL("../supabase/migrations/202607310001_premium_subscriptions.sql",import.meta.url),"utf8");
  assert.match(sql,/security definer/i); assert.match(sql,/on conflict \(user_id\) do nothing/i); assert.doesNotMatch(sql,/do update set role/i);
});
