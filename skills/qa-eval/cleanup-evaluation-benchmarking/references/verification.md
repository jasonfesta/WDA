# Verification — 20 October 2026

- `npm run build`: passed TypeScript checking and Vite production compilation.
- `npm test`: all four cart tests passed.
- Production server: HTTP 200 at `http://127.0.0.1:5186/`.
- Port isolation: existing listeners on 3001 and 8875 were left running. Both development and preview use strict binding on 5186.
- Desktop homepage checked at 1440 × 1000; no horizontal overflow.
- Home, Collection, Arc, Our Story, and Care checked at 390 × 844; no document-level horizontal overflow.
- Collection filter returned only Fold when selected.
- Ascending price sort returned Fold, Arc, then Day.
- Saving Arc showed it in Saved; removing the saved state cleared it.
- Arc gallery changed from the main product photograph to the hardware detail.
- Adding Arc, increasing quantity to two, and opening checkout preview showed a consistent $840 subtotal.
- Two-item bag survived a full browser reload. Removing Arc returned the bag to its empty state.
- Mobile menu navigated between pages; mobile search for “olive” returned Day at $480.
- Care draft fields and local-only explanation rendered correctly.
- No browser console warnings or errors were observed during the checks.
- Test bag and saved-piece data were cleared through the interface.

Checkout, newsletter, and care requests remain explicitly local demonstrations. No live order, payment, email, or repair submission was made.

The configured Git remote is `https://github.com/jasonfesta/WDA.git`; the active GitHub account is `jasonfesta`. Source branding and account attribution were checked against the requested destination. All existing commit authors and committers in this checkout were already Jason Festa.

## Previews

- Desktop preview artifact: `desktop-preview.jpg` (`1440 × 1000`)

- Mobile preview artifact: `mobile-preview.jpg` (`390 × 844`)
