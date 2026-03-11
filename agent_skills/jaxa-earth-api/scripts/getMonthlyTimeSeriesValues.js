
import * as je from "./jaxa.earth.esm.js";
import fs from "fs";

const args = process.argv.slice(2);
if (args.length < 6) {
	console.log("Usage: node getMonthlyTimeSeriesValues.js <collectionUrl> <band> <lng> <lat> <start> <end>");
	console.log("Example: node getMonthlyTimeSeriesValues.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json LST 138.73 35.36 2024-01 2025-12");
	process.exit(1);
}

const collectionUrl = args[0];
const band = args[1];
const lng = parseFloat(args[2]);
const lat = parseFloat(args[3]);
const [sy, sm] = args[4].split("-").map(Number);
const [ey, em] = args[5].split("-").map(Number);

const dates = [];
for (let y = sy, m = sm; y < ey || (y === ey && m <= em);) {
	dates.push(new Date(Date.UTC(y, m - 1, 1)));
	m++;
	if (m === 13) { m = 1; y++; }
}

console.log(`${dates.length}ヶ月分のデータを取得中...`);

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
			return { date: date.toISOString().slice(0, 7).replaceAll("-", "/"), value: NaN, unit: "" };
		}

		const stat = je.data.globalStat(dataObject);

		return {
			date: dataObject.formattedDate,
			value: stat.mean,
			unit: dataObject.unit
		};
	} catch (e) {
		return { date: date.toISOString().slice(0, 7).replaceAll("-", "/"), value: NaN, unit: "" };
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
