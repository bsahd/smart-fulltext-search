#!/usr/bin/env node
//@ts-check
import search from "./index.js"
const starttime = Date.now();
const result = await search(
	process.argv[2],
	process.argv[3],
	process.argv.slice(4)
);
console.log(Date.now() - starttime + "ms");
for (const element of result) {
	console.log("=====");
	console.log("file " + element.path);
	console.log("rank " + element.rank);
	const lines = element.lines;
	for (let linei = 0; linei < lines.length; linei++) {
		if (lines[linei].match) {
			lines[linei - 1]?.match || console.log("===" + linei);
			typeof lines[linei - 1] != "undefined" &&
				(lines[linei - 1]?.match || console.log(lines[linei - 1]?.text));
			console.log(lines[linei].text);
			typeof lines[linei + 1] != "undefined" &&
				(lines[linei + 1]?.match || console.log(lines[linei + 1]?.text));
		}
	}
}
