/**
 * Centralized asset configuration
 * All asset paths should be referenced from this file to ensure consistency
 */

export const assets = {
  logos: {
    primary: '/cr-logo-new.svg',
    white: '/cr-logo-white.svg',
    // Legacy logos - DO NOT USE
    _deprecated: {
      old: '/copper-logo.svg',
      oldText: '/copper-logo-text.svg',
      oldMain: '/copper-reels-main.svg'
    }
  },
  icons: {
    favicon: '/favicon.ico',
    favicon16: '/favicon-16x16.png',
    favicon32: '/favicon-32x32.png',
    appleTouchIcon: '/apple-touch-icon.png',
    androidChrome192: '/android-chrome-192x192.png',
    androidChrome512: '/android-chrome-512x512.png'
  }
} as const;

// Type-safe asset getter
export function getLogo(variant: 'primary' | 'white' = 'primary'): string {
  return assets.logos[variant];
}