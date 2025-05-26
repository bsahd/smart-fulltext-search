//@ts-check
import { Worker } from "worker_threads";

function sleep(delay) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, delay);
	});
}
/**
 * @param {{title:string;text:string;}[]} data
 */
export async function initData(data) {
	const workers = [];
	while (data.length > 0) {
		const worker = new Worker("./useworker-worker.js");
		workers.push(worker);
		worker.postMessage(["init", data.splice(0, 4096)]);
	}
	let workerInUse = false;
	/**
	 * @param {string[]} kwds
	 */
	return async (kwds) => {
		while (workerInUse) {
			await sleep(20);
		}
		workerInUse = true;
		const retdata = (
			await Promise.all(
				workers.map((worker) => {
					worker.postMessage(["search", kwds]);
					return new Promise((a) => worker.once("message", (b) => a(b)));
				}),
			)
		).flat();
		workerInUse = false;
		return retdata;
	};
}
