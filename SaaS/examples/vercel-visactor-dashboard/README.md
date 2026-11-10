---
id: vercel-visactor-dashboard
source_system: "VisActor Next.js Template"
catalog: "Vercel Templates"
ui_foundation: "shadcn/ui + VisActor"
primary_type: "Customer-support analytics dashboard"
package_kind: "Dashboard UI template"
tags: ["customer-support", "helpdesk", "ticket-analytics", "customer-satisfaction"]
reviewed_on: "2026-11-10"
---

# VisActor — support operations dashboard

[All systems and captures](../../SYSTEMS.md)

## System and application association

| Field | Association |
| --- | --- |
| Source system | VisActor Next.js Template |
| Discovery catalog | Vercel Templates |
| UI foundation | shadcn/ui + VisActor |
| Primary application type | Customer-support analytics dashboard |
| Secondary associations | Ticket volume, service response, and satisfaction |
| Package scope | Dashboard UI template |

## Source and visible evidence

The repository describes a Next.js dashboard using VisActor charts, shadcn components, and Tailwind. The support-specific association comes from the captured labels rather than a claim that the package supplies a complete helpdesk backend. [Source](https://github.com/mengxi-ream/visactor-next-template).

- Created, unsolved, and resolved tickets, plus average first reply time.
- Created-versus-resolved ticket bars and ticket-channel visualization.
- Customer-satisfaction indicators and a conversions breakdown.

## Suggested uses — inferred

These associations describe possible reuse, not verified backend capabilities.

- A support-team performance dashboard.
- A service-desk supervisor view for backlog, channels, and customer sentiment.

## Related views

Ticket navigation is visible, but only the dashboard is captured. Light and dark modes are included.

## Screenshots

[Live view used for capture](https://visactor-next-template.vercel.app/)

Original browser images, without postprocessing. Desktop viewport: 1800 × 948; mobile viewport: 393 × 852. Earlier full-page images include the page’s vertical scroll extent. Viewport images show the complete initial screen; internal scrolling and horizontal overflow are not stitched.

| Image | Theme | Saved dimensions | Mode |
| --- | --- | --- | --- |
| [desktop-light.jpg](desktop-light.jpg) | Light | 1800 × 951 | full-page |
| [desktop.jpg](desktop.jpg) | Dark | 1800 × 948 | viewport |
| [mobile-light.jpg](mobile-light.jpg) | Light | 393 × 1917 | full-page |
| [mobile.jpg](mobile.jpg) | Dark | 393 × 1917 | full-page |

## Capture notes

The dark desktop chart shows a partial bar series compared with the light variant; use the light image for a fuller chart reference. No backend integration was tested.
