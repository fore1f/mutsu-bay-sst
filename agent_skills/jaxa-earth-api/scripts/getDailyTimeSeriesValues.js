
import * as je from "./jaxa.earth.esm.js";
import fs from "fs";

const args = process.argv.slice(2);
if (args.length < 6) {
	console.log("Usage: node getDailyTimeSeriesValues.js <collectionUrl> <band> <lng> <lat> <start> <end>");
	console.log("Example: node getDailyTimeSeriesValues.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_daily/collection.json LST 138.73 35.36 2025-01-01 2025-03-31");
	process.exit(1);
}

const collectionUrl = args[0];
const band = args[1];
const lng = parseFloat(args[2]);
const lat = parseFloat(args[3]);
let cur = new Date(args[4] + "T00:00:00Z");
const end = new Date(args[5] + "T00:00:00Z");

if (cur > end) {
	throw new Error(`Start date must be <= End date: ${args[4]} .. ${args[5]}`);
}

const dates = [];
while (cur <= end) {
	dates.push(new Date(cur));
	cur.setUTCDate(cur.getUTCDate() + 1);
}

console.log(`${dates.length}日分のデータを取得中...`);

const dl = 0.001;
const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];

// 並行してデータを取得
const results = await Promise.all(dates.map(async (date) => {
	try {
		const dataObject = await je.getDataObject({
			collectionUrl,
			date,
			band,
			bbox,
			width: 100,
			height: 100,
		});

		if (!dataObject) {
			return { date: date.toISOString().slice(0, 7).replaceAll("-", "/"), value: NaN, unit: "" };	//★
		}

		const stat = je.data.globalStat(dataObject);

		return {
			date: dataObject.formattedDate,
			value: stat.mean,
			unit: dataObject.unit
		};
	} catch (e) {
		return { date: date.toISOString().slice(0, 7).replaceAll("-", "/"), value: NaN, unit: "" };	//★
	}
}));

console.log(results);

// CSV作成
const csv = "date,value,unit\n" + results.map(r => `${r.date},${r.value},${r.unit}`).join("\n");

const file = [band, results[0].date.replaceAll("/", "-"), results.slice(-1)[0].date.replaceAll("/", "-"), lng, lat].join("_") + ".csv";
fs.writeFileSync(file, csv);

console.log(`CSVファイルを保存しました: ${file}`);
console.log(`場所：経度${lng}、緯度${lat}`);
console.table(results);
