import * as je from "../jaxa.earth.esm.js";

{
	//富士山周辺の緯度経度範囲
	const lng = 138.73;
	const lat = 35.36;
	const dl = 0.2;
	const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];  //[west,south,east,north]

	//地形データ(JAXA AW3D)を取得
	const dataObject = await je.getDataObject({
		collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
		bbox,
		width: 200,
		height: 200,
	});
	
	console.log(dataObject);


	//様々なカラーマップを作成します。
	const colorMaps = [

		//黒～白
		new je.image.ColorMap({
			min: 0,
			max: 4000,
			colors: je.Colors.GRAY,
		}),

		//青～水色～緑～黄色～赤(虹色)
		new je.image.ColorMap({
			min: 0,
			max: 4000,
			colors: je.Colors.JET,
		}),

		//茶～緑
		new je.image.ColorMap({
			min: 0,
			max: 4000,
			colors: je.Colors.NDVI,
		}),

		//赤～白～青
		new je.image.ColorMap({
			min: 0,
			max: 4000,
			colors: je.Colors.SMC,
		}),

		//紺～白
		new je.image.ColorMap({
			min: 0,
			max: 4000,
			colors: je.Colors.IC,
		}),

		//独自の色配列を指定する場合はRRGGBBの形式の色コード文字列の配列で指定
		new je.image.ColorMap({
			min: 0,
			max: 4000,
			colors: ["ffffff", "ff0000", "00ff00", "0000ff", "000000"],
		}),

		//色に透明度を持たせる場合はRRGGBBAAの形式の色コード文字列の配列で指定
		new je.image.ColorMap({
			min: 0,
			max: 4000,
			colors: ["ff000033", "00ff0033", "0000ff33"],
		}),

		//1000～3000を虹色に塗る場合
		new je.image.ColorMap({
			min: 1000,
			max: 3000,
			colors: je.Colors.JET,
		}),

		//1000～3000のみを塗る場合(他の値は透明)
		new je.image.ColorMap({
			min: 1000,
			max: 3000,
			colors: je.Colors.JET,
			deleteMin: true,
			deleteMax: true,
		}),

		//0.1～3000を対数目盛で虹色に塗る場合
		new je.image.ColorMap({
			min: 0.1,
			max: 3000,
			colors: je.Colors.JET,
			log: true,
		}),
	];

	for (let colorMap of colorMaps) {
		//データとカラーマップからcanvas要素を作成し、ブラウザ上に表示します。

		//可視化した画像をcanvas要素として追加
		document.body.appendChild(je.image.createCanvas(dataObject, colorMap));
		document.body.appendChild(document.createTextNode(" "));	//空白

		//カラーマップ凡例をcanvas要素として追加(幅300px、高さ30px、文字サイズ10px)
		document.body.appendChild(colorMap.createLegendCanvas(300, 30, 10, dataObject.unit));
		document.body.appendChild(document.createElement("br"));	//改行
		document.body.appendChild(document.createElement("br"));	//改行
	}
}

//----------------------------------------------------------------------------------------------------
//以下、画像データ用の数値配列を独自に作成し、NaNを含む画像を可視化する例

{
	const createData = (width, height) => {
		//width * height個の要素を全てNaNで満たしたFloat32Arrayを作成
		const array = new Float32Array(width * height).fill(NaN);

		//i + j < 200 であれば (i, j) = i + j 、そうでない場合はNaNのままとなるように数値を埋める
		for (let i = 0; i < width; i++) for (let j = 0; j < height; j++) {
			const sum = i + j;
			if (sum < 200) {
				array[i + j * width] = sum;
			}
		}
		return array;
	};

	const width = 200;
	const height = 200;

	const dataObject = {
		width,
		height,
		data: createData(width, height),
		photometricInterpretation: 1,	//画像の種類と色の付け方を識別するために必須(1固定)
		unit: "XXX",
	};

	console.log(dataObject);

	//0～200が白～黒、NaNは赤"ff0000"となるカラーマップを作成。
	const colorMap = new je.image.ColorMap({
		min: 0,
		max: 200,
		colors: ["ffffff", "000000"],
		nanColor: "ff0000",
	});

	document.body.appendChild(je.image.createCanvas(dataObject, colorMap));
	document.body.appendChild(document.createTextNode(" "));	//空白
	document.body.appendChild(colorMap.createLegendCanvas(300, 30, 10, dataObject.unit));
}