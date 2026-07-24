/**
 * Global AdSense feature flag.
 * Set NEXT_PUBLIC_ENABLE_ADS=true after Google AdSense approval.
 */
export const ENABLE_ADS =
  process.env.NEXT_PUBLIC_ENABLE_ADS === 'true' ||
  process.env.ENABLE_ADS === 'true';
