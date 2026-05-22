# Design Brief: Hackathon Club Website

## Tone & Aesthetic
Energetic tech-maximalist with editorial precision. Dark-first, vibrant accents, confident geometry. Invites builders to join something real and innovative.

## Color Palette
| Role | OKLCH | Hex | Purpose |
|------|-------|-----|---------|
| Background | 0.10 0 0 | #050a14 | Deep slate primary |
| Primary (Cyan) | 0.70 0.25 200 | #00d9ff | Electric accent, CTAs |
| Secondary (Purple) | 0.50 0.27 270 | #7c3aed | Accent highlight, forms |
| Foreground | 0.93 0 0 | #ededed | Text on dark |
| Muted | 0.20 0 0 | #1a1a1a | Cards, surfaces |
| Border | 0.22 0 0 | #222222 | Dividers, inputs |

## Typography
| Role | Font | Scale | Purpose |
|------|------|-------|---------|
| Display | General Sans | 48–56px | Hero, headings (bold, geometric) |
| Body | DM Sans | 14–16px | Body text, form labels (clean, legible) |
| Mono | Geist Mono | 12–14px | Code, admin dashboard tables |

## Elevation & Depth
- **Cards**: `card-elevated` shadow, 0.145 background, 1px border
- **Buttons**: No shadow; accent colors carry hierarchy
- **Inputs**: 0.22 background, cyan/purple focus ring
- **Hero**: Deep background with geometric cyan stripe accent

## Structural Zones
| Zone | Treatment | Purpose |
|------|-----------|---------|
| Header | Dark slate border-b, minimal navigation | Orientation |
| Hero | Deep background + cyan geometric element, bold display type | Brand presence, immediate energy |
| Content Sections | Alternating muted cards, generous padding, cyan accents | Information hierarchy |
| Form | Light input surfaces (0.22), labels in body, validation in cyan/purple | Clear, accessible input |
| Admin Dashboard | High-density table, cyan row highlights, mono font | Information scanning |
| Footer | Muted surface with border-t, secondary text | Closure |

## Spacing & Rhythm
- Base: 8px grid
- Card padding: 24px
- Section gaps: 48–64px
- Tight form field spacing: 12px between groups

## Component Patterns
- **Buttons**: Solid accent colors (no outlines), rounded-lg, scale animation on active
- **Cards**: Elevated shadow, 1px border, hover lift (opacity increase)
- **Forms**: Vertical layout, labels above fields, inline validation
- **Tables**: Striped rows on hover, cyan accent for active/selected rows

## Motion & Interaction
- Transitions: `transition-smooth` (0.3s cubic-bezier)
- Button active state: `scale-95` feedback
- Hover: opacity 90% for interactive elements
- No bouncy or frivolous animations

## Constraints
- Max 2 accent colors (cyan + purple)
- No full-page gradients
- Cards always have 1px border
- Inputs always have focused ring state

## Signature Detail
**Accent Stripe**: Geometric cyan accent element in hero section—sharp angle or vertical stripe that frames the CTA. Communicates tech-forward energy without distraction.
