declare type apiPrefixArr = [string, string][];
declare type apiPrefixFn = (isSaas: boolean) => apiPrefixArr;
export declare type APIPrefix = apiPrefixArr | apiPrefixFn;
declare type Options = {
    /** 保存路由文件的路径（相对项目根目录） */
    routesWritePath: string;
    /** chunkName 取目录的深度。默认 `1` */
    chunkDepth?: number;
    /** 系统名称，用作 chunkName 的第一级 */
    systemName: string;
    /** 是否启用watch，默认`true` */
    watch?: boolean;
    /** api前缀映射关系 */
    apiPrefix: apiPrefixArr | apiPrefixFn;
    /** 额外导出的数据 */
    exports?: {
        [key: string]: string;
    };
};
declare const _default: (options: Options) => void;
/**
 * @param {Options} options
 */
export default _default;
