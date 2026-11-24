# Destination pages

## Overview

Destination detail pages are served from the dynamic App Router route:

```text
app/destinations/[country]/[slug]/page.jsx
```

The route reads the destination matching `countrySlug` and `slug` from `data/destinations.json`. `generateStaticParams()` creates a static page for every record in that file.

Examples:

```text
/destinations/france/paris
/destinations/france/normandy
/destinations/argentina/mendoza
```

## Shared destination data

Every destination record has the original content model used by the standard destination page:

- `banner`: hero image and alt text.
- `quote` and `extract`: introductory copy.
- `whyToGo`: destination reasons and highlights.
- `presentation`: editorial introduction.
- `ourStay`: accommodation section.
- `tours`: curated activities.
- `experiences`: final experiential section.
- `seo` and `geo`: metadata and geographic/FAQ content.

This data remains the source for the 16 destinations that still use the original page design.

## Standard destination design

When a destination has no special `proposal` format, `page.jsx` creates a journey page from the standard fields above.

It uses these components/sections:

- `HeaderFullScreen2`: global site menu.
- `DestinationNavigation`: sticky navigation for detail-page anchors.
- `JourneyHero`, `AtAGlance`, `JourneyIndex`, `JourneyDay` and `Stay`: page sections defined in `page.jsx`.
- `FooterSecondary`: global site footer.

The visual styles live in `app/globals.css`, primarily under the `Journey proposal` and existing `Destination detail` sections.

## Paris PDF itinerary design

Paris is currently the only destination with a special proposal format:

```json
"proposal": {
  "format": "itinerary"
}
```

When `page.jsx` finds this format, it renders `ProposalReplica` instead of the standard journey page. This branch preserves the existing site header, sticky section navigation and footer, but uses the editorial structure and exact supplied content from the Paris proposal PDF.

The Paris proposal order is:

1. Blue cover.
2. Curators.
3. At a Glance.
4. The Journey / Day by Day overview.
5. One section for each itinerary day.
6. The global site footer.

The sticky navigation provides anchors for the introduction, curators, at-a-glance summary, journey overview and Days 01–05.

### Paris proposal data

All Paris-specific proposal content is stored inside the Paris record in `data/destinations.json`:

- `proposal.cover`
- `proposal.curators`
- `proposal.atAGlance`
- `proposal.overview`
- `proposal.days`

The itinerary uses the PDF’s supplied headings, descriptions, times and `To be confirmed` accommodation states. It does not reuse or invent copy from the former destination page sections.

### Paris images

The rendered assets are located in:

```text
public/images/destinations/paris-proposal/
```

Each day references its corresponding image through `proposal.days[].image`. The image panel preserves image proportions and crops overflow rather than stretching the source image. A translucent, blurred bottom band is used behind image labels for legibility.

## Why only Paris uses this design

The Paris proposal is a faithful implementation of one supplied, five-day PDF itinerary. The other destination records do not yet have equivalent approved itineraries, exact day counts, times, descriptions or imagery.

Keeping the other 16 destinations on the standard design avoids inventing itinerary content. Once a destination has its own approved proposal, add a `proposal` object with `format: "itinerary"` to that destination’s JSON record. The same `ProposalReplica` component will then render the shared PDF-style structure, using that destination’s own number of days and content.

## Main files

| File | Responsibility |
| --- | --- |
| `data/destinations.json` | All destination content; Paris also contains the approved itinerary proposal. |
| `app/destinations/[country]/[slug]/page.jsx` | Selects the standard or itinerary renderer and contains the proposal sections. |
| `app/components/destinations/DestinationNavigation.jsx` | Reusable sticky section navigation. Supports default links or custom `items`. |
| `app/components/full-screen-header2.jsx` | Global expandable site menu. |
| `app/components/home2/footer-secondary.jsx` | Global site footer. |
| `app/globals.css` | Standard destination and Paris itinerary styles, responsive rules and image treatment. |

## Adding the PDF-style design to another destination

1. Gather an approved itinerary with exact source copy, day count, times, accommodation status and images.
2. Add a `proposal` object to that destination’s record in `data/destinations.json`.
3. Set `proposal.format` to `itinerary`.
4. Populate `cover`, `curators`, `atAGlance`, `overview` and `days` using the supplied content only.
5. Add images to `public/images/destinations/<slug>-proposal/` and reference them from each day.
6. Test the destination route at desktop and mobile widths, including the sticky navigation anchors.
