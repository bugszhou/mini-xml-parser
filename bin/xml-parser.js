#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var minimist = require("minimist");
var mini_xml_parser_min_1 = require("../dist/mini-xml-parser.min");
console.log("转换中...");
var argv = minimist(process.argv.slice(2)), pathUrl = argv._[0] || ".", isLowerCase = argv.lower, useRootPath = argv.root;
process.env.isLowerCaseTag = isLowerCase;
process.env.useRootPath = useRootPath;
try {
    (0, mini_xml_parser_min_1["default"])(pathUrl, argv.dest, {
        isLowerCaseTag: isLowerCase,
        useRootPath: useRootPath,
        sourceDir: "src"
    });
    console.log("转换成功");
}
catch (e) {
    console.error(e);
    console.log("转换失败");
}
