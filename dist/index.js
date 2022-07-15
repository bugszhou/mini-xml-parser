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
var xml_1 = __importDefault(require("./html/aliapp/xml"));
var sourcePath = "";
var config = Object.create(null);
function getConfigElementAttrs(tagName) {
    var _a, _b, _c, _d;
    var platformTagName = (_b = (_a = config === null || config === void 0 ? void 0 : config.elementMappings) === null || _a === void 0 ? void 0 : _a.elements) === null || _b === void 0 ? void 0 : _b[tagName];
    var attrs = (_d = (_c = config === null || config === void 0 ? void 0 : config.elementMappings) === null || _c === void 0 ? void 0 : _c.elementAttrs) === null || _d === void 0 ? void 0 : _d[platformTagName];
    return attrs;
}
function transform(xml) {
    var document = (0, mini_program_xml_parser_1.parseFragment)(xml);
    return (0, mini_program_xml_parser_1.serialize)(document, {
        treeAdapter: {
            getTagName: function (element) {
                // 替换成平台的属性
                map([element]);
                if (element.tagName === "wxs") {
                    return "import-sjs";
                }
                return element.tagName;
            },
            getAttrList: function (element) {
                var _a, _b;
                if (element.tagName === "wxs") {
                    return (_a = element === null || element === void 0 ? void 0 : element.attrs) === null || _a === void 0 ? void 0 : _a.map(function (attr) {
                        var _a, _b;
                        if (attr.name === "src") {
                            return {
                                name: "from",
                                value: (_b = (_a = attr.value) === null || _a === void 0 ? void 0 : _a.replace) === null || _b === void 0 ? void 0 : _b.call(_a, /(\.wxs)$/, ".sjs"),
                            };
                        }
                        if (attr.name === "module") {
                            return {
                                name: "name",
                                value: attr.value,
                            };
                        }
                        return attr;
                    });
                }
                if (["import", "include"].includes(element.tagName)) {
                    return (_b = element === null || element === void 0 ? void 0 : element.attrs) === null || _b === void 0 ? void 0 : _b.map(function (attr) {
                        var _a, _b;
                        if (attr.name === "src") {
                            return {
                                name: attr.name,
                                value: (_b = (_a = attr.value) === null || _a === void 0 ? void 0 : _a.replace) === null || _b === void 0 ? void 0 : _b.call(_a, /(\.wxml)$/, ".axml"),
                            };
                        }
                        return attr;
                    });
                }
                return element.attrs;
            },
        },
    });
}
exports.transform = transform;
function map(childNodes) {
    childNodes === null || childNodes === void 0 ? void 0 : childNodes.forEach(function (item) {
        var _a, _b;
        var element = item;
        var attrsMapping = (_b = (_a = getConfigElementAttrs(element.tagName)) !== null && _a !== void 0 ? _a : (0, xml_1.default)(element.tagName)) !== null && _b !== void 0 ? _b : Object.create(null);
        if (element === null || element === void 0 ? void 0 : element.attrs) {
            element.attrs.forEach(function (attr) {
                var _a, _b, _c, _d;
                var name = attr.name;
                var keyName = (_a = attrsMapping === null || attrsMapping === void 0 ? void 0 : attrsMapping[name]) !== null && _a !== void 0 ? _a : name;
                if (!replaceMappings_1.default[name] &&
                    (((_b = name === null || name === void 0 ? void 0 : name.startsWith) === null || _b === void 0 ? void 0 : _b.call(name, "bind:")) || ((_c = name === null || name === void 0 ? void 0 : name.startsWith) === null || _c === void 0 ? void 0 : _c.call(name, "catch:")))) {
                    keyName = keyName.replace(/^(bind:)|^(catch:)/, "");
                }
                keyName =
                    replaceMappings_1.default[keyName] || keyName;
                attr.name = keyName;
                if (element.nodeName === "image" &&
                    attr.name === "src" &&
                    !((_d = attr.value) === null || _d === void 0 ? void 0 : _d.startsWith("{{")) &&
                    config.useRootPath) {
                    attr.value =
                        "/" +
                            (0, path_1.relative)((0, path_1.join)(config.cwd || process.cwd(), config.sourceDir || "src"), (0, path_1.resolve)((0, path_1.dirname)(sourcePath), attr.value));
                }
            });
        }
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