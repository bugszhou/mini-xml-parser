import xml from "./weapp2aliapp";

export default function getTagMapping(tagName: string): Record<string, string> {
  const platformTagName: string = xml?.elements?.[tagName];

  const attrs: Record<string, string> = xml?.elementAttrs?.[platformTagName];

  return attrs;
}

export function getTagName(originalTagName: string) {
  return xml?.elements?.[originalTagName] || originalTagName;
}
