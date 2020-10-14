import { IsolateOptions } from './types';
export declare function getCapsuleName(infix?: string): string;
export declare function createCapsule(isolate: (isolateOptions: IsolateOptions) => any, isolateOptions?: Record<string, any>, capsulePath?: string): Promise<{
    res: any;
    directory: string;
}>;
export declare function destroyCapsule(capsule: any): Promise<void>;
