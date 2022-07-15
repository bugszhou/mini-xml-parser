import { IElementMappings } from "../../__interface__";

const mappings: IElementMappings = {
  elements: {
    "scroll-view": "scroll-view",
    map: "map",
  },
  elementAttrs: {
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
  },
};

export default mappings;
