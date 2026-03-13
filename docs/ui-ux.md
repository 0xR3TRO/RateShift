# UI/UX Design Principles

## Design Philosophy

RateShift follows a **clean, modern, and minimal** design philosophy. Every visual decision is guided by three principles:

1. **Usability first** -- the interface should be immediately intuitive. Users should be able to convert a currency within seconds of landing on the page, without instructions.
2. **Mobile-first responsive** -- layouts are designed for small screens first and progressively enhanced for larger viewports.
3. **Visual clarity** -- generous whitespace, consistent spacing, and restrained use of color ensure the interface is easy to scan and pleasant to use.

## Color Palette

### Primary

| Token              | Hex       | Usage                                           |
| ------------------ | --------- | ----------------------------------------------- |
| Primary            | `#2563eb` | Buttons, links, active indicators, focus rings. |
| Primary Light      | `#3b82f6` | Hover states, secondary accents.                |
| Primary Dark       | `#1d4ed8` | Active/pressed states.                          |
| Primary Background | `#eff6ff` | Subtle highlight areas (light theme).           |

### Semantic

| Token   | Hex       | Usage                                        |
| ------- | --------- | -------------------------------------------- |
| Success | `#10b981` | Positive trend indicators, success messages. |
| Error   | `#ef4444` | Error banners, validation messages.          |
| Warning | `#f59e0b` | Caution indicators, rate limit warnings.     |

### Neutrals

| Token          | Hex (Light) | Hex (Dark) | Usage                        |
| -------------- | ----------- | ---------- | ---------------------------- |
| Background     | `#f8fafc`   | `#0f172a`  | Page background.             |
| Surface        | `#ffffff`   | `#1e293b`  | Cards, panels, modals.       |
| Text           | `#1e293b`   | `#e2e8f0`  | Body text.                   |
| Heading        | `#0f172a`   | `#f1f5f9`  | Headings and titles.         |
| Text Secondary | `#475569`   | `#94a3b8`  | Labels, captions.            |
| Text Muted     | `#94a3b8`   | `#64748b`  | Placeholders, disabled text. |
| Border         | `#e2e8f0`   | `#334155`  | Dividers, input borders.     |

## Typography

### Font Family

```
'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
Roboto, 'Helvetica Neue', Arial, sans-serif
```

Inter is the primary typeface, chosen for its excellent legibility at all sizes and its clean, modern appearance. The fallback stack ensures a visually similar experience on systems where Inter is not available.

### Type Scale

| Element         | Size              | Weight | Line Height |
| --------------- | ----------------- | ------ | ----------- |
| H1              | `2rem` (32px)     | 600    | 1.25        |
| H2              | `1.5rem` (24px)   | 600    | 1.25        |
| H3              | `1.25rem` (20px)  | 600    | 1.25        |
| Body            | `1rem` (16px)     | 400    | 1.6         |
| Small / Caption | `0.875rem` (14px) | 400    | 1.5         |

On mobile viewports (below 480px), the base font size scales down to 14px to provide more comfortable content density on smaller screens.

## Layout

### Card-Based Components

All primary UI sections (converter, history, trend chart) are presented as cards:

- **Border radius:** `12px` (`--radius-lg`)
- **Shadow:** Medium elevation (`--shadow-md`)
- **Background:** Surface color (`--color-surface`)
- **Border:** 1px solid `--color-border`

### Spacing System

The spacing scale follows an 8px grid system defined as CSS custom properties:

| Token         | Value     | Pixels |
| ------------- | --------- | ------ |
| `--space-xs`  | `0.25rem` | 4px    |
| `--space-sm`  | `0.5rem`  | 8px    |
| `--space-md`  | `1rem`    | 16px   |
| `--space-lg`  | `1.5rem`  | 24px   |
| `--space-xl`  | `2rem`    | 32px   |
| `--space-2xl` | `3rem`    | 48px   |

### Container

The main content area is centered with a maximum width of `1200px` (`--max-width-xl`) and horizontal padding for breathing room on smaller screens.

## Responsive Breakpoints

| Breakpoint | Width    | Target        |
| ---------- | -------- | ------------- |
| xs         | `480px`  | Mobile phones |
| sm         | `640px`  | Small tablets |
| md         | `768px`  | Tablets       |
| lg         | `1024px` | Desktops      |
| xl         | `1200px` | Wide desktops |

### Responsive Behavior

- **Below 480px:** Elements stack vertically. Font size reduces to 14px. Full-width cards with minimal horizontal padding.
- **480px -- 768px:** Currency selectors may sit side-by-side. Cards gain more padding.
- **768px -- 1024px:** Two-column layouts where appropriate. Sidebar elements become visible.
- **Above 1024px:** Full desktop layout. Maximum content width enforced. Generous whitespace.

## Dark Mode

RateShift provides a full dark theme controlled by a `data-theme="dark"` attribute on the root element.

### Dark Theme Characteristics

- **Background:** Deep navy (`#0f172a`) with slate surface layers (`#1e293b`, `#334155`).
- **Text:** Light gray (`#e2e8f0`) on dark backgrounds for comfortable reading.
- **Contrast:** All text-background combinations meet **WCAG AA** contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text).
- **Semantic colors:** Slightly adjusted for visibility on dark backgrounds (e.g., success green becomes `#34d399`, error red becomes `#f87171`).
- **Shadows:** Deeper and more subtle to avoid a washed-out appearance.

### Theme Switching

- Theme preference is stored in `localStorage` and applied on page load.
- A toggle button in the Navbar allows manual switching.
- The transition between themes uses a `0.35s ease` animation for a smooth visual change.

## Accessibility

### ARIA Labels

- All interactive elements (buttons, inputs, selectors) include descriptive `aria-label` or `aria-labelledby` attributes.
- Currency selectors have labels that communicate both the role and the current selection.

### Keyboard Navigation

- Custom selectors and dropdowns are fully navigable via keyboard (Tab, Enter, Escape, Arrow keys).
- Focus trapping within modal-like components prevents users from tabbing into hidden content.

### Focus Indicators

- All focusable elements display a visible focus ring: `2px solid var(--color-primary)` with a `2px` offset.
- The `:focus-visible` pseudo-class ensures focus rings appear only for keyboard navigation, not mouse clicks.

### Screen Reader Support

- Loading states announce via `aria-live="polite"` regions.
- Error messages are surfaced to screen readers immediately.
- Empty states (e.g., no conversion history) include descriptive text rather than blank areas.

### Color Independence

- Trend direction (up/down) is communicated through both color and iconography, ensuring colorblind users can interpret the data.
- Error states include text descriptions alongside the red color indicator.

## Interactions

### Transitions

| Interaction         | Duration | Easing |
| ------------------- | -------- | ------ |
| Hover effects       | `0.15s`  | ease   |
| General transitions | `0.2s`   | ease   |
| Theme switch        | `0.35s`  | ease   |
| Page transitions    | `0.3s`   | ease   |

### Hover and Active States

- **Cards:** Subtle upward lift on hover (increased shadow elevation).
- **Buttons:** Background color shift on hover; slight scale reduction on active press.
- **Links:** Color transitions smoothly to primary dark.
- **Inputs:** Border color changes to primary on focus.

### Debounced Input

The amount input field uses a debounce mechanism (typically 300--500ms) to prevent firing an API call on every keystroke. The conversion triggers only after the user pauses typing, providing a responsive feel without excessive server load.

## Loading and Error States

### Loading

- A spinner (CSS animation) is displayed during async operations such as fetching rates or converting currencies.
- Interactive elements are disabled while loading to prevent duplicate submissions.
- A brief skeleton or shimmer effect may appear in place of content that is still loading.

### Errors

- **Error banners** appear prominently below the affected section with a clear, human-readable message.
- Banners are **dismissible** via a close button.
- Error messages use the semantic error color (`--color-error`) with a light error background (`--color-error-bg`) for visual distinction without being alarming.

### Empty States

- When no conversion history exists, the history section displays a friendly message encouraging the user to perform their first conversion.
- Empty states include descriptive text and are not left blank, ensuring clarity for all users.
