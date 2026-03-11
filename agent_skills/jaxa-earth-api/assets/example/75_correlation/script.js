import * as je from "../jaxa.earth.esm.js";

//指定した条件でDataObjectを取得する関数（使いまわせるように定義）
const getData = async ({ collectionUrl, date, band, width, height, area, img, cm }) => {
	const bbox = [area.lng - area.dl, area.lat - area.dl, area.lng + area.dl, area.lat + area.dl];  //[west,south,east,north]

	const dataObject = await je.getDataObject({ collectionUrl, date, band, bbox, width, height });
	console.log(dataObject);

	const stat = je.data.stat(dataObject);

	const colorMap = new je.image.ColorMap({
		min: stat.min,
		max: stat.max,
		colors: je.Colors.JET,
	});

	//結果を表示する
	document.getElementById(img).src = je.image.createCanvas(dataObject, colorMap).toDataURL();
	document.getElementById(cm).src = colorMap.createLegendCanvas(200, 30, 10, dataObject.unit).toDataURL();

	return dataObject;
};


//評価する場所（中心位置の経度緯度と、緯度経度方向の幅）
const area = { lng: 138.19, lat: 35.71, dl: 1.0 };	//中部地方

//取得する画像サイズ
const width = 100;
const height = 100;

//標高のデータ
const aw3d = await getData({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
	band: "DSM",
	width,
	height,
	area,
	img: "img1",
	cm: "cm1",
});

//地表面温度のデータ
const lst = await getData({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json",
	date: new Date(Date.UTC(2021, 12 - 1)),
	band: "LST",
	width,
	height,
	area,
	img: "img2",
	cm: "cm2",
});

//標高と地表面温度のデータを組にする
const data = [];

for (let i = 0; i < width * height; i++) {
	if (isNaN(aw3d.data[i])) continue;	//欠損値は削除
	if (isNaN(lst.data[i])) continue;	//欠損値は削除
	if (aw3d.data[i] <= 0) continue;	//標高0[m]以下（海）は削除

	data.push({
		x: aw3d.data[i],
		y: lst.data[i] - 273.15,	//ケルビンから℃単位に換算
	});
}

//----------------------------------------------------------------------------------------------------

//最小二乗法で回帰直線 y = slope * x + intercept を求める関数。dataは{x, y}の組の配列
const linearRegression = (data) => {
	//データの個数
	const n = data.length;

	//平均
	let sumX = 0, sumY = 0;
	for (const { x, y } of data) {
		sumX += x;
		sumY += y;
	}
	const meanX = sumX / n;
	const meanY = sumY / n;

	//共分散と分散
	let Sxx = 0;	//Σ(x - x̄)^2
	let Sxy = 0;	//Σ(x - x̄)(y - ȳ)
	let Syy = 0;	//Σ(y - ȳ)^2
	for (const { x, y } of data) {
		const dx = x - meanX;
		const dy = y - meanY;
		Sxx += dx * dx;
		Sxy += dx * dy;
		Syy += dy * dy;
	}

	const slope = Sxy / Sxx;
	const intercept = meanY - slope * meanX;

	//決定係数 R^2（単回帰では相関係数の二乗に一致）
	const r2 = Syy === 0 ? 1 : (Sxy * Sxy) / (Sxx * Syy);

	const predict = (x) => slope * x + intercept;

	return {
		slope,		//傾き
		intercept,	//切片
		r2,			//決定係数
		predict,	//予測関数
	};
};

//回帰分析を行います。
const { slope, intercept, r2, predict } = linearRegression(data);

{	//回帰分析の結果を表示します。
	console.log("a(傾き)", slope);
	console.log("b(切片)", intercept);
	console.log("R^2", r2);
	document.getElementById("slope").innerHTML = slope.toFixed(6) + "[℃/m]";
}

{	//標高をX、地表面温度をYとして相関関係をグラフにします
	const chart = {
		x: data.map(e => e.x),
		y: data.map(e => e.y),
		mode: "markers",
		type: "scatter",
		marker: {
			// color: "#ccc",
			opacity: Array(width * height).fill(0.1),
			// size: 1,
		},
		name: "データ",
	};

	//回帰直線
	const line = {
		x: [0, 3000],
		y: [predict(0), predict(3000)],
		mode: "lines",
		type: "scatter",
		marker: {
			color: "#ff0000",
		},
		name: "回帰直線",
	};

	Plotly.newPlot("chart", [chart, line]);
}