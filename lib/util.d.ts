export declare function isDirectory(dir: string): Promise<boolean>;
export declare function isFile(filepath: string): Promise<boolean>;
declare type ReadLineOptions = {
    targetFile: string;
    destFile: string;
    replacer?: (line: string) => string;
};
/** 复制文件 */
export declare function copyFile(options: ReadLineOptions): Promise<unknown>;
/**
 * 前缀交集
 * `['a','b','ab','bc']` -> `["ab", "bc"]`
 */
export declare function prefixIntersection(arr: string[]): string[];
export {};
