"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mappings = {
    elements: {
        "scroll-view": "scroll-view",
        map: "map",
        picker: "picker",
        input: "input",
        textarea: "textarea",
        wxs: "import-sjs",
    },
    elementAttrs: {
        /**
         * 属性为支付宝小程序标签名
         */
        "scroll-view": {
            bounces: "trap-scroll",
            bindscrolltoupper: "onScrollToUpper",
            bindscrolltolower: "onScrollToLower",
            bindscroll: "onScroll",
            "bind:touchstart": "onTouchStart",
            "catch:touchstart": "onTouchStart",
        },
        map: {
            "bind:markertap": "onMarkerTap",
        },
        picker: {
            bindchange: "onChange",
        },
        input: {
            bindblur: "onBlur",
            bindinput: "onInput",
            bindfocus: "onFocus",
            bindconfirm: "onConfirm",
        },
        textarea: {
            bindblur: "onBlur",
            bindinput: "onInput",
            bindfocus: "onFocus",
            bindconfirm: "onConfirm",
        },
    },
};
exports.default = mappings;
//# sourceMappingURL=weapp2aliapp.js.map