
import * as je from "./jaxa.earth.esm.js";
import fs from "node:fs";

const args = process.argv.slice(2);
if (args.length == 0) {
	console.log("Usage: node getImage.js <collectionUrl> <band> <lng> <lat> <dl> [date]");
	console.log("Example: node getImage.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM 138.73 35.36 0.2");
	console.log("Example: node getImage.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json LST 137.0 36.0 10.0 2026-01-01T00:00:00Z");
	process.exit(1);
}
// console.log(args);

const collectionUrl = args[0];
const band = args[1];
const lng = parseFloat(args[2]);
const lat = parseFloat(args[3]);
const dl = parseFloat(args[4]);
const date = args[5] ? new Date(args[5]) : new Date();

//指定された緯度経度を中心として±dl度のbboxを作る
const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];

//画像サイズは1000px四方
const dataObject = await je.getDataObject({
	collectionUrl,
	date,
	band,
	bbox,
	width: 1000,
	height: 1000,
});

//統計値計算を行う(最小値、最大値、平均値など)
const stat = je.data.globalStat(dataObject);


//最小値～最大値を青→赤の虹色に塗るカラーマップ
const colorMap = new je.image.ColorMap({
	min: stat.min,
	max: stat.max,
	colors: je.Colors.JET,
});

const png = await je.image.createPng(dataObject, colorMap);
const file = [band, dataObject.formattedDate.replaceAll("/", "-"), lng, lat].join("_") + ".png";
fs.writeFileSync(file, png);

console.log("出力ファイル名：", file);
console.log("属性情報：", {
	min: stat.min,
	max: stat.max,
	mean: stat.mean,
	unit: dataObject.unit,
	date: dataObject.formattedDate,
	width: dataObject.width,
	height: dataObject.height,
	collectionUrl,
});
