Repository: thanks-cohn/doku-doujins-premium
Local repository: ~/dev/doku-doujins-premium
Base branch: main
Safety tag: pre-adfree-and-routing-proposal

TASK TYPE:
IMPLEMENT THE PUBLIC AD-SUPPORTED VS PREMIUM GENUINELY AD-FREE FOUNDATION

This is an implementation task.

The immediate objective is to make advertisement behavior reliable and authoritative:

PUBLIC / FREE / NONQUALIFYING USERS
→ advertisements may initialize and display

PREMIUM TRIALING / ACTIVE / APPROVED BYPASS USERS
→ no advertisement script, provider, iframe, popunder, request, slot, or placeholder may initialize

This task does not yet implement the complete public flipbook or Premium continuous-scroll reader.

It creates the access and advertisement foundation those future reader modes will depend upon.

==================================================
READ THESE DOCUMENTS FIRST
==================================================

Before modifying code, read:

docs/codex/ad-public-vs-premium-scroll-down-request.md
docs/codex/ad-public-vs-premium-scroll-down.md
docs/premium-vs-free.md

Treat them as architectural guidance and prior repository research.

Verify important claims against the current repository before relying on them.

Source-of-truth priority:

1. Current repository code and configuration
2. Existing authoritative account and subscription behavior
3. This implementation request
4. Architecture documents
5. Clearly stated inference

==================================================
PRIMARY IMPLEMENTATION GOAL
==================================================

Create one dependable capability and advertisement-loading architecture that determines whether the current visitor should receive advertisements.

The result must guarantee:

PUBLIC / FREE

- advertisements may initialize
- valid advertisement placements may mount
- no-fill placements collapse cleanly
- providers initialize at most once
- route or view changes do not duplicate providers
- failed advertisements do not block the site

PREMIUM

- advertisement scripts do not load
- advertisement providers do not initialize
- advertisement network requests do not occur
- popunders do not initialize
- hidden advertisement iframes do not exist
- empty advertisement spaces do not remain
- Premium layout reclaims advertisement space naturally

Do not merely hide advertisements with CSS.

==================================================
QUALIFYING PREMIUM ACCESS
==================================================

Premium access should follow the existing authoritative backend behavior.

Qualifying access includes:

- subscription status `trialing`
- subscription status `active`
- existing approved staff or bypass roles already recognized by `/api/account/access`

Nonqualifying access includes:

- logged-out visitor
- ordinary free account
- no subscription
- past_due
- unpaid
- canceled
- incomplete
- expired or otherwise nonqualifying subscription

Do not invent new roles or subscription states.

Do not trust:

- localStorage Premium flags
- URL parameters
- DOM attributes
- client-supplied roles
- email addresses
- frontend-only subscription values

Use the existing authoritative account-access mechanism.

==================================================
REPOSITORY AUDIT BEFORE EDITING
==================================================

Before changing code, identify every advertisement entry point.

Search for and document:

- advertisement provider scripts
- banner scripts
- popunder initialization
- overlays
- rotunda advertisements
- reader advertisements
- dynamic script injection
- iframes
- advertisement configuration
- advertisement IDs
- provider retry logic
- no-fill behavior
- advertisement CSS
- advertisement event listeners
- route-change reinjection
- global HTML script tags
- advertisements initialized before account access resolves

Also inspect:

- `/api/account/access`
- frontend access checks
- session initialization
- login
- logout
- account switching
- checkout return
- subscription refresh
- existing Premium helpers
- existing tests

Before implementation, add an audit section to the final report listing the advertisement entry points found and how each was handled.

==================================================
CENTRALIZED ACCESS CAPABILITY MODULE
==================================================

Create or refine one centralized access-state module appropriate to the existing repository.

Do not scatter subscription-string comparisons across components.

The module should expose a clear state similar to:

- unresolved
- logged-out
- free
- premium-trialing
- premium-active
- premium-bypass
- nonqualifying
- error

It should expose derived capabilities similar to:

- isAccessResolved
- hasPremiumAccess
- shouldLoadAds
- mayComment
- mayUseContinuousReader
- mayViewPremiumCatalog
- shouldShowUpgradePrompt

Only implement the capabilities needed safely for the present architecture, but establish a clean foundation for the future reader split.

Adapt names and file paths to the repository.

Do not impose a new framework.

==================================================
ACCESS REQUEST BEHAVIOR
==================================================

The access layer must:

- use `/api/account/access` as the authoritative source
- deduplicate simultaneous access requests
- avoid making one request per advertisement slot
- cache access only for the appropriate current session
- clear account-specific state on logout
- recheck after login
- recheck after account switching
- recheck after successful checkout
- handle delayed webhook synchronization safely
- avoid one account inheriting another account’s access state
- support multiple tabs where practical
- avoid freezing public content

Do not place Premium authorization inside each advertisement component.

Resolve access centrally, then provide capabilities to advertisement code.

==================================================
UNRESOLVED ACCESS STATE
==================================================

While access is unresolved:

- do not initialize advertisements yet
- do not inject advertisement scripts
- do not initialize popunders
- do not briefly show advertisement slots to Premium users
- keep ordinary static content visible
- do not freeze the page
- avoid major layout shifts

Account-sensitive regions may use a subtle reserved or loading state only where needed.

Do not reserve large blank advertisement boxes while access is resolving.

==================================================
ACCESS FAILURE POLICY
==================================================

Choose and document a deliberate behavior when `/api/account/access` fails.

The safest initial policy should prioritize:

- no accidental Premium privilege
- no broken public reading
- no repeated request storm
- no infinite loading state

A reasonable policy to evaluate is:

- treat commenting and Premium-only capabilities as unavailable
- keep public reading available
- do not initialize intrusive advertisements during an unresolved transient failure
- retry access in a controlled, bounded manner
- permit a later state refresh
- show no raw error to ordinary readers unless account-sensitive controls require one

Do not silently create an infinite retry loop.

Document the final chosen policy.

==================================================
CENTRAL ADVERTISEMENT ORCHESTRATOR
==================================================

Create one centralized advertisement loader or orchestrator appropriate to the current codebase.

It should be responsible for:

- determining whether advertisements are allowed
- injecting provider scripts only when allowed
- initializing each provider at most once
- registering available slots
- preventing duplicate slot creation
- handling route or view changes
- handling no-fill
- handling provider failure
- cleaning up abandoned placeholders
- preventing Premium initialization
- supporting future public-reader advertisement intervals

The orchestrator should be idempotent.

Repeated calls must not:

- inject duplicate scripts
- create duplicate popunders
- attach duplicate click handlers
- render duplicate advertisements
- generate duplicate network traffic

==================================================
STATIC HTML AND GLOBAL SCRIPT AUDIT
==================================================

Any provider script embedded directly in static HTML and automatically executing before access resolution must be refactored into controlled loading.

Do not leave advertisement scripts in:

- initial HTML
- globally executed modules
- unconditional application startup
- code paths that run before access is known

The controlled loader should inject them only after:

shouldLoadAds === true

Do not change advertisement account IDs, placement IDs, or provider configuration unless necessary for correctness.

Never commit secrets.

==================================================
PREMIUM ZERO-REQUEST GUARANTEE
==================================================

For a qualifying Premium account, verify all of the following:

- no known advertisement provider script appears in the DOM
- no advertisement iframe appears
- no advertisement initialization function runs
- no advertisement network request is sent
- no popunder handler is registered
- no advertisement click overlay is mounted
- no advertisement retry timer begins
- no blank advertisement region remains
- no public-layout gap remains where the advertisement would have been

CSS hiding alone does not satisfy this requirement.

==================================================
PUBLIC ADVERTISEMENT BEHAVIOR
==================================================

For public and free users:

- existing advertisement placements should continue working
- providers should initialize only once
- advertisement failure should not block reading
- no-fill placements should collapse
- advertisements should not cover core navigation
- mobile layouts should not overflow
- click regions must not extend beyond visible advertisement placements
- popunder or overlay behavior must not freeze the application
- returning from an advertisement must preserve reader state
- advertisements must not continuously reinitialize during normal navigation

Preserve the current providers and placements unless a present implementation is unsafe or broken.

Where a placement is unsafe, document it and make the smallest coherent correction.

==================================================
LAYOUT BEHAVIOR
==================================================

Advertisement regions should be platform-controlled components.

When advertisements are unavailable or prohibited:

- remove or collapse the slot
- allow nearby content to reclaim the space
- do not leave a large fixed-height box
- avoid visible layout jumping
- preserve readable content widths
- preserve mobile behavior

Premium should feel intentionally ad-free, not like a public layout with missing objects.

==================================================
POPUNDER AND OVERLAY SAFETY
==================================================

Audit all popunder and overlay logic carefully.

The implementation must prevent:

- application freezing until click
- transparent overlays covering the entire site indefinitely
- navigation becoming unusable
- duplicate overlays
- repeated popunders during one navigation action
- Premium users receiving popunder code
- click handlers remaining after the placement is removed
- route changes multiplying handlers
- advertisements replacing the current page unexpectedly when a new tab is intended

Preserve the provider’s valid integration requirements, but prioritize application safety.

Document any provider behavior that cannot be made reliable.

==================================================
SESSION TRANSITIONS
==================================================

Implement and test these transitions:

LOGGED OUT → FREE ACCOUNT

- advertisements remain permitted
- access state updates without duplication

LOGGED OUT → PREMIUM ACCOUNT

- access resolves
- advertisements never initialize after Premium is known
- any unresolved placeholders disappear

FREE → CHECKOUT → TRIALING

- access refreshes after checkout
- advertisement providers stop initializing on subsequent navigation
- advertisement components unmount or collapse
- no page reload loop occurs

PREMIUM → LOGOUT

- Premium state clears
- public state becomes eligible for advertisements
- advertisements initialize once when appropriate

PREMIUM ACCOUNT → FREE ACCOUNT SWITCH

- previous Premium state does not leak
- advertisement eligibility is recalculated

FREE ACCOUNT → PREMIUM ACCOUNT SWITCH

- prior advertisement timers and handlers do not survive improperly
- Premium receives no subsequent advertisement initialization

==================================================
CACHING AND COST
==================================================

Do not make account-access checks excessively expensive.

The implementation should:

- deduplicate access requests
- cache the result for the current session
- invalidate it on meaningful session changes
- avoid per-slot backend calls
- avoid advertisement-provider duplication
- avoid repeated provider downloads
- keep public static content cacheable
- keep account-sensitive access responses separate from public static assets

Do not cache one user’s access state for another user.

Do not place account-specific values into public CDN-cached HTML.

==================================================
SECURITY BOUNDARIES
==================================================

This implementation controls presentation and advertisement initialization.

It must not replace authoritative backend authorization.

Do not:

- move subscription authority into the browser
- expose Stripe secrets
- expose Supabase service-role credentials
- trust frontend Premium flags
- weaken comment RPC authorization
- change current RLS behavior
- change SECURITY DEFINER protections
- make Premium catalog access frontend-only in this task

The client decides presentation from an authoritative access response.

The backend remains responsible for protected actions.

==================================================
TESTS
==================================================

Add or update automated tests where the current test structure permits.

At minimum test:

ACCESS

- unresolved
- logged out
- free
- trialing
- active
- approved bypass
- past_due
- canceled
- access error
- request deduplication
- logout
- account switching
- checkout refresh

ADVERTISEMENTS

- logged-out user may initialize ads
- free account may initialize ads
- trialing account does not inject provider script
- active account does not inject provider script
- bypass account does not inject provider script
- Premium produces no ad initialization call
- provider initializes only once
- repeated render does not duplicate scripts
- repeated route navigation does not duplicate scripts
- no-fill collapses slot
- provider failure does not break page
- unresolved access does not initialize ads
- access failure follows documented policy
- Premium layout contains no empty slot

POPUNDER / OVERLAY

- Premium never registers handler
- public handler is registered at most once
- overlay cannot permanently block application
- cleanup removes handlers
- account transition removes prohibited behavior

Run the repository’s existing test commands.

At minimum run:

npm test
npm run build

Where test scripts differ, inspect package.json and run the correct equivalents.

==================================================
MANUAL VERIFICATION
==================================================

Verify at minimum:

- logged-out visitor
- free account
- trialing account
- active account
- past_due account
- staff bypass account
- logout
- account switch
- checkout return
- access endpoint failure
- advertisement no-fill
- advertisement provider failure

Inspect browser Network and DOM tools.

For Premium verify:

- no provider request
- no provider script
- no iframe
- no popunder registration
- no blank slot

Review viewports:

- 320px
- 375px
- 390px
- 768px
- 1024px
- 1440px

==================================================
IMPLEMENTATION BOUNDARIES
==================================================

Do implement:

- centralized access capabilities
- safe access initialization
- advertisement eligibility
- controlled advertisement loading
- Premium zero-ad initialization
- idempotent provider handling
- advertisement-slot collapse
- relevant session-transition handling
- tests
- focused documentation

Do not yet implement:

- complete page-by-page flipbook rewrite
- Premium continuous-scroll reader
- numeric work URLs
- chapter and page routing
- permanent work ID allocation
- Premium tag protection
- protected R2 manifests
- signed image URLs
- image-download deterrence
- new billing plans
- major visual redesign
- framework migration
- service worker
- unrelated cleanup

Do not transform this task into a total reader rewrite.

==================================================
REQUIRED DOCUMENTATION
==================================================

Create or update:

docs/codex/ad-vs-no-ads-implementation-report.md

Include:

1. Advertisement entry points discovered
2. Current access flow discovered
3. Files changed
4. Central capability design
5. Advertisement-loader design
6. Premium zero-request mechanism
7. Public advertisement behavior
8. Popunder and overlay corrections
9. Access failure policy
10. Session-transition behavior
11. Tests added
12. Manual verification performed
13. Known limitations
14. Rollback instructions
15. Future work intentionally excluded

Do not overwrite the larger architecture documents.

==================================================
DEFINITION OF DONE
==================================================

The task is complete only when:

- Premium `trialing` receives no advertisements
- Premium `active` receives no advertisements
- approved bypass users receive no advertisements
- no advertisement script or provider request occurs for Premium
- public and free users retain controlled advertisement behavior
- access is resolved centrally
- advertisement providers initialize at most once
- route changes do not duplicate advertisement behavior
- access transitions do not leak state between accounts
- no-fill slots collapse
- failed advertisements do not break public reading
- Premium has no empty advertisement gaps
- tests pass
- build passes
- implementation report is complete

==================================================
GIT AND SAFETY
==================================================

Before editing:

- inspect git status
- stop if unrelated uncommitted changes would be overwritten
- do not reset or discard existing work
- do not modify the safety tag
- do not deploy automatically
- do not merge automatically

At completion run:

git diff --check
git status --short
npm test
npm run build

Report:

1. Files changed
2. Advertisement entry points found
3. Central access implementation
4. Premium zero-request verification
5. Public advertisement verification
6. Session-transition verification
7. Tests run and results
8. Build result
9. Known limitations
10. Confirmation that no deployment occurred
