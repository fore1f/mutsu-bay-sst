
import * as THREE from "three";
import * as je from "../jaxa.earth.esm.js";
import { Transformation } from "./Transformation.js";

//JAXA Earth APIのデータからThree.js用の3Dモデルを構築します。
const createModel = async (lng, lat, dl, size) => {

	const width = size;
	const height = size;
	const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];

	//地形データ（AW3D）を取得します。
	const dataObject = await je.getDataObject({
		collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
		band: "DSM",
		width,
		height,
		bbox,
		
		//地形の傾斜を再現するためにはバイリニアリサンプリングが必要です。
		//これを指定しない場合はニアレストネイバーを利用するため、3D等で表示した場合に不自然な段差が発生する場合があります。
		resampling: je.Resampling.BILINEAR,

		onloading: (progress, dataObject) => {
			console.log(progress);
		},
	});

	//----------------------------------------------------------------------------------------------------

	//地表面温度のデータを取得します。
	const dataObject2 = await je.getDataObject({
		collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds2/cog/v1/JAXA.JASMES_GCOM-C.SGLI_standard.L2-LST.daytime.v3_japan_8-day/collection.json",
		band: "LST_AVE",
		date: new Date(Date.UTC(2024, 11 - 1, 1)),
		width,
		height,
		bbox,
		resampling: je.BILINEAR,

		onloading: (progress, dataObject) => {
			console.log(progress);
		},
	});

	const textureCanvas = je.image.createCanvas(dataObject2, new je.image.ColorMap({
		min: 0 + 273.15,
		max: 40 + 273.15,
		colors: je.Colors.JET,
	}));

	//----------------------------------------------------------------------------------------------------

	//3Dモデルの情報（頂点座標、UV座標、面の定義）を作成します。
	const create = (dataObject) => {

		//観測データの中心位置と幅
		const lng = (dataObject.bbox[2] + dataObject.bbox[0]) * 0.5;
		const lat = (dataObject.bbox[1] + dataObject.bbox[3]) * 0.5;
		const dlng = (dataObject.bbox[2] - dataObject.bbox[0]) / dataObject.width;
		const dlat = (dataObject.bbox[3] - dataObject.bbox[1]) / dataObject.height;

		//地理座標（緯度経度）からGLB座標[km単位]への座標変換を行うクラス
		const tr = new Transformation(lng, lat, 0);

		//表示するモデルのスケール
		const scale = 1;

		//頂点データと、テクスチャ画像の位置を指定するためのUV座標を作成
		const vertices = [];
		const uvs = [];
		for (let j = 0; j < dataObject.height; j++) {
			for (let i = 0; i < dataObject.width; i++) {

				//データの中心地点を中心とした座標系に変換
				const lng = dataObject.bbox[0] + i * dlng;
				const lat = dataObject.bbox[1] + (dataObject.height - j - 1) * dlat;
				const z = isNaN(dataObject.data[i + j * dataObject.width]) ? 0 : dataObject.data[i + j * dataObject.width] * 0.001;		//[m]から[km]に換算
				const xyz = tr.getXYZ(lng, lat, z);

				//頂点座標
				vertices.push(
					xyz[0] * scale,
					xyz[1] * scale,
					xyz[2] * scale
				);

				//UV座標
				uvs.push(
					i / (width - 1),
					1 - j / (height - 1)
				);
			}
		}

		//面を定義するためのインデックス情報を作成
		const indices = [];
		for (let j = 0; j < height - 1; j++) {
			for (let i = 0; i < width - 1; i++) {
				const k = i + j * width;
				const iRight = k + 1;
				const iDown = k + width;
				const iDownRight = iDown + 1;

				indices.push(k, iDown, iRight);
				indices.push(iRight, iDown, iDownRight);
			}
		}

		//結果はFloat32Arrayとして返す
		return {
			vertices: new Float32Array(vertices),
			indices: new Uint32Array(indices),
			uvs: new Float32Array(uvs),
		};
	};

	const { vertices, indices, uvs } = create(dataObject);

	//形状データ（BufferGeometry）
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
	geometry.setIndex(new THREE.BufferAttribute(indices, 1));
	geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
	geometry.computeVertexNormals();

	//マテリアルデータ（MeshStandardMaterial）
	const material = new THREE.MeshStandardMaterial({
		map: new THREE.CanvasTexture(textureCanvas),
	});

	return new THREE.Mesh(geometry, material);
};

export {
	createModel
}