#!/usr/bin/env node

import * as minimist from "minimist";
import parser from "../dist/mini-xml-parser.min";

console.log("转换中...");

const argv = minimist(process.argv.slice(2)),
  pathUrl = argv._[0] || ".",
  isLowerCase = argv.lower,
  useRootPath = argv.root;

process.env.isLowerCaseTag = isLowerCase;
process.env.useRootPath = useRootPath;

try {
  parser(pathUrl, argv.dest);
  console.log("转换成功");
} catch (e) {
  console.error(e);
  console.log("转换失败");
}
