"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 根据 src/views 目录下的文件命名规则来生成路由
 * 页面路由： 以 _ 开头 .vue 结尾的文件视为路由
 * newPage路由： 以 ~ 开头 .vue 结尾的文件视为路由
 * 注意：文件名必须符合 /^[_~]?\w+\.vue$/ 规则
 */
const fs_1 = require("fs");
const Path = __importStar(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const index_1 = __importDefault(require("./generate/index"));
const request_1 = __importDefault(require("./generate/request"));
const util_1 = require("./util");
// 创建空文件
const emptyFiles = [
    { dest: 'src/staticRoute.js', tpl: 'staticRoute.tpl' },
    { dest: 'src/callImmediate.js', tpl: 'callImmediate.tpl' }
];
class ToolRoute {
    /**
     * @param {string} routesWritePath 存储路由的文件路径（相对项目根目录）
     */
    constructor(options) {
        this.ready = false;
        this.options = Object.assign({
            chunkDepth: 1,
            systemName: require(Path.join(process.cwd(), 'package.json')).name,
            watch: true
        }, options);
    }
    start() {
        this.generate();
        if (this.options.watch)
            this.watch();
    }
    watch() {
        chokidar_1.default
            .watch('src/views/**/*.vue', {
            cwd: process.cwd()
        })
            .on('ready', () => {
            this.ready = true;
        })
            .on('add', filepath => {
            if (this.ready && /\.vue$/i.test(filepath)) {
                this.generate();
            }
        });
    }
    async generate() {
        const { routes, pageRoutes } = await this.getRouteMapping();
        let fileContent = this.routeTemplate(routes.map(item => this.routeItemTemplate(item, 2)), pageRoutes.map(item => this.routeItemTemplate(item, 2, false)));
        let apiPrefixStr = '';
        if (Array.isArray(this.options.apiPrefix)) {
            apiPrefixStr = `JSON.parse('${JSON.stringify(this.options.apiPrefix)}')`;
        }
        else {
            apiPrefixStr = this.options.apiPrefix.toString();
        }
        fileContent += `\nexport const apiPrefix = ${apiPrefixStr}\n`;
        Object.entries(this.options.exports || {}).forEach(([key, value]) => {
            fileContent += `export const ${key} = ${value}\n`;
        });
        await fs_1.promises.writeFile(Path.join(process.cwd(), this.options.routesWritePath), fileContent, 'utf8');
        await this.createFile();
        console.log('\x1B[42;30m DONE \x1B[;m', 'Write routes file success.');
    }
    /**
     * 获取文件与路由的映射关系
     */
    async getRouteMapping() {
        const prepend = this.options.systemName || '';
        const viewsDir = Path.join(process.cwd(), 'src/views');
        // 从目录中过滤出路由（文件以 _ 开头 .vue 结尾 则视为路由对应的文件）
        const routes = new Map();
        // 从目录中过滤出路由（文件以 ~ 开头 .vue 结尾 则视为路由对应的文件）($newPage用到)
        const pageRoutes = new Map();
        const cacheAllRoutesKey = {};
        if (!await (0, util_1.isDirectory)(viewsDir)) {
            return {
                routes: [...routes.values()],
                pageRoutes: [...pageRoutes.values()],
                cacheAllRoutesKey
            };
        }
        const dirp = async (dirPath, dirs = []) => {
            const list = await fs_1.promises.readdir(dirPath);
            for (const item of list) {
                const p = Path.join(dirPath, item);
                const stat = await fs_1.promises.stat(p);
                if (stat.isFile()) {
                    if (/^_\w+\.vue$/.test(item)) {
                        const file = '@/views/' + dirs.concat(item).join('/');
                        routes.set(file, {
                            route: '/' + prepend + '/' + dirs.concat(item.slice(1, -4)).join('/'),
                            file
                        });
                        if (dirs.length > 0) {
                            cacheAllRoutesKey[dirs[0]] = true;
                        }
                    }
                    else if (/^~\w+\.vue/.test(item)) {
                        const file = '@/views/' + dirs.concat(item).join('/');
                        pageRoutes.set(file, {
                            route: '/_np/' + prepend + '/' + dirs.concat(item.slice(1, -4)).join('/'),
                            file
                        });
                    }
                }
                else {
                    await dirp(p, dirs.concat(item));
                }
            }
        };
        await dirp(viewsDir);
        return { routes: [...routes.values()], pageRoutes: [...pageRoutes.values()], cacheAllRoutesKey: Object.keys(cacheAllRoutesKey) };
    }
    /* 将路径转换成大驼峰，如将 /home/index 转换成 HomeIndex */
    pathToUpperCamelCase(pathname) {
        return pathname.replace(/\?.+$/, '').split(/[/-]/).map(el => el.slice(0, 1).toUpperCase() + el.slice(1)).join('');
    }
    getChunkName(routePath = '', depth = 1) {
        routePath = routePath.replace(/^\/_np\//, '');
        const arr = routePath.split('/');
        if (depth === 0) {
            return arr[arr.length - 1];
        }
        const paths = arr.filter(Boolean);
        if (this.options.systemName)
            paths.unshift(this.options.systemName);
        return (0, util_1.prefixIntersection)(paths.slice(0, depth)).join('.');
    }
    /* 单个路由模板 */
    routeItemTemplate({ route = '', file = '' }, spaceCount = 0, nameField = true) {
        const spaceStr = ' '.repeat(spaceCount);
        return [
            '{',
            nameField ? `  name: '${this.pathToUpperCamelCase(route)}',` : '',
            `  path: '${route}',`,
            `  component: () => import(/* webpackChunkName: "${this.getChunkName(route, this.options.chunkDepth)}" */ '${file}')`,
            '}'
        ].filter(Boolean).map(item => spaceStr + item).join('\n');
    }
    routeTemplate(routes, pageRoutes) {
        return `// 该文件通过route-tool脚本自动生成。📌请勿手动修改
import staticRoute from './staticRoute'

export { default as callImmediate } from './callImmediate'

export const routes = [
${routes.join(',\n')}
].concat(staticRoute).map(item => {
  item.meta = Object.assign(item.meta || {}, { $keepAlive: true })
  return item
})

export const pageRoutes = [
${pageRoutes.join(',\n')}
].map(item => {
  item.meta = { $keepAlive: true }
  return item
})
`;
    }
    async createFile() {
        for (const item of emptyFiles) {
            const filepath = Path.resolve(item.dest);
            if (!await (0, util_1.isFile)(filepath)) {
                await fs_1.promises.writeFile(filepath, await fs_1.promises.readFile(Path.join(__dirname, '../tpl', item.tpl), 'utf8'), 'utf8');
            }
        }
    }
}
/**
 * @param {Options} options
 */
exports.default = (options) => {
    (0, index_1.default)();
    (0, request_1.default)(options.apiPrefix);
    new ToolRoute(options).start();
};
