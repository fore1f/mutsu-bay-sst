import * as je from "../jaxa.earth.esm.js";

import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer.js";
import TileInfo from "@arcgis/core/layers/support/TileInfo.js";

//タイルサイズ512pxでの動作は未確認です。
const tileSize = 256;

const tg = new je.TileGenerator({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
	band: "DSM",
	colorMapObject: {
		min: 0,
		max: 6000,
		colors: "jet",
	},
	tileSize,
	delay: 500,
});

await tg.init();

//--------------------------------------------------

const JeLayer = BaseTileLayer.createSubclass({
	constructor() {
		this.tileInfo = TileInfo.create({
			size: tileSize,
		});
	},

	fetchTile: (z, y, x, options) => {
		console.log(x, y, z);

		return tg.getCanvas(x, y, z, options.signal);
	}
});

const map = new Map({
	// basemap: "streets",
	basemap: "satellite",
	ground: "world-elevation",
	layers: [
		new JeLayer({
			copyright: "JAXA Earth API",
		})
	],
});

//2D表示
// const view = new MapView({
// 	container: "map",
// 	map,
// 	center: [138.5, 36], // 経度, 緯度
// 	zoom: 7,
// });

//3D表示
const view = new SceneView({
	container: "map",
	map,
	camera: {
		position: {
			latitude: 35.0,
			longitude: 138.73,
			z: 20000,
		},
		heading: 0,
		tilt: 65,
	},
});