import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';
import { Shield, ShieldOptions } from './Shield';

export interface ExpressShieldOptions extends ShieldOptions {
  errorHandler ? : ErrorRequestHandler;
}

const defaultOptions: ExpressShieldOptions = {
  mongo: true,
  proto: true,
  errorHandler: (_err: any, _req: Request, res: Response) => res.sendStatus(403),
};

export default function ExpressShield(options ? : ExpressShieldOptions): RequestHandler {
  const opts = {
    ...defaultOptions,
    ...options,
  };
  return (req: Request, res: Response, next: NextFunction): any => {
    Shield.evaluate(req.query, opts, (queryErr) => {
      if (queryErr) {
        opts.errorHandler!(queryErr, req, res, next);
        return;
      }
      Shield.evaluate(req.body, opts, (bodyErr) => {
        if (bodyErr) {
          opts.errorHandler!(bodyErr, req, res, next);
          return;
        }
        Shield.evaluate(req.params, opts, (paramsErr) => {
          if (paramsErr) {
            opts.errorHandler!(paramsErr, req, res, next);
            return;
          }
          next();
        });
      });
    });
  };
}
