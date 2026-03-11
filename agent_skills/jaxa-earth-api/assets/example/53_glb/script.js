
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

import { createModel } from "./createModel.js";

//----------------------------------------------------------------------------------------------------
//Three.jsの準備をします

const dom = document.getElementById("viewer");
const width = dom.clientWidth;
const height = dom.clientHeight;
const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(10));

const XYZsun = new THREE.Vector3(0, 100, 100);
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(XYZsun.x, XYZsun.y, XYZsun.z);
scene.add(light);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
camera.up.set(0, 1, 0);
camera.position.set(0, 30, 30);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new OrbitControls(camera, dom);
controls.minDistance = 10;
controls.maxDistance = 100;
controls.enableDamping = true;
controls.dampingFactor = 0.8;
controls.enablePan = false;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 3;
controls.target = new THREE.Vector3(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	// alpha: true,
});
// renderer.setPixelRatio(1);
renderer.setSize(width, height);
renderer.setAnimationLoop(() => {
	renderer.render(scene, camera);

	if (controls) {
		controls.update(clock.getDelta());
	}
});
dom.appendChild(renderer.domElement);

//----------------------------------------------------------------------------------------------------

//JAXA Earth APIのデータから3Dモデルを作成して追加します。
scene.add(await createModel(138.7306, 35.3628, 0.3, 500));

//----------------------------------------------------------------------------------------------------

//GLBを作成してダウンロードします。
document.getElementById("download").addEventListener("click", () => {

	//https://threejs.org/docs/#GLTFExporter
	const exporter = new GLTFExporter();

	//ダウンロードさせる関数
	const download = (name, glb) => {
		const blob = new Blob([glb], { type: "application/octet-stream" });

		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = name;
		link.click();
	};

	exporter.parse(
		scene,
		(glb) => {
			// console.log(glb);
			download("model.glb", glb);
		},
		() => { },
		{
			binary: true,	//バイナリ形式(GLB)
			embedImages: true,	//テクスチャを埋め込み
		}
	);
});