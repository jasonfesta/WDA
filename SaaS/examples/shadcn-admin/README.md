---
id: shadcn-admin
source_system: "Shadcn Admin"
catalog: "Shadcn Admin"
ui_foundation: "shadcn/ui"
primary_type: "Business overview dashboard"
package_kind: "Dashboard UI template"
tags: ["business-overview", "subscriptions", "revenue", "admin"]
reviewed_on: "2026-11-10"
---

# Shadcn Admin — business overview

[All systems and captures](../../SYSTEMS.md)

## System and application association

| Field | Association |
| --- | --- |
| Source system | Shadcn Admin |
| Discovery catalog | Shadcn Admin |
| UI foundation | shadcn/ui |
| Primary application type | Business overview dashboard |
| Secondary associations | Revenue and subscription summary; general administration |
| Package scope | Dashboard UI template |

## Source and visible evidence

The project is a reusable React/Vite admin interface built with shadcn/ui. Treat the captured screen as a frontend template; this review did not verify a production billing or database backend. [Source](https://github.com/satnaing/shadcn-admin).

- Four summary cards: Total Revenue, Subscriptions, Sales, and Active Now.
- An Overview chart panel and a Recent Sales list.
- Navigation for tasks, apps, chats, users, authentication, and settings.

## Suggested uses — inferred

These associations describe possible reuse, not verified backend capabilities.

- A SaaS owner home screen that summarizes business activity.
- An executive snapshot linking into customer and operational modules.

## Related views

Tasks, Apps, Chats, Users, and Settings are visible in the captured navigation. Those views have not been captured in this folder.

## Screenshots

[Live view used for capture](https://shadcn-admin.netlify.app/)

Original browser images, without postprocessing. Desktop viewport: 1800 × 948; mobile viewport: 393 × 852. Earlier full-page images include the page’s vertical scroll extent. Viewport images show the complete initial screen; internal scrolling and horizontal overflow are not stitched.

| Image | Theme | Saved dimensions | Mode |
| --- | --- | --- | --- |
| [desktop-light.jpg](desktop-light.jpg) | Light | 1800 × 948 | viewport |
| [desktop.jpg](desktop.jpg) | Dark | 1800 × 948 | viewport |
| [mobile-light.jpg](mobile-light.jpg) | Light | 393 × 852 | viewport |
| [mobile.jpg](mobile.jpg) | Dark | 393 × 1828 | full-page |

## Capture notes

The dark desktop Overview chart remains blank in the browser capture. The light desktop variant shows the chart. The light mobile replacement is a full viewport image, so lower chart content is outside the first screen.
