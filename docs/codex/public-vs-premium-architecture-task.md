Repository: thanks-cohn/doku-doujins-premium



Local repository: ~/dev/doku-doujins-premium



Base branch: main



Safety tag: pre-adfree-and-routing-proposal







TASK TYPE:



COMPLETE REPOSITORY AUDIT, INFRASTRUCTURE APPRAISAL, DATA-MODEL PROPOSAL, AND STAGED ARCHITECTURE PLAN ONLY







DO NOT IMPLEMENT THE PROPOSAL.







This task exists to establish a durable foundation before future automation begins assigning work IDs, generating manifests, creating URLs, processing chapters, publishing works, and controlling public versus Premium access.







A weak temporary design will eventually become expensive to replace. Therefore, inspect the repository thoroughly and produce an evidence-based proposal suitable for long-term automated operation.







==================================================



ABSOLUTE CHANGE BOUNDARY



==================================================







Do not modify application behavior.







Do not:







- refactor source code



- create routes



- change the reader



- change advertisements



- alter Stripe



- alter Supabase



- modify SQL or migrations



- change R2 objects



- assign production work IDs



- alter tag visibility



- add a Worker



- change Cloudflare configuration



- install dependencies



- change package files



- create a proof of concept



- deploy



- merge automatically







The only permitted repository changes are new Markdown documents inside:







docs/







At the end, verify that no runtime, configuration, dependency, SQL, deployment, or application files changed.







==================================================



PRIMARY OBJECTIVE



==================================================







Study the present repository and determine the safest standardized architecture for:







1. Permanent numeric work identities



2. Stable chapter identities



3. Stable page identities



4. Shareable work, chapter, and page URLs



5. Public page-by-page reading



6. Premium continuous-scroll reading



7. Public advertising



8. Completely ad-free Premium use



9. Premium commenting



10. Premium catalog and tag access



11. Static-first content delivery



12. Minimal Worker dependence



13. Future automated ingestion and publishing



14. Image bandwidth control



15. Casual image-download deterrence



16. Long-term compatibility with a very large catalog







The result must be a proposal, not an implementation.







Every recommendation must be grounded in the existing repository wherever possible.







==================================================



CORE PRODUCT MODEL



==================================================







The site should eventually provide two coordinated reading experiences.







They must remain:







- one website



- one codebase



- one catalog



- one account system



- one visual identity



- one set of canonical work identities



- one shared reader foundation







Do not propose two independently maintained applications.







--------------------------------------------------



PUBLIC / FREE READER



--------------------------------------------------







The public reader should behave as a polished page-by-page digital reader.







A user sees one page at a time and advances deliberately through:







- Next and Previous controls



- keyboard arrows



- mobile swipe



- touch or click controls where appropriate







The public reader should generally load only:







- the current page



- the immediately previous page where useful



- one or two upcoming pages



- lightweight reader assets







It should not eagerly download an entire chapter merely because the first page was opened.







Primary reasons:







- lower R2 delivery cost



- lower browser memory usage



- faster first-page display



- less wasted image transfer



- more predictable mobile performance



- controlled advertisement opportunities



- reliable page-specific navigation







The public reader must remain pleasant and functional.







It should feel like a classic reader, not an intentionally broken Premium advertisement.







--------------------------------------------------



PREMIUM READER



--------------------------------------------------







Trialing and active Premium users should receive a continuous-scroll reader.







Premium readers should be able to open a work and scroll through it without pressing Next after every page.







Premium benefits should include:







- continuous-scroll reading



- no advertisements



- no popunders



- no ad-provider script initialization



- no hidden advertising iframe



- no advertisement network request



- no abandoned advertisement space



- comments and replies



- editing of owned comments



- broader approved catalog access



- Premium-visible tags and works



- saved reading position where practical



- a calmer and more spacious layout







Continuous scroll must still use:







- lazy loading



- responsive image variants



- viewport observation



- limited look-ahead loading



- placeholders



- memory controls



- virtualization or unloading where appropriate







Premium must not immediately download every image in a large work.







The central promise is:







“No ads. No interruptions. No endless clicking.”







==================================================



MEMBERSHIP AND CAPABILITY MODEL



==================================================







The proposal should recommend a centralized capability model rather than scattering raw subscription-status comparisons throughout the codebase.







Conceptual capabilities may include:







- hasPremiumAccess



- mayUseContinuousReader



- mayComment



- mayReply



- mayEditOwnComment



- mayDeleteOwnComment



- mayViewPremiumCatalog



- shouldLoadAds



- shouldShowUpgradePrompt



- isAccessResolved







Study the existing access endpoint and current account model before recommending exact names.







--------------------------------------------------



LOGGED-OUT VISITOR



--------------------------------------------------







May:







- browse public works



- use the page-by-page reader



- read comments



- encounter advertisements



- share permanent URLs



- create an account







May not:







- comment



- reply



- edit comments



- use continuous scroll



- access Premium-only catalog classifications







--------------------------------------------------



FREE ACCOUNT



--------------------------------------------------







May receive:







- account identity



- bookmarks



- reading history



- saved progress



- public work access



- public tag access



- public comment reading



- page-by-page reader







Also receives advertisements.







May not:







- comment



- reply



- edit comments



- use Premium continuous scroll



- access Premium-only works or tags







--------------------------------------------------



TRIALING PREMIUM



--------------------------------------------------







Receives the complete Premium experience:







- continuous scroll



- no advertisements



- comments and replies



- editing of owned comments



- broader approved catalog access



- Premium-visible tags and works







The trial exists partly so that users experience these advantages directly.







--------------------------------------------------



ACTIVE PREMIUM



--------------------------------------------------







Receives the same Premium capabilities continuously.







--------------------------------------------------



EXPIRED OR NONQUALIFYING SUBSCRIPTION



--------------------------------------------------







Statuses such as:







- past_due



- unpaid



- canceled



- incomplete



- expired



- failed payment



- no qualifying subscription







should return the account to:







- page-by-page reading



- advertisements



- public catalog visibility



- read-only comments







The account should retain:







- bookmarks



- history



- saved progress where possible



- existing comments



- ability to delete owned old comments







Losing Premium must not erase the user’s identity or previous participation.







==================================================



PREMIUM VALUE PROPOSITION



==================================================







The initial $5 Premium tier has four core benefits.







1. FLOW







Continuous-scroll reading without pressing Next repeatedly.







2. SILENCE







No banners, popunders, advertisement scripts, hidden frames, or advertisement requests.







3. VOICE







Comments, replies, and editing of owned comments.







4. ACCESS







The broader approved catalog, including tags and works not shown in the public edition.







Suggested product concept:







“Open the whole library.







Scroll without interruption.



Read without ads.



Join the discussion.



Unlock the complete approved catalog.”







The proposal should evaluate how to make Premium compelling without making the public experience hostile.







==================================================



STANDARDIZED PERMANENT URL FOUNDATION



==================================================







Do not use experimental punctuation such as:







@=



@=profile



@=page-7







Do not preserve unusual URL syntax merely because another part of the current site happens to use it.







The new work-reader URL system should use a standardized, predictable, durable structure.







The preferred canonical design to evaluate is:







https://9127000.xyz/work/134123132/chapter/1/page/7







Where:







- `work` is a stable namespace



- `134123132` is the permanent numeric work ID



- `chapter/1` identifies chapter 1



- `page/7` identifies page 7







Conceptual pattern:







/work/{work_id}/chapter/{chapter_number}/page/{page_number}







This is the preferred product-facing structure unless the audit proves that another standardized form is substantially safer or more scalable.







Compare it with:







/work/134123132/chapter/1/#page-7







/work/134123132/chapter/1?page=7







/work/134123132/chapter/1/page/7/







Do not compare or recommend decorative custom punctuation.







The proposal must determine which standardized form best satisfies:







- direct refresh



- copy and sharing



- bookmarks



- browser Back and Forward



- static hosting



- zero-Worker goals



- Cloudflare Pages behavior



- analytics



- canonical links



- automated route generation



- very large catalog scale



- implementation simplicity



- long-term maintainability







If the fully path-based form cannot be served reliably without generating excessive files or introducing a Worker, explain that conflict plainly.







The canonical URL must not be selected merely because it looks attractive.







==================================================



PERMANENT NUMERIC WORK IDENTITY



==================================================







Every work should receive a permanent numeric ID.







The numeric ID is identity.







The following are metadata or storage details, not identity:







- title



- title spelling



- slug



- catalog position



- local folder name



- R2 object path



- upload filename



- cover filename



- tag arrangement







Required properties:







- a work ID never changes



- a work ID is never reused



- a title change does not alter the URL



- moving R2 objects does not alter the URL



- rebuilding manifests does not alter the URL



- a removed work does not free its ID



- deleted works may retain tombstone records



- legacy references may point to the permanent ID



- future automation can request or allocate an ID safely



- ingestion can be repeated without assigning a second identity







Study how works are currently identified.







Determine whether present identity depends on:







- title



- folder name



- JSON key



- object path



- UUID



- catalog order



- filename



- generated identifier



- another mechanism







Clearly identify migration risks.







==================================================



WORK ID ALLOCATION APPRAISAL



==================================================







Compare possible numeric ID strategies:







1. Monotonic sequential integers



2. Large sequential integers



3. Random numeric identifiers



4. Time-derived numeric identifiers



5. Central registry-assigned IDs



6. Ingestion-service-assigned IDs



7. Database sequence



8. Durable static registry







For each, evaluate:







- collision risk



- enumeration



- privacy



- automation



- concurrency



- offline ingestion



- idempotency



- recovery after failure



- restoring from backup



- multiple ingestion machines



- future distributed ingestion



- human readability



- maximum practical range



- JavaScript numeric safety







Explicitly address JavaScript’s safe-integer limit.







If identifiers may exceed:







9007199254740991







recommend storing and transporting them as strings even when they contain digits only.







The proposal should recommend:







- canonical representation



- allocation authority



- transaction or lock behavior



- duplicate prevention



- retry behavior



- import behavior



- migration behavior



- audit history







==================================================



CHAPTER IDENTITY



==================================================







Determine whether chapter identity should use:







- stable chapter numbers



- permanent chapter IDs



- both a permanent chapter ID and a display order



- ingestion order



- manually assigned order







Chapter order and chapter identity may not always be the same thing.







The proposal must address:







- chapters inserted between existing chapters



- bonus chapters



- chapter renaming



- chapter reordering



- combined chapters



- split chapters



- alternate editions



- deleted chapters



- chapter tombstones



- legacy chapter URLs







A durable automated system should not break permanent links merely because chapter display order changes.







Evaluate whether the URL should use:







/chapter/1







or a permanent numeric chapter ID such as:







/chapter/482910







with display chapter number stored separately.







Recommend a model suitable for future automated publishing.







==================================================



PAGE IDENTITY



==================================================







Every reader page must have a stable addressable number.







The proposal must distinguish:







- page identity



- page display order



- image filename



- array index



- printed page number



- reader page number







Required behavior:







- opening a page URL restores the correct page



- refreshing restores the correct page



- copying the URL shares that exact location



- Back and Forward work



- jumping to a page updates the URL



- moving between chapters updates the URL



- malformed values fail safely



- page 1 is never confused with array index 0



- reprocessing images does not silently change permanent reader links







Evaluate whether pages need:







- simple chapter-relative numbers



- permanent page IDs



- both stable IDs and display positions







Address the consequences of:







- inserting a missing page



- removing a duplicate page



- rescanning a chapter



- replacing an image



- combining two pages



- splitting one page



- changing display order







The future ingestion system must not casually renumber existing public links.







==================================================



ROUTING MODELS TO APPRAISE



==================================================







Compare at least these models.







--------------------------------------------------



MODEL A: FULLY PATH-BASED CANONICAL PAGE ROUTES



--------------------------------------------------







Example:







/work/134123132/chapter/1/page/7







Evaluate:







- direct refresh



- Cloudflare Pages handling



- static file generation



- fallback shell



- route parsing



- canonical URLs



- analytics



- search indexing



- browser history



- millions-of-pages scale



- Worker requirements







--------------------------------------------------



MODEL B: STATIC CHAPTER ROUTE PLUS PAGE FRAGMENT



--------------------------------------------------







Example:







/work/134123132/chapter/1/#page-7







Evaluate:







- zero-Worker compatibility



- static delivery



- direct refresh



- server visibility



- analytics



- indexing



- browser history



- URL restoration



- automation







--------------------------------------------------



MODEL C: STATIC CHAPTER ROUTE PLUS QUERY PARAMETER



--------------------------------------------------







Example:







/work/134123132/chapter/1/?page=7







Evaluate the same concerns.







--------------------------------------------------



MODEL D: GENERATED STATIC WORK OR CHAPTER ROUTES



--------------------------------------------------







Evaluate:







- ingestion-generated folders



- build artifact size



- file count



- Cloudflare Pages limits



- millions of works



- incremental publication



- rollback



- cache invalidation







--------------------------------------------------



MODEL E: SHARED STATIC READER SHELL



--------------------------------------------------







Many canonical URLs resolve to one static reader shell that parses the path and retrieves manifests.







Evaluate:







- direct refresh behavior



- fallback rules



- status codes



- missing-work behavior



- false homepage fallback



- Cloudflare Pages support



- zero-Worker feasibility







--------------------------------------------------



MODEL F: WORKER-BASED ROUTING



--------------------------------------------------







Discuss only as a comparison or where technically unavoidable.







The project prefers zero Workers for ordinary public reading.







Do not recommend a Worker merely because it makes routing easier.







==================================================



PUBLIC READER NAVIGATION



==================================================







The page-by-page reader should eventually support:







- Next



- Previous



- keyboard navigation



- mobile swipe



- page jump



- chapter change



- direct page link



- refresh



- Back



- Forward



- opening in another tab







The proposal should evaluate:







- standard anchor navigation



- History API



- pushState



- replaceState



- popstate



- fragment navigation



- prefetching



- focus management







Deliberate public page changes should generally create meaningful history entries.







Example:







- user opens page 7



- user selects Next



- reader moves to page 8



- Back returns to page 7



- Forward returns to page 8







==================================================



PREMIUM SCROLL URL SYNCHRONIZATION



==================================================







The Premium continuous reader must still keep a meaningful page URL.







As the dominant visible page changes, the URL should update without producing hundreds of browser-history entries.







Evaluate:







- IntersectionObserver



- dominant-page calculation



- history.replaceState



- deliberate page-jump pushState



- scroll restoration



- hashchange



- popstate



- throttling



- URL-update frequency



- mobile scrolling



- chapter boundaries







A likely model is:







- passive scrolling uses replaceState



- deliberate page jumps use pushState



- chapter navigation creates a real history entry







Validate this against the repository rather than accepting it automatically.







==================================================



FUTURE AUTOMATED INGESTION



==================================================







Assume that ingestion, ID assignment, manifest generation, chapter processing, page processing, publication, and cache invalidation will eventually be automated.







The proposal must design for automation from the beginning.







The future ingestion pipeline may need to:







1. Receive a new work



2. Determine whether it already exists



3. Allocate or recover its permanent work ID



4. Validate metadata



5. Process its cover



6. detect chapters



7. allocate chapter identities



8. detect and order pages



9. allocate stable page identities or positions



10. generate responsive image variants



11. upload image objects



12. generate manifests



13. classify tags and visibility



14. produce canonical URLs



15. update discovery indexes



16. invalidate caches



17. publish atomically



18. leave a recoverable audit trail







The appraisal must address:







- idempotency



- partial failure



- retries



- duplicate uploads



- re-ingestion



- concurrent ingestion



- schema validation



- manifest versioning



- atomic publication



- staging versus published state



- rollback



- orphaned objects



- checksum use



- content replacement



- chapter additions



- page corrections



- tag corrections



- audit logs







Do not create the pipeline now.







Propose the contracts the future pipeline should obey.







==================================================



PUBLICATION STATE MODEL



==================================================







Evaluate a durable state model such as:







- draft



- processing



- validated



- staged



- published



- hidden



- quarantined



- removed



- failed







The public catalog should never observe a half-published work.







Recommend how publication should become visible atomically.







For example:







- upload all assets first



- validate manifests



- publish the final manifest pointer last







Appraise the safest strategy for R2 and static indexes.







==================================================



MANIFEST SCHEMA



==================================================







Propose a versioned manifest design.







The proposal should evaluate separate documents for:







- work metadata



- chapter metadata



- page/image records



- visibility



- tag references



- image variants



- checksums



- publication version



- timestamps



- canonical IDs







Possible shape for discussion only:







{



  "schemaVersion": 1,



  "workId": "134123132",



  "title": "Example Work",



  "visibility": "public",



  "chapters": [



    {



      "chapterId": "1",



      "displayNumber": "1",



      "manifestUrl": "/work-index/134123132/chapters/1.json"



    }



  ]



}







Do not impose this example blindly.







Recommend a schema based on repository reality and future automation requirements.







The design should support:







- schema evolution



- old-reader compatibility



- validation



- cache invalidation



- partial updates



- chapter additions



- image replacement



- catalog indexing



- Premium access classification







==================================================



MANIFEST STORAGE STRATEGY



==================================================







Compare:







1. One global catalog manifest



2. Sharded global indexes



3. One work manifest per work



4. One chapter manifest per chapter



5. One page record per page



6. Work manifest plus chapter manifests



7. Versioned immutable manifests plus a current pointer







Evaluate:







- R2 compatibility



- Cloudflare caching



- CDN invalidation



- ingestion updates



- millions of works



- large chapters



- public access



- Premium access



- rollback



- manifest size



- lookup count



- browser performance







The proposal should recommend a scalable hierarchy.







==================================================



STATIC-FIRST AND ZERO-WORKER GOAL



==================================================







Ordinary public reading should ideally follow:







Browser



→ static reader shell



→ static or cached manifest



→ cached R2 image







It should not require:







- Supabase for basic work display



- Stripe for basic work display



- dynamic HTML rendering



- a database query per page



- a Worker request per image



- a Worker request per page transition







Dynamic infrastructure should remain reserved for capabilities that require it:







- authentication



- subscriptions



- comments



- votes



- reports



- moderation



- bookmarks



- account synchronization



- strongly protected Premium assets







The appraisal must distinguish:







- where zero Workers is realistic



- where it creates harmful compromises



- where limited dynamic infrastructure may be justified



- whether Workers can be restricted to Premium-protected catalog access rather than ordinary public reading







Do not distort technical conclusions to satisfy the zero-Worker preference.







==================================================



PREMIUM CATALOG AND TAG ACCESS



==================================================







Premium should eventually unlock more of the approved catalog.







Audit the existing:







- tag format



- public/private tag handling



- blocked tags



- hidden works



- catalog filters



- search filters



- recommendation filters



- homepage selection



- manifest exposure







Recommend explicit visibility classifications such as:







- public



- account



- premium



- age-restricted



- administrative



- removed







Definitions:







PUBLIC







Visible to ordinary visitors.







ACCOUNT







Visible after authentication where appropriate.







PREMIUM







Visible to trialing and active Premium users and approved bypass roles.







AGE-RESTRICTED







Requires applicable age eligibility in addition to other access requirements.







ADMINISTRATIVE







Unavailable to ordinary users because it is under review, moderation, quarantine, or internal management.







REMOVED







Unavailable entirely.







Premium must not override:







- removed status



- illegal-content restrictions



- private material



- administrative quarantine



- territorial restrictions



- required age restrictions



- content the platform refuses to distribute







The intended principle is:







“Premium opens the complete approved library, not content the platform cannot or will not publish.”







==================================================



DISCOVERY RESTRICTION VERSUS ACCESS CONTROL



==================================================







The appraisal must distinguish:







DISCOVERY-ONLY RESTRICTION







- omitted from public search



- omitted from public recommendations



- omitted from public tag navigation



- direct URL may still work



- assets may remain publicly accessible



- highly static



- weak protection







ACTUAL ACCESS CONTROL







- unauthorized users cannot retrieve the protected manifest



- unauthorized users cannot retrieve protected images



- may require signed URLs or gated delivery



- stronger protection



- more infrastructure



- may conflict with broad CDN caching and zero Workers







Explain the tradeoff honestly.







Do not describe hidden buttons as security.







==================================================



ADVERTISING ARCHITECTURE



==================================================







The public reader may include controlled advertisement opportunities.







Possible placements:







- below the current page



- between groups of pages



- during occasional page transitions



- in desktop side space



- in safe mobile inline regions



- existing homepage or rotunda placements







The reader should own the advertising rhythm.







Individual work manifests should not contain arbitrary provider scripts.







Appraise a centralized configuration model containing:







- slot identity



- provider



- dimensions



- placement



- viewport requirements



- page interval



- minimum page before first ad



- maximum chapter frequency



- mobile behavior



- desktop behavior



- enabled state



- no-fill behavior



- initialization state







Public advertising must not appear after every page.







Discuss:







- abandonment



- accidental clicks



- provider policies



- popunders



- no-fill



- mobile safety



- layout shift



- repeated initialization



- route transitions



- ad retries



- accessibility







==================================================



PREMIUM AD-FREE REQUIREMENT



==================================================







Premium must receive genuinely ad-free delivery.







It is not sufficient to:







- load an advertisement script



- create an advertisement request



- create an iframe



- hide the result with CSS







For Premium:







- provider scripts must not initialize



- advertisement code must not execute



- advertising requests must not occur



- advertisement containers should not mount



- no popunder should initialize



- no blank advertising spaces should remain







While access status is unresolved:







- do not initialize advertising prematurely



- do not expose Premium comment controls



- do not flash upgrade messaging to known Premium users



- keep ordinary static content visible







Appraise failure behavior when `/api/account/access` is unavailable.







==================================================



COMMENT SYSTEM



==================================================







Comments remain publicly readable.







Writing is limited to:







- trialing



- active



- approved staff bypass roles







Nonqualifying users remain read-only.







Audit:







- discussion service



- RPC calls



- current access handling



- SECURITY DEFINER functions



- RLS



- service-role usage



- authorship records



- edit behavior



- delete behavior







Current intended behavior:







- create_comment requires Premium



- edit_own_comment requires Premium



- delete_own_comment requires ownership but not active Premium







Do not propose removing the server-side enforcement.







The frontend should later reflect it with a polished locked composer and friendly upgrade message.







==================================================



IMAGE DELIVERY AND BANDWIDTH



==================================================







Audit:







- current image sources



- R2 paths



- manifest references



- image variants



- eager loading



- lazy loading



- prefetching



- retry behavior



- cache headers



- mobile sources



- desktop sources



- cover images



- chapter images







Determine whether opening a work currently loads:







- one image



- adjacent images



- one chapter



- an entire work



- thumbnail and original variants simultaneously







Propose:







PUBLIC READER







- current page



- limited adjacent prefetch



- responsive display variant



- no eager whole-chapter download







PREMIUM READER







- continuous scroll



- lazy loading



- limited look-ahead



- placeholder sizing



- virtualization



- responsive variants



- memory controls







==================================================



CASUAL IMAGE-DOWNLOAD DETERRENCE



==================================================







The site should discourage effortless casual saving of work images.







Desired outcomes:







- no visible download button



- ordinary right-click saving discouraged



- ordinary dragging discouraged



- archival originals not delivered unnecessarily



- original filenames not exposed unnecessarily



- automated mass retrieval made more difficult



- screenshotting remains possible







The proposal must be honest:







A browser that displays an image has received image information.







Client-side JavaScript cannot make displayed public images impossible to save.







A determined user may use:







- developer tools



- network inspection



- browser cache



- disabled JavaScript



- automated browsers



- screenshots



- screen photography







The practical objective is:







“Prevent effortless casual downloading, avoid exposing archival originals, and make large-scale automated extraction more difficult.”







Audit and compare:







- contextmenu prevention



- dragstart prevention



- pointer overlays



- CSS selection controls



- canvas rendering



- blob URL indirection



- public R2 URLs



- signed URLs



- display-quality variants



- visible watermarks



- invisible watermarks



- per-user watermarks



- hotlink protection



- rate limiting



- bot controls







For each, state:







- what it prevents



- what it does not prevent



- accessibility impact



- performance impact



- caching impact



- mobile impact



- infrastructure requirements



- zero-Worker compatibility







==================================================



CURRENT REPOSITORY AUDIT



==================================================







Before recommending anything, inspect and document the present implementation.







APPLICATION







- entry points



- build system



- source layout



- public assets



- route handling



- reader modules



- catalog modules



- mobile behavior



- desktop behavior







ROUTING







- current homepage URL behavior



- work opening



- modal behavior



- History API



- hash handling



- query parameters



- direct refresh



- fallback behavior



- canonical links







READER







- page state



- chapter state



- image loading



- controls



- keyboard support



- touch support



- URL synchronization



- progress restoration







ADVERTISING







- provider scripts



- popunders



- banners



- overlays



- rotunda ads



- reader ads



- initialization



- retries



- no-fill handling



- CSS



- configuration







ACCOUNT AND PREMIUM







- login



- logout



- session discovery



- `/api/account/access`



- subscription lookup



- role lookup



- access caching



- account switching



- checkout



- Stripe webhooks



- delayed status synchronization







COMMENTS







- frontend discussion modules



- RPC functions



- RLS



- SECURITY DEFINER



- ownership



- edit



- delete







CATALOG AND TAGS







- work records



- tag records



- blocked tags



- hidden works



- manifests



- search indexes



- homepage indexes



- R2 catalog assumptions







DEPLOYMENT







- Cloudflare Pages



- Pages Functions



- Workers



- wrangler.jsonc



- redirects



- route configuration



- build artifact



- deployment scripts



- environment variables







For each major finding, include:







- file path



- function, class, or module



- current behavior



- confirmed fact or inference



- uncertainty requiring later testing







==================================================



ARCHITECTURAL OPTIONS



==================================================







Compare at least:







ROUTE A







Shared static shell with standardized numeric route parsing.







ROUTE B







Generated static work or chapter routes.







ROUTE C







Static chapter routes with fragment-based pages.







ROUTE D







SPA-style static fallback shell.







ROUTE E







Hybrid static public content with gated Premium manifests or assets.







ROUTE F







Worker-based routing.







For each, evaluate:







- repository fit



- implementation size



- rewrite risk



- permanent URL reliability



- direct refresh



- zero-Worker compatibility



- Cloudflare Pages compatibility



- millions-of-works scale



- automation



- caching



- R2 bandwidth



- Premium protection



- operational complexity



- rollback



- test burden







Recommend:







- one primary architecture



- one fallback architecture



- conditions that would justify using the fallback







==================================================



FOUNDATIONAL RISKS



==================================================







Explicitly address:







- title-based identity



- mutable work IDs



- ID reuse



- JavaScript unsafe numeric values



- concurrent ID allocation



- duplicate ingestion



- non-idempotent publishing



- half-published works



- chapter reordering breaking links



- page insertion renumbering links



- schema without versioning



- one enormous global manifest



- millions of generated HTML files



- stale manifest caches



- R2 paths treated as identity



- public manifests exposing protected works



- hidden tags mistaken for security



- false homepage fallback



- direct refresh failure



- duplicate canonical URLs



- hash/history loops



- hundreds of browser-history entries



- page-index off-by-one errors



- eager chapter downloads



- Premium memory exhaustion



- ad flash before access resolution



- CSS-only ad hiding



- popunder reinjection



- stale subscription state



- account-state leakage



- delayed Stripe webhooks



- service-role bypass



- SECURITY DEFINER bypass



- client-side image protection described as DRM



- accessibility broken by image deterrence



- excessive dependence on Workers



- static public reading depending on Supabase



- architectural duplication between public and Premium







==================================================



STAGED FUTURE ROADMAP



==================================================







Propose an incremental roadmap.







Do not implement any phase.







PHASE 0: AUDIT AND DECISION RECORD







- document present architecture



- identify risks



- choose canonical identity rules



- choose canonical URL rules



- choose manifest hierarchy



- define unresolved questions







PHASE 1: SCHEMA AND REGISTRY FOUNDATION







- work ID registry



- chapter identity rules



- page identity rules



- schema versions



- validation rules



- non-reuse policy



- tombstones



- idempotency contracts







PHASE 2: AUTOMATED INGESTION CONTRACT







- deterministic retries



- duplicate detection



- checksums



- staging



- validation



- atomic publication



- rollback



- audit records







PHASE 3: URL-AWARE PUBLIC READER







- canonical work route



- chapter route



- page route



- refresh



- Back and Forward



- limited image loading







PHASE 4: CENTRALIZED ACCESS CAPABILITIES







- Premium state



- advertisement eligibility



- comment eligibility



- catalog eligibility



- safe loading and failure behavior







PHASE 5: PREMIUM CONTINUOUS READER







- lazy loading



- virtualization



- page URL synchronization



- progress restoration



- long-chapter testing







PHASE 6: CONTROLLED ADVERTISEMENT SYSTEM







- centralized slots



- interval rules



- provider loading



- no-fill behavior



- Premium zero-request validation







PHASE 7: PREMIUM CATALOG ACCESS







- visibility classes



- search filtering



- direct-link policy



- manifest protection



- age restrictions



- removed-content rules







PHASE 8: IMAGE DELIVERY AND DETERRENCE







- responsive variants



- public bandwidth limits



- casual-download deterrence



- accessibility review



- abuse controls







PHASE 9: MIGRATION AND AUTOMATION VALIDATION







- legacy links



- existing works



- ingestion retries



- concurrent publication



- cache behavior



- account transitions



- trial expiration



- rollback drills







For each phase, include:







- objective



- prerequisites



- repository areas affected



- risks



- tests



- rollback strategy



- evidence required before proceeding







==================================================



REQUIRED DOCUMENTS



==================================================







Create only the following Markdown files.







1.







docs/foundational-repository-and-infrastructure-audit.md







Visible title:







# Foundational Repository and Infrastructure Audit







Include:







- current architecture



- current routing



- current reader



- current identity model



- current catalog structure



- current image loading



- current advertisement inventory



- current access flow



- current comment authorization



- current tag behavior



- current deployment structure



- confirmed facts



- inferences



- unresolved questions



- exact repository references







2.







docs/permanent-work-chapter-and-page-identity-proposal.md







Visible title:







# Permanent Work, Chapter, and Page Identity Proposal







Include:







- work ID strategy



- numeric representation



- JavaScript safe-integer concerns



- allocation authority



- duplicate prevention



- chapter identity



- chapter display order



- page identity



- page display order



- insertion and deletion behavior



- tombstones



- aliases



- migration



- future automation contracts



- recommended model







3.







docs/standardized-reader-url-and-routing-appraisal.md







Visible title:







# Standardized Reader URL and Routing Appraisal







Include the preferred standardized form:







https://9127000.xyz/work/134123132/chapter/1/page/7







Compare it with:







- fragment-based pages



- query-based pages



- static generated routes



- shared static shells



- fallback routing



- Workers







Include:







- direct refresh



- browser history



- canonical URLs



- Cloudflare Pages



- millions-of-works scale



- zero-Worker feasibility



- recommended canonical URL



- fallback recommendation



- migration strategy







Do not recommend `@=` syntax.







4.







docs/automated-ingestion-manifest-and-publication-proposal.md







Visible title:







# Automated Ingestion, Manifest, and Publication Proposal







Include:







- future ingestion stages



- ID assignment



- idempotency



- checksums



- duplicate detection



- chapter processing



- page processing



- image variants



- schema versioning



- manifest hierarchy



- staging



- atomic publication



- partial failure



- retries



- rollback



- audit records



- cache invalidation



- orphan cleanup



- validation



- recommended contracts







5.







docs/public-flipbook-and-premium-flow-reader-proposal.md







Visible title:







# Public Flipbook and Premium Flow Reader Proposal







Include:







- public page-by-page reader



- Premium continuous scroll



- membership behavior



- four Premium benefits



- public bandwidth control



- Premium lazy loading



- browser-history differences



- progress restoration



- advertising integration



- comment presentation



- failure behavior



- accessibility







6.







docs/premium-advertising-comment-and-access-architecture.md







Visible title:







# Premium, Advertising, Comment, and Access Architecture







Include:







- centralized capabilities



- authoritative access



- public ads



- Premium zero-ad-request requirement



- account-state loading



- access failure



- comments



- SECURITY DEFINER



- RLS



- logout and account switching



- checkout synchronization



- tests and risks







7.







docs/premium-tag-and-protected-catalog-appraisal.md







Visible title:







# Premium Tag and Protected Catalog Appraisal







Include:







- current tags



- proposed visibility classes



- public catalog



- Premium catalog



- discovery restriction



- actual access control



- public manifest leakage



- protected images



- age restrictions



- administrative and removed states



- zero-Worker tradeoffs



- recommended approach







8.







docs/image-delivery-cost-and-download-deterrence-appraisal.md







Visible title:







# Image Delivery Cost and Download Deterrence Appraisal







Include:







- current image behavior



- public-reader loading



- Premium-reader loading



- responsive variants



- caching



- virtualization



- R2 implications



- casual download deterrence



- technical limits



- accessibility



- hotlinking



- signed URLs



- watermarks



- abuse controls



- recommended practical protection level







9.







docs/recommended-foundational-architecture-and-roadmap.md







Visible title:







# Recommended Foundational Architecture and Roadmap







Include:







- primary architectural recommendation



- fallback architecture



- canonical ID model



- canonical URL



- chapter and page identity



- manifest model



- automated ingestion model



- public reader



- Premium reader



- advertising



- comments



- Premium catalog



- image delivery



- static versus dynamic responsibilities



- zero-Worker conclusion



- staged roadmap



- tests



- rollback



- unresolved decisions







10.







docs/executive-foundation-summary.md







Visible title:







# Executive Foundation Summary







Keep this concise.







State:







- what the site is becoming



- what remains unchanged



- recommended work identity



- recommended chapter identity



- recommended page identity



- recommended canonical URL



- recommended manifest hierarchy



- recommended publication model



- recommended public reader



- recommended Premium reader



- recommended advertising model



- where dynamic infrastructure is necessary



- zero-Worker conclusion



- greatest foundational risks



- recommended order of implementation



- confirmation that no runtime code changed







==================================================



QUALITY REQUIREMENTS



==================================================







Do not provide generic advice.







Every statement about current behavior should cite:







- exact file path



- relevant function, module, or configuration



- whether the conclusion is confirmed or inferred







Do not conceal uncertainty.







Do not select a routing strategy without examining Cloudflare Pages behavior and the existing build output.







Do not select an ID model without addressing:







- safe numeric representation



- allocation authority



- concurrency



- idempotency



- migration



- non-reuse



- tombstones







Do not select a manifest strategy without addressing:







- schema versions



- validation



- atomic publication



- retries



- cache invalidation



- millions-of-works scale







==================================================



FINAL VALIDATION



==================================================







At the end:







- run git diff --check



- run git status --short



- list every created file



- confirm only Markdown files under docs/ changed



- confirm no application source changed



- confirm no configuration changed



- confirm no dependency changed



- confirm no lockfile changed



- confirm no SQL or migration changed



- confirm no deployment occurred







The final report must state:







1. Documents created



2. Most important confirmed repository finding



3. Recommended permanent work-ID model



4. Recommended chapter-ID model



5. Recommended page-ID model



6. Recommended canonical URL



7. Recommended manifest hierarchy



8. Recommended automated publication model



9. Recommended public reader architecture



10. Recommended Premium reader architecture



11. Whether zero Workers is realistically achievable



12. Where limited dynamic infrastructure may be necessary



13. Largest unresolved foundational question



14. Confirmation that no runtime code was changedRepository: thanks-cohn/doku-doujins-premium



Local repository: ~/dev/doku-doujins-premium



Base branch: main



Safety tag: pre-adfree-and-routing-proposal







TASK TYPE:



COMPLETE REPOSITORY AUDIT, INFRASTRUCTURE APPRAISAL, DATA-MODEL PROPOSAL, AND STAGED ARCHITECTURE PLAN ONLY







DO NOT IMPLEMENT THE PROPOSAL.







This task exists to establish a durable foundation before future automation begins assigning work IDs, generating manifests, creating URLs, processing chapters, publishing works, and controlling public versus Premium access.







A weak temporary design will eventually become expensive to replace. Therefore, inspect the repository thoroughly and produce an evidence-based proposal suitable for long-term automated operation.







==================================================



ABSOLUTE CHANGE BOUNDARY



==================================================







Do not modify application behavior.







Do not:







- refactor source code



- create routes



- change the reader



- change advertisements



- alter Stripe



- alter Supabase



- modify SQL or migrations



- change R2 objects



- assign production work IDs



- alter tag visibility



- add a Worker



- change Cloudflare configuration



- install dependencies



- change package files



- create a proof of concept



- deploy



- merge automatically







The only permitted repository changes are new Markdown documents inside:







docs/







At the end, verify that no runtime, configuration, dependency, SQL, deployment, or application files changed.







==================================================



PRIMARY OBJECTIVE



==================================================







Study the present repository and determine the safest standardized architecture for:







1. Permanent numeric work identities



2. Stable chapter identities



3. Stable page identities



4. Shareable work, chapter, and page URLs



5. Public page-by-page reading



6. Premium continuous-scroll reading



7. Public advertising



8. Completely ad-free Premium use



9. Premium commenting



10. Premium catalog and tag access



11. Static-first content delivery



12. Minimal Worker dependence



13. Future automated ingestion and publishing



14. Image bandwidth control



15. Casual image-download deterrence



16. Long-term compatibility with a very large catalog







The result must be a proposal, not an implementation.







Every recommendation must be grounded in the existing repository wherever possible.







==================================================



CORE PRODUCT MODEL



==================================================







The site should eventually provide two coordinated reading experiences.







They must remain:







- one website



- one codebase



- one catalog



- one account system



- one visual identity



- one set of canonical work identities



- one shared reader foundation







Do not propose two independently maintained applications.







--------------------------------------------------



PUBLIC / FREE READER



--------------------------------------------------







The public reader should behave as a polished page-by-page digital reader.







A user sees one page at a time and advances deliberately through:







- Next and Previous controls



- keyboard arrows



- mobile swipe



- touch or click controls where appropriate







The public reader should generally load only:







- the current page



- the immediately previous page where useful



- one or two upcoming pages



- lightweight reader assets







It should not eagerly download an entire chapter merely because the first page was opened.







Primary reasons:







- lower R2 delivery cost



- lower browser memory usage



- faster first-page display



- less wasted image transfer



- more predictable mobile performance



- controlled advertisement opportunities



- reliable page-specific navigation







The public reader must remain pleasant and functional.







It should feel like a classic reader, not an intentionally broken Premium advertisement.







--------------------------------------------------



PREMIUM READER



--------------------------------------------------







Trialing and active Premium users should receive a continuous-scroll reader.







Premium readers should be able to open a work and scroll through it without pressing Next after every page.







Premium benefits should include:







- continuous-scroll reading



- no advertisements



- no popunders



- no ad-provider script initialization



- no hidden advertising iframe



- no advertisement network request



- no abandoned advertisement space



- comments and replies



- editing of owned comments



- broader approved catalog access



- Premium-visible tags and works



- saved reading position where practical



- a calmer and more spacious layout







Continuous scroll must still use:







- lazy loading



- responsive image variants



- viewport observation



- limited look-ahead loading



- placeholders



- memory controls



- virtualization or unloading where appropriate







Premium must not immediately download every image in a large work.







The central promise is:







“No ads. No interruptions. No endless clicking.”







==================================================



MEMBERSHIP AND CAPABILITY MODEL



==================================================







The proposal should recommend a centralized capability model rather than scattering raw subscription-status comparisons throughout the codebase.







Conceptual capabilities may include:







- hasPremiumAccess



- mayUseContinuousReader



- mayComment



- mayReply



- mayEditOwnComment



- mayDeleteOwnComment



- mayViewPremiumCatalog



- shouldLoadAds



- shouldShowUpgradePrompt



- isAccessResolved







Study the existing access endpoint and current account model before recommending exact names.







--------------------------------------------------



LOGGED-OUT VISITOR



--------------------------------------------------







May:







- browse public works



- use the page-by-page reader



- read comments



- encounter advertisements



- share permanent URLs



- create an account







May not:







- comment



- reply



- edit comments



- use continuous scroll



- access Premium-only catalog classifications







--------------------------------------------------



FREE ACCOUNT



--------------------------------------------------







May receive:







- account identity



- bookmarks



- reading history



- saved progress



- public work access



- public tag access



- public comment reading



- page-by-page reader







Also receives advertisements.







May not:







- comment



- reply



- edit comments



- use Premium continuous scroll



- access Premium-only works or tags







--------------------------------------------------



TRIALING PREMIUM



--------------------------------------------------







Receives the complete Premium experience:







- continuous scroll



- no advertisements



- comments and replies



- editing of owned comments



- broader approved catalog access



- Premium-visible tags and works







The trial exists partly so that users experience these advantages directly.







--------------------------------------------------



ACTIVE PREMIUM



--------------------------------------------------







Receives the same Premium capabilities continuously.







--------------------------------------------------



EXPIRED OR NONQUALIFYING SUBSCRIPTION



--------------------------------------------------







Statuses such as:







- past_due



- unpaid



- canceled



- incomplete



- expired



- failed payment



- no qualifying subscription







should return the account to:







- page-by-page reading



- advertisements



- public catalog visibility



- read-only comments







The account should retain:







- bookmarks



- history



- saved progress where possible



- existing comments



- ability to delete owned old comments







Losing Premium must not erase the user’s identity or previous participation.







==================================================



PREMIUM VALUE PROPOSITION



==================================================







The initial $5 Premium tier has four core benefits.







1. FLOW







Continuous-scroll reading without pressing Next repeatedly.







2. SILENCE







No banners, popunders, advertisement scripts, hidden frames, or advertisement requests.







3. VOICE







Comments, replies, and editing of owned comments.







4. ACCESS







The broader approved catalog, including tags and works not shown in the public edition.







Suggested product concept:







“Open the whole library.







Scroll without interruption.



Read without ads.



Join the discussion.



Unlock the complete approved catalog.”







The proposal should evaluate how to make Premium compelling without making the public experience hostile.







==================================================



STANDARDIZED PERMANENT URL FOUNDATION



==================================================







Do not use experimental punctuation such as:







@=



@=profile



@=page-7







Do not preserve unusual URL syntax merely because another part of the current site happens to use it.







The new work-reader URL system should use a standardized, predictable, durable structure.







The preferred canonical design to evaluate is:







https://9127000.xyz/work/134123132/chapter/1/page/7







Where:







- `work` is a stable namespace



- `134123132` is the permanent numeric work ID



- `chapter/1` identifies chapter 1



- `page/7` identifies page 7







Conceptual pattern:







/work/{work_id}/chapter/{chapter_number}/page/{page_number}







This is the preferred product-facing structure unless the audit proves that another standardized form is substantially safer or more scalable.







Compare it with:







/work/134123132/chapter/1/#page-7







/work/134123132/chapter/1?page=7







/work/134123132/chapter/1/page/7/







Do not compare or recommend decorative custom punctuation.







The proposal must determine which standardized form best satisfies:







- direct refresh



- copy and sharing



- bookmarks



- browser Back and Forward



- static hosting



- zero-Worker goals



- Cloudflare Pages behavior



- analytics



- canonical links



- automated route generation



- very large catalog scale



- implementation simplicity



- long-term maintainability







If the fully path-based form cannot be served reliably without generating excessive files or introducing a Worker, explain that conflict plainly.







The canonical URL must not be selected merely because it looks attractive.







==================================================



PERMANENT NUMERIC WORK IDENTITY



==================================================







Every work should receive a permanent numeric ID.







The numeric ID is identity.







The following are metadata or storage details, not identity:







- title



- title spelling



- slug



- catalog position



- local folder name



- R2 object path



- upload filename



- cover filename



- tag arrangement







Required properties:







- a work ID never changes



- a work ID is never reused



- a title change does not alter the URL



- moving R2 objects does not alter the URL



- rebuilding manifests does not alter the URL



- a removed work does not free its ID



- deleted works may retain tombstone records



- legacy references may point to the permanent ID



- future automation can request or allocate an ID safely



- ingestion can be repeated without assigning a second identity







Study how works are currently identified.







Determine whether present identity depends on:







- title



- folder name



- JSON key



- object path



- UUID



- catalog order



- filename



- generated identifier



- another mechanism







Clearly identify migration risks.







==================================================



WORK ID ALLOCATION APPRAISAL



==================================================







Compare possible numeric ID strategies:







1. Monotonic sequential integers



2. Large sequential integers



3. Random numeric identifiers



4. Time-derived numeric identifiers



5. Central registry-assigned IDs



6. Ingestion-service-assigned IDs



7. Database sequence



8. Durable static registry







For each, evaluate:







- collision risk



- enumeration



- privacy



- automation



- concurrency



- offline ingestion



- idempotency



- recovery after failure



- restoring from backup



- multiple ingestion machines



- future distributed ingestion



- human readability



- maximum practical range



- JavaScript numeric safety







Explicitly address JavaScript’s safe-integer limit.







If identifiers may exceed:







9007199254740991







recommend storing and transporting them as strings even when they contain digits only.







The proposal should recommend:







- canonical representation



- allocation authority



- transaction or lock behavior



- duplicate prevention



- retry behavior



- import behavior



- migration behavior



- audit history







==================================================



CHAPTER IDENTITY



==================================================







Determine whether chapter identity should use:







- stable chapter numbers



- permanent chapter IDs



- both a permanent chapter ID and a display order



- ingestion order



- manually assigned order







Chapter order and chapter identity may not always be the same thing.







The proposal must address:







- chapters inserted between existing chapters



- bonus chapters



- chapter renaming



- chapter reordering



- combined chapters



- split chapters



- alternate editions



- deleted chapters



- chapter tombstones



- legacy chapter URLs







A durable automated system should not break permanent links merely because chapter display order changes.







Evaluate whether the URL should use:







/chapter/1







or a permanent numeric chapter ID such as:







/chapter/482910







with display chapter number stored separately.







Recommend a model suitable for future automated publishing.







==================================================



PAGE IDENTITY



==================================================







Every reader page must have a stable addressable number.







The proposal must distinguish:







- page identity



- page display order



- image filename



- array index



- printed page number



- reader page number







Required behavior:







- opening a page URL restores the correct page



- refreshing restores the correct page



- copying the URL shares that exact location



- Back and Forward work



- jumping to a page updates the URL



- moving between chapters updates the URL



- malformed values fail safely



- page 1 is never confused with array index 0



- reprocessing images does not silently change permanent reader links







Evaluate whether pages need:







- simple chapter-relative numbers



- permanent page IDs



- both stable IDs and display positions







Address the consequences of:







- inserting a missing page



- removing a duplicate page



- rescanning a chapter



- replacing an image



- combining two pages



- splitting one page



- changing display order







The future ingestion system must not casually renumber existing public links.







==================================================



ROUTING MODELS TO APPRAISE



==================================================







Compare at least these models.







--------------------------------------------------



MODEL A: FULLY PATH-BASED CANONICAL PAGE ROUTES



--------------------------------------------------







Example:







/work/134123132/chapter/1/page/7







Evaluate:







- direct refresh



- Cloudflare Pages handling



- static file generation



- fallback shell



- route parsing



- canonical URLs



- analytics



- search indexing



- browser history



- millions-of-pages scale



- Worker requirements







--------------------------------------------------



MODEL B: STATIC CHAPTER ROUTE PLUS PAGE FRAGMENT



--------------------------------------------------







Example:







/work/134123132/chapter/1/#page-7







Evaluate:







- zero-Worker compatibility



- static delivery



- direct refresh



- server visibility



- analytics



- indexing



- browser history



- URL restoration



- automation







--------------------------------------------------



MODEL C: STATIC CHAPTER ROUTE PLUS QUERY PARAMETER



--------------------------------------------------







Example:







/work/134123132/chapter/1/?page=7







Evaluate the same concerns.







--------------------------------------------------



MODEL D: GENERATED STATIC WORK OR CHAPTER ROUTES



--------------------------------------------------







Evaluate:







- ingestion-generated folders



- build artifact size



- file count



- Cloudflare Pages limits



- millions of works



- incremental publication



- rollback



- cache invalidation







--------------------------------------------------



MODEL E: SHARED STATIC READER SHELL



--------------------------------------------------







Many canonical URLs resolve to one static reader shell that parses the path and retrieves manifests.







Evaluate:







- direct refresh behavior



- fallback rules



- status codes



- missing-work behavior



- false homepage fallback



- Cloudflare Pages support



- zero-Worker feasibility







--------------------------------------------------



MODEL F: WORKER-BASED ROUTING



--------------------------------------------------







Discuss only as a comparison or where technically unavoidable.







The project prefers zero Workers for ordinary public reading.







Do not recommend a Worker merely because it makes routing easier.







==================================================



PUBLIC READER NAVIGATION



==================================================







The page-by-page reader should eventually support:







- Next



- Previous



- keyboard navigation



- mobile swipe



- page jump



- chapter change



- direct page link



- refresh



- Back



- Forward



- opening in another tab







The proposal should evaluate:







- standard anchor navigation



- History API



- pushState



- replaceState



- popstate



- fragment navigation



- prefetching



- focus management







Deliberate public page changes should generally create meaningful history entries.







Example:







- user opens page 7



- user selects Next



- reader moves to page 8



- Back returns to page 7



- Forward returns to page 8







==================================================



PREMIUM SCROLL URL SYNCHRONIZATION



==================================================







The Premium continuous reader must still keep a meaningful page URL.







As the dominant visible page changes, the URL should update without producing hundreds of browser-history entries.







Evaluate:







- IntersectionObserver



- dominant-page calculation



- history.replaceState



- deliberate page-jump pushState



- scroll restoration



- hashchange



- popstate



- throttling



- URL-update frequency



- mobile scrolling



- chapter boundaries







A likely model is:







- passive scrolling uses replaceState



- deliberate page jumps use pushState



- chapter navigation creates a real history entry







Validate this against the repository rather than accepting it automatically.







==================================================



FUTURE AUTOMATED INGESTION



==================================================







Assume that ingestion, ID assignment, manifest generation, chapter processing, page processing, publication, and cache invalidation will eventually be automated.







The proposal must design for automation from the beginning.







The future ingestion pipeline may need to:







1. Receive a new work



2. Determine whether it already exists



3. Allocate or recover its permanent work ID



4. Validate metadata



5. Process its cover



6. detect chapters



7. allocate chapter identities



8. detect and order pages



9. allocate stable page identities or positions



10. generate responsive image variants



11. upload image objects



12. generate manifests



13. classify tags and visibility



14. produce canonical URLs



15. update discovery indexes



16. invalidate caches



17. publish atomically



18. leave a recoverable audit trail







The appraisal must address:







- idempotency



- partial failure



- retries



- duplicate uploads



- re-ingestion



- concurrent ingestion



- schema validation



- manifest versioning



- atomic publication



- staging versus published state



- rollback



- orphaned objects



- checksum use



- content replacement



- chapter additions



- page corrections



- tag corrections



- audit logs







Do not create the pipeline now.







Propose the contracts the future pipeline should obey.







==================================================



PUBLICATION STATE MODEL



==================================================







Evaluate a durable state model such as:







- draft



- processing



- validated



- staged



- published



- hidden



- quarantined



- removed



- failed







The public catalog should never observe a half-published work.







Recommend how publication should become visible atomically.







For example:







- upload all assets first



- validate manifests



- publish the final manifest pointer last







Appraise the safest strategy for R2 and static indexes.







==================================================



MANIFEST SCHEMA



==================================================







Propose a versioned manifest design.







The proposal should evaluate separate documents for:







- work metadata



- chapter metadata



- page/image records



- visibility



- tag references



- image variants



- checksums



- publication version



- timestamps



- canonical IDs







Possible shape for discussion only:







{



  "schemaVersion": 1,



  "workId": "134123132",



  "title": "Example Work",



  "visibility": "public",



  "chapters": [



    {



      "chapterId": "1",



      "displayNumber": "1",



      "manifestUrl": "/work-index/134123132/chapters/1.json"



    }



  ]



}







Do not impose this example blindly.







Recommend a schema based on repository reality and future automation requirements.







The design should support:







- schema evolution



- old-reader compatibility



- validation



- cache invalidation



- partial updates



- chapter additions



- image replacement



- catalog indexing



- Premium access classification







==================================================



MANIFEST STORAGE STRATEGY



==================================================







Compare:







1. One global catalog manifest



2. Sharded global indexes



3. One work manifest per work



4. One chapter manifest per chapter



5. One page record per page



6. Work manifest plus chapter manifests



7. Versioned immutable manifests plus a current pointer







Evaluate:







- R2 compatibility



- Cloudflare caching



- CDN invalidation



- ingestion updates



- millions of works



- large chapters



- public access



- Premium access



- rollback



- manifest size



- lookup count



- browser performance







The proposal should recommend a scalable hierarchy.







==================================================



STATIC-FIRST AND ZERO-WORKER GOAL



==================================================







Ordinary public reading should ideally follow:







Browser



→ static reader shell



→ static or cached manifest



→ cached R2 image







It should not require:







- Supabase for basic work display



- Stripe for basic work display



- dynamic HTML rendering



- a database query per page



- a Worker request per image



- a Worker request per page transition







Dynamic infrastructure should remain reserved for capabilities that require it:







- authentication



- subscriptions



- comments



- votes



- reports



- moderation



- bookmarks



- account synchronization



- strongly protected Premium assets







The appraisal must distinguish:







- where zero Workers is realistic



- where it creates harmful compromises



- where limited dynamic infrastructure may be justified



- whether Workers can be restricted to Premium-protected catalog access rather than ordinary public reading







Do not distort technical conclusions to satisfy the zero-Worker preference.







==================================================



PREMIUM CATALOG AND TAG ACCESS



==================================================







Premium should eventually unlock more of the approved catalog.







Audit the existing:







- tag format



- public/private tag handling



- blocked tags



- hidden works



- catalog filters



- search filters



- recommendation filters



- homepage selection



- manifest exposure







Recommend explicit visibility classifications such as:







- public



- account



- premium



- age-restricted



- administrative



- removed







Definitions:







PUBLIC







Visible to ordinary visitors.







ACCOUNT







Visible after authentication where appropriate.







PREMIUM







Visible to trialing and active Premium users and approved bypass roles.







AGE-RESTRICTED







Requires applicable age eligibility in addition to other access requirements.







ADMINISTRATIVE







Unavailable to ordinary users because it is under review, moderation, quarantine, or internal management.







REMOVED







Unavailable entirely.







Premium must not override:







- removed status



- illegal-content restrictions



- private material



- administrative quarantine



- territorial restrictions



- required age restrictions



- content the platform refuses to distribute







The intended principle is:







“Premium opens the complete approved library, not content the platform cannot or will not publish.”







==================================================



DISCOVERY RESTRICTION VERSUS ACCESS CONTROL



==================================================







The appraisal must distinguish:







DISCOVERY-ONLY RESTRICTION







- omitted from public search



- omitted from public recommendations



- omitted from public tag navigation



- direct URL may still work



- assets may remain publicly accessible



- highly static



- weak protection







ACTUAL ACCESS CONTROL







- unauthorized users cannot retrieve the protected manifest



- unauthorized users cannot retrieve protected images



- may require signed URLs or gated delivery



- stronger protection



- more infrastructure



- may conflict with broad CDN caching and zero Workers







Explain the tradeoff honestly.







Do not describe hidden buttons as security.







==================================================



ADVERTISING ARCHITECTURE



==================================================







The public reader may include controlled advertisement opportunities.







Possible placements:







- below the current page



- between groups of pages



- during occasional page transitions



- in desktop side space



- in safe mobile inline regions



- existing homepage or rotunda placements







The reader should own the advertising rhythm.







Individual work manifests should not contain arbitrary provider scripts.







Appraise a centralized configuration model containing:







- slot identity



- provider



- dimensions



- placement



- viewport requirements



- page interval



- minimum page before first ad



- maximum chapter frequency



- mobile behavior



- desktop behavior



- enabled state



- no-fill behavior



- initialization state







Public advertising must not appear after every page.







Discuss:







- abandonment



- accidental clicks



- provider policies



- popunders



- no-fill



- mobile safety



- layout shift



- repeated initialization



- route transitions



- ad retries



- accessibility







==================================================



PREMIUM AD-FREE REQUIREMENT



==================================================







Premium must receive genuinely ad-free delivery.







It is not sufficient to:







- load an advertisement script



- create an advertisement request



- create an iframe



- hide the result with CSS







For Premium:







- provider scripts must not initialize



- advertisement code must not execute



- advertising requests must not occur



- advertisement containers should not mount



- no popunder should initialize



- no blank advertising spaces should remain







While access status is unresolved:







- do not initialize advertising prematurely



- do not expose Premium comment controls



- do not flash upgrade messaging to known Premium users



- keep ordinary static content visible







Appraise failure behavior when `/api/account/access` is unavailable.







==================================================



COMMENT SYSTEM



==================================================







Comments remain publicly readable.







Writing is limited to:







- trialing



- active



- approved staff bypass roles







Nonqualifying users remain read-only.







Audit:







- discussion service



- RPC calls



- current access handling



- SECURITY DEFINER functions



- RLS



- service-role usage



- authorship records



- edit behavior



- delete behavior







Current intended behavior:







- create_comment requires Premium



- edit_own_comment requires Premium



- delete_own_comment requires ownership but not active Premium







Do not propose removing the server-side enforcement.







The frontend should later reflect it with a polished locked composer and friendly upgrade message.







==================================================



IMAGE DELIVERY AND BANDWIDTH



==================================================







Audit:







- current image sources



- R2 paths



- manifest references



- image variants



- eager loading



- lazy loading



- prefetching



- retry behavior



- cache headers



- mobile sources



- desktop sources



- cover images



- chapter images







Determine whether opening a work currently loads:







- one image



- adjacent images



- one chapter



- an entire work



- thumbnail and original variants simultaneously







Propose:







PUBLIC READER







- current page



- limited adjacent prefetch



- responsive display variant



- no eager whole-chapter download







PREMIUM READER







- continuous scroll



- lazy loading



- limited look-ahead



- placeholder sizing



- virtualization



- responsive variants



- memory controls







==================================================



CASUAL IMAGE-DOWNLOAD DETERRENCE



==================================================







The site should discourage effortless casual saving of work images.







Desired outcomes:







- no visible download button



- ordinary right-click saving discouraged



- ordinary dragging discouraged



- archival originals not delivered unnecessarily



- original filenames not exposed unnecessarily



- automated mass retrieval made more difficult



- screenshotting remains possible







The proposal must be honest:







A browser that displays an image has received image information.







Client-side JavaScript cannot make displayed public images impossible to save.







A determined user may use:







- developer tools



- network inspection



- browser cache



- disabled JavaScript



- automated browsers



- screenshots



- screen photography







The practical objective is:







“Prevent effortless casual downloading, avoid exposing archival originals, and make large-scale automated extraction more difficult.”







Audit and compare:







- contextmenu prevention



- dragstart prevention



- pointer overlays



- CSS selection controls



- canvas rendering



- blob URL indirection



- public R2 URLs



- signed URLs



- display-quality variants



- visible watermarks



- invisible watermarks



- per-user watermarks



- hotlink protection



- rate limiting



- bot controls







For each, state:







- what it prevents



- what it does not prevent



- accessibility impact



- performance impact



- caching impact



- mobile impact



- infrastructure requirements



- zero-Worker compatibility







==================================================



CURRENT REPOSITORY AUDIT



==================================================







Before recommending anything, inspect and document the present implementation.







APPLICATION







- entry points



- build system



- source layout



- public assets



- route handling



- reader modules



- catalog modules



- mobile behavior



- desktop behavior







ROUTING







- current homepage URL behavior



- work opening



- modal behavior



- History API



- hash handling



- query parameters



- direct refresh



- fallback behavior



- canonical links







READER







- page state



- chapter state



- image loading



- controls



- keyboard support



- touch support



- URL synchronization



- progress restoration







ADVERTISING







- provider scripts



- popunders



- banners



- overlays



- rotunda ads



- reader ads



- initialization



- retries



- no-fill handling



- CSS



- configuration







ACCOUNT AND PREMIUM







- login



- logout



- session discovery



- `/api/account/access`



- subscription lookup



- role lookup



- access caching



- account switching



- checkout



- Stripe webhooks



- delayed status synchronization







COMMENTS







- frontend discussion modules



- RPC functions



- RLS



- SECURITY DEFINER



- ownership



- edit



- delete







CATALOG AND TAGS







- work records



- tag records



- blocked tags



- hidden works



- manifests



- search indexes



- homepage indexes



- R2 catalog assumptions







DEPLOYMENT







- Cloudflare Pages



- Pages Functions



- Workers



- wrangler.jsonc



- redirects



- route configuration



- build artifact



- deployment scripts



- environment variables







For each major finding, include:







- file path



- function, class, or module



- current behavior



- confirmed fact or inference



- uncertainty requiring later testing







==================================================



ARCHITECTURAL OPTIONS



==================================================







Compare at least:







ROUTE A







Shared static shell with standardized numeric route parsing.







ROUTE B







Generated static work or chapter routes.







ROUTE C







Static chapter routes with fragment-based pages.







ROUTE D







SPA-style static fallback shell.







ROUTE E







Hybrid static public content with gated Premium manifests or assets.







ROUTE F







Worker-based routing.







For each, evaluate:







- repository fit



- implementation size



- rewrite risk



- permanent URL reliability



- direct refresh



- zero-Worker compatibility



- Cloudflare Pages compatibility



- millions-of-works scale



- automation



- caching



- R2 bandwidth



- Premium protection



- operational complexity



- rollback



- test burden







Recommend:







- one primary architecture



- one fallback architecture



- conditions that would justify using the fallback







==================================================



FOUNDATIONAL RISKS



==================================================







Explicitly address:







- title-based identity



- mutable work IDs



- ID reuse



- JavaScript unsafe numeric values



- concurrent ID allocation



- duplicate ingestion



- non-idempotent publishing



- half-published works



- chapter reordering breaking links



- page insertion renumbering links



- schema without versioning



- one enormous global manifest



- millions of generated HTML files



- stale manifest caches



- R2 paths treated as identity



- public manifests exposing protected works



- hidden tags mistaken for security



- false homepage fallback



- direct refresh failure



- duplicate canonical URLs



- hash/history loops



- hundreds of browser-history entries



- page-index off-by-one errors



- eager chapter downloads



- Premium memory exhaustion



- ad flash before access resolution



- CSS-only ad hiding



- popunder reinjection



- stale subscription state



- account-state leakage



- delayed Stripe webhooks



- service-role bypass



- SECURITY DEFINER bypass



- client-side image protection described as DRM



- accessibility broken by image deterrence



- excessive dependence on Workers



- static public reading depending on Supabase



- architectural duplication between public and Premium







==================================================



STAGED FUTURE ROADMAP



==================================================







Propose an incremental roadmap.







Do not implement any phase.







PHASE 0: AUDIT AND DECISION RECORD







- document present architecture



- identify risks



- choose canonical identity rules



- choose canonical URL rules



- choose manifest hierarchy



- define unresolved questions







PHASE 1: SCHEMA AND REGISTRY FOUNDATION







- work ID registry



- chapter identity rules



- page identity rules



- schema versions



- validation rules



- non-reuse policy



- tombstones



- idempotency contracts







PHASE 2: AUTOMATED INGESTION CONTRACT







- deterministic retries



- duplicate detection



- checksums



- staging



- validation



- atomic publication



- rollback



- audit records







PHASE 3: URL-AWARE PUBLIC READER







- canonical work route



- chapter route



- page route



- refresh



- Back and Forward



- limited image loading







PHASE 4: CENTRALIZED ACCESS CAPABILITIES







- Premium state



- advertisement eligibility



- comment eligibility



- catalog eligibility



- safe loading and failure behavior







PHASE 5: PREMIUM CONTINUOUS READER







- lazy loading



- virtualization



- page URL synchronization



- progress restoration



- long-chapter testing







PHASE 6: CONTROLLED ADVERTISEMENT SYSTEM







- centralized slots



- interval rules



- provider loading



- no-fill behavior



- Premium zero-request validation







PHASE 7: PREMIUM CATALOG ACCESS







- visibility classes



- search filtering



- direct-link policy



- manifest protection



- age restrictions



- removed-content rules







PHASE 8: IMAGE DELIVERY AND DETERRENCE







- responsive variants



- public bandwidth limits



- casual-download deterrence



- accessibility review



- abuse controls







PHASE 9: MIGRATION AND AUTOMATION VALIDATION







- legacy links



- existing works



- ingestion retries



- concurrent publication



- cache behavior



- account transitions



- trial expiration



- rollback drills







For each phase, include:







- objective



- prerequisites



- repository areas affected



- risks



- tests



- rollback strategy



- evidence required before proceeding







==================================================



REQUIRED DOCUMENTS



==================================================







Create only the following Markdown files.







1.







docs/foundational-repository-and-infrastructure-audit.md







Visible title:







# Foundational Repository and Infrastructure Audit







Include:







- current architecture



- current routing



- current reader



- current identity model



- current catalog structure



- current image loading



- current advertisement inventory



- current access flow



- current comment authorization



- current tag behavior



- current deployment structure



- confirmed facts



- inferences



- unresolved questions



- exact repository references







2.







docs/permanent-work-chapter-and-page-identity-proposal.md







Visible title:







# Permanent Work, Chapter, and Page Identity Proposal







Include:







- work ID strategy



- numeric representation



- JavaScript safe-integer concerns



- allocation authority



- duplicate prevention



- chapter identity



- chapter display order



- page identity



- page display order



- insertion and deletion behavior



- tombstones



- aliases



- migration



- future automation contracts



- recommended model







3.







docs/standardized-reader-url-and-routing-appraisal.md







Visible title:







# Standardized Reader URL and Routing Appraisal







Include the preferred standardized form:







https://9127000.xyz/work/134123132/chapter/1/page/7







Compare it with:







- fragment-based pages



- query-based pages



- static generated routes



- shared static shells



- fallback routing



- Workers







Include:







- direct refresh



- browser history



- canonical URLs



- Cloudflare Pages



- millions-of-works scale



- zero-Worker feasibility



- recommended canonical URL



- fallback recommendation



- migration strategy







Do not recommend `@=` syntax.







4.







docs/automated-ingestion-manifest-and-publication-proposal.md







Visible title:







# Automated Ingestion, Manifest, and Publication Proposal







Include:







- future ingestion stages



- ID assignment



- idempotency



- checksums



- duplicate detection



- chapter processing



- page processing



- image variants



- schema versioning



- manifest hierarchy



- staging



- atomic publication



- partial failure



- retries



- rollback



- audit records



- cache invalidation



- orphan cleanup



- validation



- recommended contracts







5.







docs/public-flipbook-and-premium-flow-reader-proposal.md







Visible title:







# Public Flipbook and Premium Flow Reader Proposal







Include:







- public page-by-page reader



- Premium continuous scroll



- membership behavior



- four Premium benefits



- public bandwidth control



- Premium lazy loading



- browser-history differences



- progress restoration



- advertising integration



- comment presentation



- failure behavior



- accessibility







6.







docs/premium-advertising-comment-and-access-architecture.md







Visible title:







# Premium, Advertising, Comment, and Access Architecture







Include:







- centralized capabilities



- authoritative access



- public ads



- Premium zero-ad-request requirement



- account-state loading



- access failure



- comments



- SECURITY DEFINER



- RLS



- logout and account switching



- checkout synchronization



- tests and risks







7.







docs/premium-tag-and-protected-catalog-appraisal.md







Visible title:







# Premium Tag and Protected Catalog Appraisal







Include:







- current tags



- proposed visibility classes



- public catalog



- Premium catalog



- discovery restriction



- actual access control



- public manifest leakage



- protected images



- age restrictions



- administrative and removed states



- zero-Worker tradeoffs



- recommended approach







8.







docs/image-delivery-cost-and-download-deterrence-appraisal.md







Visible title:







# Image Delivery Cost and Download Deterrence Appraisal







Include:







- current image behavior



- public-reader loading



- Premium-reader loading



- responsive variants



- caching



- virtualization



- R2 implications



- casual download deterrence



- technical limits



- accessibility



- hotlinking



- signed URLs



- watermarks



- abuse controls



- recommended practical protection level







9.







docs/recommended-foundational-architecture-and-roadmap.md







Visible title:







# Recommended Foundational Architecture and Roadmap







Include:







- primary architectural recommendation



- fallback architecture



- canonical ID model



- canonical URL



- chapter and page identity



- manifest model



- automated ingestion model



- public reader



- Premium reader



- advertising



- comments



- Premium catalog



- image delivery



- static versus dynamic responsibilities



- zero-Worker conclusion



- staged roadmap



- tests



- rollback



- unresolved decisions







10.







docs/executive-foundation-summary.md







Visible title:







# Executive Foundation Summary







Keep this concise.







State:







- what the site is becoming



- what remains unchanged



- recommended work identity



- recommended chapter identity



- recommended page identity



- recommended canonical URL



- recommended manifest hierarchy



- recommended publication model



- recommended public reader



- recommended Premium reader



- recommended advertising model



- where dynamic infrastructure is necessary



- zero-Worker conclusion



- greatest foundational risks



- recommended order of implementation



- confirmation that no runtime code changed







==================================================



QUALITY REQUIREMENTS



==================================================







Do not provide generic advice.







Every statement about current behavior should cite:







- exact file path



- relevant function, module, or configuration



- whether the conclusion is confirmed or inferred







Do not conceal uncertainty.







Do not select a routing strategy without examining Cloudflare Pages behavior and the existing build output.







Do not select an ID model without addressing:







- safe numeric representation



- allocation authority



- concurrency



- idempotency



- migration



- non-reuse



- tombstones







Do not select a manifest strategy without addressing:







- schema versions



- validation



- atomic publication



- retries



- cache invalidation



- millions-of-works scale







==================================================



FINAL VALIDATION



==================================================







At the end:







- run git diff --check



- run git status --short



- list every created file



- confirm only Markdown files under docs/ changed



- confirm no application source changed



- confirm no configuration changed



- confirm no dependency changed



- confirm no lockfile changed



- confirm no SQL or migration changed



- confirm no deployment occurred







The final report must state:







1. Documents created



2. Most important confirmed repository finding



3. Recommended permanent work-ID model



4. Recommended chapter-ID model



5. Recommended page-ID model



6. Recommended canonical URL



7. Recommended manifest hierarchy



8. Recommended automated publication model



9. Recommended public reader architecture



10. Recommended Premium reader architecture



11. Whether zero Workers is realistically achievable



12. Where limited dynamic infrastructure may be necessary



13. Largest unresolved foundational question



14. Confirmation that no runtime code was changed --------------==================================================



ADDENDUM: MAXIMUM CACHING, EXTREME SCALE, AND COST DISCIPLINE



==================================================







The architecture should assume unusually large future demand.







The long-term ambition is to support traffic potentially reaching hundreds of millions or even billions of users.







Do not treat that traffic estimate as guaranteed, but design the foundations so the system does not require an expensive architectural replacement if usage grows dramatically.







The proposal must therefore prioritize:







- maximum browser caching



- maximum CDN caching



- maximum R2 cache efficiency



- immutable asset strategies



- minimal repeated origin reads



- minimal database dependence



- minimal Worker execution



- minimal per-page dynamic computation



- minimal bandwidth waste



- predictable cache invalidation



- graceful behavior under sudden traffic spikes



- durable operation at very low marginal cost per reader







The objective is not merely performance.







The objective is:







“Serve the largest possible audience while keeping infrastructure simple, durable, cacheable, and cost-effective.”







==================================================



BROWSER CACHE STRATEGY



==================================================







The proposal should examine how the browser can safely cache:







- reader JavaScript



- reader CSS



- fonts



- icons



- covers



- thumbnails



- display-quality page images



- work manifests



- chapter manifests



- tag indexes



- public catalog indexes



- version metadata



- static fallback shells







Recommend appropriate caching categories.







For immutable versioned assets, evaluate headers such as:







Cache-Control: public, max-age=31536000, immutable







For mutable manifest pointers or catalog indexes, evaluate:







- shorter freshness windows



- stale-while-revalidate



- ETags



- conditional requests



- Last-Modified



- versioned filenames



- immutable manifest versions plus a small mutable pointer



- service-worker caching only if the benefits justify the complexity







The proposal must explain how to prevent stale browser data from breaking:







- newly added chapters



- corrected pages



- removed works



- changed access classifications



- tag updates



- image replacements



- reader upgrades







Avoid cache-busting through random query parameters on every request.







Prefer deterministic content hashes, schema versions, or publication-version identifiers.







==================================================



R2 AND CDN CACHE STRATEGY



==================================================







The architecture should maximize cache hits between users.







A page image viewed by one user should be reusable from edge cache for later users whenever access rules permit it.







Evaluate:







- immutable object naming



- content-hashed filenames



- versioned work and chapter manifests



- long-lived cache headers



- Cloudflare cache behavior



- edge-cache reuse



- Range requests where relevant



- tiered caching



- cache reserve where appropriate



- origin shielding concepts



- cache keys



- compression



- responsive image variants



- avoiding accidental cache fragmentation



- avoiding cookies on public static asset requests



- separating public static assets from account-sensitive requests







Public work images should ideally be served from stable, cacheable URLs that do not vary per user.







Premium-only protected assets may require a different strategy. The proposal must explain the cost tradeoff between:







- per-user signed URLs



- short-lived tokens



- shared gated manifests



- public CDN cacheability



- private cache behavior



- Worker authorization



- origin request amplification







Do not recommend signed URLs casually without measuring how they may destroy cache sharing.







==================================================



IMMUTABLE ASSET MODEL



==================================================







Strongly evaluate an immutable publication model.







A changed image should receive a new object key rather than overwriting an old cached object in place.







Example conceptual pattern:







/assets/pages/{content_hash}.webp







or:







/works/{work_id}/versions/{publication_version}/chapters/{chapter_id}/pages/{page_id}-{content_hash}.webp







The exact structure should follow repository realities.







Advantages to appraise:







- extremely long cache lifetime



- safe browser caching



- safe CDN caching



- simple rollback



- no ambiguity about stale objects



- deterministic deduplication



- checksum verification



- reduced repeated uploads



- global reuse where identical assets occur







A small mutable pointer may identify the currently published immutable manifest version.







The proposal should compare:







1. Overwriting stable object paths



2. Versioned directory publication



3. Content-addressed object naming



4. Immutable manifests plus mutable current pointers







Recommend the most durable method.







==================================================



MULTI-LAYER CACHE MODEL



==================================================







Appraise a layered cache hierarchy such as:







1. Browser memory cache



2. Browser disk cache



3. Optional application/service-worker cache



4. Cloudflare edge cache



5. Cloudflare upper-tier cache



6. R2 origin







The goal is for the overwhelming majority of repeated public reads to stop before reaching R2 origin.







For each layer, explain:







- what should be cached



- expected lifetime



- invalidation mechanism



- failure behavior



- privacy concerns



- storage limits



- mobile implications



- whether the complexity is justified







Do not introduce a service worker automatically.







Appraise whether a service worker would provide enough benefit to justify:







- version management



- stale application shells



- update bugs



- storage pressure



- difficult debugging



- account-state leakage risks







A normal browser HTTP cache may be preferable unless offline reading or advanced prefetching becomes a deliberate product feature.







==================================================



PUBLIC READER CACHE BEHAVIOR



==================================================







The public flipbook should minimize transferred data while benefiting strongly from cache reuse.







Evaluate:







- current page loaded at display resolution



- one or two adjacent pages prefetched



- previously viewed pages retained in browser cache



- no entire-chapter prefetch



- chapter manifest cached



- cover and thumbnail reuse



- responsive variant selection



- avoiding duplicate downloads when navigating Back



- avoiding duplicate downloads after refresh



- avoiding repeated manifest fetches inside the same session







The proposal should establish a page-prefetch budget based on:







- network quality



- viewport



- device memory



- data-saving preferences



- chapter length



- image size



- current direction of travel







Respect browser signals such as:







- Save-Data



- effective connection type where available



- device memory where available



- reduced-data preferences where standardized







==================================================



PREMIUM READER CACHE BEHAVIOR



==================================================







Premium continuous scroll should remain cost-controlled.







Evaluate:







- lazy-loading only pages near the viewport



- limited forward prefetch



- limited backward retention



- browser cache reuse when DOM elements are virtualized



- restoring nearby pages without redownloading



- image decoding costs



- memory pressure



- very long chapters



- tab suspension



- returning to a chapter later



- saved progress







Premium should feel uninterrupted without behaving as unlimited eager downloading.







The proposal should distinguish:







- network cache



- decoded image memory



- DOM presence



- manifest state



- saved reader position







Removing an image element from the DOM does not necessarily require downloading it again if the browser cache is configured correctly.







==================================================



MANIFEST CACHE DESIGN



==================================================







The proposal should strongly evaluate immutable, versioned manifests.







Possible conceptual structure:







/manifests/works/{work_id}/versions/{version}/work.json



/manifests/works/{work_id}/versions/{version}/chapters/{chapter_id}.json



/manifests/works/{work_id}/current.json







Where:







- versioned manifests are immutable and cached for a long period



- `current.json` is small and has a shorter cache lifetime



- publication updates the current pointer only after all immutable assets are ready







Alternative designs may be recommended if better suited to the repository.







The proposal should address:







- ETags



- conditional GETs



- stale-while-revalidate



- atomic publication



- rollback



- old version retention



- garbage collection



- cache invalidation



- schema migration



- deleted works



- emergency takedowns







==================================================



CATALOG AND INDEX CACHING



==================================================







Do not assume every reader should download one enormous catalog file.







At very large scale, evaluate:







- sharded catalog indexes



- tag-specific indexes



- numeric ID range shards



- popularity or recency shards



- paginated static indexes



- compressed index formats



- Bloom filters only if genuinely useful



- incremental index updates



- immutable index versions



- small mutable index pointers







The proposal should minimize:







- repeated transfer



- unnecessary full-catalog downloads



- cache invalidation blast radius



- expensive regeneration



- memory use in the browser







Search and discovery architecture should not force the reader to download metadata for millions of works.







==================================================



CACHE KEYS AND PERSONALIZATION



==================================================







Public static content should not vary unnecessarily by:







- cookies



- account ID



- subscription state



- tracking parameters



- arbitrary query strings



- session headers







Account-sensitive APIs should remain separate from public cacheable assets.







The proposal should identify any current behavior that may accidentally reduce cache hit rates, such as:







- setting cookies on static asset requests



- unique query strings



- signed URLs for public content



- varying on unnecessary headers



- embedding account state inside otherwise static HTML



- per-user manifest generation



- dynamically generated image URLs







Premium presentation should ideally reuse the same cached public image objects where access permits, while changing reader behavior and advertising.







==================================================



CACHE INVALIDATION PHILOSOPHY



==================================================







Prefer:







“Publish new immutable versions and change a small pointer.”







Avoid:







“Purge or overwrite thousands of existing cached objects whenever one work changes.”







The proposal should establish invalidation rules for:







- image correction



- chapter correction



- title change



- tag change



- visibility change



- work removal



- emergency moderation



- reader application release



- manifest-schema release



- subscription-state change







Access or removal changes may require faster invalidation than ordinary metadata updates.







Explain how emergency takedowns should work even when assets have long cache lifetimes.







==================================================



EXTREME TRAFFIC AND STAMPEDE RESISTANCE



==================================================







The architecture should anticipate sudden viral traffic.







Evaluate protections against:







- cache stampedes



- thundering-herd manifest requests



- simultaneous cold-cache image requests



- repeated account-access calls



- repeated Supabase queries



- webhook bursts



- hot work releases



- bot scraping



- crawler amplification



- repeated failed ad initialization







Recommend strategies such as:







- immutable cached assets



- stale-while-revalidate



- request coalescing where available



- deduplicated client requests



- tiered cache



- limited prefetch



- rate limits for dynamic endpoints



- separate static and dynamic domains where useful



- backpressure for ingestion



- atomic publication



- graceful degradation







The public library should remain readable even if:







- comments fail



- Stripe fails



- Supabase becomes slow



- account access becomes unavailable



- advertisements fail



- discovery indexes are temporarily stale







==================================================



COST MODEL APPRAISAL



==================================================







Do not invent exact dollar totals without provider data.







However, the proposal should identify the major cost drivers:







- R2 object reads



- egress or delivery charges where applicable



- cache misses



- image size



- image variant count



- repeated manifest fetches



- Worker invocations



- Supabase queries



- Stripe-related requests



- logging volume



- analytics volume



- bot traffic



- cache invalidations



- dynamic Premium authorization







Provide a qualitative cost hierarchy and identify which architectural decisions have the greatest cost impact.







The proposal should compare:







- public flipbook bandwidth



- Premium continuous-scroll bandwidth



- cached repeat views



- cold-cache first views



- protected versus public assets



- one large image versus responsive variants



- generated static routes versus shared shells



- R2 origin reads versus edge hits







==================================================



OBSERVABILITY WITHOUT EXCESSIVE COST



==================================================







At enormous scale, logs themselves can become expensive.







Propose a restrained observability model:







- aggregate cache-hit metrics



- sampled request logs



- sampled client errors



- image-delivery metrics



- reader performance metrics



- Worker invocation counts



- Supabase query volume



- advertisement initialization failures



- manifest-version failures



- ingestion errors



- publication rollback events







Avoid requiring full verbose logs for every public page view.







Discuss sampling, retention, and privacy.







==================================================



DURABILITY PRINCIPLES



==================================================







The recommended architecture should follow these principles:







1. Public content remains readable without account infrastructure.



2. Static assets are immutable wherever possible.



3. Repeated reads are served from browser or edge cache.



4. R2 is treated as durable origin storage, not as a database queried repeatedly.



5. Numeric IDs never depend on titles or paths.



6. Publication is atomic.



7. Manifests are versioned and validated.



8. Dynamic services are limited to truly dynamic features.



9. Premium does not cause unnecessary duplication of public assets.



10. Scale is handled through caching and simplicity before additional servers.



11. Failure of comments, billing, ads, or accounts does not erase the library.



12. Cost per repeated read should approach the lowest practical level.







==================================================



REQUIRED ADDITIONS TO THE DOCUMENTS



==================================================







Add dedicated caching and extreme-scale sections to:







docs/foundational-repository-and-infrastructure-audit.md







Include:







- current cache headers



- current browser-cache behavior



- current R2/CDN assumptions



- cache-fragmentation risks



- current immutable versus mutable asset behavior



- present origin-read risks







docs/automated-ingestion-manifest-and-publication-proposal.md







Include:







- immutable asset publication



- content hashes



- versioned manifests



- atomic pointer updates



- cache invalidation



- emergency takedowns



- garbage collection



- rollback







docs/public-flipbook-and-premium-flow-reader-proposal.md







Include:







- public prefetch budget



- Premium lazy-loading budget



- browser cache reuse



- decoded-image memory



- Save-Data behavior



- long-chapter behavior



- repeat-view behavior







docs/image-delivery-cost-and-download-deterrence-appraisal.md







Include:







- browser cache



- edge cache



- R2 origin



- responsive variants



- object naming



- cache keys



- estimated relative cost drivers



- scraping and bot amplification







docs/recommended-foundational-architecture-and-roadmap.md







Include:







- recommended multi-layer cache strategy



- immutable publication model



- recommended cache headers by asset class



- manifest caching



- index sharding



- cache-stampede resistance



- observability strategy



- extreme-scale conclusion



- cost-control priorities







docs/executive-foundation-summary.md







Include a concise statement that the architecture is designed to:







- maximize browser and CDN cache reuse



- minimize R2 origin reads



- minimize dynamic requests



- survive extreme traffic



- keep marginal delivery cost as low as practical==================================================



ADDENDUM: MAXIMUM CACHING, EXTREME SCALE, AND COST DISCIPLINE



==================================================







The architecture should assume unusually large future demand.







The long-term ambition is to support traffic potentially reaching hundreds of millions or even billions of users.







Do not treat that traffic estimate as guaranteed, but design the foundations so the system does not require an expensive architectural replacement if usage grows dramatically.







The proposal must therefore prioritize:







- maximum browser caching



- maximum CDN caching



- maximum R2 cache efficiency



- immutable asset strategies



- minimal repeated origin reads



- minimal database dependence



- minimal Worker execution



- minimal per-page dynamic computation



- minimal bandwidth waste



- predictable cache invalidation



- graceful behavior under sudden traffic spikes



- durable operation at very low marginal cost per reader







The objective is not merely performance.







The objective is:







“Serve the largest possible audience while keeping infrastructure simple, durable, cacheable, and cost-effective.”







==================================================



BROWSER CACHE STRATEGY



==================================================







The proposal should examine how the browser can safely cache:







- reader JavaScript



- reader CSS



- fonts



- icons



- covers



- thumbnails



- display-quality page images



- work manifests



- chapter manifests



- tag indexes



- public catalog indexes



- version metadata



- static fallback shells







Recommend appropriate caching categories.







For immutable versioned assets, evaluate headers such as:







Cache-Control: public, max-age=31536000, immutable







For mutable manifest pointers or catalog indexes, evaluate:







- shorter freshness windows



- stale-while-revalidate



- ETags



- conditional requests



- Last-Modified



- versioned filenames



- immutable manifest versions plus a small mutable pointer



- service-worker caching only if the benefits justify the complexity







The proposal must explain how to prevent stale browser data from breaking:







- newly added chapters



- corrected pages



- removed works



- changed access classifications



- tag updates



- image replacements



- reader upgrades







Avoid cache-busting through random query parameters on every request.







Prefer deterministic content hashes, schema versions, or publication-version identifiers.







==================================================



R2 AND CDN CACHE STRATEGY



==================================================







The architecture should maximize cache hits between users.







A page image viewed by one user should be reusable from edge cache for later users whenever access rules permit it.







Evaluate:







- immutable object naming



- content-hashed filenames



- versioned work and chapter manifests



- long-lived cache headers



- Cloudflare cache behavior



- edge-cache reuse



- Range requests where relevant



- tiered caching



- cache reserve where appropriate



- origin shielding concepts



- cache keys



- compression



- responsive image variants



- avoiding accidental cache fragmentation



- avoiding cookies on public static asset requests



- separating public static assets from account-sensitive requests







Public work images should ideally be served from stable, cacheable URLs that do not vary per user.







Premium-only protected assets may require a different strategy. The proposal must explain the cost tradeoff between:







- per-user signed URLs



- short-lived tokens



- shared gated manifests



- public CDN cacheability



- private cache behavior



- Worker authorization



- origin request amplification







Do not recommend signed URLs casually without measuring how they may destroy cache sharing.







==================================================



IMMUTABLE ASSET MODEL



==================================================







Strongly evaluate an immutable publication model.







A changed image should receive a new object key rather than overwriting an old cached object in place.







Example conceptual pattern:







/assets/pages/{content_hash}.webp







or:







/works/{work_id}/versions/{publication_version}/chapters/{chapter_id}/pages/{page_id}-{content_hash}.webp







The exact structure should follow repository realities.







Advantages to appraise:







- extremely long cache lifetime



- safe browser caching



- safe CDN caching



- simple rollback



- no ambiguity about stale objects



- deterministic deduplication



- checksum verification



- reduced repeated uploads



- global reuse where identical assets occur







A small mutable pointer may identify the currently published immutable manifest version.







The proposal should compare:







1. Overwriting stable object paths



2. Versioned directory publication



3. Content-addressed object naming



4. Immutable manifests plus mutable current pointers







Recommend the most durable method.







==================================================



MULTI-LAYER CACHE MODEL



==================================================







Appraise a layered cache hierarchy such as:







1. Browser memory cache



2. Browser disk cache



3. Optional application/service-worker cache



4. Cloudflare edge cache



5. Cloudflare upper-tier cache



6. R2 origin







The goal is for the overwhelming majority of repeated public reads to stop before reaching R2 origin.







For each layer, explain:







- what should be cached



- expected lifetime



- invalidation mechanism



- failure behavior



- privacy concerns



- storage limits



- mobile implications



- whether the complexity is justified







Do not introduce a service worker automatically.







Appraise whether a service worker would provide enough benefit to justify:







- version management



- stale application shells



- update bugs



- storage pressure



- difficult debugging



- account-state leakage risks







A normal browser HTTP cache may be preferable unless offline reading or advanced prefetching becomes a deliberate product feature.







==================================================



PUBLIC READER CACHE BEHAVIOR



==================================================







The public flipbook should minimize transferred data while benefiting strongly from cache reuse.







Evaluate:







- current page loaded at display resolution



- one or two adjacent pages prefetched



- previously viewed pages retained in browser cache



- no entire-chapter prefetch



- chapter manifest cached



- cover and thumbnail reuse



- responsive variant selection



- avoiding duplicate downloads when navigating Back



- avoiding duplicate downloads after refresh



- avoiding repeated manifest fetches inside the same session







The proposal should establish a page-prefetch budget based on:







- network quality



- viewport



- device memory



- data-saving preferences



- chapter length



- image size



- current direction of travel







Respect browser signals such as:







- Save-Data



- effective connection type where available



- device memory where available



- reduced-data preferences where standardized







==================================================



PREMIUM READER CACHE BEHAVIOR



==================================================







Premium continuous scroll should remain cost-controlled.







Evaluate:







- lazy-loading only pages near the viewport



- limited forward prefetch



- limited backward retention



- browser cache reuse when DOM elements are virtualized



- restoring nearby pages without redownloading



- image decoding costs



- memory pressure



- very long chapters



- tab suspension



- returning to a chapter later



- saved progress







Premium should feel uninterrupted without behaving as unlimited eager downloading.







The proposal should distinguish:







- network cache



- decoded image memory



- DOM presence



- manifest state



- saved reader position







Removing an image element from the DOM does not necessarily require downloading it again if the browser cache is configured correctly.







==================================================



MANIFEST CACHE DESIGN



==================================================







The proposal should strongly evaluate immutable, versioned manifests.







Possible conceptual structure:







/manifests/works/{work_id}/versions/{version}/work.json



/manifests/works/{work_id}/versions/{version}/chapters/{chapter_id}.json



/manifests/works/{work_id}/current.json







Where:







- versioned manifests are immutable and cached for a long period



- `current.json` is small and has a shorter cache lifetime



- publication updates the current pointer only after all immutable assets are ready







Alternative designs may be recommended if better suited to the repository.







The proposal should address:







- ETags



- conditional GETs



- stale-while-revalidate



- atomic publication



- rollback



- old version retention



- garbage collection



- cache invalidation



- schema migration



- deleted works



- emergency takedowns







==================================================



CATALOG AND INDEX CACHING



==================================================







Do not assume every reader should download one enormous catalog file.







At very large scale, evaluate:







- sharded catalog indexes



- tag-specific indexes



- numeric ID range shards



- popularity or recency shards



- paginated static indexes



- compressed index formats



- Bloom filters only if genuinely useful



- incremental index updates



- immutable index versions



- small mutable index pointers







The proposal should minimize:







- repeated transfer



- unnecessary full-catalog downloads



- cache invalidation blast radius



- expensive regeneration



- memory use in the browser







Search and discovery architecture should not force the reader to download metadata for millions of works.







==================================================



CACHE KEYS AND PERSONALIZATION



==================================================







Public static content should not vary unnecessarily by:







- cookies



- account ID



- subscription state



- tracking parameters



- arbitrary query strings



- session headers







Account-sensitive APIs should remain separate from public cacheable assets.







The proposal should identify any current behavior that may accidentally reduce cache hit rates, such as:







- setting cookies on static asset requests



- unique query strings



- signed URLs for public content



- varying on unnecessary headers



- embedding account state inside otherwise static HTML



- per-user manifest generation



- dynamically generated image URLs







Premium presentation should ideally reuse the same cached public image objects where access permits, while changing reader behavior and advertising.







==================================================



CACHE INVALIDATION PHILOSOPHY



==================================================







Prefer:







“Publish new immutable versions and change a small pointer.”







Avoid:







“Purge or overwrite thousands of existing cached objects whenever one work changes.”







The proposal should establish invalidation rules for:







- image correction



- chapter correction



- title change



- tag change



- visibility change



- work removal



- emergency moderation



- reader application release



- manifest-schema release



- subscription-state change







Access or removal changes may require faster invalidation than ordinary metadata updates.







Explain how emergency takedowns should work even when assets have long cache lifetimes.







==================================================



EXTREME TRAFFIC AND STAMPEDE RESISTANCE



==================================================







The architecture should anticipate sudden viral traffic.







Evaluate protections against:







- cache stampedes



- thundering-herd manifest requests



- simultaneous cold-cache image requests



- repeated account-access calls



- repeated Supabase queries



- webhook bursts



- hot work releases



- bot scraping



- crawler amplification



- repeated failed ad initialization







Recommend strategies such as:







- immutable cached assets



- stale-while-revalidate



- request coalescing where available



- deduplicated client requests



- tiered cache



- limited prefetch



- rate limits for dynamic endpoints



- separate static and dynamic domains where useful



- backpressure for ingestion



- atomic publication



- graceful degradation







The public library should remain readable even if:







- comments fail



- Stripe fails



- Supabase becomes slow



- account access becomes unavailable



- advertisements fail



- discovery indexes are temporarily stale







==================================================



COST MODEL APPRAISAL



==================================================







Do not invent exact dollar totals without provider data.







However, the proposal should identify the major cost drivers:







- R2 object reads



- egress or delivery charges where applicable



- cache misses



- image size



- image variant count



- repeated manifest fetches



- Worker invocations



- Supabase queries



- Stripe-related requests



- logging volume



- analytics volume



- bot traffic



- cache invalidations



- dynamic Premium authorization







Provide a qualitative cost hierarchy and identify which architectural decisions have the greatest cost impact.







The proposal should compare:







- public flipbook bandwidth



- Premium continuous-scroll bandwidth



- cached repeat views



- cold-cache first views



- protected versus public assets



- one large image versus responsive variants



- generated static routes versus shared shells



- R2 origin reads versus edge hits







==================================================



OBSERVABILITY WITHOUT EXCESSIVE COST



==================================================







At enormous scale, logs themselves can become expensive.







Propose a restrained observability model:







- aggregate cache-hit metrics



- sampled request logs



- sampled client errors



- image-delivery metrics



- reader performance metrics



- Worker invocation counts



- Supabase query volume



- advertisement initialization failures



- manifest-version failures



- ingestion errors



- publication rollback events







Avoid requiring full verbose logs for every public page view.







Discuss sampling, retention, and privacy.







==================================================



DURABILITY PRINCIPLES



==================================================







The recommended architecture should follow these principles:







1. Public content remains readable without account infrastructure.



2. Static assets are immutable wherever possible.



3. Repeated reads are served from browser or edge cache.



4. R2 is treated as durable origin storage, not as a database queried repeatedly.



5. Numeric IDs never depend on titles or paths.



6. Publication is atomic.



7. Manifests are versioned and validated.



8. Dynamic services are limited to truly dynamic features.



9. Premium does not cause unnecessary duplication of public assets.



10. Scale is handled through caching and simplicity before additional servers.



11. Failure of comments, billing, ads, or accounts does not erase the library.



12. Cost per repeated read should approach the lowest practical level.







==================================================



REQUIRED ADDITIONS TO THE DOCUMENTS



==================================================







Add dedicated caching and extreme-scale sections to:







docs/foundational-repository-and-infrastructure-audit.md







Include:







- current cache headers



- current browser-cache behavior



- current R2/CDN assumptions



- cache-fragmentation risks



- current immutable versus mutable asset behavior



- present origin-read risks







docs/automated-ingestion-manifest-and-publication-proposal.md







Include:







- immutable asset publication



- content hashes



- versioned manifests



- atomic pointer updates



- cache invalidation



- emergency takedowns



- garbage collection



- rollback







docs/public-flipbook-and-premium-flow-reader-proposal.md







Include:







- public prefetch budget



- Premium lazy-loading budget



- browser cache reuse



- decoded-image memory



- Save-Data behavior



- long-chapter behavior



- repeat-view behavior







docs/image-delivery-cost-and-download-deterrence-appraisal.md







Include:







- browser cache



- edge cache



- R2 origin



- responsive variants



- object naming



- cache keys



- estimated relative cost drivers



- scraping and bot amplification







docs/recommended-foundational-architecture-and-roadmap.md







Include:







- recommended multi-layer cache strategy



- immutable publication model



- recommended cache headers by asset class



- manifest caching



- index sharding



- cache-stampede resistance



- observability strategy



- extreme-scale conclusion



- cost-control priorities







docs/executive-foundation-summary.md







Include a concise statement that the architecture is designed to:







- maximize browser and CDN cache reuse



- minimize R2 origin reads



- minimize dynamic requests



- survive extreme traffic



- keep marginal delivery cost as low as practicalRepository: thanks-cohn/doku-doujins-premium



Local repository: ~/dev/doku-doujins-premium



Base branch: main



Safety tag: pre-adfree-and-routing-proposal







TASK TYPE:



COMPLETE REPOSITORY AUDIT, INFRASTRUCTURE APPRAISAL, DATA-MODEL PROPOSAL, AND STAGED ARCHITECTURE PLAN ONLY







DO NOT IMPLEMENT THE PROPOSAL.







This task exists to establish a durable foundation before future automation begins assigning work IDs, generating manifests, creating URLs, processing chapters, publishing works, and controlling public versus Premium access.







A weak temporary design will eventually become expensive to replace. Therefore, inspect the repository thoroughly and produce an evidence-based proposal suitable for long-term automated operation.







==================================================



ABSOLUTE CHANGE BOUNDARY



==================================================







Do not modify application behavior.







Do not:







- refactor source code



- create routes



- change the reader



- change advertisements



- alter Stripe



- alter Supabase



- modify SQL or migrations



- change R2 objects



- assign production work IDs



- alter tag visibility



- add a Worker



- change Cloudflare configuration



- install dependencies



- change package files



- create a proof of concept



- deploy



- merge automatically







The only permitted repository changes are new Markdown documents inside:







docs/







At the end, verify that no runtime, configuration, dependency, SQL, deployment, or application files changed.







==================================================



PRIMARY OBJECTIVE



==================================================







Study the present repository and determine the safest standardized architecture for:







1. Permanent numeric work identities



2. Stable chapter identities



3. Stable page identities



4. Shareable work, chapter, and page URLs



5. Public page-by-page reading



6. Premium continuous-scroll reading



7. Public advertising



8. Completely ad-free Premium use



9. Premium commenting



10. Premium catalog and tag access



11. Static-first content delivery



12. Minimal Worker dependence



13. Future automated ingestion and publishing



14. Image bandwidth control



15. Casual image-download deterrence



16. Long-term compatibility with a very large catalog







The result must be a proposal, not an implementation.







Every recommendation must be grounded in the existing repository wherever possible.







==================================================



CORE PRODUCT MODEL



==================================================







The site should eventually provide two coordinated reading experiences.







They must remain:







- one website



- one codebase



- one catalog



- one account system



- one visual identity



- one set of canonical work identities



- one shared reader foundation







Do not propose two independently maintained applications.







--------------------------------------------------



PUBLIC / FREE READER



--------------------------------------------------







The public reader should behave as a polished page-by-page digital reader.







A user sees one page at a time and advances deliberately through:







- Next and Previous controls



- keyboard arrows



- mobile swipe



- touch or click controls where appropriate







The public reader should generally load only:







- the current page



- the immediately previous page where useful



- one or two upcoming pages



- lightweight reader assets







It should not eagerly download an entire chapter merely because the first page was opened.







Primary reasons:







- lower R2 delivery cost



- lower browser memory usage



- faster first-page display



- less wasted image transfer



- more predictable mobile performance



- controlled advertisement opportunities



- reliable page-specific navigation







The public reader must remain pleasant and functional.







It should feel like a classic reader, not an intentionally broken Premium advertisement.







--------------------------------------------------



PREMIUM READER



--------------------------------------------------







Trialing and active Premium users should receive a continuous-scroll reader.







Premium readers should be able to open a work and scroll through it without pressing Next after every page.







Premium benefits should include:







- continuous-scroll reading



- no advertisements



- no popunders



- no ad-provider script initialization



- no hidden advertising iframe



- no advertisement network request



- no abandoned advertisement space



- comments and replies



- editing of owned comments



- broader approved catalog access



- Premium-visible tags and works



- saved reading position where practical



- a calmer and more spacious layout







Continuous scroll must still use:







- lazy loading



- responsive image variants



- viewport observation



- limited look-ahead loading



- placeholders



- memory controls



- virtualization or unloading where appropriate







Premium must not immediately download every image in a large work.







The central promise is:







“No ads. No interruptions. No endless clicking.”







==================================================



MEMBERSHIP AND CAPABILITY MODEL



==================================================







The proposal should recommend a centralized capability model rather than scattering raw subscription-status comparisons throughout the codebase.







Conceptual capabilities may include:







- hasPremiumAccess



- mayUseContinuousReader



- mayComment



- mayReply



- mayEditOwnComment



- mayDeleteOwnComment



- mayViewPremiumCatalog



- shouldLoadAds



- shouldShowUpgradePrompt



- isAccessResolved







Study the existing access endpoint and current account model before recommending exact names.







--------------------------------------------------



LOGGED-OUT VISITOR



--------------------------------------------------







May:







- browse public works



- use the page-by-page reader



- read comments



- encounter advertisements



- share permanent URLs



- create an account







May not:







- comment



- reply



- edit comments



- use continuous scroll



- access Premium-only catalog classifications







--------------------------------------------------



FREE ACCOUNT



--------------------------------------------------







May receive:







- account identity



- bookmarks



- reading history



- saved progress



- public work access



- public tag access



- public comment reading



- page-by-page reader







Also receives advertisements.







May not:







- comment



- reply



- edit comments



- use Premium continuous scroll



- access Premium-only works or tags







--------------------------------------------------



TRIALING PREMIUM



--------------------------------------------------







Receives the complete Premium experience:







- continuous scroll



- no advertisements



- comments and replies



- editing of owned comments



- broader approved catalog access



- Premium-visible tags and works







The trial exists partly so that users experience these advantages directly.







--------------------------------------------------



ACTIVE PREMIUM



--------------------------------------------------







Receives the same Premium capabilities continuously.







--------------------------------------------------



EXPIRED OR NONQUALIFYING SUBSCRIPTION



--------------------------------------------------







Statuses such as:







- past_due



- unpaid



- canceled



- incomplete



- expired



- failed payment



- no qualifying subscription







should return the account to:







- page-by-page reading



- advertisements



- public catalog visibility



- read-only comments







The account should retain:







- bookmarks



- history



- saved progress where possible



- existing comments



- ability to delete owned old comments







Losing Premium must not erase the user’s identity or previous participation.







==================================================



PREMIUM VALUE PROPOSITION



==================================================







The initial $5 Premium tier has four core benefits.







1. FLOW







Continuous-scroll reading without pressing Next repeatedly.







2. SILENCE







No banners, popunders, advertisement scripts, hidden frames, or advertisement requests.







3. VOICE







Comments, replies, and editing of owned comments.







4. ACCESS







The broader approved catalog, including tags and works not shown in the public edition.







Suggested product concept:







“Open the whole library.







Scroll without interruption.



Read without ads.



Join the discussion.



Unlock the complete approved catalog.”







The proposal should evaluate how to make Premium compelling without making the public experience hostile.







==================================================



STANDARDIZED PERMANENT URL FOUNDATION



==================================================







Do not use experimental punctuation such as:







@=



@=profile



@=page-7







Do not preserve unusual URL syntax merely because another part of the current site happens to use it.







The new work-reader URL system should use a standardized, predictable, durable structure.







The preferred canonical design to evaluate is:







https://9127000.xyz/work/134123132/chapter/1/page/7







Where:







- `work` is a stable namespace



- `134123132` is the permanent numeric work ID



- `chapter/1` identifies chapter 1



- `page/7` identifies page 7







Conceptual pattern:







/work/{work_id}/chapter/{chapter_number}/page/{page_number}







This is the preferred product-facing structure unless the audit proves that another standardized form is substantially safer or more scalable.







Compare it with:







/work/134123132/chapter/1/#page-7







/work/134123132/chapter/1?page=7







/work/134123132/chapter/1/page/7/







Do not compare or recommend decorative custom punctuation.







The proposal must determine which standardized form best satisfies:







- direct refresh



- copy and sharing



- bookmarks



- browser Back and Forward



- static hosting



- zero-Worker goals



- Cloudflare Pages behavior



- analytics



- canonical links



- automated route generation



- very large catalog scale



- implementation simplicity



- long-term maintainability







If the fully path-based form cannot be served reliably without generating excessive files or introducing a Worker, explain that conflict plainly.







The canonical URL must not be selected merely because it looks attractive.







==================================================



PERMANENT NUMERIC WORK IDENTITY



==================================================







Every work should receive a permanent numeric ID.







The numeric ID is identity.







The following are metadata or storage details, not identity:







- title



- title spelling



- slug



- catalog position



- local folder name



- R2 object path



- upload filename



- cover filename



- tag arrangement







Required properties:







- a work ID never changes



- a work ID is never reused



- a title change does not alter the URL



- moving R2 objects does not alter the URL



- rebuilding manifests does not alter the URL



- a removed work does not free its ID



- deleted works may retain tombstone records



- legacy references may point to the permanent ID



- future automation can request or allocate an ID safely



- ingestion can be repeated without assigning a second identity







Study how works are currently identified.







Determine whether present identity depends on:







- title



- folder name



- JSON key



- object path



- UUID



- catalog order



- filename



- generated identifier



- another mechanism







Clearly identify migration risks.







==================================================



WORK ID ALLOCATION APPRAISAL



==================================================







Compare possible numeric ID strategies:







1. Monotonic sequential integers



2. Large sequential integers



3. Random numeric identifiers



4. Time-derived numeric identifiers



5. Central registry-assigned IDs



6. Ingestion-service-assigned IDs



7. Database sequence



8. Durable static registry







For each, evaluate:







- collision risk



- enumeration



- privacy



- automation



- concurrency



- offline ingestion



- idempotency



- recovery after failure



- restoring from backup



- multiple ingestion machines



- future distributed ingestion



- human readability



- maximum practical range



- JavaScript numeric safety







Explicitly address JavaScript’s safe-integer limit.







If identifiers may exceed:







9007199254740991







recommend storing and transporting them as strings even when they contain digits only.







The proposal should recommend:







- canonical representation



- allocation authority



- transaction or lock behavior



- duplicate prevention



- retry behavior



- import behavior



- migration behavior



- audit history







==================================================



CHAPTER IDENTITY



==================================================







Determine whether chapter identity should use:







- stable chapter numbers



- permanent chapter IDs



- both a permanent chapter ID and a display order



- ingestion order



- manually assigned order







Chapter order and chapter identity may not always be the same thing.







The proposal must address:







- chapters inserted between existing chapters



- bonus chapters



- chapter renaming



- chapter reordering



- combined chapters



- split chapters



- alternate editions



- deleted chapters



- chapter tombstones



- legacy chapter URLs







A durable automated system should not break permanent links merely because chapter display order changes.







Evaluate whether the URL should use:







/chapter/1







or a permanent numeric chapter ID such as:







/chapter/482910







with display chapter number stored separately.







Recommend a model suitable for future automated publishing.







==================================================



PAGE IDENTITY



==================================================







Every reader page must have a stable addressable number.







The proposal must distinguish:







- page identity



- page display order



- image filename



- array index



- printed page number



- reader page number







Required behavior:







- opening a page URL restores the correct page



- refreshing restores the correct page



- copying the URL shares that exact location



- Back and Forward work



- jumping to a page updates the URL



- moving between chapters updates the URL



- malformed values fail safely



- page 1 is never confused with array index 0



- reprocessing images does not silently change permanent reader links







Evaluate whether pages need:







- simple chapter-relative numbers



- permanent page IDs



- both stable IDs and display positions







Address the consequences of:







- inserting a missing page



- removing a duplicate page



- rescanning a chapter



- replacing an image



- combining two pages



- splitting one page



- changing display order







The future ingestion system must not casually renumber existing public links.







==================================================



ROUTING MODELS TO APPRAISE



==================================================







Compare at least these models.







--------------------------------------------------



MODEL A: FULLY PATH-BASED CANONICAL PAGE ROUTES



--------------------------------------------------







Example:







/work/134123132/chapter/1/page/7







Evaluate:







- direct refresh



- Cloudflare Pages handling



- static file generation



- fallback shell



- route parsing



- canonical URLs



- analytics



- search indexing



- browser history



- millions-of-pages scale



- Worker requirements







--------------------------------------------------



MODEL B: STATIC CHAPTER ROUTE PLUS PAGE FRAGMENT



--------------------------------------------------







Example:







/work/134123132/chapter/1/#page-7







Evaluate:







- zero-Worker compatibility



- static delivery



- direct refresh



- server visibility



- analytics



- indexing



- browser history



- URL restoration



- automation







--------------------------------------------------



MODEL C: STATIC CHAPTER ROUTE PLUS QUERY PARAMETER



--------------------------------------------------







Example:







/work/134123132/chapter/1/?page=7







Evaluate the same concerns.







--------------------------------------------------



MODEL D: GENERATED STATIC WORK OR CHAPTER ROUTES



--------------------------------------------------







Evaluate:







- ingestion-generated folders



- build artifact size



- file count



- Cloudflare Pages limits



- millions of works



- incremental publication



- rollback



- cache invalidation







--------------------------------------------------



MODEL E: SHARED STATIC READER SHELL



--------------------------------------------------







Many canonical URLs resolve to one static reader shell that parses the path and retrieves manifests.







Evaluate:







- direct refresh behavior



- fallback rules



- status codes



- missing-work behavior



- false homepage fallback



- Cloudflare Pages support



- zero-Worker feasibility







--------------------------------------------------



MODEL F: WORKER-BASED ROUTING



--------------------------------------------------







Discuss only as a comparison or where technically unavoidable.







The project prefers zero Workers for ordinary public reading.







Do not recommend a Worker merely because it makes routing easier.







==================================================



PUBLIC READER NAVIGATION



==================================================







The page-by-page reader should eventually support:







- Next



- Previous



- keyboard navigation



- mobile swipe



- page jump



- chapter change



- direct page link



- refresh



- Back



- Forward



- opening in another tab







The proposal should evaluate:







- standard anchor navigation



- History API



- pushState



- replaceState



- popstate



- fragment navigation



- prefetching



- focus management







Deliberate public page changes should generally create meaningful history entries.







Example:







- user opens page 7



- user selects Next



- reader moves to page 8



- Back returns to page 7



- Forward returns to page 8







==================================================



PREMIUM SCROLL URL SYNCHRONIZATION



==================================================







The Premium continuous reader must still keep a meaningful page URL.







As the dominant visible page changes, the URL should update without producing hundreds of browser-history entries.







Evaluate:







- IntersectionObserver



- dominant-page calculation



- history.replaceState



- deliberate page-jump pushState



- scroll restoration



- hashchange



- popstate



- throttling



- URL-update frequency



- mobile scrolling



- chapter boundaries







A likely model is:







- passive scrolling uses replaceState



- deliberate page jumps use pushState



- chapter navigation creates a real history entry







Validate this against the repository rather than accepting it automatically.







==================================================



FUTURE AUTOMATED INGESTION



==================================================







Assume that ingestion, ID assignment, manifest generation, chapter processing, page processing, publication, and cache invalidation will eventually be automated.







The proposal must design for automation from the beginning.







The future ingestion pipeline may need to:







1. Receive a new work



2. Determine whether it already exists



3. Allocate or recover its permanent work ID



4. Validate metadata



5. Process its cover



6. detect chapters



7. allocate chapter identities



8. detect and order pages



9. allocate stable page identities or positions



10. generate responsive image variants



11. upload image objects



12. generate manifests



13. classify tags and visibility



14. produce canonical URLs



15. update discovery indexes



16. invalidate caches



17. publish atomically



18. leave a recoverable audit trail







The appraisal must address:







- idempotency



- partial failure



- retries



- duplicate uploads



- re-ingestion



- concurrent ingestion



- schema validation



- manifest versioning



- atomic publication



- staging versus published state



- rollback



- orphaned objects



- checksum use



- content replacement



- chapter additions



- page corrections



- tag corrections



- audit logs







Do not create the pipeline now.







Propose the contracts the future pipeline should obey.







==================================================



PUBLICATION STATE MODEL



==================================================







Evaluate a durable state model such as:







- draft



- processing



- validated



- staged



- published



- hidden



- quarantined



- removed



- failed







The public catalog should never observe a half-published work.







Recommend how publication should become visible atomically.







For example:







- upload all assets first



- validate manifests



- publish the final manifest pointer last







Appraise the safest strategy for R2 and static indexes.







==================================================



MANIFEST SCHEMA



==================================================







Propose a versioned manifest design.







The proposal should evaluate separate documents for:







- work metadata



- chapter metadata



- page/image records



- visibility



- tag references



- image variants



- checksums



- publication version



- timestamps



- canonical IDs







Possible shape for discussion only:







{



  "schemaVersion": 1,



  "workId": "134123132",



  "title": "Example Work",



  "visibility": "public",



  "chapters": [



    {



      "chapterId": "1",



      "displayNumber": "1",



      "manifestUrl": "/work-index/134123132/chapters/1.json"



    }



  ]



}







Do not impose this example blindly.







Recommend a schema based on repository reality and future automation requirements.







The design should support:







- schema evolution



- old-reader compatibility



- validation



- cache invalidation



- partial updates



- chapter additions



- image replacement



- catalog indexing



- Premium access classification







==================================================



MANIFEST STORAGE STRATEGY



==================================================







Compare:







1. One global catalog manifest



2. Sharded global indexes



3. One work manifest per work



4. One chapter manifest per chapter



5. One page record per page



6. Work manifest plus chapter manifests



7. Versioned immutable manifests plus a current pointer







Evaluate:







- R2 compatibility



- Cloudflare caching



- CDN invalidation



- ingestion updates



- millions of works



- large chapters



- public access



- Premium access



- rollback



- manifest size



- lookup count



- browser performance







The proposal should recommend a scalable hierarchy.







==================================================



STATIC-FIRST AND ZERO-WORKER GOAL



==================================================







Ordinary public reading should ideally follow:







Browser



→ static reader shell



→ static or cached manifest



→ cached R2 image







It should not require:







- Supabase for basic work display



- Stripe for basic work display



- dynamic HTML rendering



- a database query per page



- a Worker request per image



- a Worker request per page transition







Dynamic infrastructure should remain reserved for capabilities that require it:







- authentication



- subscriptions



- comments



- votes



- reports



- moderation



- bookmarks



- account synchronization



- strongly protected Premium assets







The appraisal must distinguish:







- where zero Workers is realistic



- where it creates harmful compromises



- where limited dynamic infrastructure may be justified



- whether Workers can be restricted to Premium-protected catalog access rather than ordinary public reading







Do not distort technical conclusions to satisfy the zero-Worker preference.







==================================================



PREMIUM CATALOG AND TAG ACCESS



==================================================







Premium should eventually unlock more of the approved catalog.







Audit the existing:







- tag format



- public/private tag handling



- blocked tags



- hidden works



- catalog filters



- search filters



- recommendation filters



- homepage selection



- manifest exposure







Recommend explicit visibility classifications such as:







- public



- account



- premium



- age-restricted



- administrative



- removed







Definitions:







PUBLIC







Visible to ordinary visitors.







ACCOUNT







Visible after authentication where appropriate.







PREMIUM







Visible to trialing and active Premium users and approved bypass roles.







AGE-RESTRICTED







Requires applicable age eligibility in addition to other access requirements.







ADMINISTRATIVE







Unavailable to ordinary users because it is under review, moderation, quarantine, or internal management.







REMOVED







Unavailable entirely.







Premium must not override:







- removed status



- illegal-content restrictions



- private material



- administrative quarantine



- territorial restrictions



- required age restrictions



- content the platform refuses to distribute







The intended principle is:







“Premium opens the complete approved library, not content the platform cannot or will not publish.”







==================================================



DISCOVERY RESTRICTION VERSUS ACCESS CONTROL



==================================================







The appraisal must distinguish:







DISCOVERY-ONLY RESTRICTION







- omitted from public search



- omitted from public recommendations



- omitted from public tag navigation



- direct URL may still work



- assets may remain publicly accessible



- highly static



- weak protection







ACTUAL ACCESS CONTROL







- unauthorized users cannot retrieve the protected manifest



- unauthorized users cannot retrieve protected images



- may require signed URLs or gated delivery



- stronger protection



- more infrastructure



- may conflict with broad CDN caching and zero Workers







Explain the tradeoff honestly.







Do not describe hidden buttons as security.







==================================================



ADVERTISING ARCHITECTURE



==================================================







The public reader may include controlled advertisement opportunities.







Possible placements:







- below the current page



- between groups of pages



- during occasional page transitions



- in desktop side space



- in safe mobile inline regions



- existing homepage or rotunda placements







The reader should own the advertising rhythm.







Individual work manifests should not contain arbitrary provider scripts.







Appraise a centralized configuration model containing:







- slot identity



- provider



- dimensions



- placement



- viewport requirements



- page interval



- minimum page before first ad



- maximum chapter frequency



- mobile behavior



- desktop behavior



- enabled state



- no-fill behavior



- initialization state







Public advertising must not appear after every page.







Discuss:







- abandonment



- accidental clicks



- provider policies



- popunders



- no-fill



- mobile safety



- layout shift



- repeated initialization



- route transitions



- ad retries



- accessibility







==================================================



PREMIUM AD-FREE REQUIREMENT



==================================================







Premium must receive genuinely ad-free delivery.







It is not sufficient to:







- load an advertisement script



- create an advertisement request



- create an iframe



- hide the result with CSS







For Premium:







- provider scripts must not initialize



- advertisement code must not execute



- advertising requests must not occur



- advertisement containers should not mount



- no popunder should initialize



- no blank advertising spaces should remain







While access status is unresolved:







- do not initialize advertising prematurely



- do not expose Premium comment controls



- do not flash upgrade messaging to known Premium users



- keep ordinary static content visible







Appraise failure behavior when `/api/account/access` is unavailable.







==================================================



COMMENT SYSTEM



==================================================







Comments remain publicly readable.







Writing is limited to:







- trialing



- active



- approved staff bypass roles







Nonqualifying users remain read-only.







Audit:







- discussion service



- RPC calls



- current access handling



- SECURITY DEFINER functions



- RLS



- service-role usage



- authorship records



- edit behavior



- delete behavior







Current intended behavior:







- create_comment requires Premium



- edit_own_comment requires Premium



- delete_own_comment requires ownership but not active Premium







Do not propose removing the server-side enforcement.







The frontend should later reflect it with a polished locked composer and friendly upgrade message.







==================================================



IMAGE DELIVERY AND BANDWIDTH



==================================================







Audit:







- current image sources



- R2 paths



- manifest references



- image variants



- eager loading



- lazy loading



- prefetching



- retry behavior



- cache headers



- mobile sources



- desktop sources



- cover images



- chapter images







Determine whether opening a work currently loads:







- one image



- adjacent images



- one chapter



- an entire work



- thumbnail and original variants simultaneously







Propose:







PUBLIC READER







- current page



- limited adjacent prefetch



- responsive display variant



- no eager whole-chapter download







PREMIUM READER







- continuous scroll



- lazy loading



- limited look-ahead



- placeholder sizing



- virtualization



- responsive variants



- memory controls







==================================================



CASUAL IMAGE-DOWNLOAD DETERRENCE



==================================================







The site should discourage effortless casual saving of work images.







Desired outcomes:







- no visible download button



- ordinary right-click saving discouraged



- ordinary dragging discouraged



- archival originals not delivered unnecessarily



- original filenames not exposed unnecessarily



- automated mass retrieval made more difficult



- screenshotting remains possible







The proposal must be honest:







A browser that displays an image has received image information.







Client-side JavaScript cannot make displayed public images impossible to save.







A determined user may use:







- developer tools



- network inspection



- browser cache



- disabled JavaScript



- automated browsers



- screenshots



- screen photography







The practical objective is:







“Prevent effortless casual downloading, avoid exposing archival originals, and make large-scale automated extraction more difficult.”







Audit and compare:







- contextmenu prevention



- dragstart prevention



- pointer overlays



- CSS selection controls



- canvas rendering



- blob URL indirection



- public R2 URLs



- signed URLs



- display-quality variants



- visible watermarks



- invisible watermarks



- per-user watermarks



- hotlink protection



- rate limiting



- bot controls







For each, state:







- what it prevents



- what it does not prevent



- accessibility impact



- performance impact



- caching impact



- mobile impact



- infrastructure requirements



- zero-Worker compatibility







==================================================



CURRENT REPOSITORY AUDIT



==================================================







Before recommending anything, inspect and document the present implementation.







APPLICATION







- entry points



- build system



- source layout



- public assets



- route handling



- reader modules



- catalog modules



- mobile behavior



- desktop behavior







ROUTING







- current homepage URL behavior



- work opening



- modal behavior



- History API



- hash handling



- query parameters



- direct refresh



- fallback behavior



- canonical links







READER







- page state



- chapter state



- image loading



- controls



- keyboard support



- touch support



- URL synchronization



- progress restoration







ADVERTISING







- provider scripts



- popunders



- banners



- overlays



- rotunda ads



- reader ads



- initialization



- retries



- no-fill handling



- CSS



- configuration







ACCOUNT AND PREMIUM







- login



- logout



- session discovery



- `/api/account/access`



- subscription lookup



- role lookup



- access caching



- account switching



- checkout



- Stripe webhooks



- delayed status synchronization







COMMENTS







- frontend discussion modules



- RPC functions



- RLS



- SECURITY DEFINER



- ownership



- edit



- delete







CATALOG AND TAGS







- work records



- tag records



- blocked tags



- hidden works



- manifests



- search indexes



- homepage indexes



- R2 catalog assumptions







DEPLOYMENT







- Cloudflare Pages



- Pages Functions



- Workers



- wrangler.jsonc



- redirects



- route configuration



- build artifact



- deployment scripts



- environment variables







For each major finding, include:







- file path



- function, class, or module



- current behavior



- confirmed fact or inference



- uncertainty requiring later testing







==================================================



ARCHITECTURAL OPTIONS



==================================================







Compare at least:







ROUTE A







Shared static shell with standardized numeric route parsing.







ROUTE B







Generated static work or chapter routes.







ROUTE C







Static chapter routes with fragment-based pages.







ROUTE D







SPA-style static fallback shell.







ROUTE E







Hybrid static public content with gated Premium manifests or assets.







ROUTE F







Worker-based routing.







For each, evaluate:







- repository fit



- implementation size



- rewrite risk



- permanent URL reliability



- direct refresh



- zero-Worker compatibility



- Cloudflare Pages compatibility



- millions-of-works scale



- automation



- caching



- R2 bandwidth



- Premium protection



- operational complexity



- rollback



- test burden







Recommend:







- one primary architecture



- one fallback architecture



- conditions that would justify using the fallback







==================================================



FOUNDATIONAL RISKS



==================================================







Explicitly address:







- title-based identity



- mutable work IDs



- ID reuse



- JavaScript unsafe numeric values



- concurrent ID allocation



- duplicate ingestion



- non-idempotent publishing



- half-published works



- chapter reordering breaking links



- page insertion renumbering links



- schema without versioning



- one enormous global manifest



- millions of generated HTML files



- stale manifest caches



- R2 paths treated as identity



- public manifests exposing protected works



- hidden tags mistaken for security



- false homepage fallback



- direct refresh failure



- duplicate canonical URLs



- hash/history loops



- hundreds of browser-history entries



- page-index off-by-one errors



- eager chapter downloads



- Premium memory exhaustion



- ad flash before access resolution



- CSS-only ad hiding



- popunder reinjection



- stale subscription state



- account-state leakage



- delayed Stripe webhooks



- service-role bypass



- SECURITY DEFINER bypass



- client-side image protection described as DRM



- accessibility broken by image deterrence



- excessive dependence on Workers



- static public reading depending on Supabase



- architectural duplication between public and Premium







==================================================



STAGED FUTURE ROADMAP



==================================================







Propose an incremental roadmap.







Do not implement any phase.







PHASE 0: AUDIT AND DECISION RECORD







- document present architecture



- identify risks



- choose canonical identity rules



- choose canonical URL rules



- choose manifest hierarchy



- define unresolved questions







PHASE 1: SCHEMA AND REGISTRY FOUNDATION







- work ID registry



- chapter identity rules



- page identity rules



- schema versions



- validation rules



- non-reuse policy



- tombstones



- idempotency contracts







PHASE 2: AUTOMATED INGESTION CONTRACT







- deterministic retries



- duplicate detection



- checksums



- staging



- validation



- atomic publication



- rollback



- audit records







PHASE 3: URL-AWARE PUBLIC READER







- canonical work route



- chapter route



- page route



- refresh



- Back and Forward



- limited image loading







PHASE 4: CENTRALIZED ACCESS CAPABILITIES







- Premium state



- advertisement eligibility



- comment eligibility



- catalog eligibility



- safe loading and failure behavior







PHASE 5: PREMIUM CONTINUOUS READER







- lazy loading



- virtualization



- page URL synchronization



- progress restoration



- long-chapter testing







PHASE 6: CONTROLLED ADVERTISEMENT SYSTEM







- centralized slots



- interval rules



- provider loading



- no-fill behavior



- Premium zero-request validation







PHASE 7: PREMIUM CATALOG ACCESS







- visibility classes



- search filtering



- direct-link policy



- manifest protection



- age restrictions



- removed-content rules







PHASE 8: IMAGE DELIVERY AND DETERRENCE







- responsive variants



- public bandwidth limits



- casual-download deterrence



- accessibility review



- abuse controls







PHASE 9: MIGRATION AND AUTOMATION VALIDATION







- legacy links



- existing works



- ingestion retries



- concurrent publication



- cache behavior



- account transitions



- trial expiration



- rollback drills







For each phase, include:







- objective



- prerequisites



- repository areas affected



- risks



- tests



- rollback strategy



- evidence required before proceeding







==================================================



REQUIRED DOCUMENTS



==================================================







Create only the following Markdown files.







1.







docs/foundational-repository-and-infrastructure-audit.md







Visible title:







# Foundational Repository and Infrastructure Audit







Include:







- current architecture



- current routing



- current reader



- current identity model



- current catalog structure



- current image loading



- current advertisement inventory



- current access flow



- current comment authorization



- current tag behavior



- current deployment structure



- confirmed facts



- inferences



- unresolved questions



- exact repository references







2.







docs/permanent-work-chapter-and-page-identity-proposal.md







Visible title:







# Permanent Work, Chapter, and Page Identity Proposal







Include:







- work ID strategy



- numeric representation



- JavaScript safe-integer concerns



- allocation authority



- duplicate prevention



- chapter identity



- chapter display order



- page identity



- page display order



- insertion and deletion behavior



- tombstones



- aliases



- migration



- future automation contracts



- recommended model







3.







docs/standardized-reader-url-and-routing-appraisal.md







Visible title:







# Standardized Reader URL and Routing Appraisal







Include the preferred standardized form:







https://9127000.xyz/work/134123132/chapter/1/page/7







Compare it with:







- fragment-based pages



- query-based pages



- static generated routes



- shared static shells



- fallback routing



- Workers







Include:







- direct refresh



- browser history



- canonical URLs



- Cloudflare Pages



- millions-of-works scale



- zero-Worker feasibility



- recommended canonical URL



- fallback recommendation



- migration strategy







Do not recommend `@=` syntax.







4.







docs/automated-ingestion-manifest-and-publication-proposal.md







Visible title:







# Automated Ingestion, Manifest, and Publication Proposal







Include:







- future ingestion stages



- ID assignment



- idempotency



- checksums



- duplicate detection



- chapter processing



- page processing



- image variants



- schema versioning



- manifest hierarchy



- staging



- atomic publication



- partial failure



- retries



- rollback



- audit records



- cache invalidation



- orphan cleanup



- validation



- recommended contracts







5.







docs/public-flipbook-and-premium-flow-reader-proposal.md







Visible title:







# Public Flipbook and Premium Flow Reader Proposal







Include:







- public page-by-page reader



- Premium continuous scroll



- membership behavior



- four Premium benefits



- public bandwidth control



- Premium lazy loading



- browser-history differences



- progress restoration



- advertising integration



- comment presentation



- failure behavior



- accessibility







6.







docs/premium-advertising-comment-and-access-architecture.md







Visible title:







# Premium, Advertising, Comment, and Access Architecture







Include:







- centralized capabilities



- authoritative access



- public ads



- Premium zero-ad-request requirement



- account-state loading



- access failure



- comments



- SECURITY DEFINER



- RLS



- logout and account switching



- checkout synchronization



- tests and risks







7.







docs/premium-tag-and-protected-catalog-appraisal.md







Visible title:







# Premium Tag and Protected Catalog Appraisal







Include:







- current tags



- proposed visibility classes



- public catalog



- Premium catalog



- discovery restriction



- actual access control



- public manifest leakage



- protected images



- age restrictions



- administrative and removed states



- zero-Worker tradeoffs



- recommended approach







8.







docs/image-delivery-cost-and-download-deterrence-appraisal.md







Visible title:







# Image Delivery Cost and Download Deterrence Appraisal







Include:







- current image behavior



- public-reader loading



- Premium-reader loading



- responsive variants



- caching



- virtualization



- R2 implications



- casual download deterrence



- technical limits



- accessibility



- hotlinking



- signed URLs



- watermarks



- abuse controls



- recommended practical protection level







9.







docs/recommended-foundational-architecture-and-roadmap.md







Visible title:







# Recommended Foundational Architecture and Roadmap







Include:







- primary architectural recommendation



- fallback architecture



- canonical ID model



- canonical URL



- chapter and page identity



- manifest model



- automated ingestion model



- public reader



- Premium reader



- advertising



- comments



- Premium catalog



- image delivery



- static versus dynamic responsibilities



- zero-Worker conclusion



- staged roadmap



- tests



- rollback



- unresolved decisions







10.







docs/executive-foundation-summary.md







Visible title:







# Executive Foundation Summary







Keep this concise.







State:







- what the site is becoming



- what remains unchanged



- recommended work identity



- recommended chapter identity



- recommended page identity



- recommended canonical URL



- recommended manifest hierarchy



- recommended publication model



- recommended public reader



- recommended Premium reader



- recommended advertising model



- where dynamic infrastructure is necessary



- zero-Worker conclusion



- greatest foundational risks



- recommended order of implementation



- confirmation that no runtime code changed







==================================================



QUALITY REQUIREMENTS



==================================================







Do not provide generic advice.







Every statement about current behavior should cite:







- exact file path



- relevant function, module, or configuration



- whether the conclusion is confirmed or inferred







Do not conceal uncertainty.







Do not select a routing strategy without examining Cloudflare Pages behavior and the existing build output.







Do not select an ID model without addressing:







- safe numeric representation



- allocation authority



- concurrency



- idempotency



- migration



- non-reuse



- tombstones







Do not select a manifest strategy without addressing:







- schema versions



- validation



- atomic publication



- retries



- cache invalidation



- millions-of-works scale







==================================================



FINAL VALIDATION



==================================================







At the end:







- run git diff --check



- run git status --short



- list every created file



- confirm only Markdown files under docs/ changed



- confirm no application source changed



- confirm no configuration changed



- confirm no dependency changed



- confirm no lockfile changed



- confirm no SQL or migration changed



- confirm no deployment occurred







The final report must state:







1. Documents created



2. Most important confirmed repository finding



3. Recommended permanent work-ID model



4. Recommended chapter-ID model



5. Recommended page-ID model



6. Recommended canonical URL



7. Recommended manifest hierarchy



8. Recommended automated publication model



9. Recommended public reader architecture



10. Recommended Premium reader architecture



11. Whether zero Workers is realistically achievable



12. Where limited dynamic infrastructure may be necessary



13. Largest unresolved foundational question



14. Confirmation that no runtime code was changedRepository: thanks-cohn/doku-doujins-premium



Local repository: ~/dev/doku-doujins-premium



Base branch: main



Safety tag: pre-adfree-and-routing-proposal







TASK TYPE:



COMPLETE REPOSITORY AUDIT, INFRASTRUCTURE APPRAISAL, DATA-MODEL PROPOSAL, AND STAGED ARCHITECTURE PLAN ONLY







DO NOT IMPLEMENT THE PROPOSAL.







This task exists to establish a durable foundation before future automation begins assigning work IDs, generating manifests, creating URLs, processing chapters, publishing works, and controlling public versus Premium access.







A weak temporary design will eventually become expensive to replace. Therefore, inspect the repository thoroughly and produce an evidence-based proposal suitable for long-term automated operation.







==================================================



ABSOLUTE CHANGE BOUNDARY



==================================================







Do not modify application behavior.







Do not:







- refactor source code



- create routes



- change the reader



- change advertisements



- alter Stripe



- alter Supabase



- modify SQL or migrations



- change R2 objects



- assign production work IDs



- alter tag visibility



- add a Worker



- change Cloudflare configuration



- install dependencies



- change package files



- create a proof of concept



- deploy



- merge automatically







The only permitted repository changes are new Markdown documents inside:







docs/







At the end, verify that no runtime, configuration, dependency, SQL, deployment, or application files changed.







==================================================



PRIMARY OBJECTIVE



==================================================







Study the present repository and determine the safest standardized architecture for:







1. Permanent numeric work identities



2. Stable chapter identities



3. Stable page identities



4. Shareable work, chapter, and page URLs



5. Public page-by-page reading



6. Premium continuous-scroll reading



7. Public advertising



8. Completely ad-free Premium use



9. Premium commenting



10. Premium catalog and tag access



11. Static-first content delivery



12. Minimal Worker dependence



13. Future automated ingestion and publishing



14. Image bandwidth control



15. Casual image-download deterrence



16. Long-term compatibility with a very large catalog







The result must be a proposal, not an implementation.







Every recommendation must be grounded in the existing repository wherever possible.







==================================================



CORE PRODUCT MODEL



==================================================







The site should eventually provide two coordinated reading experiences.







They must remain:







- one website



- one codebase



- one catalog



- one account system



- one visual identity



- one set of canonical work identities



- one shared reader foundation







Do not propose two independently maintained applications.







--------------------------------------------------



PUBLIC / FREE READER



--------------------------------------------------







The public reader should behave as a polished page-by-page digital reader.







A user sees one page at a time and advances deliberately through:







- Next and Previous controls



- keyboard arrows



- mobile swipe



- touch or click controls where appropriate







The public reader should generally load only:







- the current page



- the immediately previous page where useful



- one or two upcoming pages



- lightweight reader assets







It should not eagerly download an entire chapter merely because the first page was opened.







Primary reasons:







- lower R2 delivery cost



- lower browser memory usage



- faster first-page display



- less wasted image transfer



- more predictable mobile performance



- controlled advertisement opportunities



- reliable page-specific navigation







The public reader must remain pleasant and functional.







It should feel like a classic reader, not an intentionally broken Premium advertisement.







--------------------------------------------------



PREMIUM READER



--------------------------------------------------







Trialing and active Premium users should receive a continuous-scroll reader.







Premium readers should be able to open a work and scroll through it without pressing Next after every page.







Premium benefits should include:







- continuous-scroll reading



- no advertisements



- no popunders



- no ad-provider script initialization



- no hidden advertising iframe



- no advertisement network request



- no abandoned advertisement space



- comments and replies



- editing of owned comments



- broader approved catalog access



- Premium-visible tags and works



- saved reading position where practical



- a calmer and more spacious layout







Continuous scroll must still use:







- lazy loading



- responsive image variants



- viewport observation



- limited look-ahead loading



- placeholders



- memory controls



- virtualization or unloading where appropriate







Premium must not immediately download every image in a large work.







The central promise is:







“No ads. No interruptions. No endless clicking.”







==================================================



MEMBERSHIP AND CAPABILITY MODEL



==================================================







The proposal should recommend a centralized capability model rather than scattering raw subscription-status comparisons throughout the codebase.







Conceptual capabilities may include:







- hasPremiumAccess



- mayUseContinuousReader



- mayComment



- mayReply



- mayEditOwnComment



- mayDeleteOwnComment



- mayViewPremiumCatalog



- shouldLoadAds



- shouldShowUpgradePrompt



- isAccessResolved







Study the existing access endpoint and current account model before recommending exact names.







--------------------------------------------------



LOGGED-OUT VISITOR



--------------------------------------------------







May:







- browse public works



- use the page-by-page reader



- read comments



- encounter advertisements



- share permanent URLs



- create an account







May not:







- comment



- reply



- edit comments



- use continuous scroll



- access Premium-only catalog classifications







--------------------------------------------------



FREE ACCOUNT



--------------------------------------------------







May receive:







- account identity



- bookmarks



- reading history



- saved progress



- public work access



- public tag access



- public comment reading



- page-by-page reader







Also receives advertisements.







May not:







- comment



- reply



- edit comments



- use Premium continuous scroll



- access Premium-only works or tags







--------------------------------------------------



TRIALING PREMIUM



--------------------------------------------------







Receives the complete Premium experience:







- continuous scroll



- no advertisements



- comments and replies



- editing of owned comments



- broader approved catalog access



- Premium-visible tags and works







The trial exists partly so that users experience these advantages directly.







--------------------------------------------------



ACTIVE PREMIUM



--------------------------------------------------







Receives the same Premium capabilities continuously.







--------------------------------------------------



EXPIRED OR NONQUALIFYING SUBSCRIPTION



--------------------------------------------------







Statuses such as:







- past_due



- unpaid



- canceled



- incomplete



- expired



- failed payment



- no qualifying subscription







should return the account to:







- page-by-page reading



- advertisements



- public catalog visibility



- read-only comments







The account should retain:







- bookmarks



- history



- saved progress where possible



- existing comments



- ability to delete owned old comments







Losing Premium must not erase the user’s identity or previous participation.







==================================================



PREMIUM VALUE PROPOSITION



==================================================







The initial $5 Premium tier has four core benefits.







1. FLOW







Continuous-scroll reading without pressing Next repeatedly.







2. SILENCE







No banners, popunders, advertisement scripts, hidden frames, or advertisement requests.







3. VOICE







Comments, replies, and editing of owned comments.







4. ACCESS







The broader approved catalog, including tags and works not shown in the public edition.







Suggested product concept:







“Open the whole library.







Scroll without interruption.



Read without ads.



Join the discussion.



Unlock the complete approved catalog.”







The proposal should evaluate how to make Premium compelling without making the public experience hostile.







==================================================



STANDARDIZED PERMANENT URL FOUNDATION



==================================================







Do not use experimental punctuation such as:







@=



@=profile



@=page-7







Do not preserve unusual URL syntax merely because another part of the current site happens to use it.







The new work-reader URL system should use a standardized, predictable, durable structure.







The preferred canonical design to evaluate is:







https://9127000.xyz/work/134123132/chapter/1/page/7







Where:







- `work` is a stable namespace



- `134123132` is the permanent numeric work ID



- `chapter/1` identifies chapter 1



- `page/7` identifies page 7







Conceptual pattern:







/work/{work_id}/chapter/{chapter_number}/page/{page_number}







This is the preferred product-facing structure unless the audit proves that another standardized form is substantially safer or more scalable.







Compare it with:







/work/134123132/chapter/1/#page-7







/work/134123132/chapter/1?page=7







/work/134123132/chapter/1/page/7/







Do not compare or recommend decorative custom punctuation.







The proposal must determine which standardized form best satisfies:







- direct refresh



- copy and sharing



- bookmarks



- browser Back and Forward



- static hosting



- zero-Worker goals



- Cloudflare Pages behavior



- analytics



- canonical links



- automated route generation



- very large catalog scale



- implementation simplicity



- long-term maintainability







If the fully path-based form cannot be served reliably without generating excessive files or introducing a Worker, explain that conflict plainly.







The canonical URL must not be selected merely because it looks attractive.







==================================================



PERMANENT NUMERIC WORK IDENTITY



==================================================







Every work should receive a permanent numeric ID.







The numeric ID is identity.







The following are metadata or storage details, not identity:







- title



- title spelling



- slug



- catalog position



- local folder name



- R2 object path



- upload filename



- cover filename



- tag arrangement







Required properties:







- a work ID never changes



- a work ID is never reused



- a title change does not alter the URL



- moving R2 objects does not alter the URL



- rebuilding manifests does not alter the URL



- a removed work does not free its ID



- deleted works may retain tombstone records



- legacy references may point to the permanent ID



- future automation can request or allocate an ID safely



- ingestion can be repeated without assigning a second identity







Study how works are currently identified.







Determine whether present identity depends on:







- title



- folder name



- JSON key



- object path



- UUID



- catalog order



- filename



- generated identifier



- another mechanism







Clearly identify migration risks.







==================================================



WORK ID ALLOCATION APPRAISAL



==================================================







Compare possible numeric ID strategies:







1. Monotonic sequential integers



2. Large sequential integers



3. Random numeric identifiers



4. Time-derived numeric identifiers



5. Central registry-assigned IDs



6. Ingestion-service-assigned IDs



7. Database sequence



8. Durable static registry







For each, evaluate:







- collision risk



- enumeration



- privacy



- automation



- concurrency



- offline ingestion



- idempotency



- recovery after failure



- restoring from backup



- multiple ingestion machines



- future distributed ingestion



- human readability



- maximum practical range



- JavaScript numeric safety







Explicitly address JavaScript’s safe-integer limit.







If identifiers may exceed:







9007199254740991







recommend storing and transporting them as strings even when they contain digits only.







The proposal should recommend:







- canonical representation



- allocation authority



- transaction or lock behavior



- duplicate prevention



- retry behavior



- import behavior



- migration behavior



- audit history







==================================================



CHAPTER IDENTITY



==================================================







Determine whether chapter identity should use:







- stable chapter numbers



- permanent chapter IDs



- both a permanent chapter ID and a display order



- ingestion order



- manually assigned order







Chapter order and chapter identity may not always be the same thing.







The proposal must address:







- chapters inserted between existing chapters



- bonus chapters



- chapter renaming



- chapter reordering



- combined chapters



- split chapters



- alternate editions



- deleted chapters



- chapter tombstones



- legacy chapter URLs







A durable automated system should not break permanent links merely because chapter display order changes.







Evaluate whether the URL should use:







/chapter/1







or a permanent numeric chapter ID such as:







/chapter/482910







with display chapter number stored separately.







Recommend a model suitable for future automated publishing.







==================================================



PAGE IDENTITY



==================================================







Every reader page must have a stable addressable number.







The proposal must distinguish:







- page identity



- page display order



- image filename



- array index



- printed page number



- reader page number







Required behavior:







- opening a page URL restores the correct page



- refreshing restores the correct page



- copying the URL shares that exact location



- Back and Forward work



- jumping to a page updates the URL



- moving between chapters updates the URL



- malformed values fail safely



- page 1 is never confused with array index 0



- reprocessing images does not silently change permanent reader links







Evaluate whether pages need:







- simple chapter-relative numbers



- permanent page IDs



- both stable IDs and display positions







Address the consequences of:







- inserting a missing page



- removing a duplicate page



- rescanning a chapter



- replacing an image



- combining two pages



- splitting one page



- changing display order







The future ingestion system must not casually renumber existing public links.







==================================================



ROUTING MODELS TO APPRAISE



==================================================







Compare at least these models.







--------------------------------------------------



MODEL A: FULLY PATH-BASED CANONICAL PAGE ROUTES



--------------------------------------------------







Example:







/work/134123132/chapter/1/page/7







Evaluate:







- direct refresh



- Cloudflare Pages handling



- static file generation



- fallback shell



- route parsing



- canonical URLs



- analytics



- search indexing



- browser history



- millions-of-pages scale



- Worker requirements







--------------------------------------------------



MODEL B: STATIC CHAPTER ROUTE PLUS PAGE FRAGMENT



--------------------------------------------------







Example:







/work/134123132/chapter/1/#page-7







Evaluate:







- zero-Worker compatibility



- static delivery



- direct refresh



- server visibility



- analytics



- indexing



- browser history



- URL restoration



- automation







--------------------------------------------------



MODEL C: STATIC CHAPTER ROUTE PLUS QUERY PARAMETER



--------------------------------------------------







Example:







/work/134123132/chapter/1/?page=7







Evaluate the same concerns.







--------------------------------------------------



MODEL D: GENERATED STATIC WORK OR CHAPTER ROUTES



--------------------------------------------------







Evaluate:







- ingestion-generated folders



- build artifact size



- file count



- Cloudflare Pages limits



- millions of works



- incremental publication



- rollback



- cache invalidation







--------------------------------------------------



MODEL E: SHARED STATIC READER SHELL



--------------------------------------------------







Many canonical URLs resolve to one static reader shell that parses the path and retrieves manifests.







Evaluate:







- direct refresh behavior



- fallback rules



- status codes



- missing-work behavior



- false homepage fallback



- Cloudflare Pages support



- zero-Worker feasibility







--------------------------------------------------



MODEL F: WORKER-BASED ROUTING



--------------------------------------------------







Discuss only as a comparison or where technically unavoidable.







The project prefers zero Workers for ordinary public reading.







Do not recommend a Worker merely because it makes routing easier.







==================================================



PUBLIC READER NAVIGATION



==================================================







The page-by-page reader should eventually support:







- Next



- Previous



- keyboard navigation



- mobile swipe



- page jump



- chapter change



- direct page link



- refresh



- Back



- Forward



- opening in another tab







The proposal should evaluate:







- standard anchor navigation



- History API



- pushState



- replaceState



- popstate



- fragment navigation



- prefetching



- focus management







Deliberate public page changes should generally create meaningful history entries.







Example:







- user opens page 7



- user selects Next



- reader moves to page 8



- Back returns to page 7



- Forward returns to page 8







==================================================



PREMIUM SCROLL URL SYNCHRONIZATION



==================================================







The Premium continuous reader must still keep a meaningful page URL.







As the dominant visible page changes, the URL should update without producing hundreds of browser-history entries.







Evaluate:







- IntersectionObserver



- dominant-page calculation



- history.replaceState



- deliberate page-jump pushState



- scroll restoration



- hashchange



- popstate



- throttling



- URL-update frequency



- mobile scrolling



- chapter boundaries







A likely model is:







- passive scrolling uses replaceState



- deliberate page jumps use pushState



- chapter navigation creates a real history entry







Validate this against the repository rather than accepting it automatically.







==================================================



FUTURE AUTOMATED INGESTION



==================================================







Assume that ingestion, ID assignment, manifest generation, chapter processing, page processing, publication, and cache invalidation will eventually be automated.







The proposal must design for automation from the beginning.







The future ingestion pipeline may need to:







1. Receive a new work



2. Determine whether it already exists



3. Allocate or recover its permanent work ID



4. Validate metadata



5. Process its cover



6. detect chapters



7. allocate chapter identities



8. detect and order pages



9. allocate stable page identities or positions



10. generate responsive image variants



11. upload image objects



12. generate manifests



13. classify tags and visibility



14. produce canonical URLs



15. update discovery indexes



16. invalidate caches



17. publish atomically



18. leave a recoverable audit trail







The appraisal must address:







- idempotency



- partial failure



- retries



- duplicate uploads



- re-ingestion



- concurrent ingestion



- schema validation



- manifest versioning



- atomic publication



- staging versus published state



- rollback



- orphaned objects



- checksum use



- content replacement



- chapter additions



- page corrections



- tag corrections



- audit logs







Do not create the pipeline now.







Propose the contracts the future pipeline should obey.







==================================================



PUBLICATION STATE MODEL



==================================================







Evaluate a durable state model such as:







- draft



- processing



- validated



- staged



- published



- hidden



- quarantined



- removed



- failed







The public catalog should never observe a half-published work.







Recommend how publication should become visible atomically.







For example:







- upload all assets first



- validate manifests



- publish the final manifest pointer last







Appraise the safest strategy for R2 and static indexes.







==================================================



MANIFEST SCHEMA



==================================================







Propose a versioned manifest design.







The proposal should evaluate separate documents for:







- work metadata



- chapter metadata



- page/image records



- visibility



- tag references



- image variants



- checksums



- publication version



- timestamps



- canonical IDs







Possible shape for discussion only:







{



  "schemaVersion": 1,



  "workId": "134123132",



  "title": "Example Work",



  "visibility": "public",



  "chapters": [



    {



      "chapterId": "1",



      "displayNumber": "1",



      "manifestUrl": "/work-index/134123132/chapters/1.json"



    }



  ]



}







Do not impose this example blindly.







Recommend a schema based on repository reality and future automation requirements.







The design should support:







- schema evolution



- old-reader compatibility



- validation



- cache invalidation



- partial updates



- chapter additions



- image replacement



- catalog indexing



- Premium access classification







==================================================



MANIFEST STORAGE STRATEGY



==================================================







Compare:







1. One global catalog manifest



2. Sharded global indexes



3. One work manifest per work



4. One chapter manifest per chapter



5. One page record per page



6. Work manifest plus chapter manifests



7. Versioned immutable manifests plus a current pointer







Evaluate:







- R2 compatibility



- Cloudflare caching



- CDN invalidation



- ingestion updates



- millions of works



- large chapters



- public access



- Premium access



- rollback



- manifest size



- lookup count



- browser performance







The proposal should recommend a scalable hierarchy.







==================================================



STATIC-FIRST AND ZERO-WORKER GOAL



==================================================







Ordinary public reading should ideally follow:







Browser



→ static reader shell



→ static or cached manifest



→ cached R2 image







It should not require:







- Supabase for basic work display



- Stripe for basic work display



- dynamic HTML rendering



- a database query per page



- a Worker request per image



- a Worker request per page transition







Dynamic infrastructure should remain reserved for capabilities that require it:







- authentication



- subscriptions



- comments



- votes



- reports



- moderation



- bookmarks



- account synchronization



- strongly protected Premium assets







The appraisal must distinguish:







- where zero Workers is realistic



- where it creates harmful compromises



- where limited dynamic infrastructure may be justified



- whether Workers can be restricted to Premium-protected catalog access rather than ordinary public reading







Do not distort technical conclusions to satisfy the zero-Worker preference.







==================================================



PREMIUM CATALOG AND TAG ACCESS



==================================================







Premium should eventually unlock more of the approved catalog.







Audit the existing:







- tag format



- public/private tag handling



- blocked tags



- hidden works



- catalog filters



- search filters



- recommendation filters



- homepage selection



- manifest exposure







Recommend explicit visibility classifications such as:







- public



- account



- premium



- age-restricted



- administrative



- removed







Definitions:







PUBLIC







Visible to ordinary visitors.







ACCOUNT







Visible after authentication where appropriate.







PREMIUM







Visible to trialing and active Premium users and approved bypass roles.







AGE-RESTRICTED







Requires applicable age eligibility in addition to other access requirements.







ADMINISTRATIVE







Unavailable to ordinary users because it is under review, moderation, quarantine, or internal management.







REMOVED







Unavailable entirely.







Premium must not override:







- removed status



- illegal-content restrictions



- private material



- administrative quarantine



- territorial restrictions



- required age restrictions



- content the platform refuses to distribute







The intended principle is:







“Premium opens the complete approved library, not content the platform cannot or will not publish.”







==================================================



DISCOVERY RESTRICTION VERSUS ACCESS CONTROL



==================================================







The appraisal must distinguish:







DISCOVERY-ONLY RESTRICTION







- omitted from public search



- omitted from public recommendations



- omitted from public tag navigation



- direct URL may still work



- assets may remain publicly accessible



- highly static



- weak protection







ACTUAL ACCESS CONTROL







- unauthorized users cannot retrieve the protected manifest



- unauthorized users cannot retrieve protected images



- may require signed URLs or gated delivery



- stronger protection



- more infrastructure



- may conflict with broad CDN caching and zero Workers







Explain the tradeoff honestly.







Do not describe hidden buttons as security.







==================================================



ADVERTISING ARCHITECTURE



==================================================







The public reader may include controlled advertisement opportunities.







Possible placements:







- below the current page



- between groups of pages



- during occasional page transitions



- in desktop side space



- in safe mobile inline regions



- existing homepage or rotunda placements







The reader should own the advertising rhythm.







Individual work manifests should not contain arbitrary provider scripts.







Appraise a centralized configuration model containing:







- slot identity



- provider



- dimensions



- placement



- viewport requirements



- page interval



- minimum page before first ad



- maximum chapter frequency



- mobile behavior



- desktop behavior



- enabled state



- no-fill behavior



- initialization state







Public advertising must not appear after every page.







Discuss:







- abandonment



- accidental clicks



- provider policies



- popunders



- no-fill



- mobile safety



- layout shift



- repeated initialization



- route transitions



- ad retries



- accessibility







==================================================



PREMIUM AD-FREE REQUIREMENT



==================================================







Premium must receive genuinely ad-free delivery.







It is not sufficient to:







- load an advertisement script



- create an advertisement request



- create an iframe



- hide the result with CSS







For Premium:







- provider scripts must not initialize



- advertisement code must not execute



- advertising requests must not occur



- advertisement containers should not mount



- no popunder should initialize



- no blank advertising spaces should remain







While access status is unresolved:







- do not initialize advertising prematurely



- do not expose Premium comment controls



- do not flash upgrade messaging to known Premium users



- keep ordinary static content visible







Appraise failure behavior when `/api/account/access` is unavailable.







==================================================



COMMENT SYSTEM



==================================================







Comments remain publicly readable.







Writing is limited to:







- trialing



- active



- approved staff bypass roles







Nonqualifying users remain read-only.







Audit:







- discussion service



- RPC calls



- current access handling



- SECURITY DEFINER functions



- RLS



- service-role usage



- authorship records



- edit behavior



- delete behavior







Current intended behavior:







- create_comment requires Premium



- edit_own_comment requires Premium



- delete_own_comment requires ownership but not active Premium







Do not propose removing the server-side enforcement.







The frontend should later reflect it with a polished locked composer and friendly upgrade message.







==================================================



IMAGE DELIVERY AND BANDWIDTH



==================================================







Audit:







- current image sources



- R2 paths



- manifest references



- image variants



- eager loading



- lazy loading



- prefetching



- retry behavior



- cache headers



- mobile sources



- desktop sources



- cover images



- chapter images







Determine whether opening a work currently loads:







- one image



- adjacent images



- one chapter



- an entire work



- thumbnail and original variants simultaneously







Propose:







PUBLIC READER







- current page



- limited adjacent prefetch



- responsive display variant



- no eager whole-chapter download







PREMIUM READER







- continuous scroll



- lazy loading



- limited look-ahead



- placeholder sizing



- virtualization



- responsive variants



- memory controls







==================================================



CASUAL IMAGE-DOWNLOAD DETERRENCE



==================================================







The site should discourage effortless casual saving of work images.







Desired outcomes:







- no visible download button



- ordinary right-click saving discouraged



- ordinary dragging discouraged



- archival originals not delivered unnecessarily



- original filenames not exposed unnecessarily



- automated mass retrieval made more difficult



- screenshotting remains possible







The proposal must be honest:







A browser that displays an image has received image information.







Client-side JavaScript cannot make displayed public images impossible to save.







A determined user may use:







- developer tools



- network inspection



- browser cache



- disabled JavaScript



- automated browsers



- screenshots



- screen photography







The practical objective is:







“Prevent effortless casual downloading, avoid exposing archival originals, and make large-scale automated extraction more difficult.”







Audit and compare:







- contextmenu prevention



- dragstart prevention



- pointer overlays



- CSS selection controls



- canvas rendering



- blob URL indirection



- public R2 URLs



- signed URLs



- display-quality variants



- visible watermarks



- invisible watermarks



- per-user watermarks



- hotlink protection



- rate limiting



- bot controls







For each, state:







- what it prevents



- what it does not prevent



- accessibility impact



- performance impact



- caching impact



- mobile impact



- infrastructure requirements



- zero-Worker compatibility







==================================================



CURRENT REPOSITORY AUDIT



==================================================







Before recommending anything, inspect and document the present implementation.







APPLICATION







- entry points



- build system



- source layout



- public assets



- route handling



- reader modules



- catalog modules



- mobile behavior



- desktop behavior







ROUTING







- current homepage URL behavior



- work opening



- modal behavior



- History API



- hash handling



- query parameters



- direct refresh



- fallback behavior



- canonical links







READER







- page state



- chapter state



- image loading



- controls



- keyboard support



- touch support



- URL synchronization



- progress restoration







ADVERTISING







- provider scripts



- popunders



- banners



- overlays



- rotunda ads



- reader ads



- initialization



- retries



- no-fill handling



- CSS



- configuration







ACCOUNT AND PREMIUM







- login



- logout



- session discovery



- `/api/account/access`



- subscription lookup



- role lookup



- access caching



- account switching



- checkout



- Stripe webhooks



- delayed status synchronization







COMMENTS







- frontend discussion modules



- RPC functions



- RLS



- SECURITY DEFINER



- ownership



- edit



- delete







CATALOG AND TAGS







- work records



- tag records



- blocked tags



- hidden works



- manifests



- search indexes



- homepage indexes



- R2 catalog assumptions







DEPLOYMENT







- Cloudflare Pages



- Pages Functions



- Workers



- wrangler.jsonc



- redirects



- route configuration



- build artifact



- deployment scripts



- environment variables







For each major finding, include:







- file path



- function, class, or module



- current behavior



- confirmed fact or inference



- uncertainty requiring later testing







==================================================



ARCHITECTURAL OPTIONS



==================================================







Compare at least:







ROUTE A







Shared static shell with standardized numeric route parsing.







ROUTE B







Generated static work or chapter routes.







ROUTE C







Static chapter routes with fragment-based pages.







ROUTE D







SPA-style static fallback shell.







ROUTE E







Hybrid static public content with gated Premium manifests or assets.







ROUTE F







Worker-based routing.







For each, evaluate:







- repository fit



- implementation size



- rewrite risk



- permanent URL reliability



- direct refresh



- zero-Worker compatibility



- Cloudflare Pages compatibility



- millions-of-works scale



- automation



- caching



- R2 bandwidth



- Premium protection



- operational complexity



- rollback



- test burden







Recommend:







- one primary architecture



- one fallback architecture



- conditions that would justify using the fallback







==================================================



FOUNDATIONAL RISKS



==================================================







Explicitly address:







- title-based identity



- mutable work IDs



- ID reuse



- JavaScript unsafe numeric values



- concurrent ID allocation



- duplicate ingestion



- non-idempotent publishing



- half-published works



- chapter reordering breaking links



- page insertion renumbering links



- schema without versioning



- one enormous global manifest



- millions of generated HTML files



- stale manifest caches



- R2 paths treated as identity



- public manifests exposing protected works



- hidden tags mistaken for security



- false homepage fallback



- direct refresh failure



- duplicate canonical URLs



- hash/history loops



- hundreds of browser-history entries



- page-index off-by-one errors



- eager chapter downloads



- Premium memory exhaustion



- ad flash before access resolution



- CSS-only ad hiding



- popunder reinjection



- stale subscription state



- account-state leakage



- delayed Stripe webhooks



- service-role bypass



- SECURITY DEFINER bypass



- client-side image protection described as DRM



- accessibility broken by image deterrence



- excessive dependence on Workers



- static public reading depending on Supabase



- architectural duplication between public and Premium







==================================================



STAGED FUTURE ROADMAP



==================================================







Propose an incremental roadmap.







Do not implement any phase.







PHASE 0: AUDIT AND DECISION RECORD







- document present architecture



- identify risks



- choose canonical identity rules



- choose canonical URL rules



- choose manifest hierarchy



- define unresolved questions







PHASE 1: SCHEMA AND REGISTRY FOUNDATION







- work ID registry



- chapter identity rules



- page identity rules



- schema versions



- validation rules



- non-reuse policy



- tombstones



- idempotency contracts







PHASE 2: AUTOMATED INGESTION CONTRACT







- deterministic retries



- duplicate detection



- checksums



- staging



- validation



- atomic publication



- rollback



- audit records







PHASE 3: URL-AWARE PUBLIC READER







- canonical work route



- chapter route



- page route



- refresh



- Back and Forward



- limited image loading







PHASE 4: CENTRALIZED ACCESS CAPABILITIES







- Premium state



- advertisement eligibility



- comment eligibility



- catalog eligibility



- safe loading and failure behavior







PHASE 5: PREMIUM CONTINUOUS READER







- lazy loading



- virtualization



- page URL synchronization



- progress restoration



- long-chapter testing







PHASE 6: CONTROLLED ADVERTISEMENT SYSTEM







- centralized slots



- interval rules



- provider loading



- no-fill behavior



- Premium zero-request validation







PHASE 7: PREMIUM CATALOG ACCESS







- visibility classes



- search filtering



- direct-link policy



- manifest protection



- age restrictions



- removed-content rules







PHASE 8: IMAGE DELIVERY AND DETERRENCE







- responsive variants



- public bandwidth limits



- casual-download deterrence



- accessibility review



- abuse controls







PHASE 9: MIGRATION AND AUTOMATION VALIDATION







- legacy links



- existing works



- ingestion retries



- concurrent publication



- cache behavior



- account transitions



- trial expiration



- rollback drills







For each phase, include:







- objective



- prerequisites



- repository areas affected



- risks



- tests



- rollback strategy



- evidence required before proceeding







==================================================



REQUIRED DOCUMENTS



==================================================







Create only the following Markdown files.







1.







docs/foundational-repository-and-infrastructure-audit.md







Visible title:







# Foundational Repository and Infrastructure Audit







Include:







- current architecture



- current routing



- current reader



- current identity model



- current catalog structure



- current image loading



- current advertisement inventory



- current access flow



- current comment authorization



- current tag behavior



- current deployment structure



- confirmed facts



- inferences



- unresolved questions



- exact repository references







2.







docs/permanent-work-chapter-and-page-identity-proposal.md







Visible title:







# Permanent Work, Chapter, and Page Identity Proposal







Include:







- work ID strategy



- numeric representation



- JavaScript safe-integer concerns



- allocation authority



- duplicate prevention



- chapter identity



- chapter display order



- page identity



- page display order



- insertion and deletion behavior



- tombstones



- aliases



- migration



- future automation contracts



- recommended model







3.







docs/standardized-reader-url-and-routing-appraisal.md







Visible title:







# Standardized Reader URL and Routing Appraisal







Include the preferred standardized form:







https://9127000.xyz/work/134123132/chapter/1/page/7







Compare it with:







- fragment-based pages



- query-based pages



- static generated routes



- shared static shells



- fallback routing



- Workers







Include:







- direct refresh



- browser history



- canonical URLs



- Cloudflare Pages



- millions-of-works scale



- zero-Worker feasibility



- recommended canonical URL



- fallback recommendation



- migration strategy







Do not recommend `@=` syntax.







4.







docs/automated-ingestion-manifest-and-publication-proposal.md







Visible title:







# Automated Ingestion, Manifest, and Publication Proposal







Include:







- future ingestion stages



- ID assignment



- idempotency



- checksums



- duplicate detection



- chapter processing



- page processing



- image variants



- schema versioning



- manifest hierarchy



- staging



- atomic publication



- partial failure



- retries



- rollback



- audit records



- cache invalidation



- orphan cleanup



- validation



- recommended contracts







5.







docs/public-flipbook-and-premium-flow-reader-proposal.md







Visible title:







# Public Flipbook and Premium Flow Reader Proposal







Include:







- public page-by-page reader



- Premium continuous scroll



- membership behavior



- four Premium benefits



- public bandwidth control



- Premium lazy loading



- browser-history differences



- progress restoration



- advertising integration



- comment presentation



- failure behavior



- accessibility







6.







docs/premium-advertising-comment-and-access-architecture.md







Visible title:







# Premium, Advertising, Comment, and Access Architecture







Include:







- centralized capabilities



- authoritative access



- public ads



- Premium zero-ad-request requirement



- account-state loading



- access failure



- comments



- SECURITY DEFINER



- RLS



- logout and account switching



- checkout synchronization



- tests and risks







7.







docs/premium-tag-and-protected-catalog-appraisal.md







Visible title:







# Premium Tag and Protected Catalog Appraisal







Include:







- current tags



- proposed visibility classes



- public catalog



- Premium catalog



- discovery restriction



- actual access control



- public manifest leakage



- protected images



- age restrictions



- administrative and removed states



- zero-Worker tradeoffs



- recommended approach







8.







docs/image-delivery-cost-and-download-deterrence-appraisal.md







Visible title:







# Image Delivery Cost and Download Deterrence Appraisal







Include:







- current image behavior



- public-reader loading



- Premium-reader loading



- responsive variants



- caching



- virtualization



- R2 implications



- casual download deterrence



- technical limits



- accessibility



- hotlinking



- signed URLs



- watermarks



- abuse controls



- recommended practical protection level







9.







docs/recommended-foundational-architecture-and-roadmap.md







Visible title:







# Recommended Foundational Architecture and Roadmap







Include:







- primary architectural recommendation



- fallback architecture



- canonical ID model



- canonical URL



- chapter and page identity



- manifest model



- automated ingestion model



- public reader



- Premium reader



- advertising



- comments



- Premium catalog



- image delivery



- static versus dynamic responsibilities



- zero-Worker conclusion



- staged roadmap



- tests



- rollback



- unresolved decisions







10.







docs/executive-foundation-summary.md







Visible title:







# Executive Foundation Summary







Keep this concise.







State:







- what the site is becoming



- what remains unchanged



- recommended work identity



- recommended chapter identity



- recommended page identity



- recommended canonical URL



- recommended manifest hierarchy



- recommended publication model



- recommended public reader



- recommended Premium reader



- recommended advertising model



- where dynamic infrastructure is necessary



- zero-Worker conclusion



- greatest foundational risks



- recommended order of implementation



- confirmation that no runtime code changed







==================================================



QUALITY REQUIREMENTS



==================================================







Do not provide generic advice.







Every statement about current behavior should cite:







- exact file path



- relevant function, module, or configuration



- whether the conclusion is confirmed or inferred







Do not conceal uncertainty.







Do not select a routing strategy without examining Cloudflare Pages behavior and the existing build output.







Do not select an ID model without addressing:







- safe numeric representation



- allocation authority



- concurrency



- idempotency



- migration



- non-reuse



- tombstones







Do not select a manifest strategy without addressing:







- schema versions



- validation



- atomic publication



- retries



- cache invalidation



- millions-of-works scale







==================================================



FINAL VALIDATION



==================================================







At the end:







- run git diff --check



- run git status --short



- list every created file



- confirm only Markdown files under docs/ changed



- confirm no application source changed



- confirm no configuration changed



- confirm no dependency changed



- confirm no lockfile changed



- confirm no SQL or migration changed



- confirm no deployment occurred







The final report must state:







1. Documents created



2. Most important confirmed repository finding



3. Recommended permanent work-ID model



4. Recommended chapter-ID model



5. Recommended page-ID model



6. Recommended canonical URL



7. Recommended manifest hierarchy



8. Recommended automated publication model



9. Recommended public reader architecture



10. Recommended Premium reader architecture



11. Whether zero Workers is realistically achievable



12. Where limited dynamic infrastructure may be necessary



13. Largest unresolved foundational question



14. Confirmation that no runtime code was changed --------------==================================================



ADDENDUM: MAXIMUM CACHING, EXTREME SCALE, AND COST DISCIPLINE



==================================================







The architecture should assume unusually large future demand.







The long-term ambition is to support traffic potentially reaching hundreds of millions or even billions of users.







Do not treat that traffic estimate as guaranteed, but design the foundations so the system does not require an expensive architectural replacement if usage grows dramatically.







The proposal must therefore prioritize:







- maximum browser caching



- maximum CDN caching



- maximum R2 cache efficiency



- immutable asset strategies



- minimal repeated origin reads



- minimal database dependence



- minimal Worker execution



- minimal per-page dynamic computation



- minimal bandwidth waste



- predictable cache invalidation



- graceful behavior under sudden traffic spikes



- durable operation at very low marginal cost per reader







The objective is not merely performance.







The objective is:







“Serve the largest possible audience while keeping infrastructure simple, durable, cacheable, and cost-effective.”







==================================================



BROWSER CACHE STRATEGY



==================================================







The proposal should examine how the browser can safely cache:







- reader JavaScript



- reader CSS



- fonts



- icons



- covers



- thumbnails



- display-quality page images



- work manifests



- chapter manifests



- tag indexes



- public catalog indexes



- version metadata



- static fallback shells







Recommend appropriate caching categories.







For immutable versioned assets, evaluate headers such as:







Cache-Control: public, max-age=31536000, immutable







For mutable manifest pointers or catalog indexes, evaluate:







- shorter freshness windows



- stale-while-revalidate



- ETags



- conditional requests



- Last-Modified



- versioned filenames



- immutable manifest versions plus a small mutable pointer



- service-worker caching only if the benefits justify the complexity







The proposal must explain how to prevent stale browser data from breaking:







- newly added chapters



- corrected pages



- removed works



- changed access classifications



- tag updates



- image replacements



- reader upgrades







Avoid cache-busting through random query parameters on every request.







Prefer deterministic content hashes, schema versions, or publication-version identifiers.







==================================================



R2 AND CDN CACHE STRATEGY



==================================================







The architecture should maximize cache hits between users.







A page image viewed by one user should be reusable from edge cache for later users whenever access rules permit it.







Evaluate:







- immutable object naming



- content-hashed filenames



- versioned work and chapter manifests



- long-lived cache headers



- Cloudflare cache behavior



- edge-cache reuse



- Range requests where relevant



- tiered caching



- cache reserve where appropriate



- origin shielding concepts



- cache keys



- compression



- responsive image variants



- avoiding accidental cache fragmentation



- avoiding cookies on public static asset requests



- separating public static assets from account-sensitive requests







Public work images should ideally be served from stable, cacheable URLs that do not vary per user.







Premium-only protected assets may require a different strategy. The proposal must explain the cost tradeoff between:







- per-user signed URLs



- short-lived tokens



- shared gated manifests



- public CDN cacheability



- private cache behavior



- Worker authorization



- origin request amplification







Do not recommend signed URLs casually without measuring how they may destroy cache sharing.







==================================================



IMMUTABLE ASSET MODEL



==================================================







Strongly evaluate an immutable publication model.







A changed image should receive a new object key rather than overwriting an old cached object in place.







Example conceptual pattern:







/assets/pages/{content_hash}.webp







or:







/works/{work_id}/versions/{publication_version}/chapters/{chapter_id}/pages/{page_id}-{content_hash}.webp







The exact structure should follow repository realities.







Advantages to appraise:







- extremely long cache lifetime



- safe browser caching



- safe CDN caching



- simple rollback



- no ambiguity about stale objects



- deterministic deduplication



- checksum verification



- reduced repeated uploads



- global reuse where identical assets occur







A small mutable pointer may identify the currently published immutable manifest version.







The proposal should compare:







1. Overwriting stable object paths



2. Versioned directory publication



3. Content-addressed object naming



4. Immutable manifests plus mutable current pointers







Recommend the most durable method.







==================================================



MULTI-LAYER CACHE MODEL



==================================================







Appraise a layered cache hierarchy such as:







1. Browser memory cache



2. Browser disk cache



3. Optional application/service-worker cache



4. Cloudflare edge cache



5. Cloudflare upper-tier cache



6. R2 origin







The goal is for the overwhelming majority of repeated public reads to stop before reaching R2 origin.







For each layer, explain:







- what should be cached



- expected lifetime



- invalidation mechanism



- failure behavior



- privacy concerns



- storage limits



- mobile implications



- whether the complexity is justified







Do not introduce a service worker automatically.







Appraise whether a service worker would provide enough benefit to justify:







- version management



- stale application shells



- update bugs



- storage pressure



- difficult debugging



- account-state leakage risks







A normal browser HTTP cache may be preferable unless offline reading or advanced prefetching becomes a deliberate product feature.







==================================================



PUBLIC READER CACHE BEHAVIOR



==================================================







The public flipbook should minimize transferred data while benefiting strongly from cache reuse.







Evaluate:







- current page loaded at display resolution



- one or two adjacent pages prefetched



- previously viewed pages retained in browser cache



- no entire-chapter prefetch



- chapter manifest cached



- cover and thumbnail reuse



- responsive variant selection



- avoiding duplicate downloads when navigating Back



- avoiding duplicate downloads after refresh



- avoiding repeated manifest fetches inside the same session







The proposal should establish a page-prefetch budget based on:







- network quality



- viewport



- device memory



- data-saving preferences



- chapter length



- image size



- current direction of travel







Respect browser signals such as:







- Save-Data



- effective connection type where available



- device memory where available



- reduced-data preferences where standardized







==================================================



PREMIUM READER CACHE BEHAVIOR



==================================================







Premium continuous scroll should remain cost-controlled.







Evaluate:







- lazy-loading only pages near the viewport



- limited forward prefetch



- limited backward retention



- browser cache reuse when DOM elements are virtualized



- restoring nearby pages without redownloading



- image decoding costs



- memory pressure



- very long chapters



- tab suspension



- returning to a chapter later



- saved progress







Premium should feel uninterrupted without behaving as unlimited eager downloading.







The proposal should distinguish:







- network cache



- decoded image memory



- DOM presence



- manifest state



- saved reader position







Removing an image element from the DOM does not necessarily require downloading it again if the browser cache is configured correctly.







==================================================



MANIFEST CACHE DESIGN



==================================================







The proposal should strongly evaluate immutable, versioned manifests.







Possible conceptual structure:







/manifests/works/{work_id}/versions/{version}/work.json



/manifests/works/{work_id}/versions/{version}/chapters/{chapter_id}.json



/manifests/works/{work_id}/current.json







Where:







- versioned manifests are immutable and cached for a long period



- `current.json` is small and has a shorter cache lifetime



- publication updates the current pointer only after all immutable assets are ready







Alternative designs may be recommended if better suited to the repository.







The proposal should address:







- ETags



- conditional GETs



- stale-while-revalidate



- atomic publication



- rollback



- old version retention



- garbage collection



- cache invalidation



- schema migration



- deleted works



- emergency takedowns







==================================================



CATALOG AND INDEX CACHING



==================================================







Do not assume every reader should download one enormous catalog file.







At very large scale, evaluate:







- sharded catalog indexes



- tag-specific indexes



- numeric ID range shards



- popularity or recency shards



- paginated static indexes



- compressed index formats



- Bloom filters only if genuinely useful



- incremental index updates



- immutable index versions



- small mutable index pointers







The proposal should minimize:







- repeated transfer



- unnecessary full-catalog downloads



- cache invalidation blast radius



- expensive regeneration



- memory use in the browser







Search and discovery architecture should not force the reader to download metadata for millions of works.







==================================================



CACHE KEYS AND PERSONALIZATION



==================================================







Public static content should not vary unnecessarily by:







- cookies



- account ID



- subscription state



- tracking parameters



- arbitrary query strings



- session headers







Account-sensitive APIs should remain separate from public cacheable assets.







The proposal should identify any current behavior that may accidentally reduce cache hit rates, such as:







- setting cookies on static asset requests



- unique query strings



- signed URLs for public content



- varying on unnecessary headers



- embedding account state inside otherwise static HTML



- per-user manifest generation



- dynamically generated image URLs







Premium presentation should ideally reuse the same cached public image objects where access permits, while changing reader behavior and advertising.







==================================================



CACHE INVALIDATION PHILOSOPHY



==================================================







Prefer:







“Publish new immutable versions and change a small pointer.”







Avoid:







“Purge or overwrite thousands of existing cached objects whenever one work changes.”







The proposal should establish invalidation rules for:







- image correction



- chapter correction



- title change



- tag change



- visibility change



- work removal



- emergency moderation



- reader application release



- manifest-schema release



- subscription-state change







Access or removal changes may require faster invalidation than ordinary metadata updates.







Explain how emergency takedowns should work even when assets have long cache lifetimes.







==================================================



EXTREME TRAFFIC AND STAMPEDE RESISTANCE



==================================================







The architecture should anticipate sudden viral traffic.







Evaluate protections against:







- cache stampedes



- thundering-herd manifest requests



- simultaneous cold-cache image requests



- repeated account-access calls



- repeated Supabase queries



- webhook bursts



- hot work releases



- bot scraping



- crawler amplification



- repeated failed ad initialization







Recommend strategies such as:







- immutable cached assets



- stale-while-revalidate



- request coalescing where available



- deduplicated client requests



- tiered cache



- limited prefetch



- rate limits for dynamic endpoints



- separate static and dynamic domains where useful



- backpressure for ingestion



- atomic publication



- graceful degradation







The public library should remain readable even if:







- comments fail



- Stripe fails



- Supabase becomes slow



- account access becomes unavailable



- advertisements fail



- discovery indexes are temporarily stale







==================================================



COST MODEL APPRAISAL



==================================================







Do not invent exact dollar totals without provider data.







However, the proposal should identify the major cost drivers:







- R2 object reads



- egress or delivery charges where applicable



- cache misses



- image size



- image variant count



- repeated manifest fetches



- Worker invocations



- Supabase queries



- Stripe-related requests



- logging volume



- analytics volume



- bot traffic



- cache invalidations



- dynamic Premium authorization







Provide a qualitative cost hierarchy and identify which architectural decisions have the greatest cost impact.







The proposal should compare:







- public flipbook bandwidth



- Premium continuous-scroll bandwidth



- cached repeat views



- cold-cache first views



- protected versus public assets



- one large image versus responsive variants



- generated static routes versus shared shells



- R2 origin reads versus edge hits







==================================================



OBSERVABILITY WITHOUT EXCESSIVE COST



==================================================







At enormous scale, logs themselves can become expensive.







Propose a restrained observability model:







- aggregate cache-hit metrics



- sampled request logs



- sampled client errors



- image-delivery metrics



- reader performance metrics



- Worker invocation counts



- Supabase query volume



- advertisement initialization failures



- manifest-version failures



- ingestion errors



- publication rollback events







Avoid requiring full verbose logs for every public page view.







Discuss sampling, retention, and privacy.







==================================================



DURABILITY PRINCIPLES



==================================================







The recommended architecture should follow these principles:







1. Public content remains readable without account infrastructure.



2. Static assets are immutable wherever possible.



3. Repeated reads are served from browser or edge cache.



4. R2 is treated as durable origin storage, not as a database queried repeatedly.



5. Numeric IDs never depend on titles or paths.



6. Publication is atomic.



7. Manifests are versioned and validated.



8. Dynamic services are limited to truly dynamic features.



9. Premium does not cause unnecessary duplication of public assets.



10. Scale is handled through caching and simplicity before additional servers.



11. Failure of comments, billing, ads, or accounts does not erase the library.



12. Cost per repeated read should approach the lowest practical level.







==================================================



REQUIRED ADDITIONS TO THE DOCUMENTS



==================================================







Add dedicated caching and extreme-scale sections to:







docs/foundational-repository-and-infrastructure-audit.md







Include:







- current cache headers



- current browser-cache behavior



- current R2/CDN assumptions



- cache-fragmentation risks



- current immutable versus mutable asset behavior



- present origin-read risks







docs/automated-ingestion-manifest-and-publication-proposal.md







Include:







- immutable asset publication



- content hashes



- versioned manifests



- atomic pointer updates



- cache invalidation



- emergency takedowns



- garbage collection



- rollback







docs/public-flipbook-and-premium-flow-reader-proposal.md







Include:







- public prefetch budget



- Premium lazy-loading budget



- browser cache reuse



- decoded-image memory



- Save-Data behavior



- long-chapter behavior



- repeat-view behavior







docs/image-delivery-cost-and-download-deterrence-appraisal.md







Include:







- browser cache



- edge cache



- R2 origin



- responsive variants



- object naming



- cache keys



- estimated relative cost drivers



- scraping and bot amplification







docs/recommended-foundational-architecture-and-roadmap.md







Include:







- recommended multi-layer cache strategy



- immutable publication model



- recommended cache headers by asset class



- manifest caching



- index sharding



- cache-stampede resistance



- observability strategy



- extreme-scale conclusion



- cost-control priorities







docs/executive-foundation-summary.md







Include a concise statement that the architecture is designed to:







- maximize browser and CDN cache reuse



- minimize R2 origin reads



- minimize dynamic requests



- survive extreme traffic



- keep marginal delivery cost as low as practical==================================================



ADDENDUM: MAXIMUM CACHING, EXTREME SCALE, AND COST DISCIPLINE



==================================================







The architecture should assume unusually large future demand.







The long-term ambition is to support traffic potentially reaching hundreds of millions or even billions of users.







Do not treat that traffic estimate as guaranteed, but design the foundations so the system does not require an expensive architectural replacement if usage grows dramatically.







The proposal must therefore prioritize:







- maximum browser caching



- maximum CDN caching



- maximum R2 cache efficiency



- immutable asset strategies



- minimal repeated origin reads



- minimal database dependence



- minimal Worker execution



- minimal per-page dynamic computation



- minimal bandwidth waste



- predictable cache invalidation



- graceful behavior under sudden traffic spikes



- durable operation at very low marginal cost per reader







The objective is not merely performance.







The objective is:







“Serve the largest possible audience while keeping infrastructure simple, durable, cacheable, and cost-effective.”







==================================================



BROWSER CACHE STRATEGY



==================================================







The proposal should examine how the browser can safely cache:







- reader JavaScript



- reader CSS



- fonts



- icons



- covers



- thumbnails



- display-quality page images



- work manifests



- chapter manifests



- tag indexes



- public catalog indexes



- version metadata



- static fallback shells







Recommend appropriate caching categories.







For immutable versioned assets, evaluate headers such as:







Cache-Control: public, max-age=31536000, immutable







For mutable manifest pointers or catalog indexes, evaluate:







- shorter freshness windows



- stale-while-revalidate



- ETags



- conditional requests



- Last-Modified



- versioned filenames



- immutable manifest versions plus a small mutable pointer



- service-worker caching only if the benefits justify the complexity







The proposal must explain how to prevent stale browser data from breaking:







- newly added chapters



- corrected pages



- removed works



- changed access classifications



- tag updates



- image replacements



- reader upgrades







Avoid cache-busting through random query parameters on every request.







Prefer deterministic content hashes, schema versions, or publication-version identifiers.







==================================================



R2 AND CDN CACHE STRATEGY



==================================================







The architecture should maximize cache hits between users.







A page image viewed by one user should be reusable from edge cache for later users whenever access rules permit it.







Evaluate:







- immutable object naming



- content-hashed filenames



- versioned work and chapter manifests



- long-lived cache headers



- Cloudflare cache behavior



- edge-cache reuse



- Range requests where relevant



- tiered caching



- cache reserve where appropriate



- origin shielding concepts



- cache keys



- compression



- responsive image variants



- avoiding accidental cache fragmentation



- avoiding cookies on public static asset requests



- separating public static assets from account-sensitive requests







Public work images should ideally be served from stable, cacheable URLs that do not vary per user.







Premium-only protected assets may require a different strategy. The proposal must explain the cost tradeoff between:







- per-user signed URLs



- short-lived tokens



- shared gated manifests



- public CDN cacheability



- private cache behavior



- Worker authorization



- origin request amplification







Do not recommend signed URLs casually without measuring how they may destroy cache sharing.







==================================================



IMMUTABLE ASSET MODEL



==================================================







Strongly evaluate an immutable publication model.







A changed image should receive a new object key rather than overwriting an old cached object in place.







Example conceptual pattern:







/assets/pages/{content_hash}.webp







or:







/works/{work_id}/versions/{publication_version}/chapters/{chapter_id}/pages/{page_id}-{content_hash}.webp







The exact structure should follow repository realities.







Advantages to appraise:







- extremely long cache lifetime



- safe browser caching



- safe CDN caching



- simple rollback



- no ambiguity about stale objects



- deterministic deduplication



- checksum verification



- reduced repeated uploads



- global reuse where identical assets occur







A small mutable pointer may identify the currently published immutable manifest version.







The proposal should compare:







1. Overwriting stable object paths



2. Versioned directory publication



3. Content-addressed object naming



4. Immutable manifests plus mutable current pointers







Recommend the most durable method.







==================================================



MULTI-LAYER CACHE MODEL



==================================================







Appraise a layered cache hierarchy such as:







1. Browser memory cache



2. Browser disk cache



3. Optional application/service-worker cache



4. Cloudflare edge cache



5. Cloudflare upper-tier cache



6. R2 origin







The goal is for the overwhelming majority of repeated public reads to stop before reaching R2 origin.







For each layer, explain:







- what should be cached



- expected lifetime



- invalidation mechanism



- failure behavior



- privacy concerns



- storage limits



- mobile implications



- whether the complexity is justified







Do not introduce a service worker automatically.







Appraise whether a service worker would provide enough benefit to justify:







- version management



- stale application shells



- update bugs



- storage pressure



- difficult debugging



- account-state leakage risks







A normal browser HTTP cache may be preferable unless offline reading or advanced prefetching becomes a deliberate product feature.







==================================================



PUBLIC READER CACHE BEHAVIOR



==================================================







The public flipbook should minimize transferred data while benefiting strongly from cache reuse.







Evaluate:







- current page loaded at display resolution



- one or two adjacent pages prefetched



- previously viewed pages retained in browser cache



- no entire-chapter prefetch



- chapter manifest cached



- cover and thumbnail reuse



- responsive variant selection



- avoiding duplicate downloads when navigating Back



- avoiding duplicate downloads after refresh



- avoiding repeated manifest fetches inside the same session







The proposal should establish a page-prefetch budget based on:







- network quality



- viewport



- device memory



- data-saving preferences



- chapter length



- image size



- current direction of travel







Respect browser signals such as:







- Save-Data



- effective connection type where available



- device memory where available



- reduced-data preferences where standardized







==================================================



PREMIUM READER CACHE BEHAVIOR



==================================================







Premium continuous scroll should remain cost-controlled.







Evaluate:







- lazy-loading only pages near the viewport



- limited forward prefetch



- limited backward retention



- browser cache reuse when DOM elements are virtualized



- restoring nearby pages without redownloading



- image decoding costs



- memory pressure



- very long chapters



- tab suspension



- returning to a chapter later



- saved progress







Premium should feel uninterrupted without behaving as unlimited eager downloading.







The proposal should distinguish:







- network cache



- decoded image memory



- DOM presence



- manifest state



- saved reader position







Removing an image element from the DOM does not necessarily require downloading it again if the browser cache is configured correctly.







==================================================



MANIFEST CACHE DESIGN



==================================================







The proposal should strongly evaluate immutable, versioned manifests.







Possible conceptual structure:







/manifests/works/{work_id}/versions/{version}/work.json



/manifests/works/{work_id}/versions/{version}/chapters/{chapter_id}.json



/manifests/works/{work_id}/current.json







Where:







- versioned manifests are immutable and cached for a long period



- `current.json` is small and has a shorter cache lifetime



- publication updates the current pointer only after all immutable assets are ready







Alternative designs may be recommended if better suited to the repository.







The proposal should address:







- ETags



- conditional GETs



- stale-while-revalidate



- atomic publication



- rollback



- old version retention



- garbage collection



- cache invalidation



- schema migration



- deleted works



- emergency takedowns







==================================================



CATALOG AND INDEX CACHING



==================================================







Do not assume every reader should download one enormous catalog file.







At very large scale, evaluate:







- sharded catalog indexes



- tag-specific indexes



- numeric ID range shards



- popularity or recency shards



- paginated static indexes



- compressed index formats



- Bloom filters only if genuinely useful



- incremental index updates



- immutable index versions



- small mutable index pointers







The proposal should minimize:







- repeated transfer



- unnecessary full-catalog downloads



- cache invalidation blast radius



- expensive regeneration



- memory use in the browser







Search and discovery architecture should not force the reader to download metadata for millions of works.







==================================================



CACHE KEYS AND PERSONALIZATION



==================================================







Public static content should not vary unnecessarily by:







- cookies



- account ID



- subscription state



- tracking parameters



- arbitrary query strings



- session headers







Account-sensitive APIs should remain separate from public cacheable assets.







The proposal should identify any current behavior that may accidentally reduce cache hit rates, such as:







- setting cookies on static asset requests



- unique query strings



- signed URLs for public content



- varying on unnecessary headers



- embedding account state inside otherwise static HTML



- per-user manifest generation



- dynamically generated image URLs







Premium presentation should ideally reuse the same cached public image objects where access permits, while changing reader behavior and advertising.







==================================================



CACHE INVALIDATION PHILOSOPHY



==================================================







Prefer:







“Publish new immutable versions and change a small pointer.”







Avoid:







“Purge or overwrite thousands of existing cached objects whenever one work changes.”







The proposal should establish invalidation rules for:







- image correction



- chapter correction



- title change



- tag change



- visibility change



- work removal



- emergency moderation



- reader application release



- manifest-schema release



- subscription-state change







Access or removal changes may require faster invalidation than ordinary metadata updates.







Explain how emergency takedowns should work even when assets have long cache lifetimes.







==================================================



EXTREME TRAFFIC AND STAMPEDE RESISTANCE



==================================================







The architecture should anticipate sudden viral traffic.







Evaluate protections against:







- cache stampedes



- thundering-herd manifest requests



- simultaneous cold-cache image requests



- repeated account-access calls



- repeated Supabase queries



- webhook bursts



- hot work releases



- bot scraping



- crawler amplification



- repeated failed ad initialization







Recommend strategies such as:







- immutable cached assets



- stale-while-revalidate



- request coalescing where available



- deduplicated client requests



- tiered cache



- limited prefetch



- rate limits for dynamic endpoints



- separate static and dynamic domains where useful



- backpressure for ingestion



- atomic publication



- graceful degradation







The public library should remain readable even if:







- comments fail



- Stripe fails



- Supabase becomes slow



- account access becomes unavailable



- advertisements fail



- discovery indexes are temporarily stale







==================================================



COST MODEL APPRAISAL



==================================================







Do not invent exact dollar totals without provider data.







However, the proposal should identify the major cost drivers:







- R2 object reads



- egress or delivery charges where applicable



- cache misses



- image size



- image variant count



- repeated manifest fetches



- Worker invocations



- Supabase queries



- Stripe-related requests



- logging volume



- analytics volume



- bot traffic



- cache invalidations



- dynamic Premium authorization







Provide a qualitative cost hierarchy and identify which architectural decisions have the greatest cost impact.







The proposal should compare:







- public flipbook bandwidth



- Premium continuous-scroll bandwidth



- cached repeat views



- cold-cache first views



- protected versus public assets



- one large image versus responsive variants



- generated static routes versus shared shells



- R2 origin reads versus edge hits







==================================================



OBSERVABILITY WITHOUT EXCESSIVE COST



==================================================







At enormous scale, logs themselves can become expensive.







Propose a restrained observability model:







- aggregate cache-hit metrics



- sampled request logs



- sampled client errors



- image-delivery metrics



- reader performance metrics



- Worker invocation counts



- Supabase query volume



- advertisement initialization failures



- manifest-version failures



- ingestion errors



- publication rollback events







Avoid requiring full verbose logs for every public page view.







Discuss sampling, retention, and privacy.







==================================================



DURABILITY PRINCIPLES



==================================================







The recommended architecture should follow these principles:







1. Public content remains readable without account infrastructure.



2. Static assets are immutable wherever possible.



3. Repeated reads are served from browser or edge cache.



4. R2 is treated as durable origin storage, not as a database queried repeatedly.



5. Numeric IDs never depend on titles or paths.



6. Publication is atomic.



7. Manifests are versioned and validated.



8. Dynamic services are limited to truly dynamic features.



9. Premium does not cause unnecessary duplication of public assets.



10. Scale is handled through caching and simplicity before additional servers.



11. Failure of comments, billing, ads, or accounts does not erase the library.



12. Cost per repeated read should approach the lowest practical level.







==================================================



REQUIRED ADDITIONS TO THE DOCUMENTS



==================================================







Add dedicated caching and extreme-scale sections to:







docs/foundational-repository-and-infrastructure-audit.md







Include:







- current cache headers



- current browser-cache behavior



- current R2/CDN assumptions



- cache-fragmentation risks



- current immutable versus mutable asset behavior



- present origin-read risks







docs/automated-ingestion-manifest-and-publication-proposal.md







Include:







- immutable asset publication



- content hashes



- versioned manifests



- atomic pointer updates



- cache invalidation



- emergency takedowns



- garbage collection



- rollback







docs/public-flipbook-and-premium-flow-reader-proposal.md







Include:







- public prefetch budget



- Premium lazy-loading budget



- browser cache reuse



- decoded-image memory



- Save-Data behavior



- long-chapter behavior



- repeat-view behavior







docs/image-delivery-cost-and-download-deterrence-appraisal.md







Include:







- browser cache



- edge cache



- R2 origin



- responsive variants



- object naming



- cache keys



- estimated relative cost drivers



- scraping and bot amplification







docs/recommended-foundational-architecture-and-roadmap.md







Include:







- recommended multi-layer cache strategy



- immutable publication model



- recommended cache headers by asset class



- manifest caching



- index sharding



- cache-stampede resistance



- observability strategy



- extreme-scale conclusion



- cost-control priorities







docs/executive-foundation-summary.md







Include a concise statement that the architecture is designed to:







- maximize browser and CDN cache reuse



- minimize R2 origin reads



- minimize dynamic requests



- survive extreme traffic



- keep marginal delivery cost as low as practical
