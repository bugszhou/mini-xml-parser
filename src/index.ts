import { readFileSync, writeFileSync } from "fs";
import { dirname, join, relative, resolve } from "path";
import replaceMappings from "./replaceMappings";
import { parseFragment, serialize } from "mini-program-xml-parser";
import {
  DocumentFragment,
  Element,
} from "mini-program-xml-parser/dist/tree-adapters/default";

let sourcePath = "";

export function transform(xml: string) {
  const document = parseFragment(xml);

  // 替换成平台的属性
  map(document.childNodes);

  return serialize(document);
}

function map(childNodes: DocumentFragment["childNodes"]) {
  childNodes?.forEach((item) => {
    const element = item as unknown as Element;

    if (element?.attrs) {
      element.attrs.forEach((attr) => {
        const name = (
          process.env.isLowerCaseTag ? attr.name.toLowerCase : attr.name
        ) as keyof typeof replaceMappings;

        let keyName: string = name;

        if (
          !replaceMappings[name] &&
          (name?.startsWith("bind:") || name?.startsWith("catch:"))
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
          process.env.useRootPath
        ) {
          attr.value =
            "/" +
            relative(
              join(process.cwd(), "src"),
              resolve(dirname(sourcePath), attr.value),
            );
        }
      });
    }

    map(element.childNodes);
  });
}

export default function parse(source: string, dest: string) {
  sourcePath = join(process.cwd(), source);
  const xml = readFileSync(sourcePath, "utf-8");
  const builderXml = transform(xml);
  writeFileSync(dest, builderXml);
  sourcePath = "";
}
