/*
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	が効かない端末で、ズームしてしまった場合に誤操作防止のための要素を最前面に一時的に表示する

	【利用方法】
	import createCover from "./visualViewportCover.js";
	createCover();
*/

export default (zIndex = 10000) => {
	const cover = document.createElement("div");
	cover.style.zIndex = zIndex;
	cover.style.opacity = 0;
	cover.style.position = "fixed";
	cover.style.top = "0px";
	cover.style.bottom = "0px";
	cover.style.left = "0px";
	cover.style.right = "0px";
	cover.style.display = "none";
	document.body.appendChild(cover);

	visualViewport.addEventListener("resize", e => {
		if (visualViewport.scale > 1.01) {
			cover.style.display = "block";
		} else {
			cover.style.display = "none";
		}
	});
}