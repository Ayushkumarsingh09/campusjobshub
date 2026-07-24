const REQUIRED_PROD = ['DATABASE_URL', 'DIRECT_URL', 'AUTH_SECRET', 'FRONTEND_URL'] as const;

const INSECURE_SECRETS = new Set([
  'dev-secret-change-in-production',
  'generate-a-32-char-random-secret-here',
  'local-dev-auth-secret-min-32-chars-long',
]);

export function validateEnvironment(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const missing = REQUIRED_PROD.filter((key) => !process.env[key]?.trim());

  if (isProd && missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const secret = process.env.AUTH_SECRET?.trim();
  if (isProd && secret && INSECURE_SECRETS.has(secret)) {
    throw new Error('AUTH_SECRET must be a unique random value in production');
  }

  if (isProd && secret && secret.length < 32) {
    throw new Error('AUTH_SECRET must be at least 32 characters in production');
  }
}
