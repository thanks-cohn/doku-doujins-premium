Repository: thanks-cohn/doku-doujins-premium
Local repository: ~/dev/doku-doujins-premium
Base branch: main
Safety tag: pre-adfree-and-routing-proposal

TASK TYPE:
REPOSITORY AUDIT AND ARCHITECTURE REWRITE PLAN ONLY

This task must produce two design documents describing the future separation between:

1. The public/free page-flip reader with advertising
2. The Premium continuous-scroll reader with no advertising

Do not implement the architecture yet.

Do not modify runtime application code.

Do not refactor the reader.

Do not change advertisements.

Do not change Stripe, Supabase, R2, Cloudflare, SQL, routing, manifests, authentication, comments, tags, or deployment configuration.

Do not install dependencies.

Do not create a proof of concept.

Do not deploy.

The only permitted changes are two new Markdown documents:

docs/codex/ad-public-vs-premium-scroll-down.md
docs/premium-vs-free.md

The first document is the complete technical architecture specification intended for a future Codex implementation task.

The second document is a clear human-readable explanation of the same architecture for the site owner.

==================================================
PRIMARY PRODUCT VISION
==================================================

The site should provide two deliberately different reader experiences.

They must remain part of:

- one website
- one catalog
- one account system
- one design language
- one set of permanent work identities
- one set of chapter and page manifests
- one shared reader foundation

Do not propose two separately maintained applications.

The distinction is based on capabilities and presentation.

PUBLIC / FREE:

- page-by-page flipbook reader
- deliberate Next and Previous navigation
- advertisements
- comments readable but writing locked
- public catalog access
- limited image loading
- lower delivery cost
- permanent work, chapter, and page URLs

PREMIUM:

- continuous vertical scrolling
- no advertisements
- no advertisement scripts or requests
- comments and replies
- editing of owned comments
- broader approved catalog and Premium-tag access
- lazy-loaded uninterrupted reading
- permanent work, chapter, and page URLs
- saved reading position where practical

The Premium reader is not merely the public reader with advertisements hidden.

It is a distinct reading mode built on the same underlying work and manifest data.

==================================================
PREMIUM VALUE PROPOSITION
==================================================

Premium currently has four central benefits.

1. FLOW

Continuous scrolling without pressing Next after every page.

2. SILENCE

No banners, popunders, advertisement providers, hidden frames, or advertisement-network requests.

3. VOICE

Comments, replies, and editing of owned comments.

4. ACCESS

Access to the broader approved catalog, including Premium-visible tags and works omitted from the public edition.

The product message should remain understandable:

“Open the whole library.

Scroll without interruption.
Read without ads.
Join the discussion.
Unlock the complete approved catalog.”

The architecture must make these differences real and enforceable.

==================================================
REQUIRED REPOSITORY AUDIT
==================================================

Before proposing the architecture, inspect the repository thoroughly.

Every major claim about the current system must cite:

- exact file path
- relevant function, class, module, or configuration
- present behavior
- whether the finding is confirmed or inferred
- any uncertainty requiring later testing

Audit the following areas.

--------------------------------------------------
CURRENT READER
--------------------------------------------------

Determine:

- how works are opened
- whether the reader is modal, routed, or state-driven
- how pages are represented
- how chapters are represented
- how Next and Previous work
- whether swiping exists
- whether keyboard navigation exists
- whether the URL changes
- whether browser history is used
- whether refresh restores the reader
- whether work state exists only in memory
- how progress is stored
- how many images load when a work opens
- whether images outside the viewport are loaded
- whether the reader currently distinguishes free and Premium users

--------------------------------------------------
CURRENT ROUTING
--------------------------------------------------

Inspect:

- work links
- page links
- profile routing
- hash handling
- query-string handling
- History API use
- Cloudflare Pages fallback behavior
- direct-route refresh behavior
- redirects
- route configuration
- Pages Functions
- any Worker use
- build output structure

Explain why works currently remain under or return to the homepage URL.

--------------------------------------------------
CURRENT ADVERTISING
--------------------------------------------------

Find every advertisement entry point, including:

- provider scripts
- banners
- popunders
- overlays
- rotunda advertisements
- reader advertisements
- page-transition advertisements
- dynamically injected scripts
- advertisement configuration
- retries
- no-fill handling
- ad-related CSS
- ad-related event listeners
- route-change reinjection
- click overlays

Document whether any advertisement scripts currently load globally before Premium access is known.

--------------------------------------------------
CURRENT PREMIUM ACCESS
--------------------------------------------------

Inspect:

- login
- logout
- session resolution
- `/api/account/access`
- subscription status
- role checks
- staff bypasses
- access caching
- account switching
- checkout
- Stripe webhook synchronization
- delayed subscription updates
- frontend Premium checks
- duplicate access requests
- access-request failure behavior

Identify the authoritative source of Premium status.

--------------------------------------------------
CURRENT COMMENTS
--------------------------------------------------

Inspect:

- discussion UI
- discussion service
- RPC calls
- create_comment
- edit_own_comment
- delete_own_comment
- SECURITY DEFINER behavior
- RLS
- authorship records
- service-role use
- frontend gating
- friendly versus raw error handling

Preserve the current intended rules:

- comments are readable publicly
- `trialing` may create, reply, and edit
- `active` may create, reply, and edit
- approved staff bypass roles may participate
- free and nonqualifying users are read-only
- expired users may still delete their own old comments

--------------------------------------------------
CURRENT IMAGE DELIVERY
--------------------------------------------------

Inspect:

- R2 paths
- image manifests
- image variants
- covers
- thumbnails
- full-size pages
- eager loading
- lazy loading
- prefetching
- cache headers
- retries
- responsive source selection
- browser-cache behavior
- repeated downloads
- whether original-quality assets are exposed

Determine whether opening a work presently loads:

- one page
- adjacent pages
- one chapter
- the entire work
- multiple variants of the same image

--------------------------------------------------
CURRENT TAG AND CATALOG ACCESS
--------------------------------------------------

Inspect:

- tag files
- public tags
- private tags
- blocked tags
- hidden works
- search filtering
- homepage filtering
- recommendation filtering
- direct URL behavior
- manifest exposure
- work-level visibility
- Premium visibility logic, if any

Distinguish between:

- hidden from discovery
- actually inaccessible

==================================================
FUTURE PUBLIC READER
==================================================

The public reader should be a polished page-by-page flipbook.

The user sees one image page at a time.

Navigation should support:

- Next
- Previous
- keyboard arrows
- mobile swipe
- click or tap controls where appropriate
- direct page jump
- chapter navigation
- browser Back
- browser Forward
- refresh
- copying and sharing the current page URL

The public reader should generally load:

- the current page
- optionally the previous page
- one or two likely upcoming pages
- the chapter manifest
- only essential interface assets

It should not automatically download an entire chapter.

The design goals are:

- reduce R2 and bandwidth cost
- reduce wasted image transfer
- improve first-page speed
- reduce browser memory use
- preserve mobile performance
- create deliberate advertising opportunities
- establish a clear contrast with Premium

The free reader must remain pleasant.

It must not feel deliberately defective.

It should be described as a classic, lightweight reader.

==================================================
PUBLIC READER ADVERTISING
==================================================

The public reader may contain controlled advertisements.

Possible placements include:

- under the current page
- between groups of pages
- after selected page transitions
- desktop side placements
- safe mobile inline placements
- existing homepage or rotunda locations

The system should eventually centralize advertisement rules.

Conceptual configurable properties may include:

- slot name
- provider
- dimensions
- placement
- minimum page before the first ad
- page interval
- maximum ads per chapter
- mobile eligibility
- desktop eligibility
- viewport requirements
- no-fill behavior
- enabled state
- retry limits
- initialization state

Do not require this exact schema if the current repository suggests a better structure.

The public reader should not show an advertisement after every page.

The architecture must address:

- abandonment risk
- accidental clicks
- popunder frequency
- provider policy
- mobile safety
- layout shifts
- duplicate initialization
- route-change reinjection
- no-fill collapse
- advertisement failure
- accessibility
- keyboard and touch controls remaining usable

==================================================
FUTURE PREMIUM READER
==================================================

The Premium reader should display pages in a continuous vertical flow.

A Premium user should be able to open a work and simply scroll downward.

The reader should provide:

- continuous scrolling
- no repeated Next button requirement
- no advertising
- no advertisement placeholders
- comments and replies
- editing of owned comments
- access to Premium-visible catalog content
- saved position where practical
- a calmer layout
- chapter transitions
- stable page-address synchronization

Continuous scrolling must not mean eager downloading.

The Premium reader should evaluate:

- IntersectionObserver
- viewport-based loading
- limited forward prefetch
- limited backward retention
- placeholder dimensions
- responsive image variants
- image decoding
- memory pressure
- DOM virtualization
- unloading distant page elements
- preserving scroll height
- long chapters
- tab suspension
- mobile browsers
- returning to a previous page
- browser-cache reuse

Premium should feel uninterrupted while still remaining cost-controlled.

==================================================
GENUINELY AD-FREE PREMIUM
==================================================

Premium users must not merely have advertisements hidden through CSS.

Incorrect:

- provider script loads
- provider receives a request
- iframe is created
- popunder initialization occurs
- advertisement is hidden afterward

Correct:

- authoritative access resolves
- Premium capability is confirmed
- advertisement provider does not initialize
- advertisement script is not injected
- no ad-network request occurs
- no popunder initializes
- no advertisement component mounts
- layout reclaims the unused space

The architecture must explain how to prevent:

- advertisement flash before access resolves
- provider initialization races
- ads appearing briefly during login
- ads remaining after checkout
- ads leaking between account sessions
- duplicate script injection
- route-change reinitialization

While access is unresolved:

- keep static work content visible
- do not initialize advertisements
- do not show Premium-only comment controls
- avoid showing an upgrade prompt to a known Premium account
- use a subtle state for account-sensitive controls

The document must recommend safe behavior when access resolution fails.

==================================================
CENTRALIZED CAPABILITY ARCHITECTURE
==================================================

Recommend a centralized access and capability layer.

Do not allow unrelated components to interpret raw subscription strings independently.

The architecture may expose capabilities such as:

- hasPremiumAccess
- readerMode
- mayUseContinuousReader
- mayComment
- mayReply
- mayEditOwnComment
- mayDeleteOwnComment
- mayViewPremiumCatalog
- shouldLoadAds
- shouldShowUpgradePrompt
- isAccessResolved

Study the repository before recommending final names and file locations.

The layer should account for:

- logged-out visitor
- free account
- trialing
- active
- staff bypass
- past_due
- canceled
- unpaid
- incomplete
- access failure

The proposal must explain:

- initialization
- request deduplication
- session caching
- logout
- account switching
- post-checkout refresh
- webhook delay
- multi-tab synchronization
- avoiding one account inheriting another account’s state
- safe failure behavior

==================================================
MEMBERSHIP BEHAVIOR
==================================================

LOGGED OUT

Receives:

- public catalog
- page-by-page reader
- advertisements
- public comment reading
- permanent URLs

Does not receive:

- continuous scroll
- comment writing
- Premium catalog access

FREE ACCOUNT

Receives:

- public reader
- advertisements
- account identity
- bookmarks
- reading history
- progress where supported
- public comments
- public catalog

Does not receive:

- continuous scroll
- comment writing
- Premium catalog access

TRIALING PREMIUM

Receives:

- continuous scroll
- no advertising
- comments and replies
- editing of owned comments
- broader approved catalog
- complete Premium experience

ACTIVE PREMIUM

Receives the same Premium capabilities continuously.

NONQUALIFYING OR EXPIRED ACCOUNT

Returns to:

- public flipbook reader
- advertisements
- read-only comments
- public catalog

Retains:

- account
- bookmarks
- history
- progress
- existing comments
- deletion of owned old comments

==================================================
PERMANENT STANDARDIZED URLS
==================================================

Both reader modes must use the same canonical work, chapter, and page identity.

Evaluate this standardized canonical structure:

https://9127000.xyz/work/134123132/chapter/1/page/7

Conceptual pattern:

/work/{work_id}/chapter/{chapter_id_or_number}/page/{page_id_or_number}

The architecture must determine whether a fully path-based page route is practical with:

- Cloudflare Pages
- direct refresh
- no Worker
- millions of works
- millions or billions of page routes
- static fallback behavior
- canonical links
- automated ingestion
- route parsing
- browser history

Compare it with:

/work/134123132/chapter/1/#page-7

/work/134123132/chapter/1/?page=7

Do not use custom `@=` syntax.

The recommendation must be standardized, durable, and suitable for automation.

==================================================
WORK, CHAPTER, AND PAGE IDENTITY
==================================================

Every work receives a permanent numeric ID.

The numeric ID is identity.

The following are not identity:

- title
- slug
- folder
- upload filename
- catalog position
- R2 path
- cover filename

Work IDs must:

- never change
- never be reused
- survive title changes
- survive R2 reorganization
- support tombstones
- support aliases where needed
- support idempotent ingestion
- remain safe under concurrent automation

Address JavaScript’s maximum safe integer.

If IDs may exceed:

9007199254740991

they should be represented as digit strings rather than JavaScript numbers.

The appraisal must also decide whether chapters and pages need:

- stable permanent IDs
- display numbers
- both identities and display positions

It must account for:

- inserted chapters
- reordered chapters
- bonus chapters
- deleted chapters
- inserted missing pages
- removed duplicate pages
- rescanned pages
- replaced images
- split pages
- combined pages
- avoiding broken permanent links

==================================================
PUBLIC URL HISTORY BEHAVIOR
==================================================

In the public flipbook, deliberate page changes should create useful history states.

Expected behavior:

- open page 7
- select Next
- move to page 8
- URL changes to page 8
- Back returns to page 7
- Forward returns to page 8
- refresh restores page 8
- copying the URL shares page 8

Evaluate:

- standard links
- pushState
- popstate
- fragments
- query parameters
- focus restoration
- prefetching

==================================================
PREMIUM URL HISTORY BEHAVIOR
==================================================

In Premium continuous scrolling, the URL should identify the currently dominant visible page without creating one browser-history entry for every page passed.

Evaluate:

- IntersectionObserver
- dominant-page calculation
- throttled URL updates
- replaceState during passive scrolling
- pushState for deliberate jumps
- chapter transitions
- scroll restoration
- opening a shared page URL
- switching between free and Premium reader modes

A likely model is:

- public deliberate page changes use pushState
- Premium passive scrolling uses replaceState
- deliberate page jumps create a meaningful history entry

Validate this against the repository.

==================================================
BROWSER, CDN, AND R2 CACHING
==================================================

The system is intended to maximize caching and minimize unnecessary infrastructure cost.

The architecture should assume the possibility of extremely large future traffic, potentially hundreds of millions or billions of readers.

This scale is aspirational rather than guaranteed, but the foundations should avoid requiring a later rewrite.

Prioritize:

- browser HTTP cache
- Cloudflare edge cache
- tiered caching where useful
- immutable image objects
- versioned manifests
- content-hashed filenames
- shared cacheable public assets
- minimal R2 origin reads
- minimal Worker requests
- minimal Supabase requests
- limited image prefetching
- low marginal cost per repeated reader

The ideal repeated public page request should be served from:

1. browser memory cache
2. browser disk cache
3. Cloudflare edge cache
4. higher-tier cache
5. R2 only when necessary

The architecture must distinguish:

- browser cache
- decoded image memory
- DOM presence
- manifest state
- saved reading progress

Removing an image from the DOM should not necessarily require redownloading it if the browser cache remains valid.

==================================================
CACHE STRATEGY
==================================================

Evaluate cache policies for:

- versioned JavaScript
- versioned CSS
- fonts
- icons
- thumbnails
- covers
- page-image variants
- immutable work manifests
- immutable chapter manifests
- mutable publication pointers
- public catalog shards
- tag indexes
- reader shell
- account-sensitive API responses

Strongly consider:

Cache-Control: public, max-age=31536000, immutable

for immutable hashed assets.

For mutable pointers and indexes, evaluate:

- ETags
- Last-Modified
- conditional requests
- stale-while-revalidate
- shorter freshness windows
- immutable versions plus a small mutable pointer

Avoid:

- random cache-busting query parameters
- per-user public asset URLs
- cookies fragmenting static asset caches
- overwriting long-cached objects under unchanged keys
- enormous global catalog downloads

==================================================
PUBLIC IMAGE BUDGET
==================================================

The public reader should have a controlled image-loading budget.

Consider:

- current page
- one previous page
- one or two next pages
- current navigation direction
- viewport size
- device memory
- network quality
- Save-Data
- effective connection type
- mobile limitations

Do not preload an entire chapter.

Previously visited pages should be reusable from browser cache when navigating backward.

==================================================
PREMIUM IMAGE BUDGET
==================================================

Premium continuous scroll should remain efficient.

Consider:

- lazy loading near the viewport
- limited look-ahead
- limited retained decoded images
- virtualization
- browser cache reuse
- placeholders
- long chapters
- memory pressure
- device capability
- data-saving preferences
- tab suspension
- restoring position

Premium is an uninterrupted interface, not a promise to wastefully download everything.

==================================================
PREMIUM TAG AND CATALOG ACCESS
==================================================

Premium should eventually unlock more of the approved catalog.

Recommend explicit visibility states such as:

- public
- account
- premium
- age-restricted
- administrative
- removed

Premium may unlock approved `premium` content.

Premium must not override:

- removed content
- illegal-content restrictions
- administrative quarantine
- required age restrictions
- private material
- territorial restrictions
- content the platform refuses to distribute

Distinguish:

DISCOVERY RESTRICTION

- omitted from public search and navigation
- direct URL may still function
- assets remain public
- highly cacheable
- weak access enforcement

ACTUAL ACCESS CONTROL

- unauthorized users cannot retrieve manifests or images
- stronger restriction
- potentially requires gated manifests, signed URLs, or dynamic authorization
- may reduce shared cache efficiency
- may require limited Worker use

The architecture must state where zero Workers remains practical and where actual Premium asset protection creates a genuine conflict.

==================================================
IMAGE DOWNLOAD DETERRENCE
==================================================

The site should discourage effortless casual downloading.

Possible measures include:

- no visible download button
- context-menu prevention
- drag prevention
- interaction overlays
- display-quality variants instead of archival originals
- non-obvious object names
- hotlink controls
- rate limiting
- watermarking
- bot controls

The document must remain technically honest:

A browser that displays an image has received image information.

JavaScript cannot make a displayed public image impossible to save.

Determined users may use:

- developer tools
- network inspection
- browser cache
- disabled JavaScript
- automation
- screenshots
- screen photography

The real objective is:

“Prevent effortless casual downloading, avoid exposing archival originals, and make automated mass retrieval more difficult.”

Discuss accessibility and caching consequences before recommending any deterrent.

==================================================
STATIC-FIRST FAILURE MODEL
==================================================

Public reading should remain available whenever possible if:

- Supabase fails
- Stripe fails
- account access fails
- comments fail
- advertisements fail
- discovery indexes are temporarily stale

The static catalog, manifests, reader shell, and public images should not depend on dynamic account infrastructure merely to display ordinary public content.

The architecture should define graceful degradation for:

- failed Premium check
- failed advertisements
- failed comments
- stale subscription state
- delayed Stripe webhook
- missing manifest
- missing image
- invalid chapter
- invalid page
- removed work

==================================================
ARCHITECTURAL OPTIONS TO COMPARE
==================================================

Compare at least:

ROUTE A:
Shared static reader shell with mode-aware behavior

ROUTE B:
Generated static work or chapter routes

ROUTE C:
Static chapter routes with fragment-based page selection

ROUTE D:
SPA-style fallback shell with standardized path parsing

ROUTE E:
Hybrid static public content with gated Premium manifests or assets

ROUTE F:
Worker-based routing

For every route evaluate:

- fit with the current repository
- amount of change
- rewrite risk
- direct refresh
- canonical URLs
- browser history
- Cloudflare Pages
- zero-Worker compatibility
- automation
- millions-of-works scale
- image delivery
- cache behavior
- Premium asset security
- operating cost
- rollback
- testing burden

Recommend:

- one primary architecture
- one fallback architecture
- the conditions under which the fallback becomes necessary

==================================================
FUTURE ARCHITECTURE BOUNDARIES
==================================================

The future implementation should ideally separate concerns such as:

- access and capabilities
- public flipbook reader
- Premium flow reader
- shared reader state
- URL and history synchronization
- manifest loading
- image scheduling
- progress storage
- advertisement configuration
- advertisement provider loading
- discussion interface
- catalog visibility
- analytics
- error handling

Do not mandate exact file paths before studying the repository.

The document should recommend a coherent module structure adapted to the existing project.

==================================================
STAGED IMPLEMENTATION ROADMAP
==================================================

Propose an incremental rewrite plan.

Do not implement it.

PHASE 0: AUDIT AND SAFETY BASELINE

- document present behavior
- identify reader and advertisement entry points
- establish tests
- establish canonical terminology
- record unresolved questions

PHASE 1: SHARED IDENTITY AND URL FOUNDATION

- permanent work identity
- chapter identity
- page identity
- canonical URL
- URL parsing
- browser-history contract
- legacy-link strategy

PHASE 2: CENTRALIZED ACCESS CAPABILITIES

- authoritative access resolution
- reader mode
- advertising eligibility
- commenting eligibility
- catalog eligibility
- loading and failure states
- logout and account switching

PHASE 3: SHARED READER CORE

- manifest loading
- work state
- chapter state
- page state
- progress
- image scheduler
- URL synchronization
- shared controls and accessibility

PHASE 4: PUBLIC FLIPBOOK

- one-page display
- limited adjacent prefetch
- Next and Previous
- keyboard
- swipe
- browser history
- controlled advertising regions

PHASE 5: PREMIUM FLOW READER

- continuous layout
- lazy loading
- virtualization
- visible-page URL updates
- memory controls
- restored position
- no advertisement code

PHASE 6: ADVERTISEMENT ORCHESTRATION

- centralized slots
- interval rules
- provider initialization
- no-fill collapse
- mobile safeguards
- route safety
- Premium zero-request verification

PHASE 7: COMMENT PRESENTATION

- Premium composer
- locked free composer
- replies
- editing
- friendly server rejection
- deletion after Premium ends

PHASE 8: PREMIUM CATALOG ACCESS

- visibility states
- discovery filters
- direct URL policy
- manifest protection policy
- age restrictions
- administrative and removed states

PHASE 9: PERFORMANCE AND CACHE VALIDATION

- browser cache
- edge cache
- R2 reads
- long chapters
- mobile memory
- Save-Data
- viral traffic
- cache stampede behavior

PHASE 10: MIGRATION AND ROLLBACK

- existing works
- existing links
- reader transition
- account transitions
- checkout return
- trial expiration
- analytics
- rollback drills

For every phase include:

- objective
- prerequisites
- repository areas affected
- likely files or modules
- data migrations, if any
- risks
- tests
- performance criteria
- security criteria
- rollback procedure
- evidence required before continuing

==================================================
TESTING EXPECTATIONS
==================================================

The technical document should propose tests for:

ACCESS

- logged out
- free account
- trialing
- active
- past_due
- canceled
- unpaid
- staff bypass
- access failure
- logout
- account switching
- delayed webhook
- checkout completion

PUBLIC READER

- direct page URL
- refresh
- Back
- Forward
- Next
- Previous
- keyboard
- swipe
- invalid page
- missing chapter
- missing work
- limited image loading
- no whole-chapter eager load

PREMIUM READER

- continuous scroll
- visible-page URL updates
- shared page URL restoration
- lazy loading
- virtualization
- long chapter
- mobile memory
- no excessive browser-history entries
- returning to previously viewed pages
- trial expiration transition

ADVERTISING

- public initialization
- Premium script absence
- Premium request absence
- no duplicate provider
- no popunder reinjection
- no-fill collapse
- mobile placement
- controls unobstructed
- access-loading state

COMMENTS

- public reading
- free locked composer
- Premium composer
- reply permission
- edit permission
- deletion after expiration
- friendly RPC rejection
- server-side enforcement

CACHING

- immutable image reuse
- Back navigation without unnecessary transfer
- manifest caching
- stale pointer behavior
- version update
- image correction
- removed-work behavior
- no accidental per-user cache fragmentation

VIEWPORTS

At minimum:

- 320px
- 375px
- 390px
- 768px
- 1024px
- 1440px

==================================================
PITFALLS TO ADDRESS
==================================================

Explicitly discuss:

- total rewrite risk
- public and Premium code duplication
- two drifting reader implementations
- title-based identity
- mutable IDs
- unsafe numeric IDs
- chapter reordering breaking URLs
- page insertion breaking URLs
- false homepage fallback
- direct refresh failure
- duplicate canonical URLs
- route and History API loops
- hundreds of history entries during scrolling
- eager whole-chapter loading
- Premium memory exhaustion
- excessive image decoding
- repeated image downloads
- stale progress
- advertisement flash
- CSS-only ad hiding
- provider loading before access resolution
- duplicate advertisements
- popunder reinjection
- advertisement after every page
- no-fill holes
- mobile overflow
- stale account state
- one user inheriting another user’s state
- delayed webhooks
- service-role bypass
- SECURITY DEFINER bypass
- free users bypassing frontend controls
- hidden tags mistaken for true access control
- public manifests exposing Premium material
- signed URLs destroying shared caching
- service-worker update bugs
- image deterrence breaking accessibility
- promises of impossible DRM
- static reading depending on Supabase
- static reading depending on Stripe
- logging costs at extreme scale
- cache invalidation errors
- viral cold-cache stampedes

==================================================
DOCUMENT 1: TECHNICAL CODEX ARCHITECTURE
==================================================

Create:

docs/codex/ad-public-vs-premium-scroll-down.md

Visible title:

# Public Ad-Supported Flipbook vs Premium Continuous-Scroll Architecture

This must be an extensive technical specification suitable for a later Codex implementation task.

It should be structured so that another coding agent can execute the rewrite in controlled phases without having to rediscover the entire product intention.

Include:

1. Executive technical summary
2. Product requirements
3. Confirmed current repository architecture
4. Current reader audit
5. Current routing audit
6. Current advertisement audit
7. Current access audit
8. Current comment audit
9. Current image-loading audit
10. Current tag and catalog audit
11. Target capability model
12. Target public flipbook architecture
13. Target Premium continuous-scroll architecture
14. Shared reader-core architecture
15. Standardized URL and history architecture
16. Work, chapter, and page identity requirements
17. Manifest-loading strategy
18. Image scheduling and virtualization
19. Browser, CDN, and R2 caching
20. Advertisement orchestration
21. Genuine Premium ad suppression
22. Comment-interface behavior
23. Premium catalog behavior
24. Failure and degradation behavior
25. Accessibility
26. Security boundaries
27. Performance and cost objectives
28. Proposed module boundaries
29. Proposed state machines
30. Proposed event flows
31. Suggested data contracts
32. Phased implementation roadmap
33. Testing matrix
34. Migration plan
35. Rollback plan
36. Risks and mitigations
37. Open questions
38. Definition of done

Use repository-specific file paths and functions.

Clearly mark:

- confirmed current behavior
- proposed future behavior
- inference
- unresolved issue

Include textual flow diagrams where useful.

Example:

PUBLIC PAGE CHANGE

User presses Next
→ reader validates target page
→ URL history entry is created
→ current page state changes
→ image scheduler loads required variant
→ previous image remains cacheable
→ advertisement interval is evaluated
→ progress is saved where permitted

PREMIUM SCROLL UPDATE

IntersectionObserver identifies dominant page
→ update is throttled
→ reader state changes
→ URL is replaced without adding excessive history
→ nearby pages are scheduled
→ distant decoded images may be released
→ browser-cached responses remain reusable

PREMIUM ACCESS RESOLUTION

Session resolves
→ `/api/account/access` is requested once
→ access response becomes capabilities
→ Premium reader and comments are enabled
→ advertisement loader remains uninitialized

The document should propose state models such as:

ACCESS STATE

- unresolved
- logged-out
- free
- premium-trialing
- premium-active
- premium-bypass
- nonqualifying
- error

READER MODE

- public-flipbook
- premium-flow

READER LOAD STATE

- idle
- manifest-loading
- ready
- page-loading
- chapter-transition
- error

ADVERTISEMENT STATE

- prohibited
- unresolved
- eligible
- provider-loading
- ready
- no-fill
- failed

Adapt these names to the existing architecture rather than imposing them blindly.

The document should be detailed enough that a future Codex task can use it as the implementation source of truth.

==================================================
DOCUMENT 2: HUMAN-READABLE EXPLANATION
==================================================

Create:

docs/premium-vs-free.md

Visible title:

# Premium vs Free: How the Two Readers Should Work

This document is for the site owner and other non-specialist readers.

It must explain the same architecture in plain language.

Avoid excessive implementation vocabulary.

Do not omit important tradeoffs, but explain them clearly.

Include:

1. What is changing
2. What is not changing
3. The free reader
4. The Premium reader
5. Why free uses page-by-page navigation
6. Why Premium uses continuous scroll
7. How advertisements behave
8. Why Premium is genuinely ad-free
9. How image-loading cost is controlled
10. How browser and Cloudflare caching help
11. How work, chapter, and page URLs behave
12. How Back, Forward, refresh, and sharing work
13. How comments differ
14. How Premium catalog access differs
15. What happens when a trial ends
16. What happens during service failures
17. Why the site remains one website
18. Main risks
19. Recommended implementation order
20. What success looks like

Use concise examples.

Include a comparison such as:

FREE

- one page at a time
- click, tap, swipe, or use arrows
- controlled advertisements
- public catalog
- comments readable
- limited image loading

PREMIUM

- continuous scrolling
- no ads or ad requests
- broader approved catalog
- comments and replies
- lazy-loaded pages
- uninterrupted reading

Explain that public reading remains good, while Premium removes interruption and opens additional capabilities.

Explain that Premium continuous scroll still does not load every page immediately.

Explain that absolute prevention of image saving is impossible, but casual downloading can be discouraged.

Explain that the same permanent work and page identity is used in both reader modes.

==================================================
RELATIONSHIP BETWEEN THE TWO DOCUMENTS
==================================================

The two documents must describe the same architecture.

They must not contradict each other.

The technical document may contain:

- module boundaries
- state machines
- file references
- data contracts
- test requirements
- migration details
- implementation phases

The human document should translate those decisions into understandable product behavior.

The human document must not introduce features absent from the technical document.

The technical document must not omit a major product promise described in the human document.

==================================================
NON-GOALS
==================================================

Do not implement:

- the public flipbook
- the Premium scroll reader
- new routes
- new manifests
- advertisement loaders
- comment UI changes
- tag access changes
- numeric ID assignments
- Workers
- service workers
- image deterrence
- caching changes
- database changes
- Stripe changes
- Supabase changes
- Cloudflare changes

Do not modify:

- source files
- configuration
- lockfiles
- dependencies
- SQL
- migrations
- deployment files
- existing documentation unrelated to this request

This task creates the architecture source of truth only.

==================================================
FINAL VALIDATION
==================================================

At completion:

1. Run:

git diff --check

2. Run:

git status --short

3. Confirm that only these files were created or changed:

docs/codex/ad-public-vs-premium-scroll-down.md
docs/premium-vs-free.md

4. Confirm:

- no runtime source changed
- no configuration changed
- no dependency changed
- no lockfile changed
- no SQL changed
- no migration changed
- no deployment occurred

5. In the final response report:

- documents created
- most important confirmed repository finding
- recommended shared reader architecture
- recommended public reader model
- recommended Premium reader model
- recommended URL strategy
- recommended advertisement strategy
- recommended caching strategy
- greatest implementation risk
- largest unresolved question
- confirmation that no runtime code was changed
