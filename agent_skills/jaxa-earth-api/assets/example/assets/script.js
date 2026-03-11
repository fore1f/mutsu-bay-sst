/* このファイルはサンプルページのデザイン用です。JAXA Earth API for JavaScriptの動作とは無関係です */




document.addEventListener("DOMContentLoaded", () => {

	if (location.pathname.endsWith("example/")) return;
	if (location.pathname.endsWith("example/index.html")) return;
	if (location.pathname == "/") return;
	if (location.pathname == "/index.html") return;

	document.body.insertAdjacentHTML("afterbegin", `<header><a href="../">< 一覧に戻る</a></header>`);
});

