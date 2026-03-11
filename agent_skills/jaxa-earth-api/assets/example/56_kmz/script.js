import * as je from "../jaxa.earth.esm.js";
import createKmzBlob from "./createKmzBlob.js";

//富士山周辺の緯度経度範囲
const lng = 138.73;
const lat = 35.36;
const dl = 0.5;
const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];  //[west,south,east,north]

//地表面温度のデータを取得
const dataObject = await je.getDataObject({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds2/cog/v1/JAXA.JASMES_GCOM-C.SGLI_standard.L2-LST.daytime.v3_japan_8-day/collection.json",
	band: "LST_AVE",
	date: new Date(Date.UTC(2024, 10 - 1, 31)),
	bbox,
	width: 1000,
	height: 1000,
});

console.log(dataObject);

const colorMap = new je.image.ColorMap({
	min: 0 + 273.15,
	max: 40 + 273.15,
	colors: je.Colors.JET,
});

//可視化した画像をcanvas要素として追加
const canvas = je.image.createCanvas(dataObject, colorMap)
document.body.appendChild(canvas);


//kmzを作成してダウンロードします。
document.getElementById("download").addEventListener("click", () => {

	createKmzBlob({
		title: "地表面温度 (" + dataObject.formattedDate + ")",
		description: "Image created by using JAXA Earth API for JavaScript",

		canvas,
		bbox,

		callback: (blob) => {
			const link = document.createElement("a");
			link.href = URL.createObjectURL(new Blob([blob], { type: "application/vnd.google-earth.kmz" }));
			link.download = "data.kmz";
			link.click();
		}
	});
});