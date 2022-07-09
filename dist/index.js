"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var replaceMappings_1 = __importDefault(require("./replaceMappings"));
var fast_xml_parser_1 = require("fast-xml-parser");
var sourcePath = "";
function transform(xml) {
    var options = {
        ignoreAttributes: false,
        allowBooleanAttributes: true,
    };
    var parser = new fast_xml_parser_1.XMLParser(options);
    var xmlJs = parser.parse(xml);
    // 替换成平台的属性
    map(xmlJs);
    var builder = new fast_xml_parser_1.XMLBuilder({
        ignoreAttributes: false,
        suppressBooleanAttributes: true,
        suppressEmptyNode: true,
        format: true,
        indentBy: "  ",
        attributeNamePrefix: "@_",
        processEntities: false,
    });
    return builder.build(xmlJs);
}
exports.transform = transform;
function isPlainObject(val) {
    if (val === null ||
        Object.prototype.toString.call(val) !== "[object Object]") {
        return false;
    }
    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
}
function map(jsonObj) {
    Object.keys(jsonObj || {})
        .filter(function (key) { return key.startsWith("@_"); })
        .forEach(function (key) {
        var name = key.replace(/^\@_/, "");
        var keyName = name;
        if (!replaceMappings_1.default[name] &&
            ((name === null || name === void 0 ? void 0 : name.startsWith("bind:")) || (name === null || name === void 0 ? void 0 : name.startsWith("catch:")))) {
            keyName = keyName.replace(/^(bind:)|^(catch:)/, "");
        }
        keyName =
            replaceMappings_1.default[keyName] || keyName;
        var value = jsonObj[key];
        delete jsonObj[key];
        jsonObj["@_".concat(keyName)] = value;
    });
    Object.keys(jsonObj || {})
        .filter(function (key) { return !key.startsWith("@_"); })
        .forEach(function (key) {
        var keyName = process.env.isLowerCaseTag ? key.toLowerCase() : key;
        var value = jsonObj[key];
        delete jsonObj[key];
        jsonObj[keyName] = value;
        if (isPlainObject(jsonObj[keyName])) {
            if (keyName === "image") {
                jsonObj[keyName]["@_src"] = (0, path_1.relative)((0, path_1.join)(process.cwd(), "src"), (0, path_1.resolve)(sourcePath, jsonObj[keyName]["@_src"]));
            }
            map(jsonObj[keyName]);
        }
        if (Array.isArray(jsonObj[keyName])) {
            jsonObj[keyName].forEach(function (item) {
                if (keyName === "image" && process.env.useRootPath) {
                    item["@_src"] = "/" + (0, path_1.relative)((0, path_1.join)(process.cwd(), "src"), (0, path_1.resolve)((0, path_1.dirname)(sourcePath), item["@_src"]));
                }
                if (isPlainObject(item)) {
                    map(item);
                }
            });
            return;
        }
    });
}
function parse(source, dest) {
    sourcePath = (0, path_1.join)(process.cwd(), source);
    var xml = (0, fs_1.readFileSync)(sourcePath, "utf-8");
    var builderXml = transform(xml);
    (0, fs_1.writeFileSync)(dest, builderXml);
    sourcePath = "";
}
exports.default = parse;
//# sourceMappingURL=index.js.map