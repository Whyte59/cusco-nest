# Cusco Nest — Bilingual Landing Page

Portfolio piece: a static, responsive landing page for a serviced-apartment listing in Cusco, Peru.

- **Default language:** Spanish (`/`)
- **Secondary language:** English (`/en.html`)
- Language switcher in the header and in the mobile menu
- Plain HTML, CSS and vanilla JavaScript — no build step, no dependencies

## Live demo

<!-- Add the Vercel URL here after the first deploy -->
- https://your-project.vercel.app

## Structure

```
index.html            Spanish page (default)
en.html               English page
assets/css/styles.css
assets/js/main.js
assets/img/           Photography
```

## Features

- Responsive layout from 320 px to 1280 px and beyond
- Mobile menu, photo lightbox with keyboard support, FAQ accordion
- Booking form that builds a pre-filled WhatsApp message
- Language-aware formatting (dates, decimals, WhatsApp copy)
- Semantic HTML, JSON-LD `LodgingBusiness` schema, `hreflang`, Open Graph
- Lighthouse 100 for Accessibility, Best Practices and SEO on both pages

## Notes

- Rates show `PEN 224` for the Apartment only; the other units say "check availability" — no invented prices.
- Rating, address, phone number and check-in/check-out times follow the public Agoda listing.
- Built as a portfolio/demo piece; not affiliated with the booking platform.

## Deploy

Hosted on Vercel as a static site. Framework preset: **Other**, no build command, no output directory.
