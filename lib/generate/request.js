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
const fs_1 = require("fs");
const Path = __importStar(require("path"));
const util_1 = require("../util");
const gitIgnore_1 = __importDefault(require("../gitIgnore"));
exports.default = async (prefix) => {
    const destDir = Path.join(process.cwd(), 'src/plugins/request');
    if (!await (0, util_1.isDirectory)(destDir)) {
        await fs_1.promises.mkdir(destDir, { recursive: true });
    }
    const arr = [];
    if (typeof prefix === 'function') {
        arr.push(...prefix(true), ...prefix(false));
    }
    else {
        arr.push(...prefix);
    }
    const mapping = {};
    arr.forEach(([key, val]) => {
        mapping[key] = mapping[key] || [];
        mapping[key].push(val);
    });
    const replaceContent = Object.entries(mapping).map(([key, val]) => `  /** ${key} -> ${val.join(' | ')} */\n  ${key}: fn;`).join('\n');
    await (0, util_1.copyFile)({
        targetFile: Path.join(__dirname, '../../tpl/request.d.ts'),
        destFile: Path.join(destDir, 'index.d.ts'),
        replacer: str => str.replace(/__PREFIX__/g, replaceContent)
    });
    await (0, gitIgnore_1.default)('src/plugins');
};
