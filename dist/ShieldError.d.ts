export default class ShieldError extends Error {
    code: string;
    payload: any;
    constructor(message: string, code: string, payload: any);
}
