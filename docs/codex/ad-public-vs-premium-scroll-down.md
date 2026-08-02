# Ad-Supported Public Reader and Ad-Free Premium Scroll-Down Architecture

**Status:** architecture decision proposal only. No production ID, route, storage object, schema, access rule, advertisement, or reader behavior is changed by this document.

## Executive decision

Keep one Vite application, catalog, account system, visual system, and reader foundation, but select behavior from a single resolved capability object. The public experience becomes a polished one-page-at-a-time reader with bounded adjacent prefetch and centrally scheduled ads. Trialing/active Premium (plus existing trusted bypass roles) becomes a lazy continuous-scroll mode in which ad components and provider code are never mounted or requested.

Use permanent, never-reused, digits-only IDs for works, chapters, and pages. Treat them as **strings at every JavaScript/JSON/API boundary**, even if the allocator initially stays below `Number.MAX_SAFE_INTEGER` (`9007199254740991`). Display chapter/page numbers, titles, slugs, array positions, filenames, and R2 paths remain mutable metadata—not identity.

The preferred canonical page URL is:

```text
https://9127000.xyz/work/{work_id}/chapter/{chapter_id}/page/{page_id}
```

For example:

```text
https://9127000.xyz/work/134123132/chapter/482910/page/700007
```

This deliberately refines the task's `/chapter/1/page/7` example: IDs occupy the path; human chapter number `1` and reader position `7` remain display data. If product insists that `1` and `7` be identities, insertions will either break links or require permanent gaps/aliases.

Do **not** emit one HTML file per page. Use a shared static reader shell plus immutable work/chapter manifests. Before accepting the path URL as canonical, prove that Cloudflare Pages can serve that shell on direct refresh with appropriate not-found behavior. If a no-Worker rewrite cannot return the shell reliably, the safe zero-Worker fallback is a generated static **chapter** entry plus `?page={page_id}`; a fragment is the secondary fallback. Do not silently return the homepage for unknown content.

## 1. Evidence-based repository audit

Labels mean **confirmed** (directly observable in this checkout), **inference** (strong conclusion that needs runtime/provider proof), and **unknown** (external state not represented here).

### 1.1 Application and deployment

| Finding | Evidence | Confidence / consequence |
|---|---|---|
| Vanilla JavaScript is built by Vite as three HTML entries. | `package.json` (`dev`, `build`, `preview`) and `vite.config.js` (`main`, `mobile`, `reveal`). | **Confirmed.** A coordinated reader mode is lower-risk than a second app. |
| Cloudflare Pages serves `./dist`; Pages Functions implement account/Stripe APIs. | `wrangler.jsonc`; `functions/api/**`. | **Confirmed.** There is no repository R2 binding or general Worker fetch handler. |
| There are no checked-in `_headers` or `_redirects`. | repository file audit and `wrangler.jsonc`. | **Confirmed in repo.** Dashboard rules and actual response headers are **unknown**. |
| Static public reading already avoids a database request per image/page. | `Storage` only constructs URLs; chapter JSON and images are fetched directly. | **Confirmed in code.** CDN-to-R2 behavior remains external. |

The desired request graph is therefore compatible with the existing division:

```text
browser -> static shell -> cached manifest -> cached display image
        -> /api/account/access (authenticated capability only)
        -> Supabase RPC (discussion only)
        -> Stripe endpoints (checkout/portal only)
```

Basic public reading must continue to work when Supabase, Stripe, comments, ads, or access resolution are unavailable.

### 1.2 Current identity, catalog, and storage

* **Confirmed:** the catalog uses `slug` as the work lookup key and embeds per-work manifest paths such as `works/<slug>.json` (`src/data/fetch.json`, `src/storage/work_manifest.js::catalogWork`).
* **Confirmed:** work objects use title-like slugs, chapter strings such as `chapter_1`, and direct CDN URLs under `/works/<slug>/<chapter>/` (`src/data/works/*.json`).
* **Confirmed:** `Storage.work()` percent-encodes the slug, `Storage.chapter()` appends the chapter string, and `Storage.manifest()` appends unversioned `item.json` (`src/storage/storage.js`). Storage path and effective identity are presently coupled.
* **Confirmed:** a chapter manifest is resolved with `base_url`, `pages`, `padding`, and `extension`; reader page URLs are derived as padded `index + 1` filenames (`src/storage/manifest_resolver.js`, `src/page/reader.js::pageUrl`). Thus page identity is currently array position/filename.
* **Confirmed:** work-manifest promises use a bounded 40-entry map; chapter manifests are fetched on reader render without an equivalent application promise cache (`src/storage/work_manifest.js`, `src/page/reader.js`).
* **Migration risk:** title/slug edits, chapter reorder, inserting/removing scans, changed padding/extension, or moving R2 paths can change the effective address. Existing comment/bookmark records accept text work IDs, which helps migration, but current slug values require aliases.
* **Unknown:** there is no authoritative registry proving two slugs are editions of the same work. Migration must not guess from normalized titles alone.

### 1.3 Current routing and reader

* **Confirmed:** only a query with both `work` and `chapter` resolves as `legacy-reader`; `/work/...` is not recognized (`src/router/router.js::resolveRoute`).
* **Confirmed:** `startRouter()` handles `popstate`, intercepted `data-route` anchors, and calls `pushState`/`replaceState`; reader selection itself dispatches `open-reader` rather than navigating (`src/router/router.js`, `src/page/reader.js`, search/Rotunda modules).
* **Confirmed:** current reader is continuous scroll. It builds up to 10 images before and 10 after the active page, marks the first three eager, uses `IntersectionObserver`, and unloads out-of-window image nodes (`src/page/reader.js::createVirtualReader`).
* **Confirmed:** current page URL is computed from an array index; the reader does not synchronize a page ID into the URL. Chapter controls dispatch in-page events.
* **Confirmed:** discussion is mounted beneath the reader when a parent work ID is available (`src/page/reader.js`).
* **Gap:** no current public flipbook, swipe/page jump contract, per-page history contract, canonical link, or deep-link page restoration exists.

### 1.4 Account and Premium access

* **Confirmed:** `/api/account/access` authenticates, loads role, and loads subscription only for `subscriber` (`functions/api/account/access.js`).
* **Confirmed:** trusted staff and `legacy` bypass; only Stripe states `trialing` and `active` qualify for subscribers (`functions/api/_shared/access.js::accessFor`). The response uses `Cache-Control: no-store`.
* **Confirmed:** client account views fetch access only for selected private account routes; the reader does not yet select its mode from access (`src/page/page.js`, `src/account/subscription.js`).
* **Confirmed:** the UI already uses a neutral loading state and avoids showing an incorrect trial offer before resolution (`src/page/page.js::render`).
* **Risk:** raw `hasPremiumAccess` alone cannot consistently coordinate reader, ads, comments, and catalog. Capability derivation belongs in one module and should be tested as a truth table.

Recommended resolved shape (names are a future contract, not an implementation):

```json
{
  "isAccessResolved": true,
  "hasPremiumAccess": true,
  "mayUseContinuousReader": true,
  "mayComment": true,
  "mayReply": true,
  "mayEditOwnComment": true,
  "mayDeleteOwnComment": true,
  "mayViewPremiumCatalog": true,
  "shouldLoadAds": false,
  "shouldShowUpgradePrompt": false
}
```

`mayDeleteOwnComment` should depend on authentication/ownership, not continuing payment. On logout/account switch, cancel in-flight access requests, clear per-user capability/progress state, and recompute before mounting account-sensitive controls. Never cache this response publicly.

### 1.5 Comments and authorization

* **Confirmed:** comments are read through `get_work_discussion`; create/edit/delete call Supabase RPCs (`src/discussion/service.js`). Public reads are granted to anon and authenticated users (`supabase/migrations/202607170001_discussion_mvp.sql`).
* **Confirmed:** the RPC layer is `SECURITY DEFINER`, fixes `search_path`, and uses separate authorship records. Grants/RLS are server enforcement, not merely UI affordances.
* **Important discrepancy:** the current discussion migration predates the requested Premium writing policy; its create/edit functions enforce authentication/ownership but do not call the subscription capability endpoint. The proposal requires future server-side Premium enforcement, and the frontend must never be presented as authoritative.
* Preserve public reading, Premium create/reply/edit, and owner deletion after expiry. Expiry retains identity, prior comments, bookmarks/history/progress, and makes discussion read-only except owned deletion.

### 1.6 Tags and visibility

* **Confirmed:** tags are normalized lowercase/hyphenated and keyed by slug. Rotunda omission checks `omit_public_tags`, `omit_everyone_tags`, and explicit work slugs (`src/utils/tag.js`).
* **Confirmed:** this logic filters discovery candidates, not direct manifest/image retrieval. The fallback policy may become empty on load error (`src/components/visibility_policy.js`).
* Therefore existing hidden/omitted tags are **not access control**. Adopt explicit orthogonal fields: publication state (`draft`, `processing`, `validated`, `staged`, `published`, `hidden`, `quarantined`, `removed`, `failed`), audience (`public`, `account`, `premium`, `administrative`), and constraints (age/territory/legal). Premium never overrides quarantine, removal, legality, privacy, or age/territory requirements.
* For Premium assets, choose explicitly between discovery-only gating (maximum shared caching, weak secrecy) and retrieval enforcement (authorization infrastructure, reduced cache sharing). Do not use hidden buttons or an exposed manifest as “protection.”

### 1.7 Advertising

* **Confirmed:** `src/data/advertisement.json` currently enables between-reader-pages every three pages plus desktop/mobile interstitial/video slots, with third-party provider and Delegate-CH hosts.
* **Confirmed:** reader/blocks code contains lazy iframes and centralized-ish data, but the current access object is not the mount gate for the reader ad lifecycle.
* **Requirement:** for Premium, do not mount a slot, reserve blank space, import/initialize provider code, create an iframe, retry, initialize a popunder, or make DNS/network requests. CSS hiding is not ad-free.
* While access is unresolved, show static content but hold all ad initialization. If access fails, favor a deterministic documented policy: anonymous visitors can use the public reader; an authenticated user with unresolved status gets the public mechanics but **ads remain held for that page session** to prevent charging a Premium user with an ad request. Retry access with bounded backoff and expose a non-blocking status. This fail-safe costs some ad impressions but protects the paid promise.

### 1.8 Images, caching, cost, and deterrence

* **Confirmed:** current continuous reader can retain 21 image elements and relies on eager/lazy loading plus DOM unloading. It serves numeric padded files directly from a custom CDN host.
* **Confirmed in repo:** Vite hashes built JS/CSS, while catalog/manifests/media object conventions are generally mutable/unversioned. No repository service worker or explicit cache header policy exists.
* **Unknown:** live `Cache-Control`, `ETag`, `Last-Modified`, `Age`, `CF-Cache-Status`, tiered cache, cache reserve, R2 origin miss rate, request coalescing, cookie/header transforms, and cache-key query handling. Capture with browser HAR, `curl -sSI`, and Cloudflare/R2 dashboards before asserting savings.
* Highest qualitative costs are image bytes and cold cache misses/bot amplification, followed by poorly cached manifests, dynamic authorization/Worker calls, Supabase queries, and excessive logs. A repeat edge/browser hit should avoid R2.

## 2. Permanent identity proposal

### 2.1 Work allocation options

| Strategy | Collision/concurrency | Enumeration/privacy | Automation/recovery | Verdict |
|---|---|---|---|---|
| small monotonic sequence | transactional and collision-free | trivially enumerable | easiest backup/retry | sound identity; enumeration is not authorization |
| large sequential range | same with central lease | still inferable | permits reserved ranges/offline batches but gaps | acceptable if range leases are audited |
| random numeric | requires uniqueness check | reduces casual enumeration | retry must preserve allocated value | unnecessary complexity; not security |
| time-derived numeric | collisions under concurrency/clock faults | leaks time/volume | difficult restore/distributed ordering | reject as primary allocator |
| ingestion-machine assigned | machine coordination required | varies | split-brain/duplicate risk | reject without central authority |
| database sequence/registry | transaction + unique constraints | enumerable | strong concurrency and audit | **recommended authority** |
| durable static registry | merge/lock conflicts | depends | useful export/disaster recovery | mirror, not multi-writer authority |

Recommendation: an authoritative registry transaction allocates a monotonic `bigint` (or decimal) ID, records an immutable source fingerprint/idempotency key, and inserts the work and audit event atomically. The API returns decimal **text**. A duplicate idempotency key returns the original ID. Unique constraints cover the numeric ID, trusted external-source identity, and ingestion idempotency key. Never reuse an ID; deletion creates a tombstone.

Reserve ranges only through recorded leases if offline ingestion becomes necessary. An offline machine may prepare hashes/assets but should not invent canonical IDs. On retry after ambiguous failure, query by idempotency key before allocating. Backup/restore must include sequences, tombstones, aliases, leases, and audit history; restore the next allocator above every issued ID.

Although signed 64-bit values fit common databases, many exceed JavaScript's exact range. JSON numbers, arithmetic, sorting via subtraction, and URL parsing through `Number()` are forbidden for identity. Validate with `/^[1-9][0-9]{0,19}$/` (or registry-specific length), preserve as strings, compare using canonical decimal rules, and cap at the database's declared range.

### 2.2 Chapter identity

Store both:

* `chapterId`: permanent digits-only string, allocated once and used in URLs/references;
* `displayNumber`: string such as `"1"`, `"1.5"`, `"Bonus A"`;
* `sortKey`: reorderable rational/rank token, not identity;
* title, edition/language, publication state, predecessor/successor relationships.

Inserted/bonus chapters receive new IDs and rank keys. Rename/reorder changes metadata only. Combining or splitting creates new chapter identities plus `supersedes`/`splitFrom` relations; old IDs become aliases/tombstones that redirect only where semantically exact. Alternate editions are explicit edition records, never silently substituted. A deleted chapter returns a real unavailable/tombstone state rather than the homepage.

### 2.3 Page identity

Store `pageId` separately from `displayPosition`, printed number, source filename, image object, and zero-based array index. Inserting a missing page creates a new page ID and changes sort/rank; removing a duplicate tombstones its ID. Rescan/recompression replaces the immutable asset reference on the same page only when semantics are the same. A split/merge creates new IDs and tombstones/aliases the old page; do not pretend one old URL identifies two pages.

Manifests should expose ordered page records, never infer identity from `index + 1`:

```json
{
  "pageId": "700007",
  "displayPosition": 7,
  "printedLabel": "6",
  "rank": "h7",
  "variants": [{"width": 1280, "url": "/assets/pages/sha256-....webp"}],
  "width": 1280,
  "height": 1820,
  "checksum": "sha256:..."
}
```

UI conversion from one-based position to zero-based arrays occurs once in a tested adapter. Malformed, zero, signed, whitespace, leading-zero, missing, removed, mismatched-work/chapter, or excessive values fail safely.

### 2.4 Migration

1. Freeze destructive slug/path renames and export every catalog/work/chapter/page reference.
2. Create a reviewed reconciliation table; do not fuzzy-match automatically.
3. Allocate IDs once, preserving each legacy `(source, slug, chapter, filename/index)` as an alias.
4. Hash source content and flag duplicate/alternate-edition ambiguity for review.
5. Generate new manifests without changing old objects or URLs.
6. Shadow-validate every old page to one new semantic page.
7. Publish redirects/compatibility resolution only after validation; keep permanent tombstones.
8. Never assign production IDs in this documentation task.

## 3. Routing appraisal

| Model | Refresh/history/analytics | Static/scale properties | Recommendation |
|---|---|---|---|
| A. `/work/W/chapter/C/page/P` | ideal share, canonical, server analytics and meaningful history if rewrite works | shared shell avoids page files; platform must return shell and distinguish 404 | **Preferred canonical**, gated on deployment proof |
| B. chapter + `#page-P` | refresh restores client state; fragment absent from server logs/cache key | excellent zero-Worker static behavior; weak server analytics/indexing | second fallback |
| C. chapter + `?page=P` | server-visible, shareable, history-friendly | query cache behavior must be normalized; no page files | **primary fallback** if path fallback is unreliable |
| D. generated static routes | true static status/SEO | per-page explosion; chapter files tolerable initially, expensive global rebuild | generate chapter/work entries only where bounded |
| E. shared shell fallback | smallest artifact; easy immutable app deploy | unknown paths may return 200 shell; app must visibly resolve not-found | pair with explicit tested rewrite/status policy |
| F. Worker routing | strongest status/auth flexibility | invocation/cold-path/cost/operations | reserve for protected retrieval or proven Pages limitation |

Trailing slash (`.../page/P/`) adds no value if file generation is not used and creates a duplicate. Normalize one form with a single redirect/canonical link. Do not use `@=` syntax.

### History contract

* Opening a shared link restores exact IDs after manifests validate.
* Public Next/Previous/page jump/chapter selection uses `pushState`; Back/Forward uses `popstate` without adding entries. Initial correction/canonicalization uses `replaceState`.
* Premium passive dominant-page changes use throttled `IntersectionObserver` plus `replaceState`; explicit page jumps and chapter changes use `pushState`.
* Restore only after dimensions/placeholders exist; suppress observer writes while handling `popstate`; test chapter boundaries and mobile scroll.
* Canonical link follows resolved IDs. Invalid/removed/private routes render policy-correct 404/410/authorization states, never a false homepage.

### Route acceptance gate

Deploy a non-production artifact and verify exact page paths with GET/HEAD, hard refresh, new tab, trailing slash, encoded junk, nonexistent IDs, cache headers/status, canonical tag, and `curl -I`. Verify Cloudflare Pages limits and fallback semantics from current provider documentation at implementation time. If a shared shell cannot provide acceptable status behavior, generate one chapter file per published public chapter and use the query fallback; do not generate millions of page HTML files or add a Worker just for aesthetics.

## 4. Versioned manifest and publication contract

Recommended hierarchy:

```text
/manifests/works/{workId}/current.json
/manifests/works/{workId}/versions/{publicationVersion}/work.json
/manifests/works/{workId}/versions/{publicationVersion}/chapters/{chapterId}.json
/assets/pages/{sha256}/{width}.webp
/indexes/{indexVersion}/public/recent-0001.json
/indexes/current.json
```

All IDs, versions, checksums, visibility classifications, dimensions, MIME types, relationships, and canonical asset URLs are schema-validated. One work manifest provides ordered chapter summaries; chapter manifests provide ordered stable page records. Avoid a global catalog and a network record per page. At scale, publish compressed/paginated immutable discovery shards by tag, recency, and stable shard key, with small pointers.

### Ingestion state machine

`draft -> processing -> validated -> staged -> published`, with side states `failed`, `hidden`, `quarantined`, and `removed`.

1. Receive a source plus immutable ingestion idempotency key.
2. Resolve existing registry identity or allocate transactionally.
3. validate metadata/visibility and reconcile edition.
4. detect chapters/pages; recover existing IDs using trusted mappings and hashes.
5. decode safely, validate dimensions/MIME, create responsive display variants and checksums.
6. upload content-addressed objects idempotently; verify them.
7. generate schema-versioned immutable chapter/work manifests.
8. validate cross-references, page order, access leakage, and URL uniqueness in staging.
9. update tag/catalog immutable shards.
10. publish the small current/index pointers **last** with compare-and-swap/generation precondition.
11. append an audit event; never mutate the event history.

A retry queries the job/idempotency key, verifies checksums, and resumes. It neither creates a second identity nor overwrites an immutable key. Concurrent publishers must fail compare-and-swap and rebase. Readers either see the complete old release or complete new release, never a half-published work. Rollback repoints to a retained validated version. Garbage collection is mark-and-sweep after a generous retention window, legal holds, rollback reachability, alias reachability, and audit approval.

Emergency takedown is the exception to long immutable caching: change the short-lived access/current pointer and block the relevant asset prefix/hash at the edge where legally required. Long-lived public objects cannot be reliably “unpublished” merely by deleting catalog links, so moderation policy and cache rules must be designed before publication.

### Cache policy by class

| Class | Proposed policy | Invalidation |
|---|---|---|
| hashed JS/CSS/fonts/icons | `public, max-age=31536000, immutable` | new hash |
| content-addressed images/immutable manifests/index shards | same, after proving objects never overwrite | new hash/version |
| `current.json`, index pointers, visibility/removal metadata | short `max-age`, `stale-while-revalidate`, ETag | pointer generation; emergency purge/block |
| authenticated access/comments/progress | `private` or `no-store` as appropriate | account/event driven; never CDN shared |
| static shell | short/moderate freshness + validators | new deployment/version |

Avoid random cache-busting queries, cookies on static hosts, per-user public manifests, unnecessary `Vary`, and signed URLs for public images. Public and Premium should reuse identical cacheable image objects whenever policy permits. Responsive `srcset` variants improve byte cost but cap variant count to avoid storage/cache dilution.

Use the existing browser HTTP cache before adding a service worker. A service worker adds stale-shell, versioning, quota, debugging, and account-leakage risk; justify it only for an explicit offline feature.

## 5. Coordinated reader design

### 5.1 Public flipbook

Load manifest plus current display-sized page; prefetch one forward page and optionally one backward page. A second forward page is allowed only on fast non-metered networks with sufficient memory and stable forward travel. With Save-Data/reduced-data or constrained connection/device signals, load current only. Abort stale prefetch on jumps/chapter changes. Browser cache makes Back/refresh cheap without keeping decoded images alive.

Support visible Previous/Next, page jump, chapter selector, anchors/click zones, Left/Right keys outside form controls, mobile swipe with threshold/velocity and vertical-scroll discrimination, focus announcement, full keyboard operation, reduced motion, correct dimensions/placeholders, and opening in another tab. Ads are occasional and owned by a central scheduler; never arbitrary scripts in work manifests and never after every page.

### 5.2 Premium flow reader

Adapt the proven current virtualization concepts rather than creating another app: shared page record/render/error/zoom/navigation components, alternate layout/state policy. Use `IntersectionObserver`, placeholders with known aspect ratios, approximately 1–2 viewport forward fetch and 1 viewport backward, adaptive Save-Data limits, and DOM/decoded-image eviction under memory pressure. Network cache, decoded bitmap memory, DOM presence, manifest state, and saved progress are separate budgets. Removing a node should allow reuse from HTTP cache.

Do not fetch a whole chapter at open. Pause look-ahead in hidden tabs, abort obsolete requests, cap concurrent decodes, and stress-test extremely long/mixed-size chapters. Save progress by stable page ID with a local fallback; debounce account synchronization and do not block reading on it.

### 5.3 Mode matrix

| State | Reader | Ads | Discussion | Catalog |
|---|---|---|---|---|
| logged out | page-by-page | eligible | read | public |
| free account | page-by-page | eligible | read | public |
| trialing | continuous | no mount/request | create/reply/edit/delete-own | approved Premium |
| active | continuous | no mount/request | create/reply/edit/delete-own | approved Premium |
| expired/nonqualifying | page-by-page | eligible after resolved | read + delete-own | public |
| staff/legacy bypass | capability-defined Premium | none | capability-defined | approved scope |
| unresolved access | readable public mechanics | hold ads | read-only controls | public only |

Upgrade messaging should demonstrate Flow, Silence, Voice, and Access without degrading public controls. No hostile delays, excessive ads, disabled navigation, intentionally low-resolution pages, or whole-page interstitial on every transition.

## 6. Advertising control plane

Future central configuration should contain stable slot ID, provider, placement, dimensions, viewport/device rule, minimum page, page interval, per-chapter maximum, enabled state, consent/age constraints, no-fill timeout, retry cap, and layout reservation rules. The scheduler—not a work manifest—decides eligibility.

Lifecycle invariant:

```text
access unresolved -> no provider resources
resolved shouldLoadAds=false -> no ad component/provider resources
resolved shouldLoadAds=true -> scheduler may mount one eligible slot
route/mode/logout change -> destroy provider instance and cancel retry
```

Automated tests must intercept network traffic and assert zero requests to all known provider/Delegate-CH/popunder hosts for trialing/active/bypass identities, including refresh, deep link, navigation, no-fill, provider error, logout/login, delayed access, and account switch. DOM tests assert no iframe/container/blank reserved region. Treat any Premium provider request as a release blocker.

## 7. Catalog protection and dynamic boundary

Public shell, public catalog shards, public manifests, and public images should remain static and anonymously cacheable. Dynamic systems are justified for authentication, authoritative capability lookup, writes/moderation, progress sync, billing, and assets that policy truly requires to be protected.

For Premium discovery-only material, a gated encrypted-looking UI is not security if immutable manifests/images are public. For genuinely protected works, gate the manifest and/or asset request. Compare before implementation:

* per-user short signed URLs: strong temporal control but fragments caches and amplifies dynamic calls;
* shared gated manifest with public asset URLs: cache-efficient but URLs can escape;
* coarse shared entitlement tokens/cache keys: more cache reuse but careful leakage/revocation design;
* Worker authorization: strongest edge control but adds invocation, failure, and operational costs.

Recommendation: classify policy first. Use discovery-only restriction only when URL disclosure is acceptable. Use limited dynamic authorization for truly protected manifests, keeping public reading Worker-free. Do not casually sign every page URL.

## 8. Practical download deterrence

A displayed public image is retrievable. Context-menu/drag prevention and CSS selection controls deter only casual actions and may impair keyboard, assistive technology, translation, or touch. Overlays, canvas, and blob URLs add complexity and do not defeat DevTools/screenshots. Signed URLs/rate limits/bot controls require dynamic infrastructure and may reduce cache sharing. Visible/per-user watermarks affect art/privacy/performance and need policy review.

Recommended baseline: deliver appropriately sized WebP/AVIF/JPEG variants rather than archival originals; strip revealing source filenames/metadata; omit a download button; set non-destructive drag behavior only after accessibility review; apply CDN hotlink/bot/rate controls based on measurement; preserve shared immutable caching; retain source originals privately. Describe this as casual deterrence, never DRM. Scraping resistance should focus on bounded prefetch, bot management, rate anomaly detection, and not exposing bulk archives/manifests unnecessarily.

## 9. Scale, resilience, cost, and observability

Layer repeated reads through browser memory/disk cache, Cloudflare edge, optional upper tier/cache reserve where measured useful, then R2. Do not add a service worker by default. Immutable naming, stable cache keys, stale-while-revalidate pointers, client request deduplication, tiering/request coalescing, atomic release, and bounded prefetch reduce stampedes.

A viral work should cause many edge hits, not proportional R2 reads or database queries. Static reading continues with stale-but-valid manifests if comments/access/ads fail. Rate-limit dynamic writes/access, apply ingestion backpressure, and never regenerate personalized public images/manifests per view.

Observe aggregates rather than every page view: sampled client errors/performance, cache-hit and byte ratios by asset class, R2 operations, pointer/manifest failures, access latency/error rate, Supabase RPC volume, Worker invocations, ad initialization/no-fill failures, ingestion failures, rollback/takedown events, and bot ratios. Sample and redact logs, define short raw retention, and avoid identities/full URLs where unnecessary. Do not claim billion-user readiness from design alone; load-test and measure each layer.

## 10. Staged roadmap (nothing implemented here)

| Phase | Objective / prerequisites | Evidence and tests before proceed | Rollback |
|---|---|---|---|
| 0 audit/ADR | freeze semantics; capture live Pages/CDN/R2 headers, routes, HAR, costs | route matrix, cache headers, request counts, representative manifests | docs only |
| 1 registry/schema | IDs, aliases, tombstones, validation; approved reconciliation | concurrency, safe-string, duplicate/idempotency, restore tests | no public pointer |
| 2 ingestion contract | deterministic assets/manifests/staging | corrupt input, retries, concurrent jobs, orphan/rollback tests | discard stage |
| 3 canonical public reader | path parser or accepted fallback; flipbook | direct refresh/share/back/forward/swipe/a11y/404 and bounded network | feature flag + legacy query |
| 4 capabilities | one access truth table and lifecycle | every role/status, failure, account switch, stale response | public fail-safe mode |
| 5 Premium flow | virtual scroll/history/progress | long chapter, memory, Save-Data, tab restore, zero eager chapter | page mode flag |
| 6 ads | centralized scheduler | frequency/no-fill/a11y plus Premium zero-network suite | global ad kill switch |
| 7 catalog | explicit visibility/protection | direct URL/leak/age/removal/entitlement tests | retain previous indexes |
| 8 image/cache | immutable variants/deterrence | cold/warm HAR, cache/R2 metrics, visual/a11y checks | previous manifest pointer |
| 9 migration | aliases and atomic cutover | exhaustive legacy map, canary, rollback drill | restore old pointer/deploy |

Every phase requires a separate reviewed implementation, measurable acceptance criteria, and retained prior release. No runtime rollout should combine identity migration, routing migration, access gating, and ad changes in one irreversible step.

## 11. Unresolved decisions requiring evidence

1. Authoritative production hostname(s), Pages fallback/rewrite/status behavior, and canonical trailing-slash policy.
2. Live static/CDN headers, cache rules, R2 mapping, tier/cache reserve, and measured miss/bandwidth profile.
3. Exact registry datastore, numeric maximum/range-leasing need, source fingerprint rules, and ownership of manual reconciliation.
4. Whether Premium catalog gating is discovery-only or prohibits asset retrieval, per classification.
5. Legal/moderation takedown SLA versus immutable public caching.
6. Representative page dimensions/bytes, mobile memory thresholds, prefetch budgets, and responsive variant widths.
7. Ad-provider policy, consent/age requirements, interstitial/popunder acceptability, and verified host inventory.
8. Server-side Premium comment enforcement design and compatibility with current RPC/RLS/service-role paths.
9. Legacy URL retention period and whether ambiguous split/merge aliases return 300/410 rather than redirect.

## 12. Acceptance checklist

* All identities remain digit strings and never change/reuse; title/path/image corrections do not rewrite canonical links.
* Publication pointer is last, conditional, auditable, and reversible; readers never see mixed releases.
* Direct page refresh, copy/share, new tab, Back/Forward, invalid IDs, removed IDs, and chapter boundaries pass on the actual host.
* Public first view loads current page plus only the adaptive budget; Premium does not eagerly fetch whole chapters.
* Trialing and active are behaviorally identical to Premium; nonqualifying states retain identity/content and become public/read-only except delete-own.
* Premium produces zero ad provider requests/frames/scripts/slots/popunders, including unresolved/failure/account-switch races.
* Public assets do not vary by account cookies; protected-content compromises are explicit.
* Cache claims are backed by headers, HAR, `CF-Cache-Status`/`Age`, and R2 metrics—not inferred from URLs.
* Accessibility, memory, Save-Data, error isolation, abuse, rollback, and emergency takedown tests pass.

This architecture maximizes browser and CDN cache reuse, minimizes R2 origin reads and dynamic requests, tolerates sudden traffic, and drives repeated-read marginal cost as low as practical without claiming unmeasured capacity.
