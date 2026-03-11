import * as je from "../jaxa.earth.esm.js";

//富士山周辺の緯度経度範囲
const lng = 138.73;
const lat = 35.36;
const dl = 0.2;
const bbox = [lng - dl * 2, lat - dl, lng + dl * 2, lat + dl];  //[west,south,east,north]

//地形データ(JAXA AW3D)を取得
const dataObject = await je.getDataObject({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
	bbox,
	width: 600,
	height: 300,

	//地形の傾斜を再現するためにはバイリニアリサンプリングが必要です。
	//これを指定しない場合(false)はニアレストネイバーを利用するため、3D等で表示した場合に不自然な段差が発生する場合があります。
	resampling: je.Resampling.BILINEAR,
});

console.log(dataObject);

//----------------------------------------------------------------------------------------------------

//ピクセル間の距離[m] (地球の極半径は6,356,752[m]とする)
const mppx = 6356752 * (dataObject.bbox[3] - dataObject.bbox[1]) * (Math.PI / 180) / dataObject.height;

//標高と傾斜量からRGBの色(明るさ)を0～255の値として求めます。dh << mppx として近似した簡易計算です。
//hc: 中心ピクセルの標高[m]
//dh: 南側のピクセルの標高 - 北側のピクセルの標高[m]
const getRGB = (hc, dh) => {
	if (isNaN(dh)) dh = 0;
	if (isNaN(hc)) hc = 0;
	return 255 * (0.5 + 0.3 * dh / mppx - hc * 0.00003);
};


//HTMLCanvasElementからImageDataを取得する場合
{
	//HTMLCanvasElementを作成します。
	const cv = document.createElement("canvas");
	cv.width = dataObject.width;
	cv.height = dataObject.height;
	const ctx = cv.getContext("2d");

	//Canvasをピクセル単位で操作するために、ImageDataを取得します。
	const imgdata = ctx.getImageData(0, 0, dataObject.width, dataObject.height);

	//ピクセルごとに南北方向の傾斜量を求めて、それに応じた明るさを設定します。
	//j=0, j=data.height-1の行は上側または下側に隣接するピクセルが無いため、計算を省略します。（透明なピクセルになります）
	for (let j = 1; j < dataObject.height - 1; j++) {
		let index = j * dataObject.width;

		for (let i = 0; i < dataObject.width; i++) {

			//評価するピクセルの上(北側)に隣接するピクセルの標高[m]
			const hn = dataObject.data[index - dataObject.width];

			//評価するピクセルの標高[m]
			const hc = dataObject.data[index];
			
			//評価するピクセルの下(南側)に隣接するピクセルの標高[m]
			const hs = dataObject.data[index + dataObject.width];
			
			//標高と傾斜量からRGBの色(明るさ)を設定
			const rgb = getRGB(hc, hs - hn);

			//ImageDataの配列に色の情報を格納します。配列は[R(赤成分),G(緑成分),B(青成分),A(不透明度成分)]で指定します。
			//この例ではR=G=Bのためグレースケールで、A=255のため不透明な画像となります。
			//ImageDataでは1ピクセルあたりRGBAの4成分を持っているため、色情報を格納する位置はindex*4(ビットシフト演算でindex<<2)です。
			imgdata.data.set([rgb, rgb, rgb, 255], index << 2);

			index++;
		}
	}

	//ImageDataをCanvasに描画します。
	ctx.putImageData(imgdata, 0, 0);

	//ブラウザ上に表示します。
	document.body.appendChild(cv);
}


//Uint8ClampedArrayから直接ImageDataを作成する場合
{
	//ピクセル数の4倍の長さを持つUint8ClampedArrayを作成します。（RGBAの4成分を持たせるため）
	const array = new Uint8ClampedArray(dataObject.width * dataObject.height * 4);

	//0～4000mを虹色で塗るカラーマップを作成します。
	const colorMap = new je.image.ColorMap({
		min: 0,
		max: 4000,
		colors: je.Colors.JET,
	});

	//ピクセルごとに色を計算します。
	for (let j = 1; j < dataObject.height - 1; j++) {
		let index = j * dataObject.width;

		for (let i = 0; i < dataObject.width; i++) {
			const hn = dataObject.data[index - dataObject.width];
			const hc = dataObject.data[index];
			const hs = dataObject.data[index + dataObject.width];

			//陰影起伏図として描画されるグレースケールの値(0～255)を0～1.5程度の数値に換算します。
			const gray = 1.5 * getRGB(hc, hs - hn) / 255;

			//カラーマップからhc[m]における色を取得します。[R,G,B,A]の4成分を持つUint8ClampedArrayとして得られます。
			const rgb = colorMap.getColorUint8ClampedArray(hc);

			//陰影起伏図の色とカラーマップの色を合成した色を設定します。
			array.set([
				rgb[0] * gray,	//R成分
				rgb[1] * gray,	//G成分
				rgb[2] * gray,	//B成分
				rgb[3]			//A成分
			], index << 2);

			index++;
		}
	}

	console.log(array);
	

	//HTMLCanvasElementを作成します。
	const cv = document.createElement("canvas");
	cv.width = dataObject.width;
	cv.height = dataObject.height;
	const ctx = cv.getContext("2d");

	//ImageDataを作成し、Canvasに描画します。
	ctx.putImageData(new ImageData(array, dataObject.width, dataObject.height), 0, 0);

	//ブラウザ上に表示します。
	document.body.appendChild(cv);
}