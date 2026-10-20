# Avela - Grok 4.7

An editorial shop for three leather shapes: Arc, Fold, and Day.

This prototype is saved in WDA under `prototypes/Avela - Grok 4.7`, from the Avela project served at `http://127.0.0.1:5194/`.

Arc is the burgundy crescent, **$420**, **30 × 22 × 10 cm**. Fold is the camel flap. Day is the olive tote. Photographs were cropped from the reference grid. Page copy is written in the clear; the source image’s garbled captions are not used as interface text.

## Setup

```bash
cd "prototypes/Avela - Grok 4.7"
npm ci
npm run dev
```

Run these commands from the WDA repository root. If your terminal is already in this prototype's folder, skip the `cd` command.

The dev server binds to [http://127.0.0.1:5194](http://127.0.0.1:5194).

## Production

```bash
npm run build
npm run preview
```

Preview uses the same address. The port is fixed so it will not attach to another local server.

Stop the existing server before starting dev or preview on port 5194. The production output is written to `dist/`; dependencies and build output are ignored by Git. A production host must serve `index.html` for application routes such as `/collection` and `/arc`.

## What works

- Home, Collection, Arc, Our Story, and Care
- Collection filters for Arc, Fold, and Day
- Product galleries
- A shopping bag saved in this browser, with quantity controls and line totals
- Care accordions
- A mobile menu

Checkout and the newsletter form are labeled **Demo**. They do not take payment or send mail.
