import * as je from "../jaxa.earth.esm.js";

const projection = je.Projection.EPSG3995;

const ig = new je.ImageGenerator({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.JASMES_GCOM-W.AMSR2_ic0.v201_north_daily/collection.json",
	band: "IC0",

	colorMapObject: {
		min: 0,
		max: 100,
		colors: je.Colors.IC,
	},
	// resampling: je.Resampling.BILINEAR,
	// resampling: je.Resampling.NEAREST,
});

await ig.init();


const jeSource = new ol.source.ImageCanvas({
	canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
		const [width, height] = size.map(e => Math.floor(e));

		//表示用canvas
		const cv = document.createElement("canvas");
		cv.width = width;
		cv.height = height;
		const ctx = cv.getContext("2d", {
			willReadFrequently: true,
			alpha: true,
		});

		ig.getCanvas(width, height, extent, projection.getCode(), (progress, canvas, dataObject) => {
			document.getElementById("status").innerHTML = progress.toFixed(0) + "%";
			
			ctx.clearRect(0, 0, width, height);
			ctx.drawImage(canvas, 0, 0);		//NaN部分が透明なcanvas画像として重ね書きされるため、上記で全体消去が必要
			map.render();

			// console.log(progress, dataObject);
		}, null);

		return cv;
	},
	ratio: 1,
	interpolate: false,
});


proj4.defs("EPSG:3995", "+proj=stere +lat_0=90  +lat_ts=71  +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
ol.proj.proj4.register(proj4);


const map = new ol.Map({
	target: "map",
	pixelRatio: 1,

	layers: [
		new ol.layer.Tile({
			// source: new ol.source.OSM(),
			source: new ol.source.XYZ({
				//https://maps.gsi.go.jp/development/ichiran.html
				url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
			}),
		}),
		new ol.layer.Image({
			source: jeSource,
			// opacity: 0.5,
		}),
	],

	view: new ol.View({
		center: [0, 0],
		zoom: 3,
		extent: [-8388608, -8388608, 8388608, 8388608],
		projection: ol.proj.get(projection),
	}),

	controls: ol.control.defaults.defaults({
		zoom: true,
		attribution: false,
		rotate: false
	}),

	interactions: ol.interaction.defaults.defaults({
		altShiftDragRotate: false,
		pinchRotate: false
	}),
});

//クリックした場所の値を取得する
map.on("click", async (e) => {

	// クリックした位置のピクセル座標(div#mapの左上が(0,0)、右下が(width-1,height-1))
	const [i, j] = e.pixel;

	const dataObject = ig.getDataObject();

	if (dataObject != null) {
		// 読み込みが完了している場合

		// 値を取得するためのInspectorを作成
		const isp = new je.data.Inspector(dataObject);

		// クリックした場所の座標
		const { x, y } = isp.getCoordinateByPixelXY(i, j);

		// クリックした場所の値
		const value = isp.getValueByPixelXY(i, j);

		// データの単位
		const unit = dataObject.unit;

		alert(JSON.stringify({
			x,
			y,
			projection: dataObject.projection,
			value,			// JSON.stringifyを通すと値が無い場合のNaNがnullと表示される点に注意
			unit,
		}, null, "  "));

	} else {
		//読み込み中の場合
		alert("読み込み完了までお待ちください");
	}
});