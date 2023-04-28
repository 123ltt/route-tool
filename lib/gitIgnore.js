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
const Fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const readline_1 = require("readline");
const util_1 = require("./util");
exports.default = async (ignoreRule) => {
    const ignoreFile = Path.join(process.cwd(), '.gitignore');
    if (await (0, util_1.isFile)(ignoreFile)) {
        const rs = Fs.createReadStream(ignoreFile, { encoding: 'utf8' });
        const rl = (0, readline_1.createInterface)(rs);
        let isExist = false;
        const handler = (line) => {
            if (line.trim() === ignoreRule) {
                isExist = true;
                rl.removeListener('line', handler);
                rl.close();
                rs.close();
            }
        };
        rl.on('line', handler);
        rl.on('close', async () => {
            if (!isExist) {
                await Fs.promises.appendFile(ignoreFile, `\n${ignoreRule}\n`, 'utf8');
            }
        });
    }
};
