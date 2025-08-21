/**
 * Domain configuration for separating marketing and app
 */

export const domains = {
  marketing: {
    production: 'copperreels.com',
    dev: 'dev.copperreels.com'
  },
  app: {
    production: 'app.copperreels.com',
    dev: 'app.dev.copperreels.com'
  }
};

/**
 * Check if we're on the app subdomain
 */
export function isAppDomain(): boolean {
  const hostname = window.location.hostname;
  return hostname.includes('app.');
}

/**
 * Check if we're on the marketing domain
 */
export function isMarketingDomain(): boolean {
  return !isAppDomain();
}

/**
 * Get the appropriate domain based on environment
 */
export function getAppDomain(): string {
  const isDev = window.location.hostname.includes('dev.');
  return isDev ? domains.app.dev : domains.app.production;
}

/**
 * Get the appropriate marketing domain based on environment
 */
export function getMarketingDomain(): string {
  const isDev = window.location.hostname.includes('dev.');
  return isDev ? domains.marketing.dev : domains.marketing.production;
}

/**
 * Redirect to app domain if on marketing domain and logged in
 */
export function redirectToApp(): void {
  if (isMarketingDomain()) {
    window.location.href = `https://${getAppDomain()}/chat`;
  }
}

/**
 * Redirect to marketing domain if on app domain and not logged in
 */
export function redirectToMarketing(): void {
  if (isAppDomain()) {
    window.location.href = `https://${getMarketingDomain()}`;
  }
}