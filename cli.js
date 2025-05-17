#!/usr/bin/env node
//@ts-check
import search from "./index.js";
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
	for (let i = 0; i < lines.length; i++) {
		if (!lines[i].match) continue;

		console.log(`===${i}`);
		if (i > 0 && !lines[i - 1].match) console.log(lines[i - 1].text);
		console.log(lines[i].text);
		if (i + 1 < lines.length && !lines[i + 1].match)
			console.log(lines[i + 1].text);
	}
}
