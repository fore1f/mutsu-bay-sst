
import * as je from "./jaxa.earth.esm.js";
import fs from "node:fs";

const args = process.argv.slice(2);
if (args.length == 0) {
	console.log("Usage: node getPixelGridCsv.js <collectionUrl> <band> <lng> <lat> <dl> [date]");
	console.log("Example: node getPixelGridCsv.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM 138.73 35.36 0.2");
	process.exit(1);
}

const collectionUrl = args[0];
const band = args[1];
const lng = parseFloat(args[2]);
const lat = parseFloat(args[3]);
const dl = parseFloat(args[4]);
const date = args[5] ? new Date(args[5]) : new Date();

// 指定された緯度経度を中心として±dl度のbboxを作る
const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];

console.log(`Fetching data for ${band} at (${lng}, ${lat}) with radius ${dl}...`);

// 画像サイズは100px四方
const dataObject = await je.getDataObject({
	collectionUrl,
	date,
	band,
	bbox,
	width: 100,
	height: 100,
});

if (!dataObject) {
	console.error("Failed to fetch dataObject.");
	process.exit(1);
}

//統計値計算を行う(最小値、最大値、平均値など)
const stat = je.data.globalStat(dataObject);

// CSVデータを作成
console.log("Creating CSV data...");
const csv = je.data.createCsv(dataObject);

// ファイル名を生成して保存
const file = [band, dataObject.formattedDate.replaceAll("/", "-"), lng, lat].join("_") + ".csv";
fs.writeFileSync(file, csv);

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
