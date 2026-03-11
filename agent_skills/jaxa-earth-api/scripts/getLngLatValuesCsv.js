
import * as je from "./jaxa.earth.esm.js";
import fs from "node:fs";

const args = process.argv.slice(2);
if (args.length == 0) {
	console.log("Usage: node getCsv_with_latlng.js <collectionUrl> <band> <lng> <lat> <dl> [date]");
	console.log("Example: node getCsv_with_latlng.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM 138.73 35.36 0.2");
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

console.log("Creating CSV data with Lng/Lat...");
const csv = createCsv_LngLatValue(dataObject);

// ファイル名を生成して保存
const file = [band, dataObject.formattedDate.replaceAll("/", "-"), lng, lat, "latlng"].join("_") + ".csv";
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
