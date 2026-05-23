# Design Brief: Hackathon Club Website

## Tone & Aesthetic
Energetic tech-maximalist with editorial precision. Dark-first, vibrant accents, confident geometry. Invites builders to join something real and innovative. **Calendar Extension (समय CODEX)**: Minimalistic glassy interface with blurred backgrounds, event highlighting, and subtle reveal mechanics.

## Color Palette
| Role | OKLCH | Hex | Purpose |
|------|-------|-----|----------|
| Background | 0.10 0 0 | #050a14 | Deep slate primary |
| Primary (Cyan) | 0.70 0.25 200 | #00d9ff | Electric accent, CTAs, event highlights |
| Secondary (Purple) | 0.50 0.27 270 | #7c3aed | Accent highlight, forms |
| Foreground | 0.93 0 0 | #ededed | Text on dark |
| Muted | 0.20 0 0 | #1a1a1a | Cards, surfaces |
| Border | 0.22 0 0 | #222222 | Dividers, inputs |
| Popover (Glassy) | 0.18 0 0 | #252a34 | Semi-transparent base for calendar glass |

## Typography
| Role | Font | Scale | Purpose |
|------|------|-------|----------|
| Display | General Sans | 48–56px | Hero, headings (bold, geometric) |
| Body | DM Sans | 14–16px | Body text, form labels (clean, legible) |
| Mono | Geist Mono | 12–14px | Code, admin dashboard tables |
| Calendar Dates | DM Sans | 12–14px | Date grid, event labels |

## Elevation & Depth
- **Cards**: `card-elevated` shadow, 0.145 background, 1px border
- **Calendar Glass**: `calendar-glass` (popover 0.6 + blur-12, 1px semi-transparent border)
- **Event Tooltip**: `calendar-event-tooltip` (popover 0.7 + blur-16, elevated shadow)
- **Buttons**: No shadow; accent colors carry hierarchy
- **Inputs**: 0.22 background, cyan/purple focus ring

## Structural Zones
| Zone | Treatment | Purpose |
|------|-----------|----------|
| Header | Dark slate border-b, minimal navigation | Orientation |
| Hero | Deep background + cyan geometric element, bold display type | Brand presence, immediate energy |
| Content Sections | Alternating muted cards, generous padding, cyan accents | Information hierarchy |
| Form | Light input surfaces (0.22), labels in body, validation in cyan/purple | Clear, accessible input |
| Admin Dashboard | High-density table, cyan row highlights, mono font | Information scanning |
| Calendar Container | `calendar-glass` background with month grid, event highlights, glassy tooltips | Time-based event discovery |
| Footer | Muted surface with border-t, secondary text | Closure |

## Spacing & Rhythm
- Base: 8px grid
- Card padding: 24px
- Section gaps: 48–64px
- Calendar cell padding: 8–12px
- Tight form field spacing: 12px between groups

## Component Patterns
- **Buttons**: Solid accent colors (no outlines), rounded-lg, scale animation on active
- **Cards**: Elevated shadow, 1px border, hover lift (opacity increase)
- **Forms**: Vertical layout, labels above fields, inline validation
- **Tables**: Striped rows on hover, cyan accent for active/selected rows
- **Calendar Dates**: `calendar-day-event` (accent 0.15 bg, accent 0.3 border, hover brightens to 0.25); dates with events highlighted in cyan
- **Event Tooltips**: `calendar-event-tooltip` (popover glass with blur-16, appears on hover, shows subject + description + time)

## Motion & Interaction
- Transitions: `transition-smooth` (0.3s cubic-bezier)
- Button active state: `scale-95` feedback
- Hover: opacity 90% for interactive elements, `calendar-day-event` lifts color on hover
- Event tooltip appears on hover with smooth fade-in
- No bouncy or frivolous animations

## Constraints
- Max 2 accent colors (cyan + purple)
- No full-page gradients
- Cards always have 1px border
- Inputs always have focused ring state
- Calendar glass always uses backdrop-blur-md or greater
- Event tooltips always blend with background via popover color + blur

## Signature Detail
**Glassy Calendar Aesthetic**: Semi-transparent blurred backgrounds (backdrop-filter: blur) with fine 1px borders define event discovery zones. Cyan accent highlights guide date selection. On hover, event details materialize in a frosted glass card—no jarring overlays, just soft materialization. Blends hacker precision (sharp grid) with fluid glassmorphism.

**Calendar Name**: समय CODEX (Samay CODEX — "Time Codex") — Sanskrit for time/calendars merged with hacker club identity.
