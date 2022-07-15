"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var weapp2aliapp_1 = __importDefault(require("./weapp2aliapp"));
function getTagMapping(tagName) {
    var _a, _b;
    var platformTagName = (_a = weapp2aliapp_1.default === null || weapp2aliapp_1.default === void 0 ? void 0 : weapp2aliapp_1.default.elements) === null || _a === void 0 ? void 0 : _a[tagName];
    var attrs = (_b = weapp2aliapp_1.default === null || weapp2aliapp_1.default === void 0 ? void 0 : weapp2aliapp_1.default.elementAttrs) === null || _b === void 0 ? void 0 : _b[platformTagName];
    return attrs;
}
exports.default = getTagMapping;
//# sourceMappingURL=xml.js.map