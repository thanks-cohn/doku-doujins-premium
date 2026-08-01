# Premium Homepage Modes Proposal

## Overview

Doku-Doujin Premium should give paying users four distinct homepage modes rather than forcing every premium account into the same experience.

The four supported modes are:

```text
public
premium
custom
low_ram
```

Each mode serves a different purpose:

- `public` preserves the exact ordinary public experience.
- `premium` provides the familiar site without ads and with account preferences applied.
- `custom` lets the user design and arrange a personal homepage.
- `low_ram` provides an intentionally lightweight version for weak computers, older devices, slow connections, or users who simply prefer speed.

The selected mode should be stored as an account preference and should not change the user's subscription status, bookmarks, reading history, or account privileges.

## Goals

The homepage-mode system should:

- make Premium feel like a genuinely different product rather than merely the public site with ads hidden;
- let users switch between discovery, personalization, customization, and performance-focused experiences;
- keep the public site available for comparison and testing;
- prevent ad-provider scripts from loading in ad-free modes;
- preserve user preferences when switching modes;
- support low-memory and low-performance devices deliberately rather than as an afterthought;
- remain simple enough that a novice user can understand and change the setting safely.

## Mode 1: Public View

### Identifier

```text
public
```

### Purpose

Public View shows the same homepage that an anonymous visitor or ordinary free user would see.

This mode is useful for premium users who want to:

- preview the public site;
- experience the normal public discovery flow;
- compare public and premium presentation;
- test how the site appears to non-premium visitors;
- temporarily use the standard public rotunda without personalization.

### Behavior

Public View should preserve:

- the public rotunda;
- public ordering and discovery rules;
- public visual effects;
- public promotional placements;
- the normal anonymous homepage structure;
- the same content-selection logic used for ordinary visitors.

Because this mode intentionally reproduces the public experience, it may include the public advertising layout and ad-provider behavior.

The account itself remains premium. Premium-only account pages, subscription management, bookmarks, and settings remain available.

### Important distinction

Public View is not the default premium experience. It is an opt-in preview of the ordinary site.

## Mode 2: Premium View

### Identifier

```text
premium
```

### Purpose

Premium View is the recommended default homepage for paying users.

It should preserve the familiar structure of the ordinary site while improving it around the user.

### Behavior

Premium View should provide:

- no visible advertisements;
- no ad-provider script initialization;
- no popunders;
- no empty ad placeholders;
- preferred tags promoted;
- excluded tags filtered out;
- bookmarks surfaced more prominently;
- recent reading surfaced prominently;
- recommendations informed by the user's preferences;
- the familiar rotunda and general site identity;
- premium navigation and account controls.

### Ad handling

Premium View must not merely hide ads with CSS.

For premium users in this mode, the application should avoid loading or executing:

- third-party ad scripts;
- popunder code;
- ad inventory checks;
- ad tracking requests;
- fallback logic whose only purpose is to fill ad slots.

This avoids invisible tracking, unnecessary network requests, layout gaps, and accidental popunder behavior.

### Default behavior

New premium users should default to:

```json
{
  "homepage_mode": "premium"
}
```

## Mode 3: Custom View

### Identifier

```text
custom
```

### Purpose

Custom View gives premium users control over the structure and appearance of their own homepage.

This mode should feel like a personal library rather than a standard storefront or discovery page.

### Initial module options

Users should be able to enable, disable, and reorder modules such as:

- Continue Reading;
- Recent Reads;
- Bookmarks;
- Recommended for You;
- Preferred Tags;
- Recently Added;
- Hidden Gems;
- Rotunda;
- Saved Searches;
- Favorite Creators or Series;
- Reading Lists;
- Notes or personal shortcuts.

### Layout controls

Custom View should eventually support:

- drag-and-drop module ordering;
- one-column, two-column, or grid layouts;
- compact or spacious density;
- thumbnail-size controls;
- section-title customization;
- optional background or theme selection;
- curated templates;
- safe custom CSS within strict limits.

### Safety and maintainability

Custom layouts should be stored as structured configuration rather than arbitrary executable code.

Example:

```json
{
  "homepage_mode": "custom",
  "custom_homepage": {
    "layout": "two_column",
    "density": "comfortable",
    "modules": [
      { "type": "continue_reading", "enabled": true, "position": 1 },
      { "type": "bookmarks", "enabled": true, "position": 2 },
      { "type": "recommendations", "enabled": true, "position": 3 },
      { "type": "recently_added", "enabled": false, "position": 4 }
    ]
  }
}
```

### Ads

Custom View is always ad-free.

No ad scripts should load, even if the user places a module in a location that resembles a public ad slot.

## Mode 4: Low-RAM View

### Identifier

```text
low_ram
```

### Purpose

Low-RAM View is designed for:

- weak computers;
- older laptops;
- low-memory phones;
- slow browsers;
- slow or metered connections;
- users who prefer speed and simplicity over visual effects.

This should be a real performance mode, not simply a visual theme.

### Behavior

Low-RAM View should disable or avoid:

- animated rotundas;
- ghost text effects;
- large background images;
- auto-playing or auto-advancing carousels;
- infinite scrolling;
- large preloaded datasets;
- unnecessary third-party scripts;
- expensive transitions;
- oversized thumbnails;
- heavy client-side recommendation passes.

It should prefer:

- server-provided or precomputed lists;
- simple pagination;
- compact HTML;
- minimal JavaScript;
- small thumbnails;
- lazy loading;
- text-first navigation;
- simple lists instead of complex carousels;
- reduced motion by default;
- low network usage;
- no ads.

### Example experience

The Low-RAM homepage could contain only:

- Continue Reading;
- Bookmarks;
- a compact preferred-tags list;
- a paginated latest-works list;
- basic search;
- account navigation.

### Device detection

The site may suggest Low-RAM View when it detects possible resource constraints, but it should not silently force the mode.

Examples of suggestion signals may include:

- `navigator.deviceMemory` when available;
- repeated long startup times;
- reduced-data preferences;
- user-selected reduced-motion settings;
- explicit manual selection.

The user must remain in control.

## Preference Model

The primary preference should be:

```json
{
  "homepage_mode": "premium"
}
```

Allowed values:

```js
const HOMEPAGE_MODES = [
  "public",
  "premium",
  "custom",
  "low_ram"
];
```

Invalid or missing values should safely fall back to:

```text
premium
```

for users with premium access, and:

```text
public
```

for users without premium access.

## Access Rules

### Anonymous and free users

Anonymous and free users receive:

```text
public
```

They cannot activate `premium`, `custom`, or `low_ram` as premium account modes unless product policy later makes Low-RAM available publicly.

### Premium users

Premium users may choose any of:

```text
public
premium
custom
low_ram
```

### Expired or canceled premium accounts

When premium access ends:

- the custom configuration should be preserved;
- the selected premium-only mode should not be deleted;
- the live homepage should fall back to Public View;
- the user should regain the previous mode and layout if premium access resumes.

This avoids punishing users by deleting work they created while subscribed.

## Rendering Flow

A clean startup flow should be:

```text
load authentication state
→ determine account access
→ load homepage preference
→ validate requested mode
→ initialize only the resources required for that mode
→ render the selected homepage
```

Example logic:

```js
async function resolveHomepageMode({ access, preferences }) {
  if (!access?.hasPremiumAccess) return "public";

  const selected = preferences?.homepage_mode;

  return HOMEPAGE_MODES.includes(selected)
    ? selected
    : "premium";
}
```

Then:

```js
switch (mode) {
  case "public":
    return renderPublicHomepage({ ads: true, personalized: false });

  case "premium":
    return renderPremiumHomepage({ ads: false, personalized: true });

  case "custom":
    return renderCustomHomepage({ ads: false });

  case "low_ram":
    return renderLowRamHomepage({ ads: false });
}
```

## Avoiding Mode Flashing

The application must not briefly render the wrong homepage while account access and preferences are still loading.

During resolution, show a neutral loading shell rather than:

- the public homepage;
- the trial screen;
- ad placeholders;
- the premium homepage.

Once access and mode are known, render only the correct view.

This follows the same principle used to remove the trial-offer flash during account navigation.

## Settings Interface

Premium settings should include a clear Homepage Experience section.

Suggested presentation:

### Public View

> See the same homepage as an ordinary visitor, including the public discovery layout and advertisements.

### Premium View

> Use the familiar homepage without ads, with your preferred and excluded tags applied.

### Custom View

> Build your own homepage from bookmarks, recent reads, recommendations, and configurable sections.

### Low-RAM View

> Use a fast, lightweight homepage designed for low-memory or older devices.

The user should be able to preview a mode before saving it.

## Data Storage

The mode and custom layout should be tied to the authenticated account so they follow the user across browsers and devices.

A possible account-preferences structure:

```json
{
  "homepage_mode": "custom",
  "preferred_tags": ["example"],
  "excluded_tags": ["example"],
  "custom_homepage": {
    "layout": "two_column",
    "density": "comfortable",
    "modules": []
  },
  "low_ram": {
    "thumbnail_size": "small",
    "page_size": 24,
    "reduced_motion": true
  }
}
```

The storage format should be versioned so future layout changes can be migrated safely.

Example:

```json
{
  "homepage_preferences_version": 1
}
```

## Implementation Phases

### Phase 1: Mode foundation

- Add `homepage_mode` to account preferences.
- Support the four allowed values.
- Default premium accounts to `premium`.
- Add the settings selector.
- Ensure ad scripts do not load in `premium`, `custom`, or `low_ram`.

### Phase 2: Premium View

- Apply preferred and excluded tags.
- Add Continue Reading and bookmarks.
- Preserve the familiar standard layout.
- Verify no ad-provider code executes.

### Phase 3: Low-RAM View

- Create a dedicated lightweight renderer.
- Remove heavy animations and large assets.
- Add pagination and small thumbnails.
- Measure memory usage, startup time, and transferred bytes.

### Phase 4: Custom View

- Add configurable modules.
- Add module ordering.
- Add layout templates.
- Save configuration to the account.
- Add safe preview and reset controls.

### Phase 5: Advanced customization

- Add curated themes.
- Add safe custom CSS.
- Add import/export of layout templates.
- Preserve unpublished layouts when subscriptions lapse.

## Acceptance Criteria

The feature is complete when:

- premium users can select all four modes;
- the selected mode persists across sessions and devices;
- Public View matches the anonymous homepage;
- Premium View is ad-free and respects tag preferences;
- Custom View preserves and renders a saved module layout;
- Low-RAM View loads substantially fewer resources than the standard homepage;
- ad-provider scripts never load in ad-free modes;
- switching modes does not delete preferences;
- expired subscriptions fall back safely without destroying custom layouts;
- no incorrect homepage or trial screen flashes during mode resolution;
- every mode works on `https://9127000.xyz`.

## Product Positioning

The four-mode system gives Doku-Doujin Premium a stronger identity:

- Public View preserves openness and comparison.
- Premium View improves the familiar experience.
- Custom View gives ownership and personality.
- Low-RAM View makes performance itself a premium-quality feature.

Together, these modes make Premium feel less like a simple ad-removal purchase and more like control over how the entire library is experienced.
