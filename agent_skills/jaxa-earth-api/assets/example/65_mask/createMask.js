/*
	GeoJSONのfeatureからマスク用のデータを作成

	戻り値: {
		bbox: ポリゴン全体を包含するためのBBOX（緯度経度範囲）
		width: 画像の幅（引数で指定するもの）
		height: 画像の高さ（bboxとwidthを踏まえて、縦横比が変わらないようにするために求められた高さ）
		dataObject: ポリゴンの内側のピクセルを1、外側のピクセルを0としたDataObject
		properties: feature.propertiesの全内容
	}
*/

// ポリゴンを三角形に分割するライブラリを利用
// mapbox earcut [https://github.com/mapbox/earcut], ISC License [https://github.com/mapbox/earcut/blob/main/LICENSE]
import earcut, { flatten } from "./earcut.js";


// 図形の全頂点情報からBBOXを計算する
const getBbox = (coordinates) => {
	let s = { Xmin: Infinity, Xmax: -Infinity, Ymin: Infinity, Ymax: -Infinity };

	for (let mc of coordinates) for (let c of mc) for (let [x, y] of c) {
		if (x < s.Xmin) s.Xmin = x;
		if (x > s.Xmax) s.Xmax = x;
		if (y < s.Ymin) s.Ymin = y;
		if (y > s.Ymax) s.Ymax = y;
	}

	return [s.Xmin, s.Ymin, s.Xmax, s.Ymax];
};

export default (feature, width) => {

	let coordinates = null;
	if (feature.geometry.type === "Polygon") coordinates = [feature.geometry.coordinates];		//要素数1個のMultiPolygonの扱いにして、後続の処理内容を統一
	if (feature.geometry.type === "MultiPolygon") coordinates = feature.geometry.coordinates;

	// BBOXを計算
	const bbox = getBbox(coordinates);

	// 縦横比が崩れないように、指定されたwidthに対してheightを決める
	const height = Math.trunc((bbox[3] - bbox[1]) * width / (bbox[2] - bbox[0]));

	// XY座標からIJ座標への座標変換
	const kx = width / (bbox[2] - bbox[0]);
	const ky = height / (bbox[3] - bbox[1]);
	const getI = x => (x - bbox[0]) * kx;
	const getJ = y => (bbox[3] - y) * ky;

	// まずは全ピクセルを0で塗りつぶす
	const data = new Float32Array(width * height).fill(0);

	{
		// エッジ関数を用いて三角形を塗りつぶす
		const fill = (x0, y0, x1, y1, x2, y2) => {

			// 三角形のBBOXを求める
			const Imin = Math.trunc(getI(Math.min(x0, x1, x2)));
			const Imax = Math.trunc(getI(Math.max(x0, x1, x2)));
			const Jmax = Math.trunc(getJ(Math.min(y0, y1, y2)));
			const Jmin = Math.trunc(getJ(Math.max(y0, y1, y2)));

			const i0 = getI(x0);
			const i1 = getI(x1);
			const i2 = getI(x2);
			const j0 = getJ(y0);
			const j1 = getJ(y1);
			const j2 = getJ(y2);

			const i10 = i1 - i0;
			const i21 = i2 - i1;
			const i02 = i0 - i2;
			const j10 = j1 - j0;
			const j21 = j2 - j1;
			const j02 = j0 - j2;

			// エッジ関数の一部（i,jに依存しない部分）
			const e0__ = - i10 * j0 + j10 * i0;
			const e1__ = - i21 * j1 + j21 * i1;
			const e2__ = - i02 * j2 + j02 * i2;

			// BBOX内の全ピクセルに対して、三角形の内側か外側かを判定して、内側の場合は1で塗りつぶす
			for (let j = Jmin; j <= Jmax; j++) {

				// エッジ関数の一部（iに依存しない部分）
				const e0_ = e0__ + i10 * j;
				const e1_ = e1__ + i21 * j;
				const e2_ = e2__ + i02 * j;

				for (let i = Imin; i <= Imax; i++) {

					// エッジ関数（符号付き面積の2倍）
					const e0 = e0_ - j10 * i;
					const e1 = e1_ - j21 * i;
					const e2 = e2_ - j02 * i;

					// 3つのエッジ関数のうちどれか1つでも負がある場合、この点は三角形の外側にある。
					const n = (e0 < 0) || (e1 < 0) || (e2 < 0);
					// 3つのエッジ関数のうちどれか1つでも正がある場合、この点は三角形の内側にある。
					const p = (e0 > 0) || (e1 > 0) || (e2 > 0);

					// この点(i,j)が三角形の内側かどうか判定し、内側のピクセルの場合は1に設定
					const inside = !(n && p);
					if (inside) data[i + j * width] = 1;
				}
			}
		};

		for (let c of coordinates) {
			// earcutでポリゴンを三角形に分割する
			const data = flatten(c);
			const triangles = earcut(data.vertices, data.holes, data.dimensions);

			// 各三角形を塗りつぶす
			for (let i = 0; i < triangles.length / 3; i++) {
				const x0 = data.vertices[triangles[i * 3 + 0] * 2];
				const y0 = data.vertices[triangles[i * 3 + 0] * 2 + 1];
				const x1 = data.vertices[triangles[i * 3 + 1] * 2];
				const y1 = data.vertices[triangles[i * 3 + 1] * 2 + 1];
				const x2 = data.vertices[triangles[i * 3 + 2] * 2];
				const y2 = data.vertices[triangles[i * 3 + 2] * 2 + 1];
				fill(x0, y0, x1, y1, x2, y2);
			}
		}
	}

	return {
		properties: feature.properties,
		bbox,
		width,
		height,
		dataObject: {
			width,
			height,
			bbox,
			data,
			photometricInterpretation: 1,
			unit: "",
			projection: "EPSG:4326",
		},
	};
};