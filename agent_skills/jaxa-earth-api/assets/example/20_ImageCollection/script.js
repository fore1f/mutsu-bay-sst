import * as je from "../jaxa.earth.esm.js";

//----------------------------------------------------------------------------------------------------
//je.ImageCollectionの利用例
//----------------------------------------------------------------------------------------------------

// 利用したいデータセットを特定するためのcollection.jsonを指定します。
const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-W.AMSR2_standard.L3-SMC.daytime.v3_global_monthly/collection.json";

// ImageCollectionを作って初期化します。初期化するとcollection.jsonから必要な情報を読み込みます。
const ic = new je.ImageCollection({ collectionUrl });
await ic.init();

// 最初の日時を取得します。
console.log(ic.first());
console.log(ic.formatDate(ic.first()));

// 最後の日時を取得します。
console.log(ic.last());
console.log(ic.formatDate(ic.last()));

// 指定した日時の前の日時を取得します。
console.log(await ic.prev(new Date(Date.UTC(2023, 2 - 1))));

// 指定した日時の次の日時を取得します。
console.log(await ic.next(new Date(Date.UTC(2023, 2 - 1))));

// 指定した日時範囲のうち、データが存在する日時を取得します。
console.log(await ic.getDateAll(
	new Date(Date.UTC(2020, 1 - 1, 1)),	//開始(この値を含む)
	new Date(Date.UTC(2022, 1 - 1, 1)),	//終了(この値は含まない)
));

// 指定した日時範囲のうち、データが存在する日時（文字列表現）を取得します。
console.log(await ic.getFormattedDateAll(
	new Date(Date.UTC(2020, 1 - 1, 1)),	//開始(この値を含む)
	new Date(Date.UTC(2022, 1 - 1, 1)),	//終了(この値は含まない)
));

// 利用できるバンド名を取得します。
console.log(ic.getBandIdAll());


//----------------------------------------------------------------------------------------------------
//je.Imageの利用例
//----------------------------------------------------------------------------------------------------

// ImageCollectionからje.Imageを取得します。
const im = await ic.getImage({
	// 日時を指定します。指定した日時のデータを取得します。指定しない場合は現在の日時が指定されることで最新のデータを取得できます。
	// この例では2021/6のデータが取得されます。
	date: new Date(Date.UTC(2021, 6 - 1)),

	// バンド名を指定します。省略した場合は１つ目のバンド名を自動で選択します。
	band: "SMC",
});

// DataObjectを取得します。
const dataObject = await im.getDataObject({

	// Bboxを指定します。省略した場合は[-180,-90,180,90]が指定されたものとして動作します。
	bbox: [80, 0, 160, 80],
	
	// サイズを指定します。省略した場合は幅1000px高さ500pxが指定されたものとして動作します。
	width: 400,
	height: 400,

	// リサンプリング方法を指定します。省略した場合はje.Resampling.NEARESTが指定されたものとして動作します。
	// resampling: je.Resampling.BILINEAR,
});

console.log(dataObject);

const colorMap = new je.image.ColorMap({
	min: 0,
	max: 30,
	colors: je.Colors.SMC,
	deleteMin: false,	//最小値以下を透明にするかどうか
	deleteMax: false,	//最大値以上を透明にするかどうか
});

// 可視化した画像をcanvas要素として追加します。
document.body.appendChild(je.image.createCanvas(dataObject, colorMap));

// カラーマップ凡例をcanvas要素として追加(幅500px、高さ30px、文字サイズ10px)
document.body.appendChild(colorMap.createLegendCanvas(500, 30, 10, dataObject.unit));


// データの日付(Dateオブジェクト)を取得
console.log(dataObject.date);
// 次の方法でも取得できます。
console.log(im.getDate());

// データの日付(データセットごとの日付の有効数字を考慮した画面表示用の文字列)を取得
console.log(dataObject.formattedDate);
// 次の方法でも取得できます。
console.log(im.getFormattedDate());


// 最後に取得したDataObjectをキャッシュから再度取得します。
console.log(im.getCachedDataObject());


// 統計値(地球の球面を考慮しない)を計算します。
console.log(je.data.stat(dataObject));

// 統計値(地球の球面を考慮する)を計算します。
console.log(je.data.globalStat(dataObject));


{
	// 値を調べるためのInspectorを作成します。
	const isp = new je.data.Inspector(dataObject);

	// 緯度経度で(135.0, 35.0)の場所のピクセル位置を取得します。
	console.log(isp.getPixelByCoordinateXY(135.0, 35.0));
	
	// ピクセル位置で(275, 225)の場所の緯度経度を取得します。
	console.log(isp.getCoordinateByPixelXY(275, 225));

	// 緯度経度で(135.0, 35.0)の場所の値を取得します。
	console.log(isp.getValueByCoordinateXY(135.0, 35.0));

	// ピクセル位置で(275, 225)の場所の値を取得します。
	console.log(isp.getValueByPixelXY(275, 225));
}

{
	// 投影法をEPSG:3857に変換します。
	const dataObject3857 = je.data.projection.transform(dataObject, je.Projection.EPSG3857);
	console.log(dataObject3857);
	document.body.appendChild(je.image.createCanvas(dataObject3857, colorMap));

	const isp = new je.data.Inspector(dataObject3857);
	console.log(isp.getPixelByCoordinateXY(15028131.257091932, 6798186.104635287));
	console.log(isp.getCoordinateByPixelXY(275, 225));
	console.log(isp.getValueByCoordinateXY(15028131.257091932, 6798186.104635287));
	console.log(isp.getValueByPixelXY(275, 225));
}