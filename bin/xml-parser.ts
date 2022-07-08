#!/usr/bin/env node

import * as minimist from "minimist";
import parser from "../dist/index";

const argv = minimist(process.argv.slice(2)),
  pathUrl = argv._[0] || ".";

console.log("转换中...");
try {
  parser(pathUrl, argv.dest);
  console.log("转换成功");
} catch (e) {
  console.error(e);
  console.log("转换失败");
}
