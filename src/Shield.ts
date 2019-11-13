import ShieldError from './ShieldError';
import Utils from './Utils';

export interface ShieldOptions {
  mongo?: boolean;
  proto?: boolean;
}

export class Shield {
  private static traverse(obj: any, opts: ShieldOptions): ShieldError | undefined {
    let error;
    Object.keys(obj).some((k) => {
      if (opts.mongo && Utils.isString(k) && k.indexOf('$') === 0) {
        error = new ShieldError('Mongo $ injection found', 'mongo_error', obj);
        return true;
      }
      if (Utils.isPlainObject(obj[k])) {
        if (opts.proto && (k === '__proto__' || k === 'constructor')) {
          error = new ShieldError('Prototype pollution found', 'proto_error', obj);
          return true;
        }
        error = this.traverse(obj[k], opts);
        if (error) {
          return true;
        }
      }
      return false;
    });
    return error;
  }

  static evaluate(obj: any, opts: ShieldOptions, callback: (err?: ShieldError) => void) {
    callback(this.traverse(obj, opts));
  }

  static evaluateAsync(obj: any, opts: ShieldOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const error = this.traverse(obj, opts);
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  }
}
