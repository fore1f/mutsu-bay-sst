import * as je from "../jaxa.earth.esm.js";

const projection = je.Projection.EPSG3857;
// const projection = je.Projection.EPSG4326;

const tg = new je.TileGenerator({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
	band: "DSM",

	colorMapObject: {
		min: 0,
		max: 6000,
		colors: je.Colors.JET,
	},
});

await tg.init();


const jeSource = new ol.source.ImageTile({
	loader: (z, x, y, loaderOptions) => {
		return tg.getCanvas(x, y, z, loaderOptions.signal);
	},
});


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
		new ol.layer.Tile({
			source: jeSource,
			// opacity: 0.5,
		}),
	],

	view: new ol.View({
		//全世界を初期位置にする場合
		// center: ol.proj.fromLonLat([0, 0], projection),
		// zoom: 0,

		//日本周辺を初期位置にする場合
		center: ol.proj.fromLonLat([138, 37], projection),
		zoom: 5,

		//投影法(必須)
		projection,
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
