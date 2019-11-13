export default class ShieldError extends Error {
  code: string;

  payload: any;

  constructor(message: string, code: string, payload: any) {
    super(message);
    this.code = code;
    this.payload = payload;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
