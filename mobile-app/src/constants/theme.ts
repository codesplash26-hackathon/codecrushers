export const LIGHT_COLORS = {
  // Brand Blues
  primary: '#1D64EC',
  primaryDark: '#0B3E9E',
  primaryDeep: '#071F5C',
  primaryLight: '#3D84F5',
  primarySoft: '#EBF3FE',

  // Transit Modes
  bus: '#2563EB',
  busLight: '#E0EDFE',
  train: '#16A34A',
  trainLight: '#DCFCE7',
  tuk: '#DB2777',
  tukLight: '#FCE7F3',
  taxi: '#00C48C',
  walk: '#10B981',

  // UI Accents & Badges
  fastest: '#1D64EC',
  fastestLight: '#DBEAFE',
  cheapest: '#0D9488',
  cheapestLight: '#CCFBF1',
  reliable: '#7C3AED',
  reliableLight: '#F3E8FF',

  // Alert & Disruption States
  alertBg: '#FEF9C3',
  alertBorder: '#F59E0B',
  alertText: '#B45309',
  alertSubtext: '#92400E',

  successBg: '#DCFCE7',
  successBorder: '#10B981',
  successText: '#047857',
  successSubtext: '#065F46',

  // Backgrounds & Neutrals
  white: '#FFFFFF',
  bgLightBlue: '#F0F6FF',
  bgLightMint: '#EDFAF3',
  bgLightPeach: '#FFF8F1',
  textDark: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  borderLight: '#E2E8F0',

  // Extended Semantic Design Tokens
  screenBg: '#F8FAFC',
  cardBg: '#FFFFFF',
  cardSecondaryBg: '#F1F5F9',
  subtleBg: '#F1F5F9',
  cardBorder: '#E2E8F0',
  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  textPrimary: '#0F172A',
  bottomNavBg: '#FFFFFF',
  bottomNavBorder: '#E2E8F0',
  headerBg: '#FFFFFF',
  modalBg: '#FFFFFF',
  statNumberColor: '#0F172A',
  iconButtonBg: 'rgba(255, 255, 255, 0.22)',
  iconButtonBorder: 'rgba(255, 255, 255, 0.3)',
};

export const DARK_COLORS: typeof LIGHT_COLORS = {
  // Brand Blues
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryDeep: '#0F172A',
  primaryLight: '#60A5FA',
  primarySoft: '#1E293B',

  // Transit Modes
  bus: '#3B82F6',
  busLight: '#1E3A8A55',
  train: '#22C55E',
  trainLight: '#14532D55',
  tuk: '#F43F5E',
  tukLight: '#88133755',
  taxi: '#10B981',
  walk: '#34D399',

  // UI Accents & Badges
  fastest: '#60A5FA',
  fastestLight: '#1E3A8A60',
  cheapest: '#2DD4BF',
  cheapestLight: '#134E4A60',
  reliable: '#A78BFA',
  reliableLight: '#4C1D9560',

  // Alert & Disruption States
  alertBg: '#42200699',
  alertBorder: '#F59E0B',
  alertText: '#FDE047',
  alertSubtext: '#FCD34D',

  successBg: '#052E1699',
  successBorder: '#10B981',
  successText: '#4ADE80',
  successSubtext: '#86EFAC',

  // Backgrounds & Neutrals
  white: '#131A29',
  bgLightBlue: '#0E1726',
  bgLightMint: '#0A1C16',
  bgLightPeach: '#20150F',
  textDark: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  borderLight: '#222F46',

  // Extended Semantic Design Tokens
  screenBg: '#090D16',
  cardBg: '#131A29',
  cardSecondaryBg: '#1A2336',
  subtleBg: '#1A2336',
  cardBorder: '#222F46',
  inputBg: '#101623',
  inputBorder: '#26344B',
  textPrimary: '#F8FAFC',
  bottomNavBg: '#0E1524',
  bottomNavBorder: '#1A2336',
  headerBg: '#090D16',
  modalBg: '#131A29',
  statNumberColor: '#F8FAFC',
  iconButtonBg: 'rgba(255, 255, 255, 0.12)',
  iconButtonBorder: 'rgba(255, 255, 255, 0.2)',
};

export type ThemeColors = typeof LIGHT_COLORS;

// Default COLORS for backward compatibility
export const COLORS = LIGHT_COLORS;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export default {
  LIGHT_COLORS,
  DARK_COLORS,
  COLORS,
  FONTS,
  SPACING,
};
