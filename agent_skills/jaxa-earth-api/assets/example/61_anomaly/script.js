import * as je from "../jaxa.earth.esm.js";


const width = 400;
const height = 400;
const bbox = [120, 15, 160, 55];


//観測値と平年値に使うカラーマップ
const colorMap12 = new je.image.ColorMap({
	min: 10,
	max: 35,
	colors: je.Colors.JET,
});


//観測値を取得
const dataObject1 = await je.getDataObject({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds2/cog/v1/JAXA.G-Portal_GCOM-W.AMSR2_standard.L3-SST.nighttime.v4_global_daily/collection.json",
	band: "SST",
	width,
	height,
	bbox,
});
console.log(dataObject1);
document.body.appendChild(document.createTextNode("-----観測値-----"));
document.body.appendChild(document.createElement("br"));
document.body.appendChild(je.image.createCanvas(dataObject1, colorMap12));

document.body.appendChild(document.createElement("br"));

//平年値を取得
const dataObject2 = await je.getDataObject({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds2/cog/v1/JMA_COBE-SST-interpolation_SST.v2_global_daily-normal/collection.json",
	band: "SST",
	width,
	height,
	bbox,
});
console.log(dataObject2);
document.body.appendChild(document.createTextNode("-----平年値-----"));
document.body.appendChild(document.createElement("br"));
document.body.appendChild(je.image.createCanvas(dataObject2, colorMap12));

//カラーマップの凡例を表示
document.body.appendChild(colorMap12.createLegendCanvas(400, 30, 10, dataObject1.unit));

document.body.appendChild(document.createElement("br"));
document.body.appendChild(document.createElement("br"));

//平年差を計算
const anomaly = je.data.compute({
	dataObjects: [dataObject1, dataObject2],

	//ピクセル間の演算方法を定義（引数はdataObjectsの配列の順番と同一）
	operation: (value_of_dataObject1, value_of_dataObject2) => value_of_dataObject1 - value_of_dataObject2,

	unit: "degC",
	date: dataObject1.date,
	formattedDate: dataObject1.formattedDate,
});
console.log(anomaly);

//平年差用のカラーマップ
const colorMap_anomaly = new je.image.ColorMap({
	min: -6,
	max: 6,
	colors: je.Colors.JET,
});

//平年差とカラーマップの凡例を表示
document.body.appendChild(document.createTextNode("-----平年差（偏差）-----"));
document.body.appendChild(document.createElement("br"));
document.body.appendChild(je.image.createCanvas(anomaly, colorMap_anomaly));
document.body.appendChild(colorMap_anomaly.createLegendCanvas(400, 30, 10, anomaly.unit));

//平年差に対して統計値を求める
console.log(je.data.stat(anomaly));
console.log(je.data.globalStat(anomaly));
