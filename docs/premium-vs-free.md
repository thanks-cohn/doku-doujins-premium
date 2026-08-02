# Premium vs. Free

Doku Doujins remains one website and one library. Free reading should be useful and pleasant; Premium should remove friction rather than manufacture it.

> **Plan, not current behavior:** this document explains the proposed experience. Today, the repository uses the same continuous-scroll reader for everyone; that reader mounts configured rail-ad iframes without checking Premium access. Premium checks currently protect account pages, not the reader. The work below requires later, separately reviewed implementation.

## At a glance

The table is the **proposed target**, not a statement that these differences already exist.

| | Free / public | Premium (trialing or active) |
|---|---|---|
| Reader | One page at a time | Continuous scroll |
| Navigation | Previous, Next, page jump, chapter controls, keyboard and swipe | Scroll naturally, plus page/chapter jumps |
| Loading | Current page with a small adaptive adjacent-page prefetch | Lazy pages near the viewport; never an eager whole-work download |
| Advertising | Occasional, centrally scheduled placements | None: no slots, blank space, scripts, iframes, provider calls, or popunders |
| Comments | Read comments | Read, comment, reply, and edit owned comments |
| Owned older comments | Delete while signed in, including after Premium ends | Delete while signed in |
| Catalog | Public approved library and tags | Complete approved Premium library and tags, subject to safety/legal restrictions |
| Saved position | Where practical for accounts | Where practical, synchronized without blocking reading |
| Permanent links | Exact work, chapter, and page links | The same exact permanent links |

## The Premium promise

> **No ads. No interruptions. No endless clicking.**

Premium has four clear benefits:

1. **Flow** — continuous-scroll reading without pressing Next for every page.
2. **Silence** — no banners, interstitials, popunders, hidden frames, ad scripts, or ad-network requests.
3. **Voice** — comment, reply, and edit your own contributions.
4. **Access** — open the broader approved catalog, including Premium-visible works and tags.

Suggested message:

> **Open the whole library.**  
> Scroll without interruption.  
> Read without ads.  
> Join the discussion.  
> Unlock the complete approved catalog.

## What Free includes

Visitors and free accounts can browse public works, open a permanent link to an exact page, read public comments, and use a complete page-by-page reader. The intended reader includes clear Previous/Next controls, page and chapter selection, keyboard arrows, mobile swipe, refresh, Back/Forward, and links that open correctly in another tab.

Free is not a deliberately broken preview. It should not use excessive advertisements, forced delays, intentionally poor image quality, or disabled navigation to pressure an upgrade. Its page-at-a-time design also has practical benefits: faster first display, lower mobile memory use, and less wasted image transfer.

A free account may retain identity, bookmarks, history, and saved progress. Advertising remains eligible, but placements should be predictable, accessible, limited by central frequency rules, and never injected by individual works.

## What Premium includes

Trialing and active subscriptions receive the same complete Premium behavior. Continuous scroll still uses responsive images, placeholders, lazy loading, limited look-ahead, request cancellation, and memory controls. “Continuous” does not mean downloading an entire long chapter as soon as it opens.

Ad-free means no advertising code path starts—not merely that an ad is hidden with CSS. Premium should have a calmer layout with no abandoned advertisement spaces. The site must wait for access resolution before it initializes an ad provider, preventing an ad flash or network request for a known Premium member.

Comments remain publicly readable. Writing, replying, and editing are Premium benefits, with final authorization enforced on the server. Interface hiding alone is not security.

Premium opens the **complete approved library**. It does not override removed content, administrative quarantine, legal restrictions, privacy, territory restrictions, or required age eligibility.

## Membership behavior

| Account state | Effective experience |
|---|---|
| Logged out | Free reader, public catalog, read-only comments, advertising eligible |
| Signed-in free account | Free reader and public catalog; account data can persist; read-only comments; advertising eligible |
| Trialing | Full Premium reader, catalog, comments, and genuinely ad-free delivery |
| Active | Full Premium reader, catalog, comments, and genuinely ad-free delivery |
| Past due, unpaid, canceled, incomplete, expired, failed, or otherwise nonqualifying | Returns to Free behavior without deleting identity or prior participation |
| Approved staff/legacy bypass | Capabilities granted by the authoritative access policy |

When Premium ends, bookmarks, reading history, saved progress, account identity, and existing comments remain. The member can still delete an owned old comment while authenticated, but cannot create, reply, or edit without qualifying access.

If membership status cannot be resolved, public content should remain readable. Premium-only controls stay locked and advertisements should be held for that page session rather than risk sending an ad request for a paying member. A clear, non-blocking retry state is preferable to hiding the library.

## One reader foundation

Free and Premium are modes of the same reader—not separate applications:

* the same permanent work, chapter, and page identities;
* the same canonical URLs and manifests;
* the same image variants and browser/CDN cache where access policy allows;
* the same navigation, error, accessibility, and chapter components;
* different presentation, loading budgets, history synchronization, ad eligibility, and comment capabilities.

A public page change is deliberate and should normally create a browser-history entry. In Premium, passive scrolling should update the visible page URL without creating hundreds of entries; an explicit jump or chapter change should create a meaningful entry. Both modes therefore share exact, refreshable links.

## Responsible delivery

Both modes should load display-quality responsive variants rather than archival originals. Free normally requests the current page and only a small adaptive neighboring set. Premium requests pages near the viewport and unloads distant decoded images while relying on the browser cache for revisits. Data-saving and constrained-device signals should reduce look-ahead in either mode.

No client technique can make an image shown in a browser impossible to save. The practical policy is to avoid a download button and archival originals, discourage casual dragging only where accessible, and use measured CDN bot/hotlink controls—not to claim DRM.

## Product success criteria

The distinction succeeds when:

* a Free reader can finish a work comfortably without feeling punished;
* Premium makes the experience noticeably calmer and more fluid;
* trialing and active users receive identical benefits;
* a Premium visit causes zero ad-provider network activity;
* long chapters do not exhaust memory or eagerly consume bandwidth;
* losing Premium never erases account data or earlier participation;
* exact work, chapter, and page links behave the same for every eligible reader;
* library reading survives temporary account, billing, comment, and advertising failures.

The architecture and repository evidence behind these promises are documented in [Ad-Supported Public Reader and Ad-Free Premium Scroll-Down Architecture](codex/ad-public-vs-premium-scroll-down.md). That technical blueprint also records a provenance issue: the specifically named request document was absent from this checkout, so it must be recovered or identified and reconciled before runtime implementation begins.
