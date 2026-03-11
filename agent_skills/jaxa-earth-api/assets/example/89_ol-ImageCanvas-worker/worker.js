import * as je from "../jaxa.earth.esm.js";

//ImageGeneratorはウェブワーカー内に待機させておきます。
let ig = null;

self.addEventListener("message", async (event) => {
	// console.log(event.data);

	//このウェブワーカーで処理中となっている可能性がある、前のリクエストに基づく外部通信処理(fetch)を全て中断します。
	je.abort();

	//初回のみinitまで実行します。
	if (ig == null) {
		ig = new je.ImageGenerator(event.data.params);
		await ig.init();
	}

	try {
		//ウェブワーカーで利用できるOffscreenCanvasを取得します
		//※HTMLCanvasElementはウェブワーカーでは利用できません。
		await ig.getOffscreenCanvas(event.data.width, event.data.height, event.data.extent, event.data.projection, (progress, offscreenCanvas, dataObject) => {

			//メインスレッドに転送するためのImageBitmapを作成します。
			const imageBitmap = offscreenCanvas.transferToImageBitmap();
			
			self.postMessage({
				progress,
				timestamp: event.data.timestamp,
				dataObject,
				imageBitmap,
			}, [
				dataObject.data.buffer,		//これ以降にはworkerからdataObject.dataにはアクセスできなくなります。
				imageBitmap
			]);
		});

	} catch (e) {
		// console.warn(e);
		console.warn("[Worker] 読み込みを中断しました。");
	}
});