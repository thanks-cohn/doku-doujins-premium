import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

let auth = { status: "authenticated", user: { id: "one" }, session: { access_token: "token-one" } };
let authListener;
const source = (await readFile(new URL("../src/access/capabilities.js", import.meta.url), "utf8"))
  .replace('import { getAuthState, subscribeAuth } from "../auth/session.js";', `
    const getAuthState = () => globalThis.__testAuth;
    const subscribeAuth = listener => { globalThis.__authListener = listener; return () => {}; };
  `);
globalThis.__testAuth = auth;
const access = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

for (const [status, premium, ads] of [
  ["unresolved", false, false], ["logged-out", false, true], ["free", false, true],
  ["premium-trialing", true, false], ["premium-active", true, false], ["premium-bypass", true, false],
  ["nonqualifying", false, true], ["error", false, false]
]) test(`${status} capabilities`, () => {
  const value = access.capabilitiesFor(status);
  assert.equal(value.hasPremiumAccess, premium); assert.equal(value.shouldLoadAds, ads);
});

test("authoritative responses classify trialing, active, bypass, and nonqualifying states", () => {
  assert.equal(access.classifyAccess({ role:"subscriber", subscriptionStatus:"trialing", hasPremiumAccess:true }), "premium-trialing");
  assert.equal(access.classifyAccess({ role:"subscriber", subscriptionStatus:"active", hasPremiumAccess:true }), "premium-active");
  assert.equal(access.classifyAccess({ role:"owner", isStaff:true, hasPremiumAccess:true }), "premium-bypass");
  for (const status of ["past_due", "canceled", "unpaid", "incomplete_expired"])
    assert.equal(access.classifyAccess({ role:"subscriber", subscriptionStatus:status, hasPremiumAccess:false }), "nonqualifying");
});

test("simultaneous requests deduplicate and account switches cannot inherit results", async () => {
  let calls = 0;
  let resolveFirst;
  const fetcher = () => { calls++; return new Promise(resolve => { resolveFirst = resolve; }); };
  const first = access.refreshAccess({ force:true, fetcher });
  const duplicate = access.refreshAccess({ fetcher });
  assert.equal(first, duplicate); assert.equal(calls, 1);
  globalThis.__testAuth = { status:"authenticated", user:{id:"two"}, session:{access_token:"token-two"} };
  await access.refreshAccess({ force:true, fetcher:async()=>({ok:true,json:async()=>({role:"subscriber",subscriptionStatus:"inactive",hasPremiumAccess:false})}) });
  resolveFirst({ ok:true, json:async()=>({role:"subscriber",subscriptionStatus:"active",hasPremiumAccess:true}) });
  await first;
  assert.notEqual(access.getCapabilities().status, "premium-active");
});

test("logout clears account access and checkout refresh bypasses the session cache", async () => {
  let calls = 0;
  globalThis.__testAuth = { status:"authenticated", user:{id:"three"}, session:{access_token:"token-three"} };
  await access.refreshAccess({ force:true, fetcher:async()=>({ok:true,json:async()=>({role:"subscriber",subscriptionStatus:"active",hasPremiumAccess:true})}) });
  await access.refreshAfterCheckout({ fetcher:async()=>{calls++; return {ok:true,json:async()=>({role:"subscriber",subscriptionStatus:"active",hasPremiumAccess:true})};} });
  assert.equal(calls, 1);
  globalThis.__testAuth = { status:"signed-out", user:null, session:null };
  await access.refreshAccess();
  assert.equal(access.getCapabilities().status, "logged-out");
});
