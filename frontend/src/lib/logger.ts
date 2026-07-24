type LogLevel = 'info' | 'warn' | 'error';

const PREFIX = '[CampusJobsHub]';

function isDev(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function formatMessage(level: LogLevel, message: string, context?: unknown): unknown[] {
  const parts: unknown[] = [`${PREFIX} [${level.toUpperCase()}]`, message];
  if (context !== undefined) {
    parts.push(context);
  }
  return parts;
}

function log(level: LogLevel, message: string, context?: unknown): void {
  if (typeof window === 'undefined' && level === 'info' && !isDev()) {
    return;
  }

  const args = formatMessage(level, message, context);

  switch (level) {
    case 'info':
      console.info(...args);
      break;
    case 'warn':
      console.warn(...args);
      break;
    case 'error':
      console.error(...args);
      break;
  }
}

export const logger = {
  info(message: string, context?: unknown): void {
    log('info', message, context);
  },
  warn(message: string, context?: unknown): void {
    log('warn', message, context);
  },
  error(message: string, context?: unknown): void {
    log('error', message, context);
  },
};
