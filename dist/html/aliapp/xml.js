"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xml = {
    "scroll-view": {
        attrs: {
            weapp: {
                bounces: "trap-scroll",
                bindscrolltoupper: "onScrollToUpper",
                bindscrolltolower: "onScrollToLower",
                bindscroll: "onScroll",
                "bind:touchstart": "onTouchStart",
                "catch:touchstart": "onTouchStart",
            },
        },
    },
    map: {
        attrs: {
            weapp: {
                "bind:markertap": "onMarkerTap",
            },
        },
    },
};
function getTagMapping(tagName) {
    return xml[tagName];
}
exports.default = getTagMapping;
//# sourceMappingURL=xml.js.map