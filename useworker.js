//@ts-check
import { Worker } from "worker_threads";
class ThreadPool {
	// 空きスレッド、キューを初期化
	availableWorkers = [];
	queue = [];
	constructor(size, filePath, options) {
		// 引数で指定されたとおりにスレッドを生成してプール
		for (let i = 0; i < size; i++) {
			this.availableWorkers.push(new Worker(filePath, options));
		}
	}

	// 外部からの処理要求を受け付けるメソッド
	executeInThread(arg) {
		return new Promise((resolve) => {
			const request = { resolve, arg };

			// 空きスレッドがあればリクエストを処理し、なければキューに積む
			const worker = this.availableWorkers.pop();
			worker ? this.__process(worker, request) : this.queue.push(request);
		});
	}

	// 実際にスレッドで処理を実行するprivateメソッド
	__process(worker, { resolve, arg }) {
		worker.once("message", (result) => {
			// リクエスト元に結果を返す
			resolve(result);

			// キューに積まれたリクエストがあれば処理し、なければ空きスレッドに戻す
			const request = this.queue.shift();
			request
				? this.__process(worker, request)
				: this.availableWorkers.push(worker);
		});
		worker.postMessage(arg);
	}
}

const worker = new ThreadPool(8, "./useworker-worker.js");
/**
 * @param {{title:string;text:string;}[]} data
 * @param {string[]} kwds
 */
export async function searchData(data, kwds) {
	const es = [];
	while (data.length > 0) {
		es.push(data.splice(0, 128));
	}
	return (
		await Promise.all(es.map((a) => worker.executeInThread([a, kwds])))
	).flat();
}
