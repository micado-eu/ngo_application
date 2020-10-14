"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.getDynamicConfig = exports.getDynamicPackageDependencies = void 0;
require("@vue/cli-plugin-babel");
require("@vue/cli-plugin-eslint");
require("@vue/cli-plugin-typescript");
require("eslint");
require("eslint-loader");
require("eslint-plugin-prettier");
require("eslint-plugin-vue");
require("postcss-loader");
require("recursive-readdir");
require("url-loader");
require("vue");
require("vue-property-decorator");
require("vue-template-compiler");
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const fs_1 = require("fs");
const tsconfig_1 = require("./tsconfig");
const vueConfig_1 = require("./vueConfig");
const bit_envs_compilers_utils_1 = require("@bit/bit.envs.compilers.utils");
const vueCli = require('@vue/cli-service');
if (process.env.DEBUG) {
    debug_1.default('build');
}
const COMPILED_EXTS = ['vue', 'ts', 'tsx'];
function getDynamicPackageDependencies() {
    return {};
}
exports.getDynamicPackageDependencies = getDynamicPackageDependencies;
function getDynamicConfig(ctx) {
    return ctx.rawConfig;
}
exports.getDynamicConfig = getDynamicConfig;
function action(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { res, directory } = yield bit_envs_compilers_utils_1.createCapsule(ctx.context.isolate, { shouldBuildDependencies: true });
        const distDir = path_1.default.join(directory, 'dist');
        const componentObject = res.componentWithDependencies.component.toObject();
        const { files, mainFile, name } = componentObject;
        let sources = bit_envs_compilers_utils_1.getSourceFiles(files, COMPILED_EXTS);
        let TS = Object.assign(tsconfig_1.TSConfig, {
            include: sources.map((s) => s.path),
        });
        yield fs_1.promises.writeFile(path_1.default.join(directory, 'tsconfig.json'), JSON.stringify(TS, null, 4));
        yield fs_1.promises.writeFile(path_1.default.join(directory, 'vue.config.js'), `module.exports=${JSON.stringify(vueConfig_1.vueConfig)}`);
        try {
            const service = new vueCli(directory);
            yield service.run('build', {
                mode: 'development',
                entry: path_1.default.resolve(directory, mainFile),
                target: 'lib',
                name,
                dest: 'dist',
            });
        }
        catch (e) {
            console.log(e);
            process.exit(1);
        }
        const dists = yield bit_envs_compilers_utils_1.readFiles(distDir);
        bit_envs_compilers_utils_1.destroyCapsule(res.capsule);
        return {
            mainFile: `${name}.common.js`,
            dists: dists || [],
            packageJson: {
                browser: `${name}.umd.js`,
            },
        };
    });
}
exports.action = action;
