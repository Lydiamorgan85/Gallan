/**
 * Visual theme for Gallan.
 *
 * A single source of truth for colour, spacing and type, so the look is
 * consistent across screens and can be adjusted in one place. The palette is
 * drawn from Ireland's landscape and heritage traditions: deep heritage green,
 * peat, stone and aran cream, chosen to suit ancient sacred sites and to sit
 * comfortably alongside Irish tourism visual language without copying any
 * trademarked identity.
 */

// Core palette. Names describe the role, not the raw colour, so screens read
// clearly and a shade can be changed here without hunting through the app.
export const colors = {
  // Deep heritage green: the primary brand colour, used for headers and accents.
  primary: "#1f5c3d",
  // A lighter pasture green for secondary highlights.
  primaryLight: "#7c9a4c",
  // Warm aran cream: the main background, soft and paper-like.
  background: "#f4efe3",
  // Slightly lighter cream for cards, to lift them off the background.
  surface: "#fbf8f0",
  // Peat brown: primary text, warmer and softer than black.
  text: "#3a2e22",
  // Muted stone for secondary text and metadata.
  textMuted: "#7d7361",
  // Connemara marble green-grey for subtle borders.
  border: "#d8d0bd",
  // A restrained gold for the save marker and small accents.
  accent: "#b8892b",
  // White, for text sitting on the deep green.
  onPrimary: "#ffffff",
} as const;

// Consistent spacing steps, so gaps and padding stay in proportion across the
// app rather than being picked ad hoc per screen.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// Shared type sizes, from small metadata up to screen titles.
export const typography = {
  title: 28,
  heading: 20,
  body: 16,
  small: 13,
} as const;

// A standard corner radius for cards and buttons, for a soft, consistent feel.
export const radius = 14;
