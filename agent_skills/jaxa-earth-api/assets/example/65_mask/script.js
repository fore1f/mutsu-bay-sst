
import * as je from "../jaxa.earth.esm.js";
import createMask from "./createMask.js";


// 静岡県の形状を表すGeoJSONのデータ
// このGeoJSONは、国土交通省 国土数値情報 行政区域データ[https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2025.html](オープンデータCC_BY_4.0)の
// データを加工・編集(軽量化)して独自に作成したものです。
// FeatureCollectionの0番目にデータが格納されています。
const feature = (await fetch("./shizuoka.geojson").then(res => res.json())).features[0];

// 幅600pxでマスク画像を作成
const mask = createMask(feature, 600);


// マスク画像の緯度経度範囲、画像サイズに合わせて標高データを取得
const dataObject = await je.getDataObject({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
	bbox: mask.bbox,
	width: mask.width,
	height: mask.height,
});
console.log(dataObject);


// 都道府県の形状でマスク処理
const masked = je.data.compute({
	dataObjects: [dataObject, mask.dataObject],

	//ピクセル間の演算方法を定義（引数はdataObjectsの配列の順番と同一）
	operation: (value, mask) => {
		if (mask == 0) return NaN;		// 都道府県の範囲外の場合はNaNに置き換え
		if (mask == 1) return value;	// 都道府県の範囲内のみデータを持たせる
	},

	unit: dataObject.unit,
	date: dataObject.date,
	formattedDate: dataObject.formattedDate,
});
console.log(masked);


// 統計値を計算。都道府県の範囲外となるNaNのピクセルは計算には含めません。
const stat = je.data.globalStat(masked);
console.log(stat);


// 可視化のためのカラーマップ
const colorMap = new je.image.ColorMap({
	min: 0,
	max: 4000,
	colors: je.Colors.JET,
});


// 結果を表示
document.getElementById("map").appendChild(je.image.createCanvas(masked, colorMap));
document.getElementById("map").appendChild(document.createElement("br"));
document.getElementById("map").appendChild(document.createElement("br"));
document.getElementById("map").appendChild(colorMap.createLegendCanvas(300, 20, 10, masked.unit));

document.getElementById("text").innerHTML = "静岡県の平均標高は、" + stat.mean.toFixed(1) + "[m]";
