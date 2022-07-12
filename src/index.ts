import { readFileSync, writeFileSync } from "fs";
import { dirname, join, relative, resolve } from "path";
import replaceMappings from "./replaceMappings";
import { parseFragment, serialize } from "mini-program-xml-parser";
import {
  DocumentFragment,
  Element,
} from "mini-program-xml-parser/dist/tree-adapters/default";

interface IConfig {
  isLowerCaseTag: boolean;
  useRootPath: boolean;
  sourceDir?: string;
  cwd?: string;
}

let sourcePath = "";
let config: IConfig = Object.create(null);

export function transform(xml: string) {
  const document = parseFragment(xml);

  // 替换成平台的属性
  map(document.childNodes);

  return serialize(document);
}

function map(childNodes: DocumentFragment["childNodes"]) {
  childNodes?.forEach((item) => {
    const element = item as unknown as Element;

    if (config.isLowerCaseTag) {
      element.nodeName = element?.nodeName?.toLowerCase?.() || element.nodeName;
      element.tagName = element?.tagName?.toLowerCase?.() || element.tagName;
    }

    if (element?.attrs) {
      element.attrs.forEach((attr) => {
        const name = attr.name as keyof typeof replaceMappings;

        let keyName: string = name;

        if (
          !replaceMappings[name] &&
          (name?.startsWith?.("bind:") || name?.startsWith?.("catch:"))
        ) {
          keyName = keyName.replace(/^(bind:)|^(catch:)/, "");
        }

        keyName =
          replaceMappings[keyName as keyof typeof replaceMappings] || keyName;

        attr.name = keyName;

        if (
          element.nodeName === "image" &&
          attr.name === "src" &&
          !attr.value?.startsWith("{{") &&
          config.useRootPath
        ) {
          attr.value =
            "/" +
            relative(
              join(config.cwd || process.cwd(), config.sourceDir || "src"),
              resolve(dirname(sourcePath), attr.value),
            );
        }
      });
    }

    map(element.childNodes);
  });
}

export default function parse(source: string, dest: string, options: IConfig) {
  config = {
    sourceDir: "src",
    ...(options ?? {}),
  };
  sourcePath = join(config.cwd || process.cwd(), source);
  const xml = readFileSync(sourcePath, "utf-8");
  const builderXml = transform(xml);
  writeFileSync(dest, builderXml);
  sourcePath = "";
  config = Object.create(null);
}
