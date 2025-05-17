//@ts-check
import { searchData } from "./index.js";
import fs from "fs";
import path from "path";
/**
 * @param {string} searchpath
 */
export async function getDirData(searchpath) {
	const results = Promise.all(
		fs
			.globSync(searchpath, {
				withFileTypes: true,
			})
			.map(async (element) => {
				const elempath = path.join(element.parentPath, element.name);
				const text = (await fs.promises.readFile(elempath)).toString();
				return { text, title: elempath };
			})
	);
	return results;
}
let starttime = Date.now();
const data = await getDirData(process.argv[2]);
console.log(Date.now() - starttime + "ms");
for (let index = 0; index < 100; index++) {
	starttime = Date.now();
	const result = searchData(data, process.argv.slice(4));
	console.log(Date.now() - starttime + "ms");
}
