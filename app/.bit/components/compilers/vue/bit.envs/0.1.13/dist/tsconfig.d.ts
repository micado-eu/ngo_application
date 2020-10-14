export declare const TSConfig: {
    compilerOptions: {
        target: string;
        module: string;
        strict: boolean;
        jsx: string;
        importHelpers: boolean;
        moduleResolution: string;
        experimentalDecorators: boolean;
        esModuleInterop: boolean;
        allowSyntheticDefaultImports: boolean;
        allowJs: boolean;
        sourceMap: boolean;
        baseUrl: string;
        types: string[];
        paths: {
            '@/*': string[];
            '~/*': string[];
        };
        lib: string[];
    };
    exclude: string[];
};
