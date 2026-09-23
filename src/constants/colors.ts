/** Palette alignée sur le logo ESIEE Undercover : noir · blanc · rouge. */
export const Palette = {
  bgTop: '#000000',
  bgBottom: '#121212',
  surface: '#161616',
  surfaceRaised: '#222222',
  border: '#333333',
  accent: '#E30613',
  accentPressed: '#B80510',
  onAccent: '#FFFFFF',
  text: '#FFFFFF',
  textMuted: '#A8A8A8',
  textFaint: '#666666',
  danger: '#E30613',
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
  sm: 6,
  md: 10,
  lg: 14,
} as const;

export const Type = {
  display: 44,
  title: 32,
  secret: 52,
  heading: 22,
  body: 17,
  small: 14,
  label: 12,
} as const;
