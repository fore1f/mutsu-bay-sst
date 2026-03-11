
import * as je from "../jaxa.earth.esm.js";

class JeImageryProvider {
	constructor(options) {
		const tileSize = 256;	//または512

		this.tileWidth = tileSize;
		this.tileHeight = tileSize;
		this.minimumLevel = 0;
		this.maximumLevel = 18;
		this.tilingScheme = new Cesium.WebMercatorTilingScheme();
		this.rectangle = this.tilingScheme.rectangle;
		this.credit = new Cesium.Credit(options.credit);

		this.tg = new je.TileGenerator({
			collectionUrl: options.collectionUrl,
			band: options.band,
			date: options.date,
			colorMapObject: options.colorMapObject,
			tileSize,
		});

		this.hasAlphaChannel = true;
	}

	async init() {
		await this.tg.init();
	}

	async requestImage(x, y, level) {
		return this.tg.getCanvas(x, y, level);
	}
}


const gsiStd = new Cesium.UrlTemplateImageryProvider({
	url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
	credit: new Cesium.Credit(`<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">地理院タイル（国土地理院）</a>`),
	maximumLevel: 18,
});

const viewer = new Cesium.Viewer("cesiumContainer", {
	baseLayer: new Cesium.ImageryLayer(gsiStd),

	animation: false,			// 左下アニメーション
	timeline: false,			// 左下タイムライン
	fullscreenButton: false,	// 右下フルスクリーン
	baseLayerPicker: false,		// ベースレイヤー選択
	geocoder: false,			// 検索ボックス
	homeButton: false,			// Homeボタン
	sceneModePicker: false,		// 2D/3D切替
	navigationHelpButton: false,// ヘルプ
	infoBox: false,				// エンティティ情報ボックス
	selectionIndicator: false,	// 選択マーカー

	// sceneMode: Cesium.SceneMode.SCENE2D,
});

viewer.scene.fog.enabled = false;
viewer.scene.skyAtmosphere.show = false;
viewer.scene.globe.showGroundAtmosphere = false;
viewer.scene.globe.enableLighting = false;

const jeImageryProvider = new JeImageryProvider({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-SST.daytime.v3_global_monthly/collection.json",
	band: "SST",
	date: new Date("2025-08-01T00:00:00Z"),

	colorMapObject: {
		min: 0,
		max: 40,
		colors: je.Colors.JET,
	},

	credit: `<a href="https://data.earth.jaxa.jp/" target="_blank" rel="noopener">JAXA Earth API</a>`,
});

await jeImageryProvider.init();

viewer.imageryLayers.addImageryProvider(jeImageryProvider);

viewer.camera.flyTo({
	destination: Cesium.Cartesian3.fromDegrees(136, 35, 8000000),
	orientation: {
		heading: Cesium.Math.toRadians(0.0),
		pitch: Cesium.Math.toRadians(-90.0),
	}
});
