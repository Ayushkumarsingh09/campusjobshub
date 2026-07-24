import { Request, Response, NextFunction } from 'express';

import { ZodSchema } from 'zod';



type RequestTarget = 'body' | 'query' | 'params';



/** Express 5 query/params are getter-only; store coerced values on req.validated. */

function storeValidated(req: Request, target: RequestTarget, data: unknown) {

  if (!req.validated) req.validated = {};

  req.validated[target] = data;



  if (target === 'body') {

    req.body = data;

    return;

  }



  // Allow existing handlers to keep reading req.query / req.params with coerced types.

  Object.defineProperty(req, target, {

    value: data,

    writable: true,

    configurable: true,

    enumerable: true,

  });

}



export function validate(schema: ZodSchema, target: RequestTarget = 'body') {

  return (req: Request, _res: Response, next: NextFunction) => {

    const result = schema.safeParse(req[target]);

    if (!result.success) {

      return next(result.error);

    }

    storeValidated(req, target, result.data);

    next();

  };

}


