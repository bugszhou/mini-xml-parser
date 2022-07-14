interface IAttr {
  weapp: Record<string, string>;
}

const xml = {
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

export default function getTagMapping(tagName: string): {
  attrs: IAttr;
} {
  return xml[tagName as keyof typeof xml];
}
