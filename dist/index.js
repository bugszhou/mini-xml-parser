"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var replaceMappings_1 = __importDefault(require("./replaceMappings"));
var mini_program_xml_parser_1 = require("mini-program-xml-parser");
var sourcePath = "";
var config = Object.create(null);
function transform(xml) {
    var document = (0, mini_program_xml_parser_1.parseFragment)(xml);
    // 替换成平台的属性
    map(document.childNodes);
    return (0, mini_program_xml_parser_1.serialize)(document);
}
exports.transform = transform;
function map(childNodes) {
    childNodes === null || childNodes === void 0 ? void 0 : childNodes.forEach(function (item) {
        var element = item;
        if (element === null || element === void 0 ? void 0 : element.attrs) {
            element.attrs.forEach(function (attr) {
                var _a, _b, _c;
                var name = attr.name;
                var keyName = name;
                if (!replaceMappings_1.default[name] &&
                    (((_a = name === null || name === void 0 ? void 0 : name.startsWith) === null || _a === void 0 ? void 0 : _a.call(name, "bind:")) || ((_b = name === null || name === void 0 ? void 0 : name.startsWith) === null || _b === void 0 ? void 0 : _b.call(name, "catch:")))) {
                    keyName = keyName.replace(/^(bind:)|^(catch:)/, "");
                }
                keyName =
                    replaceMappings_1.default[keyName] || keyName;
                attr.name = keyName;
                if (element.nodeName === "image" &&
                    attr.name === "src" &&
                    !((_c = attr.value) === null || _c === void 0 ? void 0 : _c.startsWith("{{")) &&
                    config.useRootPath) {
                    attr.value =
                        "/" +
                            (0, path_1.relative)((0, path_1.join)(config.cwd || process.cwd(), config.sourceDir || "src"), (0, path_1.resolve)((0, path_1.dirname)(sourcePath), attr.value));
                }
            });
        }
        map(element.childNodes);
    });
}
function parse(source, dest, options) {
    config = __assign({ sourceDir: "src" }, (options !== null && options !== void 0 ? options : {}));
    sourcePath = (0, path_1.join)(config.cwd || process.cwd(), source);
    var xml = (0, fs_1.readFileSync)(sourcePath, "utf-8");
    var builderXml = transform(xml);
    (0, fs_1.writeFileSync)(dest, builderXml);
    sourcePath = "";
    config = Object.create(null);
}
exports.default = parse;
//# sourceMappingURL=index.js.map