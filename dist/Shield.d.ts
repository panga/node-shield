import ShieldError from './ShieldError';
export interface ShieldOptions {
    mongo?: boolean;
    proto?: boolean;
}
export declare class Shield {
    private static traverse;
    static evaluate(obj: any, opts: ShieldOptions, callback: (err?: ShieldError) => void): void;
    static evaluateAsync(obj: any, opts: ShieldOptions): Promise<void>;
}
