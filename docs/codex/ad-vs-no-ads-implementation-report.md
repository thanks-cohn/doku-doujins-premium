# Public advertising versus ad-free Premium implementation report

## 1. Advertisement entry points discovered

The active advertisement path was the pair of `rail-ad` records in `src/data/blocks.json`. `Blocks.start` rendered them on landing and reader views, and `renderBlock` assigned the third-party URL directly to an iframe. This path is now routed through the eligibility-aware advertisement orchestrator.

`src/data/advertisement.json` also contains four enabled future placements (between-page, video slider, and desktop/mobile interstitial) and two provider-script URLs. Repository search found no runtime importer, initializer, retry, popunder, or overlay consumer for this configuration. It remains dormant and unchanged. The static HTML entries contain application/bootstrap scripts but no advertisement-provider script. The CSS selectors for legacy click overlays and reader slots hide them; no runtime creator was found. General HTML/embed block support can recreate scripts, but the checked-in block records point only to same-origin meme HTML and are not advertising records.

## 2. Current access flow discovered

Supabase session state is owned by `src/auth/session.js`. Authenticated account views previously called `/api/account/access` through `src/account/subscription.js`; readers and landing blocks did not resolve access. The endpoint authenticates the bearer token, obtains the backend role and (for subscribers) subscription, and delegates qualification to `functions/api/_shared/access.js`. Only `trialing`, `active`, approved staff roles, and `legacy` qualify. Stripe webhook state is authoritative for subscriber status.

## 3. Files changed

- Added `src/access/capabilities.js`.
- Added `src/advertising/orchestrator.js`.
- Updated application startup, account access use, checkout polling, and block rendering.
- Added focused access and advertising tests and adapted the block fixture.
- Added this report.

## 4. Central capability design

The access module exposes resolved state and derived capabilities. Logged-out/anonymous sessions resolve locally because there is no authenticated account whose Premium status could be queried. Authenticated sessions use `/api/account/access`; simultaneous requests for the same identity are deduplicated. Results are held only in memory and keyed to the current user ID. Identity changes clear state before a new request, and stale responses cannot publish into another account.

States are `unresolved`, `logged-out`, `free`, `premium-trialing`, `premium-active`, `premium-bypass`, `nonqualifying`, and `error`. Derived values include resolution, Premium, advertising, commenting, future reader/catalog eligibility, and upgrade-prompt eligibility. Backend `hasPremiumAccess` remains authoritative; client classification only describes that response.

## 5. Advertisement-loader design

The orchestrator is the sole creator of advertising provider scripts and rail-ad iframes. Providers are promise-deduplicated by URL and slots by stable view/placement/index ID. Eligibility is checked before creating a node and iframe `src` is assigned only after the eligible slot is registered. Repeated view rendering cleans old registrations. Script/iframe errors remove their controlled objects without throwing into page rendering.

## 6. Premium zero-request mechanism

Startup resolves centralized access before page rendering. Therefore Premium block rendering never creates the ad element or assigns an iframe URL. Provider loading similarly returns before creating a script. A capability transition away from ad eligibility removes tracked slots and provider nodes, reclaiming layout space. There is no CSS-only suppression in this mechanism.

## 7. Public advertisement behavior

Logged-out visitors and resolved free/nonqualifying accounts retain the existing 160×600 rail placements and existing zone ID. Stable slot identity prevents duplicates across repeated renders. Errors collapse the slot and do not block reading. Existing responsive breakpoints remain unchanged.

## 8. Popunder and overlay corrections

No executing popunder, click-overlay, or advertisement overlay implementation was found, so none was introduced. The dormant interstitial configuration is not loaded. Consequently there are no handlers or retry timers to duplicate or clean up. Future integrations must enter through the orchestrator rather than global startup.

## 9. Access failure policy

An authenticated access failure resolves to `error`: public reading continues, while Premium capabilities and all advertising remain disabled for that page session. There is no automatic retry loop or request storm. A deliberate navigation, identity event, checkout refresh, or explicit refresh may retry. This favors zero accidental ad requests to a paying member without granting Premium privileges.

## 10. Session-transition behavior

Login, logout, anonymous-to-account conversion, and account switching are observed through the single auth subscription. Each identity boundary first clears account-specific access and advertising, then resolves the new identity. Checkout-success polling force-refreshes centralized access to accommodate delayed webhook synchronization. Polling remains bounded at ten attempts. Logout resolves to advertising-eligible public state and ads may initialize once on the next render.

## 11. Tests added

Capability truth-table tests cover unresolved, logged-out, free, trialing, active, bypass, nonqualifying statuses, and error. Further tests cover past-due/canceled states, request deduplication, stale account responses, logout, checkout refresh, public ad initialization, Premium/unresolved suppression, provider/slot idempotence, failure collapse, and Premium-transition cleanup. Existing block tests continue to cover all block types.

## 12. Manual verification performed

Static repository audit confirmed no global provider scripts and no active popunder/overlay creator. Automated DOM fixtures verified zero node creation for unresolved/Premium/error states, public idempotence, failure collapse, and cleanup. The production build was inspected successfully. Live authenticated browser/Network verification was not possible without test accounts and deployed provider conditions; no deployment was performed.

The requested viewport matrix does not change layout CSS in this foundation. Existing 1370px/700px rail breakpoints continue to collapse rails on constrained screens; automated logic is viewport-independent.

## 13. Known limitations

Cross-origin iframe contents cannot reliably report provider “no fill” to the parent. The slot collapses on observable load errors and on access/view cleanup, but a provider that returns a successful blank iframe cannot be distinguished without a documented provider callback. No dormant `advertisement.json` placement has been activated. Multi-tab changes converge through Supabase auth events where supplied; no new persistent or broadcast cache was added, avoiding cross-account leakage. A provider request already made while genuinely free cannot be undone if that same document later upgrades, but tracked nodes are removed immediately and no subsequent initialization is allowed.

## 14. Rollback instructions

Revert the implementation commit. This removes the capability/orchestrator modules and tests and restores direct rail iframe rendering, prior account access calls, and prior checkout polling. No schema, provider IDs, billing configuration, deployment configuration, or external state requires rollback.

## 15. Future work intentionally excluded

The public flipbook, Premium continuous-scroll selection, stable numeric routing/IDs, protected manifests/assets, Premium catalog/tag policy, comment authorization changes, new billing, and visual redesign remain excluded. Activating the dormant interstitial/video/between-page placements requires separate provider-specific review, including a supported no-fill signal and safe interaction contract.
