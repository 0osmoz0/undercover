/** Palette alignée sur le logo Club Nix Undercover : noir · blanc · rouge. */
export const Palette = {
  bgTop: '#000000',
  bgMid: '#070707',
  bgBottom: '#141414',
  surface: '#111111',
  surfaceRaised: '#1C1C1C',
  border: '#2A2A2A',
  hairline: 'rgba(255, 255, 255, 0.08)',
  accent: '#A82424',
  accentPressed: '#8A1D1D',
  accentSoft: 'rgba(168, 36, 36, 0.14)',
  accentLine: 'rgba(168, 36, 36, 0.45)',
  onAccent: '#FFFFFF',
  text: '#FFFFFF',
  textMuted: '#A8A8A8',
  textFaint: '#6E6E6E',
  danger: '#A82424',
  success: '#C8C8C8',
  mrWhite: '#F0F0F0',
} as const;

export const Space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  xs: 3,
  sm: 6,
  md: 10,
  lg: 14,
} as const;

export const Type = {
  hero: 88,
  display: 64,
  title: 44,
  secret: 76,
  heading: 26,
  body: 17,
  small: 14,
  label: 11,
} as const;
