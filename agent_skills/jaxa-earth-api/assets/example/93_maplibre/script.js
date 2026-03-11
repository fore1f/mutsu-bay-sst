import * as je from "../jaxa.earth.esm.js";

//タイルサイズは256または512を利用可能です。
const tileSize = 256;
// const tileSize = 512;

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

const map = new maplibregl.Map({
	container: "map",
	pixelRatio: 1,
	style: {
		version: 8,
		projection: {
			type: "globe",
		},
		sources: {
			osm: {
				type: "raster",
				tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
				attribution: "<a href='https://osm.org/copyright' target='_blank'>OpenStreetMap contributors</a>",
			},
		},
		layers: [
			{
				id: "osm",
				type: "raster",
				source: "osm",
			},
		],
	},
	center: [138, 38],
	zoom: 4,
});

map.on("load", async () => {
	maplibregl.addProtocol("je", async (params, abortController) => {
		// console.log(params);

		const [z, x, y] = params.url.split("/").slice(-3).map(v => parseInt(v));
		console.log(z, x, y);

		return tg.getPng(x, y, z, abortController.signal).then((png) => {
			return {
				data: png.buffer,
			};
		}).catch(e => {
			throw e;
		});
	});

	//https://maplibre.org/maplibre-gl-js/docs/API/interfaces/Source/
	map.addSource("jeSource", {
		type: "raster",
		tiles: [`je://{z}/{x}/{y}`],
		tileSize,
		// minzoom: 8,
		// maxzoom: 16,
		attribution: "<a href='https://data.earth.jaxa.jp' target='_blank'>JAXA Earth API</a>",
		// isTileClipped: false,
		// roundZoom: true,
	});

	map.addLayer({
		id: "jeLayer",
		type: "raster",
		source: "jeSource",
	});
});

map.addControl(
	new maplibregl.NavigationControl({
		visualizePitch: true,
		showZoom: true,
		showCompass: true
	})
);

map.addControl(
	new maplibregl.GlobeControl()
);

map.on("idle", () => {
	console.log("読み込み完了");
});

//--------------------------------------------------

setTimeout(() => {
	tg.setColorMapObject({
		min: 0,
		max: 6000,
		colors: je.Colors.GRAY,
	});
	console.log("色変更");
	map.refreshTiles("jeSource");

}, 10000);