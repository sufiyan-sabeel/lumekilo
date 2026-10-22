/**
 * LumeKilo design system.
 *
 * A single source of truth for colour, spacing, radius, typography and
 * elevation. The visual direction is premium, minimal and mobile-first:
 * AMOLED-black and deep-graphite surfaces, restrained cyan-blue accents,
 * fine borders and quiet elevation.
 *
 * Prefer importing tokens from here over hard-coding hex values so the
 * palette can evolve in one place.
 */

export const palette = {
  /** App canvas — true AMOLED black. */
  background: '#0A0A0B',
  /** Raised card / sheet surface — deep graphite. */
  surface: '#141417',
  /** Secondary surface for inputs, chips and quiet rows. */
  surfaceMuted: '#1B1D21',
  /** Hairline borders and dividers. */
  border: '#26282C',
  borderStrong: '#33363B',

  /** Primary text. */
  ink: '#F2F3F5',
  /** Secondary text. */
  inkSecondary: '#C6CBD3',
  /** Muted / tertiary text. */
  muted: '#8B929C',
  /** Disabled text and placeholder. */
  disabled: '#5B616B',

  /** Primary accent — restrained cyan-blue. */
  blue: '#3AA0FF',
  /** Accent tint used behind icon buttons and chips. */
  blueSurface: '#12293C',
  /** Accent text that sits on a dark surface. */
  blueText: '#7FC4FF',

  /** Feedback colours. */
  danger: '#FF5C7A',
  dangerSurface: '#3A1D25',
  success: '#34C759',
  warning: '#F5B544',
  warningSurface: '#3A2E14',
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 18,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '700', letterSpacing: -0.8 },
  title: { fontSize: 23, fontWeight: '700', letterSpacing: -0.6 },
  heading: { fontSize: 18, fontWeight: '700', letterSpacing: -0.4 },
  body: { fontSize: 15, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 17 },
} as const;

/** Subtle elevation for dark surfaces — light shadows read poorly on black. */
export const elevation = {
  card: {
    borderWidth: 1,
    borderColor: palette.border,
  },
  sheet: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
} as const;

export const theme = { palette, radius, spacing, typography, elevation } as const;
export default theme;
