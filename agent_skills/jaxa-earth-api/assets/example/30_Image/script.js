import * as je from "../jaxa.earth.esm.js";

const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-W.AMSR2_standard.L3-SMC.daytime.v3_global_monthly/collection.json";
const ic = new je.ImageCollection({ collectionUrl });

//初期化(必須)
await ic.init();

const image = await ic.getImage({
	date: new Date(Date.UTC(2021, 6 - 1)),
	band: "SMC",
});

//カラーマップ指定
const colorMap = new je.image.ColorMap({
	min: 0,
	max: 30,
	// colors: je.Colors.SMC,	//省略した場合は黒～白になる(colors: je.Colors.GLAYを自動設定)
});

//画像を表示するためのimg要素
const img = document.getElementById("img");

//DataObjectを取得します。
const dataObject = await image.getDataObject({

	bbox: [120, 30, 160, 50],
	width: 600,
	height: 300,
	// resampling: je.Resampling.BILINEAR,

	//タイルのデータが読み込まれるたびに実行する関数
	onloading: (progress, dataObject) => {
		//進捗を表示
		console.log(progress + "%");

		//タイルが読み込まれている状況を表示
		//Imageタグのsrcに渡す場合は、HTMLCanvasElement#toDataURLを使用します。
		img.src = je.image.createCanvas(dataObject, colorMap).toDataURL();
	},
});

console.log(dataObject);

//カラーマップ凡例を表示(幅500px、高さ30px、文字サイズ10px)
const cm = document.getElementById("cm");
cm.src = colorMap.createLegendCanvas(500, 30, 10, dataObject.unit).toDataURL();


//2秒後にカラーマップを変えて再表示
setTimeout(() => {
	const colorMap2 = new je.image.ColorMap({
		min: 0,
		max: 30,
		colors: je.Colors.SMC,	//省略した場合は黒～白になる(colors: je.Colors.GLAYを自動設定)
	});

	img.src = je.image.createCanvas(dataObject, colorMap2).toDataURL();
	cm.src = colorMap2.createLegendCanvas(500, 30, 10, dataObject.unit).toDataURL();
}, 2000);