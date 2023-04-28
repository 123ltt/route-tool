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
const fs_1 = require("fs");
const Path = __importStar(require("path"));
const util_1 = require("../util");
const arr = [
    {
        tpl: 'staticRoute.d.ts',
        dest: Path.resolve('src/plugins/staticRoute/index.d.ts')
    }
];
async function bootstrap() {
    for (const item of arr) {
        const target = Path.join(__dirname, '../../tpl', item.tpl);
        const p = Path.parse(item.dest);
        if (!await (0, util_1.isDirectory)(p.dir)) {
            await fs_1.promises.mkdir(p.dir, { recursive: true });
        }
        await (0, util_1.copyFile)({
            targetFile: target,
            destFile: item.dest
        });
    }
}
exports.default = bootstrap;
