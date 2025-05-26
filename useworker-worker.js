//@ts-check

/**
 * @param {string} str
 */
function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
 * @param {string} path
 * @param {string} text
 * @param {RegExp[]} kwds
 */
function calcRank(path, text, kwds) {
	const lines = text.split("\n");
	const counts = kwds.map((kw) => {
		const matches = Array.from(text.matchAll(kw));
		return { keyword: kw, index: matches.map((a) => a.index) };
	});
	if (counts.every((c) => c.index.length > 0)) {
		return {
			path: path,
			rank: counts
				.flatMap((kwda, i) =>
					counts.flatMap((kwdb, j) =>
						j > i
							? [
									{
										kwda: kwda.keyword,
										kwdb: kwdb.keyword,
										distance: Math.min(
											...kwda.index
												.flatMap((a) => kwdb.index.map((b) => a - b))
												.map((a) => Math.abs(a)),
										),
									},
								]
							: [],
					),
				)
				.reduce((total, pair) => total + pair.distance, 0),
			lines: lines.map((a) => ({
				text: a,
				match: kwds.some((b) => a.match(b)),
			})),
		};
	} else {
		return null;
	}
}

/**
 * @param {string[]} kwds
 */
export function searchData(kwds) {
	const regexes = kwds.map((kw) => new RegExp(escapeRegExp(kw), "ig"));
	const results = dataForSearch.flatMap((elem) => {
		const ar = calcRank(elem.title, elem.text, regexes);
		return ar ? [ar] : [];
	});
	return results.sort((a, b) => a.rank - b.rank);
}

import { parentPort } from "worker_threads";
/** @type {{title:string;text:string;}[]} */
let dataForSearch = [];
parentPort?.on("message", ([method, args]) => {
	if (method === "init") {
		dataForSearch = args;
	} else if (method === "search") {
		parentPort?.postMessage(searchData(args));
	}
});
