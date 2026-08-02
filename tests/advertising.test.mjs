import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
let capabilities = { shouldLoadAds:false };
let listener;
const source = (await readFile(new URL("../src/advertising/orchestrator.js", import.meta.url), "utf8"))
 .replace('import { getCapabilities, subscribeCapabilities } from "../access/capabilities.js";', `
 const getCapabilities=()=>globalThis.__caps; const subscribeCapabilities=fn=>{globalThis.__capListener=fn;fn(globalThis.__caps);return()=>{}};
 `);
globalThis.__caps = capabilities;
const ads = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
class Node { constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.listeners={};} appendChild(x){this.children.push(x);return x;} setAttribute(k,v){this[k]=v;} addEventListener(k,v){this.listeners[k]=v;} remove(){this.removed=true;} }
const documentRef={head:new Node("head"),createElement:tag=>new Node(tag)};

test("unresolved, error, trialing, active, and bypass access mount no ad code", async()=>{
 for (const status of ["unresolved","error","premium-trialing","premium-active","premium-bypass"]) {
  globalThis.__caps={status,shouldLoadAds:false};
  assert.equal(ads.mountIframeSlot({id:status,src:"https://ads.test",documentRef}),null);
  assert.equal(await ads.loadProvider("https://ads.test/provider.js",{documentRef}),null);
 }
 assert.equal(documentRef.head.children.length,0);
});
test("public slots and providers initialize once, collapse on failure, and clean up for Premium", async()=>{
 globalThis.__caps={status:"free",shouldLoadAds:true};
 const one=ads.mountIframeSlot({id:"rail",src:"https://ads.test/frame",documentRef});
 const two=ads.mountIframeSlot({id:"rail",src:"https://ads.test/frame",documentRef});
 assert.equal(one,two); assert.equal(ads.advertisementDiagnostics().slots,1);
 const iframe=one.children[0].children[0]; iframe.listeners.error();
 assert.equal(ads.advertisementDiagnostics().slots,0); assert.equal(one.removed,true);
 const provider=ads.loadProvider("https://ads.test/provider.js",{documentRef});
 assert.equal(provider,ads.loadProvider("https://ads.test/provider.js",{documentRef}));
 assert.equal(documentRef.head.children.length,1);
 documentRef.head.children[0].onerror(); await provider;
 globalThis.__caps={status:"premium-active",shouldLoadAds:false}; globalThis.__capListener(globalThis.__caps);
 assert.deepEqual(ads.advertisementDiagnostics(),{slots:0,providers:0});
});
