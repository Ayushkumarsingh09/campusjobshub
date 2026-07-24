import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

export function logError(error: unknown, context?: Record<string, unknown>) {
  if (error instanceof Error) {
    logger.error({ err: error, ...context }, error.message);
  } else {
    logger.error({ error, ...context }, 'Unknown error');
  }
}
