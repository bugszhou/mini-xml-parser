interface IAttr {
    weapp: Record<string, string>;
}
export default function getTagMapping(tagName: string): {
    attrs: IAttr;
};
export {};
