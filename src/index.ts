import { readFileSync, writeFileSync } from "fs";
import { join, relative, resolve } from "path";
import replaceMappings from "./replaceMappings";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

let sourcePath = "";

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
    processEntities: false,
  });

  return builder.build(xmlJs);
}

function isPlainObject(val: any): val is Record<string, any> {
  if (
    val === null ||
    Object.prototype.toString.call(val) !== "[object Object]"
  ) {
    return false;
  }
  const prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
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
      const keyName = process.env.isLowerCaseTag ? key.toLowerCase() : key;
      const value = jsonObj[key];
      delete jsonObj[key];
      jsonObj[keyName] = value;

      if (isPlainObject(jsonObj[keyName])) {
        if (keyName === "image") {
          jsonObj[keyName]["@_src"] = relative(
            join(process.cwd(), "src"),
            resolve(sourcePath, jsonObj[keyName]["@_src"]),
          );
        }
        map(jsonObj[keyName]);
      }
      if (Array.isArray(jsonObj[keyName])) {
        jsonObj[keyName].forEach((item: any) => {
          if (keyName === "image") {
            item["@_src"] = relative(
              join(process.cwd(), "src"),
              resolve(sourcePath, item["@_src"]),
            );
          }

          if (isPlainObject(item)) {
            map(item);
          }
        });
        return;
      }
    });
}

export default function parse(source: string, dest: string) {
  sourcePath = join(process.cwd(), source);
  const xml = readFileSync(sourcePath, "utf-8");
  const builderXml = transform(xml);
  writeFileSync(dest, builderXml);
  sourcePath = "";
}
