import { readFileSync, writeFileSync } from "fs";
import { dirname, join, relative, resolve } from "path";
import replaceMappings from "./replaceMappings";
import { parseFragment, serialize } from "mini-program-xml-parser";
import {
  DocumentFragment,
  Element,
} from "mini-program-xml-parser/dist/tree-adapters/default";
import getTagMapping, { getTagName } from "./html/aliapp/xml";
import { IElementMappings } from "./__interface__";

interface IConfig {
  isLowerCaseTag: boolean;
  useRootPath: boolean;
  elementMappings: IElementMappings;
  sourceDir?: string;
  cwd?: string;
}

let sourcePath = "";
let config: IConfig = Object.create(null);

function getConfigElementAttrs(tagName: string) {
  const platformTagName: string = config?.elementMappings?.elements?.[tagName];

  const attrs: Record<string, string> =
    config?.elementMappings?.elementAttrs?.[platformTagName];

  return attrs;
}

export function transform(xml: string) {
  const document = parseFragment(xml);

  return serialize(document, {
    treeAdapter: {
      getTagName(element) {
        // 替换成平台的属性
        map([element]);
        return getTagName(element.tagName);
      },
      getAttrList(element) {
        if (element.tagName === "wxs") {
          return element?.attrs?.map((attr) => {
            if (attr.name === "src") {
              return {
                name: "from",
                value: attr.value?.replace?.(/(\.wxs)$/, ".sjs"),
              };
            }

            if (attr.name === "module") {
              return {
                name: "name",
                value: attr.value,
              };
            }

            return attr;
          });
        }
        if (["import", "include"].includes(element.tagName)) {
          return element?.attrs?.map((attr) => {
            if (attr.name === "src") {
              return {
                name: attr.name,
                value: attr.value?.replace?.(/(\.wxml)$/, ".axml"),
              };
            }

            return attr;
          });
        }
        return element.attrs;
      },
    },
  });
}

function isInternalResource(path: string) {
  // 检查路径是否是网络资源、本地文件或Base64编码的资源
  const isExternal = /^(https?:\/\/|wxfile:\/\/|data:image\/\w+;base64,)/i.test(path);
  // 检查路径是否是内部变量模板
  const isVariableTemplate = /^\{\{.*\}\}$/.test(path);
  // 如果不是上述类型，我们认为它是小程序包内资源
  return !isExternal && !isVariableTemplate;
}

function map(childNodes: DocumentFragment["childNodes"]) {
  childNodes?.forEach((item) => {
    const element = item as unknown as Element;

    const attrsMapping =
      getConfigElementAttrs(element.tagName) ??
      getTagMapping(element.tagName) ??
      Object.create(null);

    if (element?.attrs) {
      element.attrs.forEach((attr) => {
        const name = attr.name as keyof typeof replaceMappings;

        let keyName: string = attrsMapping?.[name] ?? name;

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
          !attr.value?.startsWith("/") &&
          isInternalResource(attr.value) &&
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
