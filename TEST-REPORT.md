# Nexus Learning Worlds v4.0 — quality report

Build date: 28 July 2026  
Release type: flat-file GitHub Pages release candidate  
Primary artifact: `leerhelden-pwa/index.html`

## Automated checks passed

- Every embedded JavaScript block passes `node --check`.
- The application is served byte-for-byte correctly over a local HTTP server.
- ZIP integrity passes with no archive errors.
- The ZIP contains the expected `leerhelden-pwa/index.html` upload structure.
- No external JavaScript or stylesheet dependency is present.
- Twenty locale packs contain the same complete set of 55 required interface keys, with no empty values.
- Arabic and Urdu activate right-to-left document direction.
- Twenty school-system profiles are present; each contains at least twelve ordered grade/stage mappings.
- Exercise generation returns a valid maths, reading and spelling task in every supported locale.
- Every generated multiple-choice question contains its declared correct answer.
- Exactly 500 marketplace records are generated.
- All 500 records have unique IDs, unique item names and unique animation signatures.
- Each marketplace record receives its own generated CSS keyframe name and parameters.
- The animal catalogue contains one Horse, one Donkey and one Zebra.
- Zoo and farm categories each contain twenty distinct entries; further animal categories cover safari, oceans, birds and small creatures.
- Zoo and farm world presets are available alongside football, hockey, fantasy, space, ocean, city, jungle, dinosaur and winter worlds.
- Dani defaults to the football world, Zana to hockey and Lena to fantasy.
- Twelve game modules are registered, including Four in a Row, Memory and Tic-Tac-Toe.
- Tic-Tac-Toe and Four in a Row winner detection passed deterministic board tests.
- The 6 × 6 Memory deck contains 36 cards.
- The per-profile ten-play game cap is enforced.
- Existing v3 inventory IDs and placements are migrated deterministically to v4 assets.
- Migration preserves profile points, XP and placement count.
- Back navigation is included in the shared shell and dedicated exercise/game shells.
- Profile PIN values are not stored as plain text in the current flat build.

## Catalogue review

The six animal-focused categories contain 120 named entries. Species names are unique within the catalogue. Where Unicode has no species-specific pictogram, the visual combines the named species, a unique motion sequence, timing, direction, scale, rotation, hue treatment and nameplate. This is a procedurally generated asset system, not a library of 500 hand-drawn illustrations.

## Language and curriculum boundary

Automated consistency checks prove that all twenty language packs have the same required interface structure and that each curriculum profile has ordered stage mappings. They do not replace native-speaker proofreading, local educational approval or legal review. A commercial release in twenty languages requires native educational reviewers for each target market, especially for age-appropriate reading texts, terminology, grammar, cultural suitability and curriculum alignment.

## Security and payment boundary

The flat file has no remote database, exposed API secret or third-party script. Local PIN gates reduce accidental access on a shared device, but source code and local browser storage remain under the device owner's control. Therefore this build is not a tamper-proof authentication or entitlement system.

A personal `revolut.me` link is included only as an optional parent-area support/payment link. It does not unlock access automatically. Secure paid access requires a server-side order and entitlement service, Revolut Business Merchant API webhooks for web sales, and the applicable Apple/Google purchase systems for store-distributed digital access.

## Visual test limitation

Two Chromium headless attempts were made in the build container. Chromium did not complete startup because of local DBus/GPU initialisation failures. Functional UI logic was therefore validated with an isolated DOM harness, JavaScript syntax checks, HTTP serving and deterministic state tests. Before public release, device QA remains required on current Safari/iPadOS, iOS, Chrome/Android, Chrome/Windows and Edge/Windows.

## Checksums

- `index.html`: `e20a523708a1014ea506fe23bfb3e5e69e4e08a638b955e8e4d6bd9e5d8b233a`
- ZIP before adding this report: `cce7069a3189ac88b56c514250266223faadf94cace795202f7845d827926d9e`
