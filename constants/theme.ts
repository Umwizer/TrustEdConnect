/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * TrustEDConnect brand palette.
 *
 * This is separate from `Colors` (light/dark) above on purpose:
 * `Colors` drives system UI chrome (tab bar, default text/background)
 * that should respect the device's light/dark setting. `Brand` is our
 * fixed marketing/product palette (navy + gold + green) used on the
 * landing page, dashboards, and role-based screens — it does NOT
 * change with light/dark mode, the same way a logo doesn't.
 *
 * Import it as: `import { Brand } from '@/constants/theme';`
 */
export const Brand = {
  navyDeep: '#0A1442',
  navyPanel: '#122156',
  navyHeader: '#33456E',
  navyCard: '#1A2A5E',
  navyRail: '#0F1B4D',

  green: '#22C55E',
  greenLight: '#4ADE80',
  gold: '#F5B942',
  amber: '#F59E0B',
  danger: '#EF4444',

  white: '#FFFFFF',
  offWhite: '#E7ECFB',
  muted: '#A9B4D6',

  bg: '#F4F6FB',
  card: '#FFFFFF',
  text: '#1E2340',
  border: '#E5E8F2',
};