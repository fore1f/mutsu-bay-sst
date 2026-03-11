import * as je from "../jaxa.earth.esm.js";

const bbox = [-180, -90, 180, 90];
const width = 600;
const height = 300;

//気候変動観測衛星「しきさい」（GCOM-C）による月別の地表面温度のデータを使います。
const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json";
const band = "LST";
const colorMap = new je.image.ColorMap({
	min: -50 + 273.15,
	max: 50 + 273.15,
	colors: je.Colors.JET,
});


const ic = new je.ImageCollection({ collectionUrl });
await ic.init();

//指定した日時範囲のうち、データが存在する日時を取得します。
const list = await ic.getDateAll(
	new Date(Date.UTC(2024, 1 - 1, 1)),	//開始(この値を含む)
	new Date(Date.UTC(2025, 1 - 1, 1)),	//終了(この値は含まない)
);
console.log(list);


//読み込み完了の件数
let ready = 0;
const status = document.getElementById("status");


//並行処理でデータを取得するために、各日付のdataObjectを取得して統計値計算まで実施するPromiseを作成します。
const prs = list.map(async date => {

	//DataObjectを取得
	const im = await ic.getImage({ date, band });
	const dataObject = await im.getDataObject({ bbox, width, height });

	//可視化してDataURLとして格納
	const imgSrc = je.image.createCanvas(dataObject, colorMap).toDataURL();

	//統計値を計算
	const stat = je.data.globalStat(dataObject);

	//読み込み完了の個数を追加
	console.log(dataObject.formattedDate + "分の読み込み完了");
	ready++;
	status.innerHTML = "読み込み中..." + (100 * ready / list.length).toFixed(1) + "%";

	return {
		dataObject,
		imgSrc,
		stat,
	};
});

//全てのPromiseを同時に実行します。
//※listをforループで回して1つずつ順番にデータを取得すると、待ち時間によって全ての処理が止まるため時間がかかります
const result = await Promise.all(prs);
status.innerHTML = "読み込み完了";

//カラーマップの凡例を表示
const cm = document.getElementById("cm");
cm.src = colorMap.createLegendCanvas(500, 30, 10, result[0].dataObject.unit).toDataURL();


{	//アニメーション表示
	const img = document.getElementById("img");
	const yyyymm = document.getElementById("yyyymm");

	let i = 0;
	setInterval(function () {
		img.src = result[i].imgSrc;
		yyyymm.innerHTML = result[i].dataObject.formattedDate;

		i++;
		if (i >= result.length) i = 0;
	}, 100);
}

{	//場所ごとの季節変化量を画像にする

	const dataObject = je.data.compute({
		//全ての時系列データを渡す
		dataObjects: result.map(r => r.dataObject),

		//各場所（ピクセル単位）における最大値と最小値から季節変化量を求めます。
		//values[0]には1月目、values[1]には2月目…のようにデータが格納されてきます。
		//NaN（欠損データ）が1回でもある場合の結果はNaNとなります。（可視化すると透明の扱い）
		operation: (...values) => {
			const min = Math.min(...values);
			const max = Math.max(...values);
			return max - min;
		},

		//得られるデータの単位を指定します。
		unit: "degC",
	});

	const colorMap = new je.image.ColorMap({
		min: 0,
		max: 100,
		colors: je.Colors.JET,
	});

	const img2 = document.getElementById("img2");
	img2.src = je.image.createCanvas(dataObject, colorMap).toDataURL();

	const cm2 = document.getElementById("cm2");
	cm2.src = colorMap.createLegendCanvas(500, 30, 10, dataObject.unit).toDataURL();
}

{	//Plotlyによるグラフ表示
	//https://plotly.com/javascript/

	const max = {
		y: result.map(r => r.stat.max),
		x: result.map(r => r.dataObject.date),
		type: "scatter",
		mode: "lines+markers",
		name: "max",
		line: {
			dash: "dot",
			color: "#ff0000",
			width: 1,
		},
	};

	const mean = {
		y: result.map(r => r.stat.mean),
		x: result.map(r => r.dataObject.date),
		type: "scatter",
		mode: "lines+markers",
		name: "mean",
		line: {
			dash: "solid",
			color: "#000000",
			width: 3,
		},
	};

	const min = {
		y: result.map(r => r.stat.min),
		x: result.map(r => r.dataObject.date),
		type: "scatter",
		mode: "lines+markers",
		name: "min",
		line: {
			dash: "dot",
			color: "#0000ff",
			width: 1,
		},
	};

	const layout = {
		title: { text: band + "の季節変化" },
		xaxis: {
			type: "date",
			tickformat: "%Y-%m-%d",
		},
		width: 600,
		height: 600,
	};

	Plotly.newPlot("chart", [max, mean, min], layout);
}