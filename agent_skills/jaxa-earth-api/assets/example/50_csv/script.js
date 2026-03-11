import * as je from "../jaxa.earth.esm.js";

//富士山周辺の緯度経度範囲
const lng = 138.73;
const lat = 35.36;
const dl = 0.2;
const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];  //[west,south,east,north]

//地形データ(JAXA AW3D)を取得
const dataObject = await je.getDataObject({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
	bbox,
	width: 200,
	height: 200,

	//地形の傾斜を再現するためにはバイリニアリサンプリングが必要です。
	//これを指定しない場合はニアレストネイバーを利用するため、3D等で表示した場合に不自然な段差が発生する場合があります。
	resampling: je.Resampling.BILINEAR,
});

console.log(dataObject);

const colorMap = new je.image.ColorMap({
	min: 0,
	max: 4000,
	colors: je.Colors.JET,
});


//可視化した画像をcanvas要素として追加
document.body.appendChild(je.image.createCanvas(dataObject, colorMap));
document.body.appendChild(document.createElement("br"));	//改行

//カラーマップ凡例をcanvas要素として追加(幅500px、高さ30px、文字サイズ10px)
document.body.appendChild(colorMap.createLegendCanvas(500, 30, 10, dataObject.unit));
document.body.appendChild(document.createElement("br"));	//改行


//ダウンロードさせる関数
const download = (name, text) => {
	const blob = new Blob([text], { type: "text/plain" });

	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = name;
	link.click();
};

//CSV（ピクセル並び順）を作成してダウンロードします。
document.getElementById("download1").addEventListener("click", () => {
	download("data.csv", je.data.createCsv(dataObject));
});

//CSV（経度、緯度、値の列挙）を作成してダウンロードします。
document.getElementById("download2").addEventListener("click", () => {

	const createCsv_LngLatValue = (dataObject) => {
		if (dataObject.projection !== "EPSG:4326") {
			//下記の計算では緯度経度が等間隔であることが前提になっているため、EPSG:4326のみ対応
			throw new Error(`EPSG:4326以外には対応していません。projection = ${dataObject.projection}`);
		}

		const { width, height, bbox } = dataObject;
		const [minLng, minLat, maxLng, maxLat] = bbox;

		const dLng = (maxLng - minLng) / width;
		const dLat = (maxLat - minLat) / height;

		const lines = ["lng,lat,value"];

		for (let j = 0; j < height; j++) {
			const lat = maxLat - (j + 0.5) * dLat;	//ピクセル中心の緯度
			for (let i = 0; i < width; i++) {
				const lng = minLng + (i + 0.5) * dLng;	//ピクセル中心の経度
				lines.push([
					lng.toFixed(4),
					lat.toFixed(4),
					dataObject.data[i + width * j].toFixed(1)
				].join(","));
			}
		}

		return lines.join("\n");
	}

	download("data.csv", createCsv_LngLatValue(dataObject));
});