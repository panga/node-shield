import { RequestHandler, ErrorRequestHandler } from 'express';
import { ShieldOptions } from './Shield';
export interface ExpressShieldOptions extends ShieldOptions {
    errorHandler?: ErrorRequestHandler;
}
export default function ExpressShield(options?: ExpressShieldOptions): RequestHandler;
