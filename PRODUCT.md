# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clients evaluating development and consulting services, and hiring teams evaluating the developer's experience and work.

## Product Purpose

Present Abdulkhaliq Al-Saidi's professional profile, skills, services, projects, and career history so visitors can assess fit and contact him.

## Positioning

No distinct market position has been established in the supplied product material.

## Operating Context

Visitors browse the portfolio on desktop or mobile, in Arabic (right-to-left) or English (left-to-right), and may switch between light and dark themes.

## Capabilities and Constraints

- Public profile, statistics, skills, services, projects, testimonials, timeline, blog, and contact form are backed by a Django API.
- Preserve existing routes, API contracts, Arabic and English content, RTL/LTR behavior, and responsive layouts.
- Frontend uses Nuxt 4 and Vuetify 3; backend uses Django REST Framework.
- Light and dark themes must both keep all page content visible and legible.

## Evidence on Hand

- Current portfolio data: `../backend/portfolio_data.json` and the local Django API.
- Profile image, hero image, and CV files are in `public/`.
- Existing portfolio pages and components are the source for current content and workflows.

## Product Principles

- Help visitors assess experience and work quickly.
- Make the path to contact easy to find.
- Keep the experience usable in either language, direction, and theme.
