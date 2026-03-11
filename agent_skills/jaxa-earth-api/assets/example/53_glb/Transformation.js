
//角度の換算定数（度からラジアン）
const DEGtoRAD = Math.PI / 180;

//WGS84による地球の長半径Re[km]と扁平率fe
const Re = 6378.137;
const fe = 1 / 298.257223563;

//地理座標(緯度・経度・楕円体高)を地心座標(地球中心を原点、経度0度緯度0度方向をX軸、北極方向をZ軸、自転する地球に固定)に変換
//地理経度	lng[deg]
//地理緯度	lat[deg]
//楕円体高	h[km]
const getGeocentricPosition = (lng, lat, h) => {
	const coslng = Math.cos(lng * DEGtoRAD);
	const sinlng = Math.sin(lng * DEGtoRAD);
	const coslat = Math.cos(lat * DEGtoRAD);
	const sinlat = Math.sin(lat * DEGtoRAD);

	const e2 = fe * (2 - fe);
	const N = Re / Math.sqrt(1 - e2 * sinlat * sinlat);

	const x = (N + h) * coslat * coslng;
	const y = (N + h) * coslat * sinlng;
	const z = (N * (1 - e2) + h) * sinlat;
	return [x, y, z];
};

//行列とベクトルの積
const mul = (mat, vec) => {
	return mat.map(row => row.reduce((sum, val, i) => sum + val * vec[i], 0));
}

//地平座標からGLB座標への変換行列
//GLBの座標系は、東にX軸、上にY軸、南にZ軸のため軸を入れ替える
const ENUtoGLB = [
	[1, 0, 0],
	[0, 0, 1],
	[0, -1, 0]
];

//地理座標（緯度経度）からGLB座標[km単位]への座標変換を行うクラス
class Transformation {
	constructor(lng, lat, h) {
		//中心地点の地心座標
		this.center = getGeocentricPosition(lng, lat, h);

		//地心座標から地平座標ENU(東X軸、北Y軸、上Z軸)への変換行列
		const coslng = Math.cos(lng * DEGtoRAD);
		const sinlng = Math.sin(lng * DEGtoRAD);
		const coslat = Math.cos(lat * DEGtoRAD);
		const sinlat = Math.sin(lat * DEGtoRAD);
		this.GCtoENU = [
			[-sinlng, coslng, 0],
			[-sinlat * coslng, -sinlat * sinlng, coslat],
			[coslat * coslng, coslat * sinlng, sinlat]
		];
	}

	//地理座標 → GLB座標
	getXYZ(lng, lat, h) {
		//地理座標→地心座標への変換
		const gc = getGeocentricPosition(lng, lat, h);

		//地心座標→地平座標→GLB座標への変換
		return mul(ENUtoGLB, mul(this.GCtoENU, [
			gc[0] - this.center[0],
			gc[1] - this.center[1],
			gc[2] - this.center[2]
		]));
	}
}

export {
	Transformation
}