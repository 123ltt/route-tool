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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixIntersection = exports.copyFile = exports.isFile = exports.isDirectory = void 0;
const Fs = __importStar(require("fs"));
const ReadLine = __importStar(require("readline"));
async function getPathType(path) {
    try {
        const stat = await Fs.promises.stat(path);
        if (stat.isFile())
            return 1;
        if (stat.isDirectory())
            return 2;
    }
    catch (err) { }
    return 0;
}
async function isDirectory(dir) {
    return await getPathType(dir) === 2;
}
exports.isDirectory = isDirectory;
async function isFile(filepath) {
    return await getPathType(filepath) === 1;
}
exports.isFile = isFile;
/** 复制文件 */
async function copyFile(options) {
    return new Promise(resolve => {
        const ws = Fs.createWriteStream(options.destFile);
        const rl = ReadLine.createInterface(Fs.createReadStream(options.targetFile, { encoding: 'utf8' }));
        rl.on('line', line => {
            const str = options.replacer ? options.replacer(line) : line;
            ws.write(str + '\n');
        });
        rl.once('close', () => {
            ws.close();
            resolve(null);
        });
    });
}
exports.copyFile = copyFile;
/**
 * 前缀交集
 * `['a','b','ab','bc']` -> `["ab", "bc"]`
 */
function prefixIntersection(arr) {
    arr = arr.filter(Boolean);
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (i === j || arr[i] === '' || arr[j] === '')
                continue;
            if (arr[i].toLowerCase().indexOf(arr[j].toLowerCase()) === 0) {
                arr.splice(j, 1, '');
            }
        }
    }
    return arr.filter(Boolean);
}
exports.prefixIntersection = prefixIntersection;
