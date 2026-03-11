
import * as je from "./jaxa.earth.esm.js";

const args = process.argv.slice(2);
if (args.length < 4) {
	console.log("Usage: node getValue.js <collectionUrl> <band> <lng> <lat> [date]");
	console.log("Example: node getValue.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM 138.73 35.36");
	process.exit(1);
}

const collectionUrl = args[0];
const band = args[1];
const lng = parseFloat(args[2]);
const lat = parseFloat(args[3]);
const date = args[4] ? new Date(args[4]) : new Date();

//指定された緯度経度を中心として±0.001度の狭い区域でbboxを作る
const dl = 0.001;
const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];

//DataObjectを取得
//画像サイズは100px四方
const dataObject = await je.getDataObject({
	collectionUrl,
	date,
	band,
	bbox,
	width: 100,
	height: 100,
});

if (!dataObject) {
	console.error("データの取得に失敗しました。");
	process.exit(1);
}

//統計値計算を行う(最小値、最大値、平均値など)
const stat = je.data.globalStat(dataObject);

//結果を出力
console.log({
	value: stat.mean,
	unit: dataObject.unit,
	date: dataObject.formattedDate,
	lng,
	lat,
	collectionUrl
});
