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
			type: "globe"
		},
		sources: {
			osm: {
				type: "raster",
				tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
				// tiles: ["https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png"],
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
	center: [138.73, 35.39],
	zoom: 6,
	// pitch: 60,
	maxZoom: 11,
	// maxPitch: 75,
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

map.on("load", async () => {

	//----------------------------------------------------------------------------------------------------------------
	//3D地形のレイヤーを追加
	//----------------------------------------------------------------------------------------------------------------

	//Terrain RGBのPNGタイル画像を動的に生成
	const createTerrainRGB = async (dataObject) => {

		//Terrain RGBの仕様に基づいて高度height[m]をRGBに変換
		const getRGB = (height) => {
			if (isNaN(height)) height = 0;

			const h = Math.round((height + 10000) * 10) | 0;
			return {
				r: (h >>> 16) & 255,
				g: (h >>> 8) & 255,
				b: h & 255,
			};
		};

		//Terrain RGBの画像データを作成
		const imageDataObject = {
			width: tileSize,
			height: tileSize,
			data: new Uint8ClampedArray(tileSize * tileSize * 4),	//RGBAの4チャンネル
		};

		if (dataObject != null) {
			for (let i = 0; i < imageDataObject.data.length / 4; i++) {
				const rgb = getRGB(dataObject.data[i]);
				imageDataObject.data[i * 4] = rgb.r;
				imageDataObject.data[i * 4 + 1] = rgb.g;
				imageDataObject.data[i * 4 + 2] = rgb.b;
				imageDataObject.data[i * 4 + 3] = 255;
			}
		}

		//PNG画像のバイナリデータにして返す
		return await je.image.createPngUint8ArrayByImageDataObject(imageDataObject);
	};

	maplibregl.addProtocol("je3d", async (params, abortController) => {
		// console.log(params);

		const [z, x, y] = params.url.split("/").slice(-3).map(v => parseInt(v));
		console.log(z, x, y);

		const dataObject = await tg.getDataObject(x, y, z, abortController.signal);
		const png = await createTerrainRGB(dataObject);

		return { data: png.buffer };
	});

	//https://maplibre.org/maplibre-gl-js/docs/API/interfaces/Source/
	map.addSource("jeSource3D", {
		type: "raster-dem",
		tiles: [`je3d://{z}/{x}/{y}`],
		tileSize,
		attribution: "<a href='https://data.earth.jaxa.jp' target='_blank'>JAXA Earth API</a>",
	});

	map.setTerrain({
		source: "jeSource3D",
		exaggeration: 1.0,		//高さの誇張率
	});

	map.addControl(
		new maplibregl.TerrainControl({
			source: "jeSource3D",
			exaggeration: 1
		})
	);

	//----------------------------------------------------------------------------------------------------------------
	//通常のラスターレイヤーを追加
	//----------------------------------------------------------------------------------------------------------------

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
		attribution: "<a href='https://data.earth.jaxa.jp' target='_blank'>JAXA Earth API</a>",
	});

	map.addLayer({
		id: "jeLayer",
		type: "raster",
		source: "jeSource",
		// paint: {
		// 	"raster-opacity": 0.9,
		// },
	});
});

map.on("idle", () => {
	console.log("読み込み完了");
});