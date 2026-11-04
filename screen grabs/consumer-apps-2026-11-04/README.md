# Consumer application captures — November 4, 2026

24 images: one desktop and one mobile reference for each of 12 applications, captured in Google Chrome. Mobile images show responsive web interfaces, not native iOS or Android apps.

[Download the complete ZIP](https://github.com/jasonfesta/WDA/raw/refs/heads/main/screen%20grabs/consumer-apps-2026-11-04/consumer-apps-2026-11-04.zip) · [Open the local gallery](gallery.html) · [Preview](preview.jpg) · [Capture manifest](manifest.json) · [Text-check report](qa.json)

Long pages use scrolling captures where practical. Infinite feeds contain a finite loaded section. X mobile and map/AI workspaces use fixed-height captures where that better represents the application, following the approved capture flexibility.

| Application | Category | Desktop | Mobile |
| --- | --- | --- | --- |
| X | Social | [Desktop](x/desktop.jpg) | [Mobile](x/mobile.jpg) |
| Facebook | Social | [Desktop](facebook/desktop.png) | [Mobile](facebook/mobile.jpg) |
| Instagram | Social | [Desktop](instagram/desktop.png) | [Mobile](instagram/mobile.png) |
| TikTok | Social | [Desktop](tiktok/desktop.jpg) | [Mobile](tiktok/mobile.jpg) |
| YouTube | Social | [Desktop](youtube/desktop.jpg) | [Mobile](youtube/mobile.jpg) |
| Manus | AI | [Desktop](manus/desktop.jpg) | [Mobile](manus/mobile.jpg) |
| Meta AI | AI | [Desktop](meta-ai/desktop.jpg) | [Mobile](meta-ai/mobile.jpg) |
| Google Maps | Maps | [Desktop](google-maps/desktop.png) | [Mobile](google-maps/mobile.jpg) |
| Airbnb | Maps | [Desktop](airbnb/desktop.jpg) | [Mobile](airbnb/mobile.jpg) |
| Redfin | Maps | [Desktop](redfin/desktop.jpg) | [Mobile](redfin/mobile.jpg) |
| Mapbox | Maps | [Desktop](mapbox/desktop.png) | [Mobile](mapbox/mobile.png) |
| Wanderlog | Trip planning | [Desktop](wanderlog/desktop.jpg) | [Mobile](wanderlog/mobile.jpg) |

## Editing and review

The revised Instagram edit prompts are recorded in [image-edits.json](image-edits.json). The built-in AI image editor was used.

Facebook desktop and both Instagram images were edited with the AI image editor to replace Darwin account references with Studio / joinstudio and neutral avatars. The user chose AI editing after being informed it can change unrelated screenshot details. These three images are visual references, not pixel-exact originals; AI output also changed dimensions. Instagram desktop is a long profile-grid capture and mobile uses Explore. Other images are browser captures.

The delivered images were visually reviewed and checked with local OCR for Darwin text. No matches were found. OCR is a supporting check; small text and stylized logos can be missed. The raw images containing the replaced branding are excluded from this collection.

## Capture notes

- **X:** Home timeline. Desktop shows a finite loaded feed; mobile uses a fixed viewport because full-page export produced a blank tail.

- **Facebook:** Home feed, bounded to the loaded posts. Desktop is AI-edited to replace account branding with Studio Page.

- **Instagram:** Desktop shows a long scrolling Instagram public-profile grid; mobile shows Explore. Both are AI-edited to replace the account avatar with a neutral S. AI editing can change unrelated image details.

- **TikTok:** Explore grid, bounded to the initially loaded results. Some lower thumbnail placeholders remain in the live export.

- **YouTube:** Home recommendations, bounded to loaded rows. Some desktop news thumbnails remain blank. Existing browser zoom affects output dimensions.

- **Manus:** Consumer task workspace; complete fixed-height view.

- **Meta AI:** Consumer chat workspace; complete fixed-height view.

- **Google Maps:** Paris map workspace. Desktop and mobile show the expanded map without the place panel.

- **Airbnb:** Paris accommodation search in map view. Desktop uses the expanded map control at normal browser height; mobile shows the map with a listing sheet.

- **Redfin:** Tampa listings in map view on desktop and mobile; desktop retains the full navigation header at normal browser height.

- **Mapbox:** Official interactive Default basemap demo, showing San Francisco. Desktop and mobile responsive map views.

- **Wanderlog:** Full-page guest sample itinerary for Paris, November 14–15, 2026, with Eiffel Tower and Louvre Museum. Desktop includes a map; mobile shows the planning column. Sample content only.

## Travel-planning research

Wanderlog was captured inside its consumer planning application using a sample guest trip. Furkot was removed at the user’s request. Mapbox replaces MapQuest in the revised collection.

Two additional comparable planners were researched but are not counted among the 24 delivered images:

- **Tripomatic:** its [website planning guide](https://support.tripomatic.com/how-to-plan-a-trip/planning-a-trip-on-the-website.html) describes day itineraries and map planning. The live app stopped at a browser-verification error.
- **Roadtrippers:** its [website getting-started guide](https://support.roadtrippers.com/hc/en-us/articles/203322709-Website-Getting-Started) covers map-based trip planning. The live planner encountered browser security verification before a usable pair could be completed.

No account sign-up, paid trial, booking, or purchase was needed for the delivered references.
