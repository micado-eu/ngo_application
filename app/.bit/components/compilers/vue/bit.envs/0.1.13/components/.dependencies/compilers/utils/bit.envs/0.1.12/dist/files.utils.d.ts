import Vinyl from 'vinyl';
export declare function isTestFile(dir: string): boolean;
export declare function getSourceFiles(sources: Vinyl[], extensions?: string[]): Vinyl[];
export declare function getTestFiles(sources: Vinyl[], extensions?: string[]): Vinyl[];
export declare function readFiles(dir: string): Promise<Vinyl[] | undefined>;
