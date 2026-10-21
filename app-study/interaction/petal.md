# Petal — flow and interaction review

Jason Festa / WDA · 21 October 2026

Five visual states, with additional routes specified below. These are proposed product behaviors for later implementation; the review images are not functional app screens.

## Direction

One concise onboarding screen introduces both drag and tap-to-move. Collections is the landing library; Play shows in-progress and completion states, and Profile reflects the completed puzzle.

Original Petal art direction: precise painterly lemon, blossom and leaf botanical artwork on creamy paper; expressive refined serif headlines, muted olive utility text, warm coral controls, thin botanical dividers. Preserve the original illustration-based strip puzzle, not abstract colour bars.

Type: Cormorant Garamond, DM Sans. Palette: #FFF9EC, #718064, #E8795B, #993D2A.

## Reference chain

Original art direction: [saved screen](../references/originals/petal.png). [Original prompt](../prompts/petal.txt). Historical research: [mobile research](../research/archive/mobile-research-2026-10-20.md), [state plan](../research/archive/mobile-state-plan-2026-10-20.md), [expanded flow research](../research/archive/expanded-flow-research-2026-10-20.md).

Current product and interaction references were checked on 21 October 2026. Product documentation establishes features, not a hands-on audit of each native screen.

- [I Love Hue · Official product page](https://zutgames.com/i-love-hue.php) — Calm visual arrangement informs the play loop. Horizontal botanical strips, snapping rules and tap alternatives are Petal-specific proposals.
- [W3C · Dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) — Provide a single-pointer alternative to dragging. Petal uses tap a strip, then its target, with keyboard support in addition.
- [W3C · Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Modal focus stays inside the dialog; Escape closes it. Restore useful focus on return. Dirty drafts require an explicit discard choice.
- [W3C · Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — In-page tabs need matching panels and keyboard behavior. The study’s bottom destinations are route navigation: implement links with aria-current, rather than applying tab semantics to unrelated pages.

## Action flow

01 Put the garden back together → 02 A shelf of small gardens → 03 A little closer, piece by piece → 04 A small garden, whole again → 05 Your quiet collection

The sequence shows representative states, not five mandatory steps on every visit. Returning users land on the last valid main destination; completed onboarding is skipped. Tab routes remain available independently of this reading order.

| Destination | Route | Return rule |
| --- | --- | --- |
| Play | `03-play` | Preserve its scroll, selection and draft; active destination does not reload. |
| Collections | `02-collections` | Preserve its scroll, selection and draft; active destination does not reload. |
| Profile | `05-profile` | Preserve its scroll, selection and draft; active destination does not reload. |

## Fixed review data

Citrus contains 12 arrangements. The library starts at zero complete; Citrus 01 is shown at 3 of 5 aligned (60%). Completion aligns all five and records one completed arrangement. Profile shows 1 of 12. Pear orchard has 10 arrangements; Wild rose has 8; both remain at zero.

- Play contains five strips; 1, 3 and 5 aligned = 3/5 = 60%.
- Completion aligns all five and stores Citrus 01 exactly once.
- Collections pictured before play is 0/12; after completion it becomes 1/12.
- Profile total counts completed IDs, not visits; replay cannot inflate the count.

## 01 · Put the garden back together

Entry: First launch. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/petal/01-welcome.png) · [Exact prompt](../prompts/screens/petal/01-welcome.txt)

Pictured state: PETAL small spaced brand. Headline "Put the garden back together." A beautiful large lemon blossom botanical image divided into five horizontal strips, with two visibly offset, fills the middle. Short instruction "Slide a piece into place. Or tap a piece, then its destination." Primary "Try a little arrangement". Secondary "I have played before". No tabs. No completion count on tutorial artwork. A Pause tutorial icon appears at top right.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `petal.01.01` · Tutorial piece / destination | Drag, tap-select/tap-target, or keys | Demonstrate one reversible move; support tap-select/tap-slot and keyboard, not drag only. Route: `self`. | Pointer capture only after drag intent; vertical scroll remains available. Snap from real positions and announce aligned count. Escape cancels a move. |
| `petal.01.02` · Try a little arrangement | Tap/click; Enter or Space | Mark tutorial seen and open collection library; do not count tutorial as a completed puzzle. Route: `02-collections`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `petal.01.03` · I have played before | Tap/click; Enter | Open optional restore/local continuation; failed sign-in leaves guest play available. Route: `aux:restore-progress`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `petal.01.04` · Pause tutorial | Tap/click; Enter or Space | Pause the illustrative tutorial; Resume restores it. Tutorial moves and pauses never affect completed puzzle IDs; collections entry remains available. Route: `aux:pause`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 02 · A shelf of small gardens

Entry: Finish tutorial / Collections tab. Selected destination: Collections.

[Screen image](../images/mobile/petal/02-collections.png) · [Exact prompt](../prompts/screens/petal/02-collections.txt)

Pictured state: PETAL, heading "A shelf of small gardens". Three spacious botanical collection rows, each different illustration: "Citrus" / "0 of 12 complete", "Pear orchard" / "0 of 10 complete", "Wild rose" / "0 of 8 complete". Citrus is selected with an olive thin outline and lemon vignette. Main "Open Citrus". Bottom Play / Collections / Profile; ONLY Collections active. No locks, prices or subscription.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `petal.02.01` · Citrus / Pear orchard / Wild rose | Tap/click; Enter or Space | Select collection and update CTA label; keep progress separate per collection. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `petal.02.02` · Open Citrus | Tap/click; Enter or Space | Open next unfinished arrangement01, restoring partial state if one exists. Route: `03-play`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `petal.02.nav.1` · Play | Tap/click or Enter | Open Play; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-play`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `petal.02.nav.2` · Collections | Tap/click or Enter | Open Collections; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `02-collections`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `petal.02.nav.3` · Profile | Tap/click or Enter | Open Profile; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-profile`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 03 · A little closer, piece by piece

Entry: Open Citrus / Play tab. Selected destination: Play.

[Screen image](../images/mobile/petal/03-play.png) · [Exact prompt](../prompts/screens/petal/03-play.txt)

Pictured state: PETAL. Header "Citrus · 01 / 12" with pause icon. Original botanical lemon branch artwork in EXACTLY FIVE horizontal strips. Strips 1,3,5 in correct position; strips 2 and 4 visibly offset and incomplete. Text "3 of 5 pieces aligned" and exactly 60% filled coral progress. Primary "Show a hint". Secondary "Start again". Small helper "Drag a strip, or tap to move". Bottom Play / Collections / Profile; ONLY Play active. Do not write complete.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `petal.03.01` · Five puzzle strips | Drag, tap-select/tap-target, or keys | Drag horizontally to snap, or tap strip then target; keyboard left/right; recompute aligned count from position, not text. Route: `self`. | Pointer capture only after drag intent; vertical scroll remains available. Snap from real positions and announce aligned count. Escape cancels a move. |
| `petal.03.02` · Pause | Tap/click; Enter or Space | Freeze input and open Resume / Restart / Collections sheet; resume preserves offsets. Route: `aux:pause`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `petal.03.03` · Show a hint | Tap/click; Enter or Space | Highlight one incorrect strip and target only; do not count it aligned until the move occurs. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `petal.03.04` · Start again | Tap/click; Enter or Space | Confirm before resetting unsolved positions; cancel retains exact arrangement. Route: `aux:restart-confirm`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `petal.03.05` · Final correct move | State transition | Persist solved ID once and transition after a brief confirmation; reduced motion uses immediate update. Route: `04-complete`. | Not a visible button. Derived condition fires once per record, persists idempotently and announces the new state. |
| `petal.03.nav.1` · Play | Tap/click or Enter | Open Play; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-play`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `petal.03.nav.2` · Collections | Tap/click or Enter | Open Collections; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `02-collections`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `petal.03.nav.3` · Profile | Tap/click or Enter | Open Profile; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-profile`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 04 · A small garden, whole again

Entry: Final correct move. Selected destination: Play.

[Screen image](../images/mobile/petal/04-complete.png) · [Exact prompt](../prompts/screens/petal/04-complete.txt)

Pictured state: PETAL. Header "Citrus · 01 / 12". Heading "A small garden, whole again." The SAME lemon-branch botanical composition is a complete continuous image across EXACTLY FIVE aligned horizontal bands. No horizontal offsets. Count "5 of 5 pieces aligned"; progress 100%. Small "1 of 12 arrangements complete". Main "Next arrangement". Secondary "Back to collections". Bottom Play / Collections / Profile; ONLY Play active. No extra confetti or coins.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `petal.04.01` · Next arrangement | Tap/click; Enter or Space | Load arrangement02 with its own initial offsets; keep arrangement01 completed. Route: `03-play`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `petal.04.02` · Back to collections | Tap/click; Enter | Return to Citrus with 1/12 complete; preserve other collection counts. Route: `02-collections`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `petal.04.nav.1` · Play | Tap/click or Enter | Open Play; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-play`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `petal.04.nav.2` · Collections | Tap/click or Enter | Open Collections; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `02-collections`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `petal.04.nav.3` · Profile | Tap/click or Enter | Open Profile; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-profile`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 05 · Your quiet collection

Entry: Profile tab after first completion. Selected destination: Profile.

[Screen image](../images/mobile/petal/05-profile.png) · [Exact prompt](../prompts/screens/petal/05-profile.txt)

Pictured state: PETAL, heading "Your quiet collection". Small botanical sprig. Display "Guest garden". One clear statistic "1 arrangement completed". Progress line "Citrus · 1 of 12". Preferences "Gentle haptics" ON, "Sound effects" OFF, "Reduce motion" ON. Main outlined "Save my progress". Quiet link "Replay the tutorial". Bottom Play / Collections / Profile; ONLY Profile active. No invented streak or points.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `petal.05.01` · Gentle haptics / Sound effects / Reduce motion | Tap or Space | Persist immediately; unsupported haptics show unavailable; no unsolicited sound. Route: `self`. | Native checkbox styled as switch; label and checked state agree. Permission-dependent value stays off until granted. |
| `petal.05.02` · Save my progress | Tap/click; Enter or Space | Optional sign-in links local progress only after success; guest play remains available. Route: `aux:account-link`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `petal.05.03` · Replay the tutorial | Tap/click; Enter | Open tutorial in replay mode; preserve all completed puzzle IDs. Route: `01-welcome`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `petal.05.nav.1` · Play | Tap/click or Enter | Open Play; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-play`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `petal.05.nav.2` · Collections | Tap/click or Enter | Open Collections; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `02-collections`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `petal.05.nav.3` · Profile | Tap/click or Enter | Open Profile; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-profile`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## Additional routes and recovery

These states are specified, not additional image exports. Every `aux:` destination in the ledger is defined here. Shared loading, error, back and persistence behavior is in the [React handoff](react-handoff.md).

### account-link

Optional account linking with consent to sync local progress. Success unions puzzle IDs; failure retains all guest data and offers retry. Cancel returns to Profile without a lost-progress warning loop.

### pause

Modal with Resume, Restart and Collections. Resume restores offsets, Restart opens its confirmation, Collections saves partial state. Escape/Back resumes; focus returns to the selected strip.

### restart-confirm

Keep playing preserves every strip offset. Restart resets only the current puzzle’s in-progress arrangement, never the completed-ID history or other collections.

### restore-progress

Offer Continue on this device and optional sign-in restore. Show local and remote counts before an explicit merge; union completed IDs without adding duplicates. Cancel keeps guest progress.

## Alternative to evaluate

**Play before library.** Try a little arrangement can lead directly to Citrus 01; completing it opens the library with 1/12. Keep tutorial progress separate. Compare first puzzle completion and ability to find another collection.

## Implementation acceptance

- Every visible control maps to a ledger ID; decorative and operating-system content is explicitly excluded.
- Resolve every route and carry `returnTo`, record ID and draft ID through editors.
- Test primary flow plus back/cancel, rejected permission, empty data, failed save/retry, offline resume and duplicate activation.
- Test keyboard-only, screen reader order, reduced motion, 200% text and a narrow viewport; no clipped controls or hidden essential actions.
- Verify the fixed data checks above with shared selectors rather than hardcoded repeated strings.

<!-- MOTION CONTRACT -->

## Motion, rollover and implementation prompts

Animate the actual botanical strips and their alignment. The pleasure comes from a small, precise snap and the whole picture coming together, with the calm illustration carrying the atmosphere.

[Complete motion contract](motion/petal.md) · [App interaction prompt](../prompts/interaction/petal.txt) · [Asset preparation prompt](../prompts/motion/petal-assets.txt) · [Motion direction prompt](../prompts/motion/petal-direction.txt)

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

- [01 screen interaction prompt](../prompts/interaction/petal/01-welcome.txt) — Try a little arrangement routes into the documented collection/play flow. Rollover shows a quiet coral tint, not an automatic game move.

- [02 screen interaction prompt](../prompts/interaction/petal/02-collections.txt) — Hover outlines the collection without changing the selected Citrus state. Selecting another collection updates its label/count; Open uses the selected ID. The count remains 0/12 before play.

- [03 screen interaction prompt](../prompts/interaction/petal/03-play.txt) — Drag strip 2 or 4 with direct tracking; 1, 3 and 5 start aligned. Use the same snap rule for mouse, touch, tap-target and keyboard. Hint highlights a relevant target once without completing it. Pause retains offsets.

- [04 screen interaction prompt](../prompts/interaction/petal/04-complete.txt) — Next arrangement initializes the next valid puzzle; Back to collections shows 1/12. Hover does not replay completion. No count-up animation that suggests multiple completions.

- [05 screen interaction prompt](../prompts/interaction/petal/05-profile.txt) — Haptics, sound and reduced-motion controls expose actual saved values. Save progress opens optional account linking. Replay tutorial is explicit and never resets completed IDs.
