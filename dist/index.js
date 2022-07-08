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
function transform(xml) {
    var options = {
        ignoreAttributes: false,
        allowBooleanAttributes: true,
    };
    var parser = new fast_xml_parser_1.XMLParser(options);
    var xmlJs = parser.parse(xml);
    console.log(xmlJs);
    // 替换成平台的属性
    map(xmlJs);
    var builder = new fast_xml_parser_1.XMLBuilder({
        ignoreAttributes: false,
        suppressBooleanAttributes: true,
        suppressEmptyNode: true,
        format: true,
        indentBy: "  ",
        attributeNamePrefix: "@_",
        entities: [],
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
    console.log(jsonObj);
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
        if (isPlainObject(jsonObj[key])) {
            map(jsonObj[key]);
        }
        if (Array.isArray(jsonObj[key])) {
            jsonObj[key].forEach(function (item) {
                if (isPlainObject(item)) {
                    map(item);
                }
            });
            return;
        }
    });
}
function parse(source, dest) {
    var xml = (0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), source), "utf-8");
    var builderXml = transform(xml);
    (0, fs_1.writeFileSync)(dest, builderXml);
}
exports.default = parse;
//# sourceMappingURL=index.js.map