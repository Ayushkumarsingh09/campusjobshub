import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    validated?: {
      body?: unknown;
      query?: unknown;
      params?: unknown;
    };
  }
}
