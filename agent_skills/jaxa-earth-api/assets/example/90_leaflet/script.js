import * as je from "../jaxa.earth.esm.js";

//256pxタイルで描画する場合
const tileSize = 256;
const zoomOffset = 0;

//512pxタイルで描画する場合
// const tileSize = 512;
// const zoomOffset = -1;

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

//--------------------------------------------------

const JeGridLayer = L.GridLayer.extend({
	options: {
		opacity: 1,
		updateWhenIdle: true,	//アイドル中のみ更新する（地図スクロールは更新しない）
		updateWhenZooming: false,	//ズーム中は更新しない

		tileSize,
		zoomOffset,
	},

	createTile: function (coords, done) {
		console.log(coords);
		const { x, y, z } = coords;

		const img = document.createElement("img");

		tg.getCanvas(x, y, z + this.options.zoomOffset).then(canvas => {
			img.src = canvas.toDataURL();
			done(null, img);
		}).catch(e => {
			console.error(e);
			done(e, null);
		});

		return img;
	},

	getAttribution: function () {
		return "JAXA Earth API";
	},

	getTileSize: function () {
		return L.point(tileSize, tileSize);
	},
});


const map = L.map("map").setView([36, 139], 5);

L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
	attribution: "&copy; 国土地理院 地理院地図",
	tileSize,
	zoomOffset,
}).addTo(map);

const jelayer = new JeGridLayer();
map.addLayer(jelayer);
