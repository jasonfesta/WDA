# Home Note — flow and interaction review

Jason Festa / WDA · 21 October 2026

Five visual states, with additional routes specified below. These are proposed product behaviors for later implementation; the review images are not functional app screens.

## Direction

Retain separate create-household and join-by-invitation routes. Reduce the core tab set to Today, Notes and People so the five images cover each destination.

Original Home Note art direction: peach, citron and burgundy; friendly sculptural adult and child avatars, tactile household pictograms, softly tilted illustrated cards in welcome only. Cream/pink surfaces, a rich expressive serif headline and practical rounded humanist labels. Never substitute portrait photography.

Type: Fraunces, Nunito Sans. Palette: #FFE5D4, #E2D998, #9F9953, #78252E.

## Reference chain

Original art direction: [saved screen](../references/originals/home-note.png). [Original prompt](../prompts/home-note.txt). Historical research: [mobile research](../research/archive/mobile-research-2026-10-20.md), [state plan](../research/archive/mobile-state-plan-2026-10-20.md), [expanded flow research](../research/archive/expanded-flow-research-2026-10-20.md).

Current product and interaction references were checked on 21 October 2026. Product documentation establishes features, not a hands-on audit of each native screen.

- [Cozi · Feature overview](https://www.cozi.com/feature-overview/) — Shared calendars, reminders and lists support a household agenda. Home Note’s invitation, acknowledgement and handover details are proposed here, not copied native flows.
- [Apple · Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) — Reference retained from the research plan. Full article could not be read through the text fetch, so no specific behavior is attributed to it. The proposed short setup sequences are WDA decisions.
- [W3C · Validating input](https://www.w3.org/WAI/tutorials/forms/validation/) — Label required fields and expose accessible validation feedback. Validate on the server as well as the client. Failed saves should keep the user’s draft.
- [W3C · Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Modal focus stays inside the dialog; Escape closes it. Restore useful focus on return. Dirty drafts require an explicit discard choice.

## Action flow

01 Leave the details. Keep the peace. → 02 Give your home a name → 03 Today at Maple House → 04 The handover notebook → 05 The people who make home

The sequence shows representative states, not five mandatory steps on every visit. Returning users land on the last valid main destination; completed onboarding is skipped. Tab routes remain available independently of this reading order.

| Destination | Route | Return rule |
| --- | --- | --- |
| Today | `03-today` | Preserve its scroll, selection and draft; active destination does not reload. |
| Notes | `04-notes` | Preserve its scroll, selection and draft; active destination does not reload. |
| People | `05-people` | Preserve its scroll, selection and draft; active destination does not reload. |

## Fixed review data

Maple House; Avery is the owner. The demonstration agenda is Friday, 19 June 2026: school pickup 15:15, snack 16:00, story 19:30. Setup creates one member. The People image is a later state after explicitly inviting Morgan: one member and one pending invitation.

- Friday 19 June 2026 is the fixture date; it is not live device data.
- Setup creates Avery only. Screen 05 is reached after an explicitly sent Morgan invitation.
- One member plus one pending invite is not two members.
- Read acknowledgement requires Mark read; merely expanding a note does not acknowledge it.

## 01 · Leave the details. Keep the peace.

Entry: First launch. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/home-note/01-welcome.png) · [Exact prompt](../prompts/screens/home-note/01-welcome.txt)

Pictured state: Home Note brand. Same warm original 3D household handover cards and two friendly original avatars in upper half; one card "Friday with June" with school bag, apple, book. Headline "Leave the details. Keep the peace." Body "The little things, ready for whoever is helping." Marker "1 / 2". Primary "Create your home note". Secondary "I have an invitation". No tabs.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `home-note.01.01` · Create your home note | Tap/click; Enter or Space | Start household draft without sending any invitation. Route: `02-household`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.01.02` · I have an invitation | Tap/click; Enter | Open invitation-code entry; invalid/expired code allows retry; successful acceptance routes to Today. Route: `aux:join-household`. | Route link; announce destination heading after navigation and restore scroll on Back. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 02 · Give your home a name

Entry: Create your home note. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/home-note/02-household.png) · [Exact prompt](../prompts/screens/home-note/02-household.txt)

Pictured state: Back arrow and Home Note, "2 / 2". Small sculptural clay house on peach/citron. Title "Give your home a name". Field "Household name" value "Maple House". Field "Your name" value "Avery". Small explanation "Invite your people once you are inside." Primary "Open my home". No pre-sent invite, no tabs.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `home-note.02.01` · Back | Tap/click; Enter or Space | Preserve household draft. Route: `01-welcome`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.02.02` · Household name | Focus, type; blur validates | Required 1–60 trimmed characters; clear inline error. Route: `self`. | Native labeled input; errors use aria-describedby and aria-invalid. Keyboard must not cover the active field. |
| `home-note.02.03` · Your name | Focus, type; blur validates | Required display name; do not infer role from typed text. Route: `self`. | Native labeled input; errors use aria-describedby and aria-invalid. Keyboard must not cover the active field. |
| `home-note.02.04` · Open my home | Tap/click or form Enter | Create household with Avery as owner exactly once; show failure and retain draft if request fails. Route: `03-today`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 03 · Today at Maple House

Entry: Open my home / Today tab. Selected destination: Today.

[Screen image](../images/mobile/home-note/03-today.png) · [Exact prompt](../prompts/screens/home-note/03-today.txt)

Pictured state: Home Note and small Avery avatar. Heading "Today at Maple House". Date "Friday, 19 June". Small clay house vignette. Three readable loose rows: "15:15 School pickup" / "Avery"; "16:00 Peanut-free snack" / "Ready to pack"; "19:30 Choose a story" / "On the shelf". Small context note "Keep the handover simple." Primary "Add a note +". Bottom Today / Notes / People; ONLY Today active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `home-note.03.01` · Avery avatar | Tap/click; Enter or Space | Open account/preferences; household remains Maple House. Route: `aux:account`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.03.02` · Schedule row | Tap/click; Enter | Open exact item with time, assignee, notes and edit permission. Route: `aux:handover-detail`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `home-note.03.03` · Add a note | Tap/click; Enter or Space | Open a new blank note editor; save returns to Notes with the new record. Cancel returns to Today. Route: `aux:note-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.03.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `home-note.03.nav.2` · Notes | Tap/click or Enter | Open Notes; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-notes`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `home-note.03.nav.3` · People | Tap/click or Enter | Open People; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-people`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 04 · The handover notebook

Entry: Notes tab / Add a note. Selected destination: Notes.

[Screen image](../images/mobile/home-note/04-notes.png) · [Exact prompt](../prompts/screens/home-note/04-notes.txt)

Pictured state: Home Note. Heading "The handover notebook". Three cream rows with small tactile icons: "Blue cardigan in the hall"; "Library books due Friday"; "Snack box is packed". First row expanded with "On the lower hook beside the front door." and "Added by Avery". Under it small actions "Edit" and "Mark read". Primary "Add a note +". Bottom Today / Notes / People; ONLY Notes active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `home-note.04.01` · Note row | Tap/click; Enter or Space | Expand that note; collapse previous if one-at-a-time; expansion is not a read receipt. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.04.02` · Edit | Tap/click; Enter or Space | Open existing note draft; Save updates same ID; Cancel restores original. Route: `aux:note-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.04.03` · Mark read | Tap/click; Enter or Space | Record explicit read acknowledgement for current person; announce result, allow undo. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.04.04` · Add a note | Tap/click; Enter or Space | Create draft with blank title/body; validate and add once on Save. Route: `aux:note-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.04.05` · Avery avatar | Tap/click; Enter or Space | Open current account; preserve Notes scroll. The tiny author avatar beside Added by Avery is decorative attribution, not a second control. Route: `aux:account`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.04.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `home-note.04.nav.2` · Notes | Tap/click or Enter | Open Notes; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-notes`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `home-note.04.nav.3` · People | Tap/click or Enter | Open People; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-people`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 05 · The people who make home

Entry: People tab / after explicitly sending invitation. Selected destination: People.

[Screen image](../images/mobile/home-note/05-people.png) · [Exact prompt](../prompts/screens/home-note/05-people.txt)

Pictured state: Home Note. Heading "The people who make home". Small summary "1 member · 1 invitation pending". Friendly clay avatar row "Avery" / "Owner". Separate row "Morgan" / "Invitation pending" with outlined "Resend" and quiet "Cancel invitation". Small text "They can join when they are ready." Primary "Invite someone +". Bottom Today / Notes / People; ONLY People active. Do not label Morgan a member. Morgan uses an M placeholder because the invitation has not been accepted.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `home-note.05.01` · Avery row | Tap/click; Enter or Space | Show role/contact options permitted for owner. Route: `aux:person-detail`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.05.02` · Morgan invitation row | Tap/click; Enter or Space | Show pending status and sent time without implying acceptance. Route: `aux:invite-detail`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.05.03` · Resend | Tap/click; Enter or Space | Explicit resend; show pending/success/error with rate limit; preserve invite ID. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.05.04` · Cancel invitation | Tap/click; Enter or Space | Confirm before revoking; cancellation leaves one owner and zero pending invites. Route: `aux:cancel-invite`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.05.05` · Invite someone | Tap/click; Enter or Space | Enter recipient; review then Send; only successful send creates pending invite. Route: `aux:invite-form`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `home-note.05.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `home-note.05.nav.2` · Notes | Tap/click or Enter | Open Notes; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-notes`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `home-note.05.nav.3` · People | Tap/click or Enter | Open People; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-people`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## Additional routes and recovery

These states are specified, not additional image exports. Every `aux:` destination in the ledger is defined here. Shared loading, error, back and persistence behavior is in the [React handoff](react-handoff.md).

### account

Show current person and household, profile edit and preferences. Save validates the display name and updates the same person ID. Close returns to Today; switching household requires a separate explicit choice.

### cancel-invite

Confirm revoking Morgan’s pending invitation with Keep invitation / Cancel invitation. A successful request reduces pending count to zero; failure retains the invitation and offers retry.

### handover-detail

Show selected time, item, assignee and notes. Owner can Edit; other roles see the permitted actions. Save updates the same item with conflict handling; Back leaves the agenda unchanged.

### invite-detail

Show Morgan, pending status and sent timestamp, plus Resend and Cancel invitation. Pending is not membership. Close preserves the list; revoked or accepted state refreshes visibly.

### invite-form

Enter recipient and optional display name → Review recipient and household → Send invitation. Sending is explicit. Success adds one pending row, failure keeps the form. Cancel sends nothing.

### join-household

Enter invitation code/link → validate → show household and inviter → Accept. Expired/revoked codes show retry/help. Accept joins exactly that household; cancel leaves membership unchanged.

### note-editor

Labeled title/body with Save and Cancel. New notes start blank; edit loads the selected note ID. Required title (1–80) and body (1–2000); Save prevents duplicate submits. Cancel offers Keep editing / Discard if dirty.

### person-detail

Show Avery, Owner and permitted contact/profile fields. No automatic messaging. Close returns to People. Destructive membership changes require authorization and confirmation.

## Alternative to evaluate

**Invitation first.** For households arriving from an invitation link, show the household and inviter before account/setup. Accept joins; creating a new household remains secondary. Compare failed joins and duplicate households.

## Implementation acceptance

- Every visible control maps to a ledger ID; decorative and operating-system content is explicitly excluded.
- Resolve every route and carry `returnTo`, record ID and draft ID through editors.
- Test primary flow plus back/cancel, rejected permission, empty data, failed save/retry, offline resume and duplicate activation.
- Test keyboard-only, screen reader order, reduced motion, 200% text and a narrow viewport; no clipped controls or hidden essential actions.
- Verify the fixed data checks above with shared selectors rather than hardcoded repeated strings.

<!-- MOTION CONTRACT -->

## Motion, rollover and implementation prompts

Bring the soft clay house to life with a little window warmth and foliage movement. Keep the adult avatar consistent and let handover actions, read states and invitations carry the functional feedback.

[Complete motion contract](motion/home-note.md) · [App interaction prompt](../prompts/interaction/home-note.txt) · [Asset preparation prompt](../prompts/motion/home-note-assets.txt) · [Motion direction prompt](../prompts/motion/home-note-direction.txt)

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

- [01 screen interaction prompt](../prompts/interaction/home-note/01-welcome.txt) — Primary CTA fill darkens on hover/press. Join household remains an explicit link. Illustration cards do not tilt or behave like buttons.

- [02 screen interaction prompt](../prompts/interaction/home-note/02-household.txt) — Household and Your name fields get an immediate visible border on focus. Open my home shows pending without hiding values; navigate only after successful creation.

- [03 screen interaction prompt](../prompts/interaction/home-note/03-today.txt) — Agenda rows use a soft peach tint on rollover. Optional object tilt is limited to 2 degrees once during pointer entry, never the text. Add a note opens the editor; the schedule is unchanged until save.

- [04 screen interaction prompt](../prompts/interaction/home-note/04-notes.txt) — Accordion expands in 220 ms; chevron reflects aria-expanded. Edit and Mark read remain separate buttons. Mark read updates its label and saved state only after success, with no celebratory movement.

- [05 screen interaction prompt](../prompts/interaction/home-note/05-people.txt) — Resend uses explicit pending/sent text; Cancel invitation opens confirmation. Hover never sends or revokes. Invitation success may fade in one pending row over 180 ms, but the member count stays one.
