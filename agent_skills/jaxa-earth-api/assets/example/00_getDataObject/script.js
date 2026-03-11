import * as je from "../jaxa.earth.esm.js";

//--------------------------------------------------
//地形データ(JAXA AW3D)を利用する場合
//--------------------------------------------------
const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json";
const band = "DSM";
const colorMap = new je.image.ColorMap({
	min: 0,
	max: 6000,
	colors: je.Colors.JET,
	// nanColor: "cccccccc",	//NaNに色を塗る場合("RRGGBB"または"RRGGBBAA"の形式で入力。未指定時は透明)
});

//--------------------------------------------------
//降雨量のデータ(JAXA GSMaP)を利用する場合
//--------------------------------------------------
// const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_GSMaP_standard.Gauge.00Z-23Z.v6_daily/collection.json";
// const band = "PRECIP";
// const colorMap = new je.image.ColorMap({
// 	min: 0.01,
// 	max: 50,
// 	colors: je.Colors.JET,
// 	deleteMin: true,	//min以下の透明化設定
// 	// deleteMax: false,	//max以上の透明化設定
// 	log: true,		//対数目盛にする場合
// 	nanColor: "cccccccc",	//NaNに色を塗る場合("RRGGBB"または"RRGGBBAA"の形式で入力。未指定時は透明)
// });

//指定された条件でje.Imageオブジェクトを取得
const dataObject = await je.getDataObject({
	//データのcollection.jsonのURLを指定(必須)
	collectionUrl,

	//バンドを指定。指定しない場合はImageCollection中の最初のバンドを取得
	// band,

	//BBOX指定(省略した場合は[-180,-90,180,90]を使用)
	// bbox: [120, 30, 160, 50],

	//出力サイズ指定(省略した場合は幅1000px高さ500pxを使用)
	// width: 2000,
	// height: 1000,

	//バイリニアリサンプリングを使用(未指定時は高速なニアレストネイバーje.Resampling.NEARESTを使用)
	resampling: je.Resampling.BILINEAR,
});

console.log(dataObject);

//可視化した画像をcanvas要素として追加
document.body.appendChild(je.image.createCanvas(dataObject, colorMap));

//カラーマップ凡例をcanvas要素として追加(幅500px、高さ30px、文字サイズ10px)
document.body.appendChild(colorMap.createLegendCanvas(500, 30, 10, dataObject.unit));

//統計値(地球の球面を考慮しない)を計算します。
console.log(je.data.stat(dataObject));

//統計値(地球の球面を考慮する)を計算します。
console.log(je.data.globalStat(dataObject));


//応用例：ピクセルごとのデータをCSV形式の文字列にしてコンソールに出力する
//実際にファイルとしてダウンロードさせる例は、je.data.createCsvのサンプルをご参照ください。
{
	const csv = (dataObject) => {
		const csv = [];
		for (let j = 0; j < dataObject.height; j++) {

			//1行分をカンマで区切って連結する
			const line = [];
			for (let i = 0; i < dataObject.width; i++) {
				line.push(dataObject.data[i + j * dataObject.width]);
			}
			csv.push(line.join(","));
		}

		//全ての行を改行で連結する
		return csv.join("\n");
	};

	console.log(csv(dataObject));
}

//応用例：平均値を求める
//このサンプルでは、実際の地球表面上におけるピクセルごとの面積の違いは考慮しておらず、配列の操作の例として単純な統計計算の例を示しているものです。
{
	//NaNの値を除いて平均を求める
	const mean = (dataObject) => {
		let sum = 0;
		let size = 0;

		for (let i = 0; i < dataObject.data.length; i++) {
			if (isNaN(dataObject.data[i])) continue;
			sum += dataObject.data[i];
			size++;
		}
		return sum / size;
	}

	console.log(mean(dataObject));
}
