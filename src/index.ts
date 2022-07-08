import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import replaceMappings from "./replaceMappings";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export function transform(xml: string) {
  const options = {
    ignoreAttributes: false,
    allowBooleanAttributes: true,
  };

  const parser = new XMLParser(options);
  const xmlJs = parser.parse(xml);

  // 替换成平台的属性
  map(xmlJs);

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    suppressBooleanAttributes: true,
    suppressEmptyNode: true,
    format: true,
    indentBy: "  ",
    attributeNamePrefix: "@_",
  });

  return builder.build(xmlJs);
}

function map(jsonObj: Record<string, any>) {
  Object.keys(jsonObj || {})
    .filter((key) => key.startsWith("@_"))
    .forEach((key) => {
      const name = key.replace(/^\@_/, "") as keyof typeof replaceMappings;
      let keyName: string = name;
      if (
        !replaceMappings[name] &&
        (name?.startsWith("bind:") || name?.startsWith("catch:"))
      ) {
        keyName = keyName.replace(/^(bind:)|^(catch:)/, "");
      }

      keyName =
        replaceMappings[keyName as keyof typeof replaceMappings] || keyName;
      const value = jsonObj[key];
      delete jsonObj[key];
      jsonObj[`@_${keyName}`] = value;
    });

  Object.keys(jsonObj || {})
    .filter((key) => !key.startsWith("@_"))
    .forEach((key) => {
      map(jsonObj[key]);
    });
}

export default function parse(source: string, dest: string) {
  const xml = readFileSync(join(process.cwd(), source), "utf-8");
  const builderXml = transform(xml);
  writeFileSync(dest, builderXml);
}
