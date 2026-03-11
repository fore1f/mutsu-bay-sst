import * as je from "../jaxa.earth.esm.js";

const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-NDVI.daytime.v3_global_monthly/collection.json";
const band = "NDVI";
const colorMap = new je.image.ColorMap({
	min: 0,
	max: 1,
	colors: je.Colors.NDVI,
	// deleteMin: false,	//最小値以下を透明にするかどうか
	// deleteMax: false,	//最大値以上を透明にするかどうか
});

//画像を表示するためのimg要素
const img = document.getElementById("img");


//指定された条件でDataObjectを取得
const dataObject = await je.getDataObject({
	collectionUrl,
	band,

	//時刻を指定。指定しない場合は最新のデータを取得
	date: new Date(Date.UTC(2021, 6 - 1)),		//yyyy,m-1

	//BBOX指定(省略した場合は[-180,-90,180,90]を使用)
	bbox: [120, 30, 160, 50],

	//サイズ指定(省略した場合は幅1000px高さ500pxを使用)
	// width: 800,
	// height: 400,

	//タイルのデータが読み込まれるたびに実行する関数
	onloading: (progress, dataObject) => {
		//進捗を表示
		console.log(progress + "%");

		//タイルが読み込まれている状況を表示
		//Imageタグのsrcに渡す場合は、HTMLCanvasElement#toDataURLを使用します。
		img.src = je.image.createCanvas(dataObject, colorMap).toDataURL();
	},

	//バイリニアリサンプリングを使用(未指定時は高速なニアレストネイバーje.Resampling.NEARESTを使用)
	// resampling: je.Resampling.BILINEAR,
});

console.log(dataObject);

//カラーマップ凡例を表示(幅500px、高さ30px、文字サイズ10px)
const cm = document.getElementById("cm");
cm.src = colorMap.createLegendCanvas(500, 30, 10, dataObject.unit).toDataURL();


//データの日付(Dateオブジェクト)を取得
console.log(dataObject.date);

//データの日付(データセットごとの日付の有効数字を考慮した画面表示用の文字列)を取得
console.log(dataObject.formattedDate);
