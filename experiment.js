//@ts-check
import { initData } from "./useworker.js";
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
starttime = Date.now();
let search = await initData(data);
console.log(Date.now() - starttime + "ms");
starttime = Date.now();
while (true) {
	starttime = Date.now();
	let result = await search(process.argv.slice(4));
	console.log(Date.now() - starttime + "ms");
}
