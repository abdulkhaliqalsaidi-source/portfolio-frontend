# Visual system

## Direction: Qamariyah

The portfolio pairs the calm material quality of limewashed Yemeni architecture with the luminous color of qamariyah stained glass. It should feel crafted and credible for both potential clients and hiring teams, while keeping the developer's work and contact path easy to scan.

### Surface and color

- The dark theme uses deep mineral green-black surfaces, soft mineral text, and restrained patina, periwinkle, and brass accents.
- The light theme uses pale limewash surfaces, dark green ink, and the same patina, periwinkle, and brass accents.
- Shared CSS variables in `app/assets/css/main.css` are the source for portfolio colors. Vuetify's `dark` and `light` palettes in `app/plugins/vuetify.ts` mirror them.
- Cards use quiet borders and soft shadows. Reserve brighter accent colors for actions, small indicators, and selected states.

### Typography and layout

- Cairo and Tajawal serve Arabic body and display text; Urbanist and Inter serve Latin text; JetBrains Mono is reserved for technical labels.
- Preserve RTL and LTR reading order, clear heading hierarchy, generous whitespace, and responsive layouts across public sections.
- Keep prominent contact and project actions visible without competing with the portfolio content.

### Interaction and accessibility

- The theme toggle changes the shared app theme and persists the preference in the `theme` cookie.
- Theme changes reveal the new palette with a circular wipe from the toggle; browsers without the View Transitions API use a temporary, non-interactive snapshot overlay.
- Both theme variants must keep the full application visible, preserve readable contrast, and share the same component structure.
- Use the established reduced-motion and focus-visible behavior; transitions must not cover or hide the page content.

### Constraints

- Preserve routes, API contracts, portfolio content, Arabic and English localization, responsive behavior, and keyboard interaction.
- Keep Vuetify colors aligned with the CSS theme tokens to avoid conflicting surfaces during theme changes.
