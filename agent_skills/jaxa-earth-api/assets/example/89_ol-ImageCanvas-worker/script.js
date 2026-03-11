import * as je from "../jaxa.earth.esm.js";

const projection = je.Projection.EPSG4326;
// const projection = je.Projection.EPSG3857;

const params = {
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
	band: "DSM",
	colorMapObject: {
		min: 0,
		max: 6000,
		colors: je.Colors.JET,
	},
	projection,
};

//----------------------------------------------------------------------------------------------------

let timestamp = null;
let jeSourceCanvas = null;
let dataObject = null;

const worker = new Worker("./worker.js", { type: "module" });

worker.addEventListener("message", async (event) => {
	// console.log(event.data);

	//最新の描画指示以外のレスポンスは無視する
	if (timestamp != event.data.timestamp) return;

	//ワーカーで描画されたOffscreenCanvasを表示
	jeSourceCanvas.getContext("bitmaprenderer").transferFromImageBitmap(event.data.imageBitmap);
	
	document.getElementById("status").innerHTML = event.data.progress.toFixed(0) + "%";

	if (event.data.progress == 0) {
		// 新規読み込みが開始した場合は削除する
		dataObject = null;

	} else if (event.data.progress == 100) {
		
		document.getElementById("status").innerHTML = "読み込み完了";

		// 読み込みが完了した時だけdataObjectを取得する
		dataObject = event.data.dataObject;

		console.log(dataObject);
	}

	//OpenLayersを再表示
	map.render();
});

const jeSource = new ol.source.ImageCanvas({
	canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
		const [width, height] = size.map(e => Math.floor(e));

		timestamp = Date.now();
		
		document.getElementById("status").innerHTML = "0%";

		worker.postMessage({
			params,
			width,
			height,
			extent,
			projection: projection.getCode(),
			timestamp,
		});

		//表示用canvas
		jeSourceCanvas = document.createElement("canvas");
		jeSourceCanvas.width = width;
		jeSourceCanvas.height = height;
		return jeSourceCanvas;
	},
	ratio: 1,
	interpolate: false,
});

//----------------------------------------------------------------------------------------------------


const map = new ol.Map({
	target: "map",
	pixelRatio: 1,

	layers: [
		new ol.layer.Tile({
			// source: new ol.source.OSM(),
			source: new ol.source.XYZ({
				//https://maps.gsi.go.jp/development/ichiran.html
				url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
			}),
		}),
		new ol.layer.Image({
			source: jeSource,
			// opacity: 0.5,
		}),
	],

	view: new ol.View({
		//全世界を初期位置にする場合
		// center: ol.proj.fromLonLat([0, 0], projection),
		// zoom: 0,

		//日本周辺を初期位置にする場合
		center: ol.proj.fromLonLat([138, 36], projection),
		zoom: 5,

		//投影法(必須)
		projection,
	}),

	controls: ol.control.defaults.defaults({
		zoom: false,
		attribution: false,
		rotate: false
	}),

	interactions: ol.interaction.defaults.defaults({
		altShiftDragRotate: false,
		pinchRotate: false
	}),
});


//クリックした場所の値を取得する
map.on("click", async (e) => {

	// クリックした位置のピクセル座標(div#mapの左上が(0,0)、右下が(width-1,height-1))
	const [i, j] = e.pixel;

	if (dataObject != null) {
		// 読み込みが完了している場合

		// 値を取得するためのInspectorを作成
		const isp = new je.data.Inspector(dataObject);

		// クリックした場所の座標
		const { x: longitude, y: latitude } = isp.getCoordinateByPixelXY(i, j);

		// クリックした場所の値
		const value = isp.getValueByPixelXY(i, j);

		// データの単位
		const unit = dataObject.unit;

		alert(JSON.stringify({
			longitude,
			latitude,
			projection: dataObject.projection,
			value,			// JSON.stringifyを通すと値が無い場合のNaNがnullと表示される点に注意
			unit,
		}, null, "  "));

	} else {
		//読み込み中の場合
		alert("読み込み完了までお待ちください");
	}
});

{
	//画面サイズ変更時のイベントが連続しないように0.5秒間のデバウンスを追加
	const updateSize = map.updateSize.bind(map);
	map.updateSize = () => {};

	let resizeTimer = null;

	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);

		resizeTimer = setTimeout(() => {
			updateSize();
			jeSource.refresh();
		}, 500);
	});
}