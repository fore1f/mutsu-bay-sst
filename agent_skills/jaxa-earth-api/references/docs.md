
<a name="readmemd"></a>

**JAXA Earth API for JavaScript**

***

JAXA Earth API for JavaScript Version 2.0.0 のAPIドキュメントです。
このAPIを利用すると、地球観測データを容易にブラウザ上に表示したり、地球観測データを利用したウェブアプリを開発したりすることが可能です。
必要な範囲のデータを必要な解像度で取り扱う仕組みになっているため、ブラウザ上で動作するJavaScriptであってもデータを取り扱うことが可能となっていることが特徴です。

Version 2系よりブラウザのメインスレッドのみならず、ブラウザのウェブワーカーや、
<a href="https://nodejs.org/" target="_blank">Node.js</a>、
<a href="https://deno.com/" target="_blank">Deno</a>、
<a href="https://bun.com/" target="_blank">Bun</a>
での実行にも対応しました。<a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>による開発も可能となりました。
そのため、<a href="https://data.earth.jaxa.jp/api/javascript/v1.2.3/" target="_blank">Version 1系</a>に比べて仕様が大きく変更となっております。

---

# クイックスタート

## 何ができる？

ほんの数行のプログラミングで地球観測データにアクセスできます。ユーザー登録やAPIキーは不要です。

```js
// 地形データ（JAXA AW3D）の全球データを画像サイズ幅1000px高さ500pxで取得
const dataObject = await je.getDataObject({
  collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
  bbox: [-180, -90, 180, 90], //[西, 南, 東, 北]
  width: 1000,
  height: 500,
});

// 標高0m～6000mを青～緑～黄～赤の虹色で塗る
const colorMap = new je.image.ColorMap({ min: 0, max: 6000, colors: je.Colors.JET });

// 可視化した結果をHTMLCanvasElementとしてHTML上に追加
document.body.appendChild(je.image.createCanvas(dataObject, colorMap));
```
<img src="_media/top-quickstart.png" style="background-color: white;">

## サンプルコードを実行する
<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/00_getDataObject/" target="_blank">サンプルコードのページはこちらへ</a>

## CodePenで実行する

Resultタブの「Run Pen」を押すと実行されます。右上の「EDIT ON CODEPEN」を開くと直接ソースコードを編集して試すことも可能です。

<p class="codepen" data-height="300" data-pen-title="The simplest example" data-preview="true" data-default-tab="js,result" data-slug-hash="PwGYMYR" data-user="jaxa-earth" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/jaxa-earth/pen/PwGYMYR">
  The simplest example</a> by JAXA Earth API (<a href="https://codepen.io/jaxa-earth">@jaxa-earth</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

## 実際に作ってみましょう

- [ウェブブラウザ用に作る場合はこちらへ](#documentsfor-browsersmd)

- [Node.js、Deno、Bun用に作る場合はこちらへ](#documentsfor-nodejs-deno-bunmd)

## その他補足等

- <a href="https://data.earth.jaxa.jp/" target="_blank">JAXA Earth API の全体概要や利用できるデータセットの詳細について（公式サイトトップ）</a>

- [データの構造や考え方、各クラスの概要について](#documentsoverviewmd)

- [各モジュール、クラスの詳細を含むAPIドキュメント](./modules/)

---
# チュートリアル

具体的な開発をしてみましょう。地図に重ねて表示させたり、3Dモデルを作ったり、グラフを表示させたりできます。
その他各種サンプルコードは<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/" target="_blank">こちら</a>へ。

## 解析処理
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#timeseries" target="_blank">時系列アニメーションとグラフを表示する</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#correlation" target="_blank">データの相関を確認する</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#anomaly" target="_blank">ピクセル間演算で平年差を算出する</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#mask" target="_blank">GeoJSONでマスク処理して統計値を算出する</a>

## ファイル出力
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#csv" target="_blank">CSVファイルを保存する</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#glb" target="_blank">3DモデルのGLBファイルを作る</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#kmz" target="_blank">Google Earthで開けるKMZファイルを作る</a>

## 地図API連携
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#ol" target="_blank">OpenLayers</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#leaflet" target="_blank">Leaflet</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#maplibre" target="_blank">MapLibre GL JS (3D表示)</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#cesium" target="_blank">CesiumJS (3D表示)</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#arcgis" target="_blank">ArcGIS Maps SDK for JavaScript (3D表示)</a>

CesiumJSの実行例：
<p class="codepen" data-height="300" data-pen-title="CesiumJS example" data-preview="true" data-default-tab="js,result" data-slug-hash="jEMOppx" data-user="jaxa-earth" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/jaxa-earth/pen/jEMOppx">
  CesiumJS example</a> by JAXA Earth API (<a href="https://codepen.io/jaxa-earth">@jaxa-earth</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

## 生成AI連携
生成AIと連携するためのMCPも作れます。これによって、生成AIが地球観測データを扱うことも可能になります。
MCPは下記のサンプルで使用している生成AI以外にも、様々な生成AIで利用可能です。
また、ファイル保存などの別のMCPも利用することで、結果を生成AIが整理してCSVファイルとして書き出したりすることも可能です。

- [MCP基礎（STDIO編）](documents/MCP-(STDIO).md)
- [MCP基礎（Streamable HTTP編）](documents/MCP-(Streamable-HTTP).md)
- [MCP基礎（MCP Apps編）](#documentsmcp-appsmd)
- [MCP実用編（データ取得やウェブアプリ開発）](#documentsmcp-demo1md)

---
# 開発者向け

## モジュールのダウンロード

実行に必要なモジュールと、TypeScript開発時に便利な型定義ファイルは次の通りです。モジュールファイルはわずか120KBで、その他インストールが必要な依存モジュールは何もありません。

### ESM形式
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js" style="overflow-wrap: anywhere;" target="_blank">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.d.ts" style="overflow-wrap: anywhere;" target="_blank">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.d.ts</a>

### UMD形式
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.js" style="overflow-wrap: anywhere;" target="_blank">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.js</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.d.ts" style="overflow-wrap: anywhere;" target="_blank">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.d.ts</a>

## AI駆動開発

生成AIを利用する開発者向けの情報として、マークダウン形式のドキュメントを下記から利用可能です。
これらのファイルを生成AIに添付することで、ソースコードの作成やデータセットの選定などがある程度可能になります。
ただし、利用する生成AIの種類や質問の文脈等によっては期待通りの結果が得られない場合もあります。

### APIドキュメント
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/docs.md" style="overflow-wrap: anywhere;" target="_blank">https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/docs.md</a>

### 利用できるデータセットの一覧
- <a href="https://data.earth.jaxa.jp/app/mcp/catalog.v2.md" style="overflow-wrap: anywhere;" target="_blank">https://data.earth.jaxa.jp/app/mcp/catalog.v2.md</a>

---
# 利用例

JAXA Earth API for JavaScript を使用した利用例は次の通りです。一部旧バージョンのAPIを使用しているものも含まれます。

- <a href="https://data.earth.jaxa.jp/app/sea-level-rise/" target="_blank">海面上昇シミュレーター(国内版)</a>

<a href="https://data.earth.jaxa.jp/ja/datasets/#/id/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global" target="_blank">地形データ</a>とOpenLayersを用いて海面上昇をシミュレーションします。
スライドバーの設定に応じてカラーマップを切り替えることによって、瞬時に色を塗り替えています。

- <a href="https://data.earth.jaxa.jp/app/sea-level-rise-global/" target="_blank">海面上昇シミュレーター(全球版)</a>

<a href="https://data.earth.jaxa.jp/ja/datasets/#/id/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global" target="_blank">地形データ</a>とOpenLayersを用いて海面上昇をシミュレーションします。
全球版では背景に表示されている陰影起伏図もJavaScriptを用いて動的に生成しています。

- <a href="https://data.earth.jaxa.jp/app/edu/sst/" target="_blank">海の温度をくらべてみよう</a>

海面水温の経年変化を比較して、気候変動の影響を見ることができます。
簡易的な画面構成により、タブレット端末でも表示可能な小中学生向けの教材としての利用も可能です。

- <a href="https://data.earth.jaxa.jp/app/observable/" target="_blank">Observableのサンプルコード</a>

Observableを用いることで、ブラウザ上でインタラクティブにJAXA Earth API for JavaScript を実行できます。

- <a href="https://data.earth.jaxa.jp/app/codepen/" target="_blank">CodePenのサンプルコード</a>

CodePenを用いることで、ブラウザ上でインタラクティブにJAXA Earth API for JavaScript を実行できます。

- <a href="https://earth.jaxa.jp/dashboard/" target="_blank">JAXA Earth Dashboard</a>

OpenLayersを用いて、様々なデータを閲覧・利用などできるようにしたウェブサイトです。JAXA Earth API for JavaScript を利用して現在開発中です。

- <a href="https://earth.jaxa.jp/climate2023/" target="_blank">特集 気候変動2023</a>

JAXA Earth API for JavaScript を利用して、日本周辺の海面水温の最新観測データを常時表示しています。

---
# ライセンス

JAXA Earth API は一部のデータセットを使用する場合を除いて商用利用が可能です。
詳細については、<a href="https://data.earth.jaxa.jp/license/" target="_blank">こちらのページ</a>をご確認ください。

**THIRD PARTY LICENSE(s)**
- <a href="https://github.com/nodeca/pako" target="_blank">pako</a>, <a href="https://github.com/nodeca/pako/blob/master/LICENSE" target="_blank">MIT license</a> (Compression Streams APIに非対応であるBunの実行環境においてdeflate圧縮解凍に使用しています)

---
# リリースノート
* 2026/03/04 - GeoJSON利用のサンプルを追加しました。
* 2026/02/25 - CesiumJS利用のサンプルとCodePenを追加しました。
* 2026/02/18 - <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/docs/" target="_blank">Version 2.0.0 (このドキュメント)</a>を公開しました。
* 2025/02/27 - <a href="https://data.earth.jaxa.jp/api/javascript/v1.2.3/" target="_blank">Version 1.2.3</a>を公開しました。


<a name="documentsfor-browsersmd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / For Browsers

# 使用方法（ブラウザの場合）

JAXA Earth API for JavaScript はブラウザ上のJavaScriptで実行可能です。
地球観測データを可視化したり、簡単な統計処理を行うことが可能で、フロントエンド（HTML、JavaScript、CSSなど）の実装のみで地球観測データを扱うウェブアプリを作ることが可能です。

ES Module (ESM) 形式及び Universal Module Definition (UMD) 形式に対応しています。開発方法に応じてどちらかをご利用ください。

この解説内容は次の環境で動作確認済です（2026.2時点のWindows11, Android 16, iOS 18.5の最新版）。動作しない場合は最新バージョンをお試しください。

- Chrome
- Edge
- Safari
- Firefox

## ESM 形式の場合

次のリンク先からモジュールのファイルをダウンロードしてください。

<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js" style="overflow-wrap: anywhere;">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js</a>

また、VS Code等のコード補完機能（インテリセンス）を利用したり、TypeScriptで開発したりする場合は、次の型定義ファイルを利用してください。`jaxa.earth.esm.js`と同じフォルダに保存すると自動で適用されます。

<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.d.ts" style="overflow-wrap: anywhere;">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.d.ts</a>

次の通りHTMLファイルの`index.html`を作成します。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>esm</title>
</head>
<body>
  <script type="module"> //ESM形式の場合はtype="module"の記載が必須です。

    //モジュールのファイルを読み込みます。
    //このHTMLファイルとjaxa.earth.esm.jsのファイルは同一フォルダにある想定です。
    import * as je from "./jaxa.earth.esm.js";

    //全てのクラスやメソッドはjeオブジェクトを使ってアクセスします。
    console.log(je);
    
    //ここにコードを記載します。（後述）
    
  </script>
</body>
</html>
```

必要なファイルは次の通りです。

```
- jaxa.earth.esm.js
- jaxa.earth.esm.d.ts (VS Code等のコード補完機能を使用したい場合のみ)
- index.html
```

ウェブサーバーを起動し、このHTMLにアクセスしてください。ESM形式のJavaScriptを実行するためにはウェブサーバーが必要です。HTMLファイルをダブルクリックで開いても動作しません。端末ローカルで実行する際はVSCodeの<a href="https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer" target="_blank">Live Server</a>等をご利用ください。

## UMD 形式の場合

次のリンク先からモジュールのファイルをダウンロードしてください。

<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.js" style="overflow-wrap: anywhere;">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.js</a>

また、VS Code等のコード補完機能（インテリセンス）を利用したり、TypeScriptで開発したりする場合は、次の型定義ファイルを利用してください。`jaxa.earth.umd.js`と同じフォルダに保存すると自動で適用されます。

<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.d.ts" style="overflow-wrap: anywhere;">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.d.ts</a>

次の通りHTMLファイルの`index.html`を作成します。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>umd</title>

  <!-- モジュールのファイルを読み込みます。-->
  <!-- このHTMLファイルとjaxa.earth.umd.jsのファイルは同一フォルダにある想定です。-->
  <script src="./jaxa.earth.umd.js"></script>
</head>
<body>
  <script>
    //全てのクラスやメソッドはグローバルオブジェクトに定義されたjeを使ってアクセスします。
    console.log(je);

    //UMD形式ではトップレベルawaitはサポートされていません。
    //トップレベルawaitを模擬するために、非同期の即時実行関数式内に記述します。
    (async function(){
    
      //ここにコードを記載します。（後述）

    })();
  </script>
</body>
</html>
```

必要なファイルは次の通りです。

```
- jaxa.earth.umd.js
- jaxa.earth.umd.d.ts (VS Code等のコード補完機能を使用したい場合のみ)
- index.html
```

ブラウザでこのHTMLを開きます。UMD形式のJavaScriptを実行するためにはウェブサーバーは不要です。ダブルクリックで開いても動作します。

## コードの例（各形式で共通）

`//ここにコードを記載します。`の部分に記載するコードの例は次の通りです。
利用できるデータセットの詳細については、<a href="https://data.earth.jaxa.jp/ja/datasets/" target="_blank">こちら</a>をご参照ください。

```js
//数値配列データとして汎用的に扱えるDataObjectを取得します。
const dataObject = await je.getDataObject({
  //利用するデータセットのcollection.jsonのURLを記載します。
  collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",

  //dateの指定を省略した場合は最新のデータを取得します。

  //利用するデータセットのバンドを指定します。
  band: "DSM",

  //データを取得する緯度経度範囲を記載します。
  //[最小経度(西), 最小緯度(南), 最大経度(東), 最大緯度(北)]
  bbox: [-180, -90, 180, 90],

  //データを取得する画像のサイズをピクセル数で記載します。
  width: 1000,
  height: 500,
});

//可視化するためのカラーマップを指定します。
const colorMap = new je.image.ColorMap({
  //最小値
  min: 0,
  //最大値
  max: 6000,
  //最小値～最大値を青～緑～黄～赤の虹色で塗りつぶします。
  colors: je.Colors.JET,
});

//可視化した結果をHTMLCanvasElementとして取得し、HTML上に追加します。
document.body.appendChild(je.image.createCanvas(dataObject, colorMap));
```

<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/00_getDataObject/" target="_blank">実行結果の例はこちらへ</a>

## その他のサンプルコード

JAXA Earth API for JavaScriptを利用すると、上記のような単純な画像表示以外にも様々なウェブアプリケーションを開発することが可能です。

詳細については、<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/" target="_blank">こちら</a>のサンプルコードをご参照ください。


<a name="documentsfor-nodejs-deno-bunmd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / For Node.js, Deno, Bun

# 使用方法（Node.js、Deno、Bunの場合）

JAXA Earth API for JavaScript は、Node.js、Deno、BunのJavaScript環境でも実行可能です。
地球観測データを扱うための複雑な環境構築をすることなく、地球観測データを可視化してPNG画像として保存したり、CSVファイルとして保存したり、簡単な統計処理を行うことが可能です。

ES Module (ESM) 形式及び CommonJS 形式に対応しています。開発方法に応じてどちらかをご利用ください。

なお、画像出力に関しては、非ブラウザ環境では`HTMLCanvasElement`と`OffscreenCanvas`は利用できません。PNG画像として出力するための[\`createPng\`](#createpng)をご利用ください。

この解説内容は次の環境で動作確認済です（2026.2時点）。動作しない場合は次のバージョンよりも新しい環境をお試しください。

- Node.js v22.20.0
- Deno 2.1.9
- Bun 1.2.2

## ESM 形式の場合

次のリンク先からモジュールのファイルをダウンロードしてください。

<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js" style="overflow-wrap: anywhere;">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js</a>

また、VS Code等のコード補完機能（インテリセンス）を利用したり、TypeScriptで開発したりする場合は、次の型定義ファイルを利用してください。jaxa.earth.esm.jsと同じフォルダに保存すると自動で適用されます。

<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.d.ts" style="overflow-wrap: anywhere;">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.d.ts</a>

下記の通り任意のフォルダに保存します。

```
- package.json
- jaxa.earth.esm.js
- jaxa.earth.esm.d.ts (VS Code等のコード補完機能を使用したい場合のみ)
- main.js
```

ESM形式で開発する場合は、package.jsonに次の通り記載します。

```json package.json
{
  "type": "module"
}
```

main.jsには次のように記載します。

```js
import * as je from "./jaxa.earth.esm.js";

//ファイル出力するための機能（Node.jsがインストールされている場合）
import fs from "node:fs";

//DataObjectを取得
const dataObject = await je.getDataObject({
  collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
  band: "DSM",
  width: 1000,
  height: 500,
  bbox: [-180, -90, 180, 90],
  onloading: (progress, dataObject) => {
    console.log(progress);
  },
});

//カラーマップを作成
const colorMap = new je.image.ColorMap({
  min: 0,
  max: 6000,
  colors: je.Colors.JET,
});

//PNG画像にして保存
const png = await je.image.createPng(dataObject, colorMap);
fs.writeFileSync("image.png", png);

//CSVファイルにして保存
const csv = je.data.createCsv(dataObject);
fs.writeFileSync("data.csv", csv, "utf8");

//上記の保存方法は、Node.js環境、または、Node.jsがインストールされていないBun環境で実行可能です。
//Node.jsがインストールされていないDeno環境では、代わりに次の方法でも保存できます。
//await Deno.writeFile("image.png", png);
//await Deno.writeTextFile("data.csv", csv);
```

Node.jsの場合は、次のコマンドで実行できます。
```
node main.js
```

Denoの場合は、通信とファイル操作のアクセス権限を許可する必要があるため、下記のようにオプションを用います。
```
deno -A main.js
```

Bunの場合は、次のコマンドで実行できます。
```
bun main.js
```

実行が成功すると、同一フォルダ内に`image.png`、`data.csv`として結果が保存されます。

## CommonJS 形式の場合

次のリンク先からモジュールのファイルをダウンロードしてください。Universal Module Definition (UMD) 形式のモジュールはCommonJS形式の開発環境でも利用可能です。

- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.js" style="overflow-wrap: anywhere;">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.js</a>
- <a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.d.ts" style="overflow-wrap: anywhere;">https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.d.ts</a>

CommonJS形式で開発する場合は、package.jsonに次の通り記載します。

```json package.json
{
  "type": "commonjs"
}
```

main.jsには次のように記載します。

```js
//requireでモジュールをインポートします。
const je = require("./jaxa.earth.umd.js");

//CommonJS形式ではトップレベルawaitが不可のため、即時実行関数の中に記載します。
(async function () {

  //await je.getDataObjectなどの処理はESM形式のサンプルと同様です。

})();
```

## SSL証明書のエラーが発生する場合

JAXA Earth API for JavaScript では、データの取得のためにデータが保存されたサーバーと通信を行います。
企業や組織内のネットワークの都合上、SSL証明書のエラーが発生する場合は、SSL証明書の確認を一時的に回避する方法として、次のコードを`main.js`の一番最初に追記します。
```js
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
```


<a name="documentsmcp-stdiomd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / MCP (STDIO)

# MCP基礎（STDIO編）

JAXA Earth API for JavaScript を使うと生成AIと連携するためのMCP (Model Context Protocol)の開発も可能です。
このチュートリアルでは、[公式サイトの掲載方法](https://modelcontextprotocol.io/docs/develop/build-server#typescript)に基づいてSTDIO方式のMCPを作ります。

そのため、MCPサーバー（下記のソースコード）とMCPクライアント（Claude Desktopなど）は同一の端末上で稼働することが前提となります。

この解説内容は次の環境で動作確認済です（2026.2時点）。

- Windows 11
- Node.js (v22.20.0)
- TypeScript (5.9.3)
- Claude Desktop (バージョン 1.1.1520) 
- Claude Freeプラン

## ソースコードの準備

下記リンクからソースコード一式をダウンロードしてZIPファイルを展開して、任意のフォルダ（以下、「プロジェクトルート」と言います）に保存します。

[MCPサンプルコード一式](../_media/mcp-stdio-sample.zip)

フォルダへのパスの途中に日本語名が含まれると問題が生じる可能性がありますので、`C:\mcp-test`のような階層が浅い英語名のフォルダを使う事をお勧めします。

サンプルコードには次のようなファイルが含まれます。

```
- package.json //このパッケージに関する情報を記載したNode.js用のファイル
- tsconfig.json //TypeScriptの設定ファイル

- src/
  - index.ts //MCPの実行に必要なファイル
  - test.ts //モジュール単体テスト用のファイル
  - getElevationValue.ts //JAXA Earth APIで標高データの値を返すための関数
  - getElevationImage.ts //JAXA Earth APIで標高データの画像を返すための関数
  - getCatalogList.ts //JAXA Earth APIで利用できるカタログファイルを返すための関数
  - jaxa.earth.esm.js //JAXA Earth APIのモジュールファイル
  - jaxa.earth.esm.d.ts //JAXA Earth APIのモジュールの型定義ファイル
```

`index.ts`ファイルにはMCPサーバーとして動作させるためのコードが含まれています。ツールの説明や受け付ける引数の詳細について定義されています。

```js
//MCPの実装に必要なモジュール
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

//JAXA Earth APIを使った各機能
import getElevationValue from "./getElevationValue.js";

//(途中省略)

//利用できるツールを登録
server.registerTool(
  "jaxa-earth-api-get-elevation-value",
  {
    //このツールの説明を記載
    description: `
      JAXA Earth APIを使って全世界の標高のデータを数値で取得します。
      標高の値を知りたい場所の経度(longitude)と緯度(latitude)を指定すると、その場所の標高(単位はm)を返します。
      海上など、観測データが無い場合はNaNまたはエラーを返します。
      源泉となるデータはAW3Dです。データセットの詳細について知りたい場合は、
      https://data.earth.jaxa.jp/ja/datasets/#/id/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global
      をご参照ください。
    `,
    //受け付ける引数を登録
    inputSchema: {
      longitude: z.number().describe("経度を指定します。（例：135.5）"),
      latitude: z.number().describe("緯度を指定します。（例：35.8）"),
    },
  },
  //引数を受け付けて実行する関数
  async ({ longitude, latitude }) => {
    return {
      content: [
        {
          type: "text",
          //結果の数値については文字列として返します。
          text: String(await getElevationValue(longitude, latitude)),
        },
      ],
    };
  },
);

//(途中省略)
```

`getElevationValue.ts`などの中にはJAXA Earth API for JavaScriptを利用する具体的な処理が書かれています。

```js
import * as je from "./jaxa.earth.esm.js";

//AW3Dのデータを利用して、指定した緯度経度の場所の標高を返す
export default async (lng: number, lat: number): Promise<number> => {

  //指定された緯度経度を中心として±0.001度の狭い区域でbboxを作る
  const dl = 0.001;
  const bbox: je.Bbox = [lng - dl, lat - dl, lng + dl, lat + dl];

  //AW3Dを指定
  //https://data.earth.jaxa.jp/ja/datasets/#/id/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global
  const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json";
  const band = "DSM";

  //DataObjectを取得
  //画像サイズは100px四方
  const dataObject = await je.getDataObject({
    collectionUrl,
    band,
    bbox,
    width: 100,
    height: 100,
  });

  //統計値計算を行う(最小値、最大値、平均値など)
  const stat = je.data.globalStat(dataObject);

  //平均値meanを返す
  return stat.mean;
};
```

## その他必要なモジュールをインストール

プロジェクトルートでターミナル（コマンドプロンプト）を開き、次を実行することで、`package.json`の記載に従って、TypeScriptやMCPなどの必要なモジュールがインストールされます。

```
npm i
```

## TypeScriptファイルをコンパイル

ターミナルで続けて次を実行します。TypeScriptファイルがコンパイルされて、実際に実行するためのJavaScriptファイルが`./build`フォルダに出力されます。

```
npm run build
```

次のようなファイルがそろえば完成です。

<img src="../_media/mcp-stdio-files.png">

## モジュールの単体テストをする場合（省略可能）

`getElevationValue.ts`などの各処理内容を変更した場合には、次のコマンドで`test.ts`に書かれている単体テストを実行できます。

```
npm run test
```

```js
//このファイルは下記のモジュール単体のテスト用です。
//MCPの実行には利用されません。

//JAXA Earth APIを使った各機能
import getElevationValue from "./getElevationValue.js";
import getElevationImage from "./getElevationImage.js";
import getCatalogList from "./getCatalogList.js";

//Node.jsのファイル保存機能
import fs from "node:fs";

//コンソール上に標高を表示します。
console.log(await getElevationValue(138.727, 35.361));

//test.pngに画像を保存します。
fs.writeFileSync("test.png", await getElevationImage(138.727, 35.361));

//test.txtに回答の文字列を保存します。
fs.writeFileSync("test.txt", await getCatalogList(), "utf8");
```

Claude Desktopを経由せずにモジュール単体で実行するため、効率良く動作確認が可能です。

### SSL証明書のエラーが発生する場合

JAXA Earth API for JavaScript では、データの取得のためにデータが保存されたサーバーと通信を行います。
企業や組織内のネットワークの都合上、SSL証明書のエラーが発生する場合は、SSL証明書の確認を一時的に回避する方法として、次のコードを`index.ts`と`test.ts`の一番最初に追記します。
```js
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
```

### console.log()は利用できません

STDIO方式ではMCPの通信にSTDIOを用いる仕組みであるため、STDIOに出力してしまう`console.log()`を利用するとエラーが発生します。
`console.log()`は使用しないようにするか、`console.error()`をご利用ください。
[公式サイトの記載はこちら](https://modelcontextprotocol.io/docs/develop/build-server#logging-in-mcp-servers-2)。

## Claude DesktopにMCPを登録

Claude Desktopを開き、メニュー→ファイル→設定→開発者→"設定を編集"をクリックし、開いたフォルダで`claude_desktop_config.json`ファイルを探します。このファイルに下記の通り記載します。

<img src="../_media/mcp-stdio-configfile.png">

```js
{
  "mcpServers": {
    "jaxa-earth-api": {
      "command": "node",
      "args": [
        "C:\\(PATH-TO-YOUR-PROJECT-ROOT)\\build\\index.js"
      ]
    }
  }
}
```

TypeScriptファイルのコンパイルで出力された`./build`フォルダ内の`index.js`を指定します。パス区切りは`\\`のように2つ書く必要がある点にご注意ください。

## Claude Desktopを再起動

Claude Desktopを再起動します。ウィンドウを閉じてもタスクバーに常駐していることがありますので、完全に終了させます。

<img src="../_media/mcp-stdio-claude-restart.png">

## Claude Desktopを開く

次のような項目が出現していれば読み込み成功です。

<img src="../_media/mcp-stdio-ready.png">

## Claude Desktopに聞いてみる

次のように質問してみてください。JAXA Earth APIのデータを駆使して生成AIが答えてくれます！

<img src="../_media/mcp-stdio-demo1.png">

JAXA Earth APIではPNG画像を返すことも可能なため、画像を用いたマルチモーダルな生成AI連携が可能です。

<img src="../_media/mcp-stdio-demo2.png">

<img src="../_media/mcp-stdio-demo3.png">

## 次はStreamable HTTP方式

STDIO方式では生成AIのアプリケーション上でMCPが実行されるため、MCPのサービスを異なる端末に提供することはできません。
ネットワーク越しにMCPを利用する場合は、Streamable HTTP方式を利用します。

[Streamable HTTP方式のサンプルはこちらへ](MCP-(Streamable-HTTP).md)


<a name="documentsmcp-streamable-httpmd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / MCP (Streamable HTTP)

# MCP基礎（Streamable HTTP編）

JAXA Earth API for JavaScript を使うと生成AIと連携するためのMCP (Model Context Protocol)の開発も可能です。
このチュートリアルではStreamable HTTP方式のMCPを作ります。
そのため、MCPサーバー（下記のソースコード）とMCPクライアント（Claude Desktopなど）を別の端末で起動して、ネットワーク越しに動作させることも可能です。

ただし下記のソースコードではHTTPS対応やユーザー認証等のセキュリティ対策は省略していますので、信頼できるローカルネットワーク内での利用を想定しています。
不特定多数のユーザーがアクセスできるようにインターネットに公開するためには別途セキュリティ対策が必要です。

STDIO方式を理解した上での解説となりますので、不明な部分は[STDIO方式のチュートリアル](MCP-(STDIO).md)をご覧ください。

この解説内容は次の環境で動作確認済です（2026.2時点）。

- Windows 11
- Node.js (v22.20.0)
- TypeScript (5.9.3)
- Claude Desktop (バージョン 1.1.1520) 
- Claude Freeプラン

## ソースコードの準備

下記リンクからソースコード一式をダウンロードしてZIPファイルを展開して、任意のフォルダ（以下、「プロジェクトルート」と言います）に保存します。

[MCPサンプルコード一式](../_media/mcp-streamable-http.zip)

サンプルコードには次のようなファイルが含まれます。

```
- package.json //このパッケージに関する情報を記載したNode.js用のファイル
- tsconfig.json //TypeScriptの設定ファイル

- src/
  - index.ts //MCPの実行に必要なファイル
  - createMcpServer.ts //McpServerを作成する関数のファイル
  - test.ts //モジュール単体テスト用のファイル
  - getElevationValue.ts //JAXA Earth APIで標高データの値を返すための関数
  - getElevationImage.ts //JAXA Earth APIで標高データの画像を返すための関数
  - getCatalogList.ts //JAXA Earth APIで利用できるカタログファイルを返すための関数
  - jaxa.earth.esm.js //JAXA Earth APIのモジュールファイル
  - jaxa.earth.esm.d.ts //JAXA Earth APIのモジュールの型定義ファイル
```

`index.ts`ファイルにはMCPサーバーとして動作させるためのコードが含まれています。
[STDIO方式の場合](MCP-(STDIO).md)との違いとして、McpServerを作成する部分については`createMcpServer.ts`として分離しています。
ツールの説明や受け付ける引数の詳細について定義されている部分については同じです。

`index.ts`ファイルのサーバーの起動部分については、Streamable HTTP方式の場合は下記のようになっています。
`const host = `の部分については、このソースコードを実行する端末のIPアドレスを指定してください。

```js
//Streamable HTTP用のモジュールを読み込み
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import type { Request, Response } from "express";

//(途中省略)

const port = "3001";
// const host = "localhost"; //Claude Desctopなどのクライアントが同一端末内で実行される場合。
const host = "192.168.xxx.xxx"; //Claude Desctopなどのクライアントが別の端末で実行される場合には、この端末のIPアドレスを指定。

const app = createMcpExpressApp({ host });
app.use(cors());

app.all("/mcp", async (req: Request, res: Response) => {
  //生成AIから届くリクエストの内容をコンソールに表示します。
  console.log(req.body);

  //このサンプルはステートレスな機能のみのため、セッションは持たずに都度新しく立ち上げます。
  //ユーザー認証等、ステートフルな機能を作る場合はセッションを管理するための別の実装が必要です。
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport();

  res.on("close", () => {
    transport.close().catch(() => { });
    server.close().catch(() => { });
  });

  try {

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

  } catch (error) {
    console.error("MCP error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

const httpServer = app.listen(port, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`MCP server listening on http://${host}:${port}/mcp`);
});

//(以後省略)
```

## インストールとコンパイル

プロジェクトルートでターミナル（コマンドプロンプト）を開き、次を実行することで、必要なモジュールがインストールされます。

```
npm i
```

ターミナルで続けて次を実行します。TypeScriptファイルがコンパイルされて、MCPサーバーの起動まで行います。npmの使い方として、`start`に関しては`npm start`と省略して書くことも可能です。

```
npm run start
```

次の表示が出ればMCPサーバーの起動成功です。

```
> jaxa-earth-api@1.0.0 start
> npm run build && node ./build/index.js

> jaxa-earth-api@1.0.0 build
> tsc

MCP server listening on http://192.168.xxx.xxx:3001/mcp
```

ターミナル上ではMCPサーバーが起動したままの状態となるため、終了させるには \[Ctrl\] + C を押します。

## Claude DesktopにMCPを登録

[STDIO方式の場合](MCP-(STDIO).md)と同じく`claude_desktop_config.json`ファイルを開き、下記の通り記載します。

```js
{
  "mcpServers": {
    "jaxa-earth-api": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://192.168.xxx.xxx:3001/mcp",
        "--allow-http"
      ]
    }
  }
}
```

URL部分に関しては、`index.ts`で`const host = "localhost";`とした場合は、`"http://localhost:3001/mcp"`と記載します。

Claude DesktopのFreeプランではリモートMCPに未対応（2026.2時点）のため、npxとmcp-remoteを利用します。
mcp-remoteはnpx実行時に自動でインストールされるため、特にインストール作業は不要です。

## Claude Desktopを再起動

[STDIO方式の場合](MCP-(STDIO).md)と同じくClaude Desktopを再起動して、コネクタに`jaxa-earth-api`が表示されていればMCPサーバー接続完了です。

チャット欄で質問してみてください。[STDIO方式の場合](MCP-(STDIO).md)と同じくJAXA Earth APIのデータを駆使して生成AIが答えてくれます！

## 次はMCP Apps

STDIO方式やStreamable HTTP方式では生成AIに対して文字列や画像の応答を返すことができました。
MCP Appsを利用すると、さらにUIとしてウェブアプリケーションを返すことも可能です。

[MCP Appsのサンプルはこちらへ](#documentsmcp-appsmd)


<a name="documentsmcp-appsmd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / MCP Apps

# MCP基礎（MCP Apps編）

JAXA Earth API for JavaScript を使うと生成AIと連携するためのMCP (Model Context Protocol)の開発も可能です。
このチュートリアルではStreamable HTTP方式のMCP Appsを作ります。
そのため、MCPサーバー（下記のソースコード）とMCPクライアントを別の端末で起動して、ネットワーク越しに動作させることも可能です。

ただし下記のソースコードではHTTPS対応やユーザー認証等のセキュリティ対策は省略していますので、信頼できるローカルネットワーク内での利用を想定しています。
不特定多数のユーザーがアクセスできるようにインターネットに公開するためには別途セキュリティ対策が必要です。

STDIO方式とStreamable HTTP方式を理解した上での解説となりますので、不明な部分は次をご覧ください。
- [STDIO方式のチュートリアル](MCP-(STDIO).md)
- [Streamable HTTP方式のチュートリアル](MCP-(Streamable-HTTP).md)

この解説内容は次の環境で動作確認済です（2026.2時点）。

- Windows 11
- Node.js (v22.20.0)
- TypeScript (5.9.3)
- Visual Studio Code Insiders (バージョン 1.110.0-insider) 
- GitHub Copilot Freeプラン

## ソースコードの準備

下記リンクからソースコード一式をダウンロードしてZIPファイルを展開して、任意のフォルダ（以下、「プロジェクトルート」と言います）に保存します。

[MCPサンプルコード一式](../_media/mcp-apps-sample.zip)

サンプルコードには次のようなファイルが含まれます。

```
- package.json //このパッケージに関する情報を記載したNode.js用のファイル
- tsconfig.json //MCPサーバー部分をコンパイルするためのTypeScriptの設定ファイル
- vite.config.ts //UI部分をコンパイルするためのViteの設定ファイル

- src-sv/ //MCPサーバー部分の構成ファイル
  - index.ts //MCPサーバーの実行に必要なファイル
  - createMcpServer.ts //McpServerを作成する関数のファイル
  - getElevationImage.ts //JAXA Earth APIで標高データの画像を返すための関数
  - jaxa.earth.esm.js //JAXA Earth APIのモジュールファイル
  - jaxa.earth.esm.d.ts //JAXA Earth APIのモジュールの型定義ファイル

- src-ui/ //UI部分の構成ファイル
  - index.html //UIのウェブアプリのHTMLファイル
  - script.ts //index.html内で動作するJavaScriptのコードを記載したファイル
```

MCP Appsでは、[Streamable HTTP方式の場合](MCP-(Streamable-HTTP).md)に対して`src-ui`が追加されています。この中のウェブアプリも生成AIから呼び出されるようになります。

`createMcpServer.ts`におけるUIの定義部分は次の通りです。
生成AIからUIリソースが要求された場合にindex.htmlを返します。生成AIがMCP Appsに対応していない場合は無視されて、通常のStreamable HTTP方式のMCPとして動作する機能だけが有効になります。

```js
import { registerAppResource, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs/promises";
import path from "node:path";

//(途中省略)

export default (): McpServer => {

  //MCPサーバーを作成
  const server = new McpServer({
    name: "jaxa-earth-api",
    version: "1.0.0",
  });

  //UIリソースのURIを定義
  const resourceUri = "ui://get-elevation-image/ui";

  //(途中省略)

  //リソースを定義
  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => {
      //このcreateMcpServer.tsのコンパイル出力先フォルダbuild（=import.meta.dirname）内に、コンパイル後のindex.htmlもある場合
      const text = await fs.readFile(path.join(import.meta.dirname, "index.html"), "utf-8");

      return {
        contents: [{
          uri: resourceUri,
          mimeType: RESOURCE_MIME_TYPE,
          text,
        }],
      };
    },
  );
  
  return server;
}
```

## インストールとコンパイル

プロジェクトルートでターミナル（コマンドプロンプト）を開き、次を実行することで、必要なモジュールがインストールされます。

```
npm i
```

ターミナルで続けて次を実行します。npmの使い方として、`start`に関しては`npm start`と省略して書くことも可能です。

```
npm run start
```

これにより次の３つの処理が自動で実行されます。
- Viteによる`src-ui`部分のコンパイル（`npm run build-ui`により単独でも実行できます）
- TypeScriptによる`src-sv`部分のコンパイル（`npm run build-sv`により単独でも実行できます）
- MCPサーバーの起動（`node ./build/index.js`により単独でも実行できます）

> ※MCPサーバーを起動したままであっても、`src-ui`内のファイルを編集した場合には、別のターミナルを開いて`npm run build-ui`を実行することで、UI部分のみコンパイルすることも可能です。

次のような表示が出ればMCPサーバーのコンパイル～起動が成功です。

```
> jaxa-earth-api@1.0.0 start
> npm run build-ui && npm run build-sv && node ./build/index.js

> jaxa-earth-api@1.0.0 build-ui
> npx vite build

vite v7.3.1 building client environment for production...
✓ 142 modules transformed.
[plugin vite:singlefile]

[plugin vite:singlefile] Inlining: index-Bkm2ptAA.js
../build/index.html  381.72 kB │ gzip: 92.59 kB
✓ built in 718ms

> jaxa-earth-api@1.0.0 build-sv
> tsc

MCP server listening on http://192.168.xxx.xxx:3001/mcp
```

`192.168.xxx.xxx`の部分については、お使いの端末のIPアドレス、ネットワーク環境に合わせて`./src-sv/index.ts`内の記載を書き換えてください。
ターミナル上ではMCPサーバーが起動したままの状態となるため、終了させるには \[Ctrl\] + C を押します。

コンパイル後のファイルは、プロジェクトルートに新しく作られる`build`フォルダ内に格納されます。主なファイルは次の通りです。

- `./build/index.html`：UIとして表示されるファイル。MCP AppsではUIのウェブアプリは単一のファイルにバンドルされます。
- `./build/index.js`：MCPサーバーとして起動するためのファイル。
- その他：MCPサーバーで使う構成ファイル。

## 生成AIにMCP Appsを登録

2026.2現在、MCP Appsをサポートする生成AIや利用できるユーザーは一部に限られています。
今回の場合は、Visual Studio Codeを利用します。InsidersバージョンであればMCP Appsに対応しており、VS Codeのチャット機能（GitHub Copilot Freeプラン）でも試すことが可能です。
インストール方法については流動的であるため、最新の各種解説記事等をご確認ください。

生成AIに、上記で起動しているMCP AppsのURLを登録します。

```
http://192.168.xxx.xxx:3001/mcp
```

接続が成功すると、質問に対して次のようなUIを用いて回答してくれます。

<img src="../_media/mcp-apps-demo1.png">

上記は札幌の地形データを表示させた後に「富士山」のボタンを押した状態のスクリーンショットです。
MCP AppsのUIにはこのようなボタンなどを配置することができ、ボタンを押すことによってもMCPサーバーに対して追加の要求を送信し、表示を切り替えたりすることが可能です。

## 次は、より実用的なMCPの開発

MCPで文字列や画像などを返すことができるようになりました。
次は地球観測データを取り扱うための実用的なMCPを開発します。

[実用的なMCP作成はこちらへ](#documentsmcp-demo1md)


<a name="documentsmcp-demo1md"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / MCP Demo1

# 実用的なMCP作成

JAXA Earth API for JavaScript を使うと生成AIと連携するためのMCP (Model Context Protocol)の開発も可能です。
このチュートリアルではStreamable HTTP方式で、より実用的に使えるMCPを作ります。

Streamable HTTP方式を理解した上での解説となりますので、不明な部分は[Streamable HTTP方式のチュートリアル](MCP-(Streamable-HTTP).md)をご覧ください。

この解説内容は次の環境で動作確認済です（2026.2時点）。

- Windows 11
- Node.js (v22.20.0)
- TypeScript (5.9.3)
- Claude Desktop (バージョン 1.1.1520) 
- Claude Freeプラン

## ソースコードの準備

下記リンクからソースコード一式をダウンロードしてZIPファイルを展開して、任意のフォルダに保存します。

[MCPソースコード一式](../_media/mcp-demo1.zip)

ソースコードには次のようなファイルが含まれます。

```
- package.json //このパッケージに関する情報を記載したNode.js用のファイル
- tsconfig.json //TypeScriptの設定ファイル

- src/
  - index.ts //MCPの実行に必要なファイル
  - createMcpServer.ts //McpServerを作成する関数のファイル
  - test.ts //モジュール単体テスト用のファイル

  - getCatalogList.ts //JAXA Earth APIで利用できるカタログファイルを返すための関数
  - getLinks.ts //データセットの詳細を確認できるページへのリンクを返すための関数
  - getValue.ts //JAXA Earth APIでデータの値を返すための関数
  - getImage.ts //JAXA Earth APIでデータの画像を返すための関数
  - getCsv.ts //JAXA Earth APIで50点四方、計2500点のデータを一度に取得してCSVで返すための関数
  - getJavaScriptCode.ts //JAXA Earth API for JavaScriptのソースコードを返すための関数
  - getDocs.ts //JAXA Earth API for JavaScriptのAPIドキュメント（マークダウン形式）を返すための関数

  - jaxa.earth.esm.js //JAXA Earth APIのモジュールファイル
  - jaxa.earth.esm.d.ts //JAXA Earth APIのモジュールの型定義ファイル
```

このように、データセットのカタログ情報や関連リンクを取得する機能や、値、画像を返す機能をセットにしました。
さらには、ソースコードを作るための機能やAPIドキュメント全体を返す機能も追加しました。

## 実行方法

[Streamable HTTP方式のチュートリアル](MCP-(Streamable-HTTP).md)と同様に、インストール、コンパイル、Claude DesktopへのMCPの登録を行います。

## 実行例

以上の機能を駆使することで、生成AIが必要なデータセットを選択し、値や画像を取得したり、詳細ページへの案内をすることが可能になります。
データを表示させるウェブページを生成することもできます。

なお、下記の生成AIの出力内容については出力された原文のままであり、科学的な正確性は未確認であることにご留意ください。
また、利用する生成AIの種類やバージョン、過去の会話の内容等によっては、同じ質問に対してもツールの使い方や入力するパラメータに差異が生じて、異なる結果が得られることがあります。
<br><br>

### ツールの使い方を認識
MCP経由で利用できる機能を生成AIが認識します。

- このツールの使い方を取得する例：<img src="../_media/mcp-demo1-img0.png"><br><br>

### データ取得とレポートの作成
質問に応じて必要なデータセットを確認し、データを取得します。必要に応じてレポートのような形にも整形できます。

- 時期指定で地表面温度の画像を取得する例：<img src="../_media/mcp-demo1-img1.png"><br><br>
- 関連リンクを取得する例：<img src="../_media/mcp-demo1-img2.png"><br><br>
- さらに別のデータセットを探す例：<img src="../_media/mcp-demo1-img5.png"><br><br>
- 複数のデータを駆使して、レポートとしてまとめる例：<img src="../_media/mcp-demo1-img6.png"><br><br>

### ウェブアプリの開発
データ取得の処理を実行するウェブページ（HTML）を生成させることも可能です。

- 生成されたJavaScriptのソースコードを元に、ウェブページのHTMLを作成する例：<img src="../_media/mcp-demo1-img3.png"><br><br>
- 生成されたウェブページ（正常に動作しました）：<img src="../_media/mcp-demo1-img4.png"><br><br>

### より高度な表現が可能なウェブアプリの開発
getDocsの機能によりマークダウン形式のAPIドキュメントも読ませることで、グラフ表示や3D表示のようなより高度な表現が可能なウェブアプリの開発も可能です。

- グラフ表示ウェブアプリ（正常に動作しました）：<img src="../_media/mcp-demo1-img7.png"><br><br>
- 3D地形表示ウェブアプリ（正常に動作しました）：<img src="../_media/mcp-demo1-img8.png">


<a name="documentsoverviewmd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / Overview

# 概要

JAXA Earth API では、地球観測衛星が観測した様々なデータセットを利用できます。
地形や地表面温度、海面水温などのデータセットがあります。
利用できるデータセットの詳細については、<a href="https://data.earth.jaxa.jp/ja/datasets/" target="_blank">こちら</a>をご参照ください。

JAXA Earth APIでは、それらの月別統計値なども予め計算したデータセットとして用意しています。
統計期間が異なる場合には、それぞれIDが異なる別のデータセットとして管理されています。

<img src="../_media/overview-image1.png">

# データを取得する

## ImageCollection
JAXA Earth API for JavaScript では、各データセットに対応するものを[\`ImageCollection\`](#imagecollection)と呼んでいます。
[\`ImageCollection\`](#imagecollection)の中には、観測日時が異なる[\`Image\`](#image)が複数格納されています。
各観測日時のデータが複数の値(バンド)を持つ場合もあります。
[\`ImageCollection\`](#imagecollection)に対して、観測日時とバンドを指定することで、[\`Image\`](#image)を取得します。

## Image
[\`Image\`](#image)は観測日時とバンドが特定された1つの全球データと考えることができます。
[\`Image\`](#image)に対しては、データを取得したい緯度経度範囲、出力する画像のサイズ（ピクセル数）を指定することで、必要な範囲、必要な解像度のデータを格納した[\`DataObject\`](#dataobject)を取得します。

## DataObject
[\`DataObject\`](#dataobject)は、観測日時や緯度経度範囲、画像サイズが特定された一つのデータとして考えることができます。
可視化して閲覧可能な画像（`HTMLCanvasElement`やPNG画像など）にしたり、統計処理を行うことが可能です。

## getDataObject
[\`getDataObject\`](#getdataobject-3)を用いると必要な条件をまとめて指定して、[\`DataObject\`](#dataobject)を簡易的に取得することも可能です。

```js
const dataObject = await je.getDataObject({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
	bbox: [-180, -90, 180, 90], //[西, 南, 東, 北]
	width: 1000,
	height: 500,
});
```

ただし、内部では[\`ImageCollection\`](#imagecollection)と[\`Image\`](#image)の準備を毎回実行することになるため非効率です。
次のような場合は、[\`ImageCollection\`](#imagecollection)と[\`Image\`](#image)を直接扱って再利用することで効率化することが可能です。
- 日付を変えながら時系列のデータを取得したい場合は、[\`ImageCollection\`](#imagecollection)を再利用します。
- 緯度経度範囲を変えていろいろな場所のデータを取得したい場合は、[\`Image\`](#image)を再利用します。

# 統計処理する

[\`DataObject\`](#dataobject)にはピクセルごとのデータが数値配列として格納されています。

[\`Inspector\`](#inspector)を用いて特定の場所の値や座標を取得したり、[\`stat\`](#stat)を用いて統計値を取得したり、[\`createCsv\`](#createcsv)でCSVファイルにしたり、数値配列を直接操作して独自の処理をしたりすることも可能です。

[\`compute\`](#compute)を利用すると、ピクセル単位の演算をすることも可能で、単位変換をしたり、[\`DataObject\`](#dataobject)間の引き算により平年差算出をしたりすることが可能です。

# 可視化する

## ColorMap
[\`ColorMap\`](#colormap)により、データの値に応じた色塗りの方法を指定します。

```js
const colorMap = new je.image.ColorMap({
    min: 0,
    max: 6000,
    colors: je.Colors.JET,
});
```

## createCanvas
[\`DataObject\`](#dataobject)と[\`ColorMap\`](#colormap)の両方を使って、[\`createCanvas\`](#createcanvas)により`HTMLCanvasElement`を作成します。
```js
document.body.appendChild(je.image.createCanvas(dataObject, colorMap));
```
のようにして、そのままブラウザの画面上に画像として表示させることが可能です。ただし、ブラウザのメインスレッド以外では使用できません。

## createOffscreenCanvas
ブラウザのウェブワーカーでも処理させたい場合は`OffscreenCanvas`を使用します。[\`createOffscreenCanvas\`](#createoffscreencanvas)によりウェブワーカー上で`OffscreenCanvas`として画像を作成できます。ウェブワーカーで描画された`OffscreenCanvas`は`ImageBitmap`に変換することでメインスレッドに転送することが可能で、ブラウザ上の`HTMLCanvasElement`に高速に描画できます。ただし、ブラウザ（メインスレッドまたはウェブワーカー）以外では使用できません。

## createPng
ブラウザ以外のサーバーサイドのJavaScript実行環境：Node.js、Deno、Bunでも処理させたい場合は、PNG画像として画像を出力します。
[\`createPng\`](#createpng)により、PNG画像の`Uint8Array`に変換することが可能なため、
```js
import fs from "node:fs";
// (中略)
fs.writeFileSync("image.png", await je.image.createPng(dataObject, colorMap));
```
のようにしてファイル保存することが可能です。また、ウェブサーバーで実行している場合は、
```js
import { Buffer } from "node:buffer";
// (中略)
res.type("png");
res.send(Buffer.from((await je.image.createPng(dataObject, colorMap)).buffer));
```
のようにウェブサーバーからPNG画像としてのレスポンスを返すことも可能です。

# 地図APIと連携する

現状動作確認ができているものとして、次の地図APIとフロントエンドのみの開発で連携可能です。
- <a href="https://openlayers.org/" target="_blank">OpenLayers</a>
- <a href="https://leafletjs.com/" target="_blank">Leaflet</a>
- <a href="https://maplibre.org/" target="_blank">MapLibre GL JS</a>
- <a href="https://cesium.com/platform/cesiumjs/" target="_blank">CesiumJS</a>
- <a href="https://developers.arcgis.com/javascript/" target="_blank">ArcGIS Maps SDK for JavaScript</a>

<a href="https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/#maps" target="_blank">サンプルコードの例はこちら</a>をご参照ください。

また、Node.jsなどを利用してウェブサーバー側で実行して簡易的なWMS/WMTSサーバーを作ることで、それ以外の一般的なWMS/WMTSに対応した地図APIと広く連携することも可能です。

## ImageGenerator

[\`ImageGenerator\`](#imagegenerator)を使うことにより、WMS (Web Map Service) 方式のパラメータを使用して画像を作成できます。
Node.jsなどを利用してウェブサーバー側で実行することにより、簡易的なWMSサーバーを作ることも可能です。

## TileGenerator

[\`TileGenerator\`](#tilegenerator)を使うことにより、WMTS (Web Map Tile Service) 方式のパラメータを使用して画像を作成できます。
Node.jsなどを利用してウェブサーバー側で実行することにより、簡易的なWMTSサーバーを作ることも可能です。

---

# 補足

## 時刻の考え方

JAXA Earth API では各データセットの時刻は世界時(UTC)で定義されています。JavaScriptの`Date`については、通常は端末のローカル時刻に従って生成されるため、
JAXA Earth API for JavaScript で時刻を指定する際は、必ずUTCで指定するようにする必要があります。UTCで時刻を指定するには、`Date.UTC()`を使用します。
JavaScriptの`Date`については、月を0～11で指定する必要があることにも注意が必要です。

ISO8601のフォーマットで指定することも可能です。

```
// 2025/02/03 04:05:06 (UTC)を指定する場合（Date.UTC()を使用）
const date = new Date(Date.UTC(2025, 2 - 1, 3, 4, 5, 6));

// 2025/02/03 04:05:06 (UTC)を指定する場合（ISO8601のフォーマットで指定）
const date = new Date("2025-02-03T04:05:06Z");
```

## ピクセルと緯度経度の考え方

JAXA Earth API ではピクセルの位置の定義で「Pixel is Area」を採用しています。
ピクセルの番号は、ピクセルの左上の位置で定義されています。
ピクセルは左上から右上へと`i`方向、上から下へと`j`方向に順番に並んでいます。

また、投影法は等緯度経度(EPSG:4326)を採用しています（北極や南極のデータセットを除く）。そのため、`i`,`j`方向の経度と緯度は等間隔になっています。

<img src="../_media/overview-image2.png">


<a name="indexreadmemd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / index

# index

## 名前空間

- [data](#indexnamespacesdatareadmemd)
- [image](#indexnamespacesimagemd)

## 列挙

### Projection

定義: data/projection/Projection.ts:4

投影法を指定する場合の選択肢です。

#### 列挙メンバー

##### EPSG4326

> **EPSG4326**: `"EPSG:4326"`

定義: data/projection/Projection.ts:9

等緯度経度を指定する場合の選択肢です。

##### EPSG3857

> **EPSG3857**: `"EPSG:3857"`

定義: data/projection/Projection.ts:14

Webメルカトルを指定する場合の選択肢です。

##### EPSG3995

> **EPSG3995**: `"EPSG:3995"`

定義: data/projection/Projection.ts:19

北極用のEPSG:3995を指定する場合の選択肢です。

##### EPSG3031

> **EPSG3031**: `"EPSG:3031"`

定義: data/projection/Projection.ts:24

南極用のEPSG:3031を指定する場合の選択肢です。

***

### Resampling

定義: data/resample/Resampling.ts:4

リサンプリング方法を指定する場合の選択肢です。

#### 列挙メンバー

##### NEAREST

> **NEAREST**: `"NEAREST"`

定義: data/resample/Resampling.ts:10

ニアレストネイバーを指定する場合の選択肢です。バイリニアの1/6程度の処理時間で高速に処理できます。

##### BILINEAR

> **BILINEAR**: `"BILINEAR"`

定義: data/resample/Resampling.ts:16

バイリニアを指定する場合の選択肢です。ニアレストネイバーよりも時間がかかりますが、地形データの傾斜を求めるような場合には必須です。

***

### Colors

定義: image/Colors.ts:5

[image.ColorMapObject#colors](#colors)に指定する選択肢です。

#### 列挙メンバー

##### GRAY

> **GRAY**: `"gray"`

定義: image/Colors.ts:10

黒→白

##### JET

> **JET**: `"jet"`

定義: image/Colors.ts:15

青→水色→緑→黄色→赤 (虹色)

##### NDVI

> **NDVI**: `"ndvi"`

定義: image/Colors.ts:20

茶→緑

##### SMC

> **SMC**: `"smc"`

定義: image/Colors.ts:25

赤→白→青

##### IC

> **IC**: `"ic"`

定義: image/Colors.ts:30

紺→白

## クラス

### Image

定義: Image.ts:53

[Image](#image)は[ImageCollection](#imagecollection)で日時とバンド名を指定して得ることが可能です。コンストラクターから直接作ることはできません。

[Image#getDataObject](#getdataobject)に緯度経度、画像サイズ、リサンプリング方法を指定することで、[DataObject](#dataobject)を取得することが可能です。

#### 例

```ts
import * as je from "./jaxa.earth.esm.js";

// 利用したいデータセットを特定するためのcollection.jsonを指定します。
const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-W.AMSR2_standard.L3-SMC.daytime.v3_global_monthly/collection.json";

// ImageCollectionを作って初期化します。初期化するとcollection.jsonから必要な情報を読み込みます。
const ic = new je.ImageCollection({ collectionUrl });
await ic.init();

// ImageCollectionからje.Imageを取得します。
const im = await ic.getImage({
	// 日時を指定します。指定した日時のデータを取得します。指定しない場合は現在の日時が指定されることで最新のデータを取得できます。
	// この例では2021/6のデータが取得されます。
	date: new Date(Date.UTC(2021, 6 - 1)),

	// バンド名を指定します。省略した場合は１つ目のバンド名を自動で選択します。
	band: "SMC",
});

// DataObjectを取得します。
const dataObject = await im.getDataObject({

	// Bboxを指定します。省略した場合は[-180,-90,180,90]が指定されたものとして動作します。
	bbox: [110, 30, 150, 50],
	
	// サイズを指定します。省略した場合は幅1000px高さ500pxが指定されたものとして動作します。
	width: 800,
	height: 400,

	// リサンプリング方法を指定します。省略した場合はje.Resampling.NEARESTが指定されたものとして動作します。
	// resampling: je.Resampling.BILINEAR,
});

console.log(dataObject);
```

#### メソッド

##### getDataObject()

> **getDataObject**(`options`): `Promise`\<[`DataObject`](#dataobject)\>

定義: Image.ts:84

[DataObject](#dataobject)を取得します。

###### パラメータ

###### options

###### bbox?

[`Bbox`](#bbox)

[Bbox](#bbox)を指定します。省略した場合は、`[-180, -90, 180, 90]`を指定したものとして動作します。

###### width?

`number`

画像の幅[px]を指定します。省略した場合は`1000`を指定したものとして動作します。

###### height?

`number`

画像の高さ[px]を指定します。省略した場合は`500`を指定したものとして動作します。

###### resampling?

[`Resampling`](#resampling)

リサンプリング方法を指定します。実行を省略した場合は`je.Resampling.NEAREST`が指定されたものとしてニアレストネイバーで処理されます。

###### onloading?

(`progress`, `dataObject`) => `void`

ファイルを読み込むたびに実行されるコールバック関数です。コールバック関数には引数としてprogress(0～100の進捗率)と各時点での[DataObject](#dataobject)が渡されます。

###### 戻り値

`Promise`\<[`DataObject`](#dataobject)\>

##### getCachedDataObject()

> **getCachedDataObject**(): [`DataObject`](#dataobject)

定義: Image.ts:314

すでに[Image#getDataObject](#getdataobject)が実行されている場合に、再度[DataObject](#dataobject)を取得します。再度通信は行わずキャッシュを返します。

###### 戻り値

[`DataObject`](#dataobject)

前回の[Image#getDataObject](#getdataobject)の実行で取得された[DataObject](#dataobject)

##### getCollectionUrl()

> **getCollectionUrl**(): `string`

定義: Image.ts:371

この[Image](#image)のcollectionUrlを返します。

###### 戻り値

`string`

##### getDate()

> **getDate**(): `Date`

定義: Image.ts:378

この[Image](#image)の日時を返します。

###### 戻り値

`Date`

##### getFormattedDate()

> **getFormattedDate**(): `string`

定義: Image.ts:385

この[Image](#image)の日時を、データセットが持つ時刻間隔を踏まえた文字列表現で返します。

###### 戻り値

`string`

##### getBand()

> **getBand**(): `string`

定義: Image.ts:392

この[Image](#image)のバンド名を返します。

###### 戻り値

`string`

***

### ImageCollection

定義: ImageCollection.ts:56

データセットに関する情報を格納した[ImageCollection](#imagecollection)のクラスです。主に日時とバンドの情報を扱います。

データセットのcollection.jsonのURLを指定してインスタンスを作成し、[init](#init)を実行することで準備を完了します。

その後、[first](#first)、[last](#last)、[prev](#prev)、[next](#next)などを用いてこのデータセットで利用できる日時を探し、
日時とバンド名を指定した上で[getImage](#getimage)を実行することで[Image](#image)を取得できます。

#### 例

```ts
import * as je from "./jaxa.earth.esm.js";

// 利用したいデータセットを特定するためのcollection.jsonを指定します。
const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-W.AMSR2_standard.L3-SMC.daytime.v3_global_monthly/collection.json";

// ImageCollectionを作って初期化します。初期化するとcollection.jsonから必要な情報を読み込みます。
const ic = new je.ImageCollection({ collectionUrl });
await ic.init();

// 最初の日時を取得します。
console.log(ic.first());
console.log(ic.formatDate(ic.first()));

// 最後の日時を取得します。
console.log(ic.last());
console.log(ic.formatDate(ic.last()));

// 指定した日時の前の日時を取得します。カタログファイル内を通信しながら探索するため、awaitの指定が必要です。
console.log(await ic.prev(new Date(Date.UTC(2023, 2 - 1))));

// 指定した日時の次の日時を取得します。カタログファイル内を通信しながら探索するため、awaitの指定が必要です。
console.log(await ic.next(new Date(Date.UTC(2023, 2 - 1))));

// 指定した日時範囲のうち、データが存在する日時を取得します。
console.log(await ic.getDateAll(
	new Date(Date.UTC(2020, 1 - 1, 1)),	//開始(この値を含む)
	new Date(Date.UTC(2022, 1 - 1, 1)),	//終了(この値は含まない)
));

// 利用できるバンド名を取得します。
console.log(ic.getBandIdAll());

// ImageCollectionからje.Imageを取得します。
const im = await ic.getImage({
	// 日時を指定します。指定した日時のデータを取得します。指定しない場合は現在の日時が指定されることで最新のデータを取得できます。
	// この例では2021/6のデータが取得されます。
	date: new Date(Date.UTC(2021, 6 - 1)),

	// バンド名を指定します。省略した場合は１つ目のバンド名を自動で選択します。
	band: "SMC",
});
```

#### コンストラクター

##### コンストラクター

> **new ImageCollection**(`options`): [`ImageCollection`](#imagecollection)

定義: ImageCollection.ts:68

###### パラメータ

###### options

###### collectionUrl

`string`

データセットのcollection.jsonのURLです。

###### 戻り値

[`ImageCollection`](#imagecollection)

#### メソッド

##### init()

> **init**(): `Promise`\<`void`\>

定義: ImageCollection.ts:81

`collectionUrl`で指定されたcollection.jsonを読み込んで、このインスタンスを利用できるように準備します。

###### 戻り値

`Promise`\<`void`\>

##### formatDate()

> **formatDate**(`date`): `string`

定義: ImageCollection.ts:108

日時の文字列表現を返します。例えば月単位のデータセットの場合は"YYYY/MM"、日単位のデータセットの場合は"YYYY/MM/DD"、気候値(複数年のデータから得られる平均値等)の場合は"MM"のように、データセット固有の時間間隔を反映した文字列表現に変換します。

###### パラメータ

###### date

`Date`

###### 戻り値

`string`

##### first()

> **first**(): `Date`

定義: ImageCollection.ts:115

利用可能な最初の日時を返します。

###### 戻り値

`Date`

##### last()

> **last**(): `Date`

定義: ImageCollection.ts:123

利用可能な最後の日時を返します。

###### 戻り値

`Date`

##### prev()

> **prev**(`date`): `Promise`\<`Date`\>

定義: ImageCollection.ts:131

引数に指定された日時よりも前のデータが存在する日時を返します。カタログファイル内を通信しながら探索するため、`Promise`を返します。

###### パラメータ

###### date

`Date`

###### 戻り値

`Promise`\<`Date`\>

##### next()

> **next**(`date`): `Promise`\<`Date`\>

定義: ImageCollection.ts:147

引数に指定された日時よりも後のデータが存在する日時を返します。カタログファイル内を通信しながら探索するため、`Promise`を返します。

###### パラメータ

###### date

`Date`

###### 戻り値

`Promise`\<`Date`\>

##### getDateAll()

> **getDateAll**(`start`, `end`): `Promise`\<`Date`[]\>

定義: ImageCollection.ts:166

指定した日時範囲(start <= Date < end)に含まれるデータの日時を全て返します。

###### パラメータ

###### start

`Date`

日時を探索する開始日時です。

###### end

`Date`

日時を探索する終了日時です。（この日時は含みません）

###### 戻り値

`Promise`\<`Date`[]\>

##### getFormattedDateAll()

> **getFormattedDateAll**(`start`, `end`): `Promise`\<`string`[]\>

定義: ImageCollection.ts:177

指定した日時範囲(start <= Date < end)に含まれるデータの日時を全て文字列表現で返します。

###### パラメータ

###### start

`Date`

日時を探索する開始日時です。

###### end

`Date`

日時を探索する終了日時です。（この日時は含みません）

###### 戻り値

`Promise`\<`string`[]\>

##### getBandIdAll()

> **getBandIdAll**(): `string`[]

定義: ImageCollection.ts:187

この[ImageCollection](#imagecollection)で利用できるバンド名を全て返します。collection.jsonの中で定義されるバンド名の順番を維持した文字列の配列として取得できます。

###### 戻り値

`string`[]

利用できるバンド名の配列

##### getImage()

> **getImage**(`options`): `Promise`\<[`Image`](#image)\>

定義: ImageCollection.ts:204

指定された日時、バンド名の[Image](#image)を取得します。

日時の指定に関しては次の通りです。
- 指定した日時にデータが存在する場合は、そのデータを返します。
- 指定した日時に端数があり、ピンポイントのデータが存在しない場合には、その直前のデータを指すように丸められます。例えば月別のデータに対して、2025/02/05 12:00を指定した場合は2025/02が選択されます。
- 指定を省略した場合は、現在日時`new Date()`が指定されることで最も最新のデータを取得できます。

バンド名の指定に関しては次の通りです。
- 指定した場合はそのバンド名のデータを返します。
- 指定を省略した場合は、collection.json上で定義されている1個目のバンド名を自動で選択します。

###### パラメータ

###### options

###### date?

`Date`

日時を指定します。

###### band?

`string`

バンド名を指定します。

###### 戻り値

`Promise`\<[`Image`](#image)\>

***

### ImageGenerator

定義: ImageGenerator.ts:45

WMS (Web Map Service) 方式のパラメータを使用して画像を作成します。
[OpenLayers](https://openlayers.org/)の[ImageCanvas](https://openlayers.org/en/latest/apidoc/module-ol_source_ImageCanvas.html)などを使用して地図APIと連携する場合に使用します。

#### コンストラクター

##### コンストラクター

> **new ImageGenerator**(`__namedParameters`): [`ImageGenerator`](#imagegenerator)

定義: ImageGenerator.ts:63

###### パラメータ

###### \_\_namedParameters

###### collectionUrl

`string`

データセットのcollection.jsonのURLです。

###### date?

`Date`

取得するデータの日時です。省略した場合は現在の日時`new Date()`が指定されたものとして動作します。

###### band?

`string`

利用するデータセットのバンドです。省略した場合はそのデータセットに含まれる1件目（collection.json内で定義される順番で1件目）のバンドを利用します。

###### resampling?

[`Resampling`](#resampling)

使用するリサンプリング方法です。省略した場合はニアレストネイバー(`je.Resampling.NEAREST`)が指定されたものとして動作します。

###### colorMapObject?

[`ColorMapObject`](#colormapobject)

可視化するためのカラーマップの条件です。省略した場合は`{min: 0, max: 255, colors: ["000000", "ffffff"]}`を指定したものとして動作します。
カラー画像やクラス分類型のデータ（`photometricInterpretation == 1`ではないデータ）の場合は無視され、各データで元から指定されている色が優先されます。
ウェブワーカーなど、スレッド間で描画条件を送受信する際に支障が無いように、[ColorMap](#colormap)ではなく[ColorMapObject](#colormapobject)としています。

###### 戻り値

[`ImageGenerator`](#imagegenerator)

#### メソッド

##### init()

> **init**(): `Promise`\<`void`\>

定義: ImageGenerator.ts:139

初期化します。実行必須です。

###### 戻り値

`Promise`\<`void`\>

##### getCanvas()

> **getCanvas**(`width`, `height`, `extent`, `projection`, `callback`, `abortSignal`): `Promise`\<`HTMLCanvasElement`\>

定義: ImageGenerator.ts:242

`HTMLCanvasElement`として画像を取得します。

###### パラメータ

###### width

`number`

画像の幅（ピクセル数）です。

###### height

`number`

画像の高さ（ピクセル数）です。

###### extent

[`Bbox`](#bbox)

表示する地理範囲を示す[Bbox](#bbox)です。投影法`projection`がEPSG:4326の場合は緯度経度で指定されますが、EPSG:3857の場合はm単位で指定されるものとなります。WMSのパラメータのルールに依存することに注意が必要です。

###### projection

[`Projection`](#projection)

使用する投影法です。

###### callback

(`progress`, `canvas`, `dataObject`) => `void`

データが読み込まれるたびに実行されるコールバック関数です。進捗率（0～100）や読み込み途中の画像を取得できます。

###### abortSignal

`AbortSignal`

###### 戻り値

`Promise`\<`HTMLCanvasElement`\>

###### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドでのみ利用可能です。</span>

##### getOffscreenCanvas()

> **getOffscreenCanvas**(`width`, `height`, `extent`, `projection`, `callback`, `abortSignal`): `Promise`\<`OffscreenCanvas`\>

定義: ImageGenerator.ts:274

`OffscreenCanvas`として画像を取得します。

###### パラメータ

###### width

`number`

画像の幅（ピクセル数）です。

###### height

`number`

画像の高さ（ピクセル数）です。

###### extent

[`Bbox`](#bbox)

表示する地理範囲を示す[Bbox](#bbox)です。投影法`projection`がEPSG:4326の場合は緯度経度で指定されますが、EPSG:3857の場合はm単位で指定されるものとなります。WMSのパラメータのルールに依存することに注意が必要です。

###### projection

[`Projection`](#projection)

使用する投影法です。

###### callback

(`progress`, `offscreenCanvas`, `dataObject`) => `void`

データが読み込まれるたびに実行されるコールバック関数です。進捗率（0～100）や読み込み途中の画像を取得できます。

###### abortSignal

`AbortSignal`

###### 戻り値

`Promise`\<`OffscreenCanvas`\>

###### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドまたはウェブワーカーでのみ利用可能です。</span>

##### getPng()

> **getPng**(`width`, `height`, `extent`, `projection`, `callback`, `abortSignal`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

定義: ImageGenerator.ts:305

PNG画像の`Uint8Array`として画像を取得します。

###### パラメータ

###### width

`number`

画像の幅（ピクセル数）です。

###### height

`number`

画像の高さ（ピクセル数）です。

###### extent

[`Bbox`](#bbox)

表示する地理範囲を示す[Bbox](#bbox)です。投影法`projection`がEPSG:4326の場合は緯度経度で指定されますが、EPSG:3857の場合はm単位で指定されるものとなります。WMSのパラメータのルールに依存することに注意が必要です。

###### projection

[`Projection`](#projection)

使用する投影法です。

###### callback

(`progress`, `pngUint8Array`, `dataObject`) => `void`

データが読み込まれるたびに実行されるコールバック関数です。進捗率（0～100）や読み込み途中の画像を取得できます。

###### abortSignal

`AbortSignal`

###### 戻り値

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### setColorMapObject()

> **setColorMapObject**(`colorMapObject`): `void`

定義: ImageGenerator.ts:330

カラーマップを途中で変更する場合に使用します。

###### パラメータ

###### colorMapObject

[`ColorMapObject`](#colormapobject)

###### 戻り値

`void`

##### getDataObject()

> **getDataObject**(): [`DataObject`](#dataobject)

定義: ImageGenerator.ts:342

すでに読み込まれている[DataObject](#dataobject)をキャッシュから再度取得します。再度通信は行われません。

###### 戻り値

[`DataObject`](#dataobject)

***

### TileGenerator

定義: TileGenerator.ts:32

WMTS (Web Map Tile Service) 方式のパラメータを使用してタイル画像を作成します。
[OpenLayers](https://openlayers.org/)の[ImageTile](https://openlayers.org/en/latest/apidoc/module-ol_source_ImageTile.html)などを使用して地図APIと連携する場合に使用します。

#### コンストラクター

##### コンストラクター

> **new TileGenerator**(`__namedParameters`): [`TileGenerator`](#tilegenerator)

定義: TileGenerator.ts:48

###### パラメータ

###### \_\_namedParameters

###### collectionUrl

`string`

データセットのcollection.jsonのURLです。

###### date?

`Date`

取得するデータの日時です。省略した場合は現在の日時`new Date()`が指定されたものとして動作します。

###### band?

`string`

利用するデータセットのバンドです。省略した場合はそのデータセットに含まれる1件目（collection.json内で定義される順番で1件目）のバンドを利用します。

###### resampling?

[`Resampling`](#resampling)

使用するリサンプリング方法です。省略した場合はニアレストネイバー(`je.Resampling.NEAREST`)が指定されたものとして動作します。

###### colorMapObject?

[`ColorMapObject`](#colormapobject)

可視化するためのカラーマップの条件です。省略した場合は`{min: 0, max: 255, colors: ["000000", "ffffff"]}`を指定したものとして動作します。
カラー画像やクラス分類型のデータ（`photometricInterpretation == 1`ではないデータ）の場合は無視され、各データで元から指定されている色が優先されます。
ウェブワーカーなど、スレッド間で描画条件を送受信する際に支障が無いように、[ColorMap](#colormap)ではなく[ColorMapObject](#colormapobject)としています。

###### tileSize?

`number`

作成するタイルのサイズ（幅・高さのピクセル数）です。256か512で動作確認済みです。指定しない場合は256が指定されたものとして動作します。

###### delay?

`number` = `500`

この時間[ミリ秒]ごとにまとめてタイルを取得します。指定しない場合は500が指定されたものとして動作します。
この値を大きくすると、この時間内に届く複数のタイル描画指示を集約してデータをまとめて取得するため通信を効率化できますが、結果が返るまでの時間が長くなります。

###### 戻り値

[`TileGenerator`](#tilegenerator)

#### メソッド

##### init()

> **init**(): `Promise`\<`void`\>

定義: TileGenerator.ts:167

初期化します。実行必須です。

###### 戻り値

`Promise`\<`void`\>

##### getDataObject()

> **getDataObject**(`x`, `y`, `z`, `abortSignal?`): `Promise`\<[`DataObject`](#dataobject)\>

定義: TileGenerator.ts:197

[DataObject](#dataobject)としてタイルのデータを取得します。

###### パラメータ

###### x

`number`

タイル座標Xです。

###### y

`number`

タイル座標Yです。

###### z

`number`

タイル座標Zです。

###### abortSignal?

`AbortSignal`

中断処理するための`AbortSignal`を渡します。

###### 戻り値

`Promise`\<[`DataObject`](#dataobject)\>

##### getCanvas()

> **getCanvas**(`x`, `y`, `z`, `abortSignal?`): `Promise`\<`HTMLCanvasElement`\>

定義: TileGenerator.ts:279

`HTMLCanvasElement`としてタイル画像を取得します。

###### パラメータ

###### x

`number`

タイル座標Xです。

###### y

`number`

タイル座標Yです。

###### z

`number`

タイル座標Zです。

###### abortSignal?

`AbortSignal`

中断処理するための`AbortSignal`を渡します。

###### 戻り値

`Promise`\<`HTMLCanvasElement`\>

###### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドでのみ利用可能です。</span>

##### getOffscreenCanvas()

> **getOffscreenCanvas**(`x`, `y`, `z`, `abortSignal?`): `Promise`\<`OffscreenCanvas`\>

定義: TileGenerator.ts:323

`OffscreenCanvas`としてタイル画像を取得します。

###### パラメータ

###### x

`number`

タイル座標Xです。

###### y

`number`

タイル座標Yです。

###### z

`number`

タイル座標Zです。

###### abortSignal?

`AbortSignal`

中断処理するための`AbortSignal`を渡します。

###### 戻り値

`Promise`\<`OffscreenCanvas`\>

###### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドまたはウェブワーカーでのみ利用可能です。</span>

##### getPng()

> **getPng**(`x`, `y`, `z`, `abortSignal?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

定義: TileGenerator.ts:364

PNG画像の`Uint8Array`としてタイル画像を取得します。

###### パラメータ

###### x

`number`

タイル座標Xです。

###### y

`number`

タイル座標Yです。

###### z

`number`

タイル座標Zです。

###### abortSignal?

`AbortSignal`

中断処理するための`AbortSignal`を渡します。

###### 戻り値

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### setColorMapObject()

> **setColorMapObject**(`colorMapObject`): `void`

定義: TileGenerator.ts:390

###### パラメータ

###### colorMapObject

[`ColorMapObject`](#colormapobject)

###### 戻り値

`void`

## 型エイリアス

### Bbox

> **Bbox** = \[`number`, `number`, `number`, `number`\]

定義: Bbox.ts:27

緯度経度範囲を表す数値配列です。
数値配列は、等緯度経度(EPSG:4326)の場合にはWGS84における緯度[deg]と経度[deg]を用いて、[西の経度, 南の緯度, 東の経度, 北の緯度] のように反時計回りで指定します。<br><br>
北極(EPSG:3995)の場合は、北極点を原点、経度180度の線に沿って+Y方向、経度0度の線に沿って-Y方向として、距離[m]を用いて[-X, -Y, X, Y]のように反時計回りで指定します。<br><br>
南極(EPSG:3031)の場合には、南極点を原点、経度0度の線に沿って+Y方向、経度180度の線に沿って-Y方向として、距離[m]を用いて[-X, -Y, X, Y]のように反時計回りで指定します。

#### 例

```ts
// 全球を指定する場合
const bbox = [-180, -90, 180, 90];

// 日本周辺を指定する場合
const bbox = [120, 15, 160, 55];

// 特定の緯度経度の点から半径dl[deg]の範囲を指定する場合
const lng = 138.73;
const lat = 35.36;
const dl = 0.2;
const bbox = [lng - dl, lat - dl, lng + dl, lat + dl];

// 北極(EPSG:3995)または南極(EPSG:3031)の場合
const bbox = [-8388608, -8388608, 8388608, 8388608];

// TypeScriptで書く場合（jaxa.earth.esm.jsとjaxa.earth.esm.d.tsをダウンロードして利用してください）
import type { Bbox } from "./jaxa.earth.esm.js";
const bbox: Bbox = [-180, -90, 180, 90];
```

## 関数

### abort()

> **abort**(): `void`

定義: abort.ts:12

スレッド内の全ての読み込み処理を中断します。ウェブワーカーの処理を中断する時などに利用します。

メモリー領域はウェブワーカーごとに異なるため、中断できる範囲は実行したウェブワーカー内のみです。
他のウェブワーカーで実行されている処理への影響はありません。
そのため、複数の地図画面を表示するウェブアプリを作る場合には、地図画面ごとにウェブワーカーをそれぞれ用意することで、地図画面ごとの中断処理が可能になります。

#### 戻り値

`void`

***

### getDataObject()

> **getDataObject**(`options`): `Promise`\<[`DataObject`](#dataobject)\>

定義: getDataObject.ts:57

[ImageCollection](#imagecollection)と[Image](#image)の操作を意識することなく、指定した条件で[DataObject](#dataobject)を簡易的に取得するためのメソッドです。

次の処理と等価です。
```js
const ic = new ImageCollection({
	collectionUrl,
});

await ic.init();

const image = await ic.getImage({
	date,
	band,
});

const dataObject = await image.getDataObject({
	bbox,
	width,
	height,
	resampling,
	onloading,
});
```

#### パラメータ

##### options

###### collectionUrl

`string`

利用するデータセットのcollection.jsonのURL

###### date?

`Date`

取得するデータの日時。省略した場合は現在の日時（`new Date()`）が指定されたものとして動作し、利用可能な最新のデータを返します。

###### band?

`string`

利用するデータセットのバンド名。省略した場合はそのデータセットに含まれる1件目（collection.json内で定義される順番で1件目）のバンド名を利用します。

###### bbox?

[`Bbox`](#bbox)

緯度経度範囲を示す[Bbox](#bbox)。省略した場合は`[-180, -90, 180, 90]`が指定されたものとして動作します。

###### width?

`number`

取得する画像の幅[px]。省略した場合は`1000`が指定されたものとして動作します。

###### height?

`number`

取得する画像の高さ[px]。省略した場合は`500`が指定されたものとして動作します。

###### resampling?

[`Resampling`](#resampling)

リサンプリング方法。省略した場合はニアレストネイバー(`je.Resampling.NEAREST`)が指定されたものとして動作します。

###### onloading?

(`progress`, `dataObject`) => `void`

ファイルを読み込むたびに実行されるコールバック関数です。コールバック関数には引数としてprogress(0～100の進捗率)と各時点での[DataObject](#dataobject)が渡されます。省略した場合は何も実行しない関数`() => { }`が指定されたものとして動作します。

#### 戻り値

`Promise`\<[`DataObject`](#dataobject)\>

#### 例

```ts
import * as je from "./jaxa.earth.esm.js";

const dataObject = await je.getDataObject({
	//利用するデータセットのcollection.jsonのURLを記載します。
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",

	//利用するデータセットのバンド名を指定します。
	band: "DSM",

	//データを取得する緯度経度範囲を記載します。
	//[最小経度(西), 最小緯度(南), 最大経度(東), 最大緯度(北)]
	bbox: [-180, -90, 180, 90],

	//データを取得する画像のサイズをピクセル数で記載します。
	width: 1000,
	height: 500,

	//データが読み込まれるたびに実行されるコールバック関数
	onloading: (progress, dataObject) => {
		console.log(progress, dataObject);
		// 読み込みの進捗状況表示や途中状況の可視化を行います。
	}
});
```


<a name="indexnamespacesdatareadmemd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / [index](#indexreadmemd) / data

# data

[DataObject](#dataobject)に関連する機能をまとめたモジュールです。
投影変換やリサンプリング、統計値計算、CSV出力などが可能です。

## 名前空間

- [projection](#indexnamespacesdatanamespacesprojectionmd)
- [resample](#indexnamespacesdatanamespacesresamplemd)

## クラス

### Inspector

定義: data/Inspector.ts:24

[DataObject](#dataobject)上における特定の位置のデータの値や座標を取得するためのクラスです。

#### 例

```ts
// 値を調べるためのInspectorを作成します。
const isp = new je.data.Inspector(dataObject);

// 緯度経度で(135.0, 35.0)の場所のピクセル位置を取得します。
console.log(isp.getPixelByCoordinateXY(135.0, 35.0));

// ピクセル位置で(275, 225)の場所の緯度経度を取得します。
console.log(isp.getCoordinateByPixelXY(275, 225));

// 緯度経度で(135.0, 35.0)の場所の値を取得します。
console.log(isp.getValueByCoordinateXY(135.0, 35.0));

// ピクセル位置で(275, 225)の場所の値を取得します。
console.log(isp.getValueByPixelXY(275, 225));
```

#### コンストラクター

##### コンストラクター

> **new Inspector**(`dataObject`): [`Inspector`](#inspector)

定義: data/Inspector.ts:28

###### パラメータ

###### dataObject

[`DataObject`](#dataobject)

###### 戻り値

[`Inspector`](#inspector)

#### メソッド

##### getPixelByCoordinateXY()

> **getPixelByCoordinateXY**(`x`, `y`): `object`

定義: data/Inspector.ts:40

座標(投影法がEPSG:4326の場合は緯度経度、EPSG:3857の場合はm単位など)で位置指定して、その場所のピクセル座標を取得します。

データの範囲外の場合は`null`を返します。

###### パラメータ

###### x

`number`

座標を取得したい場所のX座標です。

###### y

`number`

座標を取得したい場所のY座標です。

###### 戻り値

`object`

###### x

> **x**: `number`

###### y

> **y**: `number`

##### getCoordinateByPixelXY()

> **getCoordinateByPixelXY**(`x`, `y`): `object`

定義: data/Inspector.ts:63

ピクセル座標で位置指定して、その場所の座標(投影法がEPSG:4326の場合は緯度経度、EPSG:3857の場合はm単位など)を取得します。

データの範囲外の場合は`null`を返します。

###### パラメータ

###### x

`number`

座標を取得したい場所のピクセル位置のX座標です。

###### y

`number`

座標を取得したい場所のピクセル位置のY座標です。

###### 戻り値

`object`

###### x

> **x**: `number`

###### y

> **y**: `number`

###### projection

> **projection**: [`Projection`](#projection)

##### getValueByCoordinateXY()

> **getValueByCoordinateXY**(`x`, `y`): `number`

定義: data/Inspector.ts:91

緯度経度を指定して、その場所の値を取得します。コンストラクターに与えたdataObjectにおいて、画像の左上は`(dataObject.bbox[0], dataObject.bbox[3])`、画像の右下は`(dataObject.bbox[2], dataObject.bbox[1])`となります。
dataObject.projectionがEPSG:4326の場合は緯度経度、EPSG:3857の場合はm単位で指定します。

データの範囲外の場合は`null`を返します。

###### パラメータ

###### x

`number`

値を取得したい場所のX座標です。

###### y

`number`

値を取得したい場所のY座標です。

###### 戻り値

`number`

##### getValueByPixelXY()

> **getValueByPixelXY**(`x`, `y`): `number`

定義: data/Inspector.ts:116

ピクセル座標で位置指定して、その場所の値を取得します。画像の左上のピクセルは`(0, 0)`、画像の右下のピクセルは`(width - 1, height - 1)`です。

データの範囲外の場合は`null`を返します。

###### パラメータ

###### x

`number`

値を取得したい場所のピクセル位置のX座標です。

###### y

`number`

値を取得したい場所のピクセル位置のY座標です。

###### 戻り値

`number`

## インターフェイス

### DataObject

定義: data/DataObject.ts:10

[getDataObject](#getdataobject-3)、[Image#getDataObject](#getdataobject)などにより取得できる、取得したデータを扱いやすいように格納したオブジェクトです。

DataObjectは[\`ColorMap\`](#colormap)の設定を利用して、[\`createCanvas\`](#createcanvas)などを用いることで画像として可視化できます。

#### プロパティ

##### width

> **width**: `number`

定義: data/DataObject.ts:12

画像の幅(ピクセル数)です。

##### height

> **height**: `number`

定義: data/DataObject.ts:15

画像の高さ(ピクセル数)です。

##### data

> **data**: `Float32Array`

定義: data/DataObject.ts:18

各ピクセルの値を画像の左上→右上、上→下へと順に格納した1次元配列(`Float32Array`)です。配列の要素数は`width * height`個です。ピクセル`(i, j)`のデータは、1次元配列の`i + j * width`番目に格納されています。観測の範囲外などで値が無いピクセルには`NaN`が格納されています。

##### bbox

> **bbox**: [`Bbox`](#bbox)

定義: data/DataObject.ts:21

緯度経度範囲を表す[Bbox](#bbox)です。

##### unit

> **unit**: `string`

定義: data/DataObject.ts:24

dataに格納されている値の単位です。単位が無い無次元量の場合は`""`が格納されます。

##### date

> **date**: `Date`

定義: data/DataObject.ts:27

データの日時を示す`Date`です。

##### formattedDate

> **formattedDate**: `string`

定義: data/DataObject.ts:30

データの日時の文字列表現です。例えば月単位のデータセットの場合は"YYYY/MM"、日単位のデータセットの場合は"YYYY/MM/DD"、気候値(複数年のデータから得られる平均値等)の場合は"MM"のように、データセット固有の時間間隔を反映した文字列表現となっています。

##### projection

> **projection**: [`Projection`](#projection)

定義: data/DataObject.ts:33

"EPSG:4326"などの投影法[Projection](#projection)です。

##### src

> **src**: `object`[]

定義: data/DataObject.ts:38

元のCOGファイルとSTACファイルへのURLです。

###### cog

> **cog**: `string`

###### stac

> **stac**: `string`

##### photometricInterpretation

> **photometricInterpretation**: `number`

定義: data/DataObject.ts:46

元のGeoTIFFファイルで定義されている`photometricInterpretation`の値です。JAXA Earth APIでは次の値に対応しています。
- `photometricInterpretation = 1` (BlackIsZero)：各ピクセルに物理量の値が格納されているデータであることを示します。いわゆる尺度水準における「順序尺度（大きさの比較はできるが四則演算は意味を持たない：植生指数など）」か「間隔尺度（足し算引き算は可能であるが、掛け算割り算は意味を持たない：摂氏単位の温度など）」か「比率尺度（四則演算可能：降水量やケルビン単位の温度など）」と呼ばれるデータであることを示します。
- `photometricInterpretation = 2` (RGB)：各ピクセルにRRGGBBAAの色の値が格納されているカラー画像であることを示します。ニアレストネイバーリサンプリングは可能ですが、バイリニアリサンプリングは使用できません。本来はGeoTIFFの`samplesPerPixel = 4`、`planarConfiguration = 1`に従って[RR, GG, BB, AA]の4倍の要素数で処理する必要がありますが、便宜的に`Float32Array`の各32ビット値にRRGGBBAAを格納することで、`data`の要素数（`width * height`）をBlackIsZeroの場合と同一にして処理します。
- `photometricInterpretation = 3` (Palette color)：各ピクセルにクラス分類を示す値が格納されているデータであることを示します。いわゆる尺度水準における「名義尺度」と呼ばれるデータ（土地被覆分類など）であり、値間の順位や大きさは意味を持たず、四則演算をしても意味のある値は出せません。ニアレストネイバーリサンプリングは可能ですが、バイリニアリサンプリングは使用できません。

##### colors?

> `optional` **colors**: `string`[]

定義: data/DataObject.ts:53

`photometricInterpretation = 3` (Palette color)の場合に各値に塗る色を格納しています。
[\`ColorMap\`](#colormap)よりも優先されます。
GeoTIFFファイル内のIFD (Image File Directory)の`ColorMap`で指定された情報から色のカラーコード文字列の配列を作成し、格納しています。

##### classes?

> `optional` **classes**: `any`

定義: data/DataObject.ts:59

`photometricInterpretation = 3` (Palette color)の場合に各値の説明内容を格納しています。
STACのカタログファイル内の`classification:classes`で定義されているJSONを格納しています。

## 関数

### compute()

> **compute**(`__namedParameters`): [`DataObject`](#dataobject)

定義: data/compute.ts:46

複数の[DataObject](#dataobject)を利用して演算を行い、新しい[DataObject](#dataobject)を返します。

#### パラメータ

##### \_\_namedParameters

###### dataObjects

[`DataObject`](#dataobject)[]

演算に利用する[DataObject](#dataobject)を配列で指定します。

###### operation

(...`values`) => `number`

ピクセルごとの演算方法を指定します。

###### unit

`string`

演算後の値の単位を指定します。

###### date?

`Date`

演算後の[DataObject](#dataobject)に日時の概念がある場合は、その日時を指定します。指定しない場合は`undefined`となります。

###### formattedDate?

`string`

演算後の[DataObject](#dataobject)に日時の概念がある場合は、その日時の文字列表現を指定します。指定しない場合は`undefined`となります。

#### 戻り値

[`DataObject`](#dataobject)

#### 例

```ts
//ケルビン単位のデータを℃単位のデータに換算する
const dataObject2 = je.data.compute({
	dataObjects: [dataObject],
	operation: (value) => value - 273.15,
	unit: "degC",
	date: dataObject.data,
	formattedDate: dataObject.formattedDate,
});

//観測値dataObject1と平年値dataObject2から平年差anomalyを計算
const anomaly = je.data.compute({
	dataObjects: [dataObject1, dataObject2],

	//ピクセル間の演算方法を定義（引数はdataObjectsの配列の順番と同一）
	operation: (value_of_dataObject1, value_of_dataObject2) => value_of_dataObject1 - value_of_dataObject2,

	unit: "degC",
	date: dataObject1.data,
	formattedDate: dataObject1.formattedDate,
});
```

***

### createCsv()

> **createCsv**(`dataObject`): `string`

定義: data/createCsv.ts:7

データをCSV (Comma-Separated Values) 形式の文字列に変換します。テキストファイルとしてダウンロードする機能やファイル保存する機能を別途作成することで、CSVファイルを作ることが可能です。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

#### 戻り値

`string`

***

### globalStat()

> **globalStat**(`dataObject`): `object`

定義: data/globalStat.ts:9

WGS84回転楕円体に基づいて計算されるピクセルごとの面積の違いを考慮して、データの統計値を求めます。`NaN`のピクセルは統計には含めません。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

#### 戻り値

##### size

> **size**: `number`

NaNのピクセルを除くピクセル数です。

##### min

> **min**: `number`

全ピクセルの値のうち、最も小さな値（最小値）です。

##### max

> **max**: `number`

全ピクセルの値のうち、最も大きな値（最大値）です。

##### mean

> **mean**: `number`

全ピクセルの値の平均値です。計算においてはピクセルごとの面積の違いをピクセルごとの重みとして考慮しています。

#### Remarks

<span style="color:red;font-weight:bold;">等緯度経度(EPSG:4326)のみに対応しており、北極(EPSG:3995)及び南極(EPSG:3031)等には対応していません。</span>

***

### stat()

> **stat**(`dataObject`): `object`

定義: data/stat.ts:9

データの統計値を求めます。`NaN`のピクセルは統計には含めません。
なお、この計算では実際の地球表面上におけるピクセルごとの面積の違いは考慮していません。
緯度経度範囲が十分に狭く、ピクセルごとの面積の違いを無視できる場合はこの簡易的な計算でも問題ありませんが、ピクセルごとの面積の違いがある広い緯度経度範囲のデータで厳密な評価を行なうためには、[globalStat](#globalstat)を利用してください。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

#### 戻り値

##### size

> **size**: `number`

NaNのピクセルを除くピクセル数です。

##### min

> **min**: `number`

全ピクセルの値のうち、最も小さな値（最小値）です。

##### max

> **max**: `number`

全ピクセルの値のうち、最も大きな値（最大値）です。

##### sum

> **sum**: `number`

全ピクセルの値の合計値です。

##### mean

> **mean**: `number`

全ピクセルの値の平均値(sum / size)です。

##### stdev

> **stdev**: `number`

全ピクセルの値の標準偏差(√( Σ((x - mean)^2) / size ))です。

##### median

> **median**: `number`

全ピクセルの値の中央値です。


<a name="indexnamespacesdatanamespacesprojectionmd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / [index](#indexreadmemd) / [data](#indexnamespacesdatareadmemd) / projection

# projection

## 関数

### transform()

> **transform**(`dataObject`, `projection`): [`DataObject`](#dataobject)

定義: data/projection/transform.ts:9

投影変換を行います。現状はEPSG:4326からEPSG:3857への変換にのみ対応しています。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

##### projection

[`Projection`](#projection)

#### 戻り値

[`DataObject`](#dataobject)

## リファレンス

### Projection

再エクスポート [Projection](#projection)


<a name="indexnamespacesdatanamespacesresamplemd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / [index](#indexreadmemd) / [data](#indexnamespacesdatareadmemd) / resample

# resample

## リファレンス

### Resampling

再エクスポート [Resampling](#resampling)


<a name="indexnamespacesimagemd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

[JAXA Earth API for JavaScript](#modulesmd) / [index](#indexreadmemd) / image

# image

[\`DataObject\`](#dataobject)から画像を作成するための機能をまとめたモジュールです。

実行環境に応じて、主に次の関数を利用して[\`DataObject\`](#dataobject)と[ColorMap](#colormap)から画像に変換します。
- [createCanvas](#createcanvas)（ブラウザのメインスレッド限定で、`HTMLCanvasElement`に変換する）
- [createOffscreenCanvas](#createoffscreencanvas)（ブラウザのメインスレッドまたはウェブワーカー限定で、`OffscreenCanvas`に変換する）
- [createPng](#createpng)（ブラウザ、Node.js、Deno、BunでPNG画像の`Uint8Array`に変換する）

また、[createImageDataObject](#createimagedataobject)を使用することで、各ピクセルのRGBAの色成分を`Uint8ClampedArray`として格納した中間データ[ImageDataObject](#imagedataobject)も利用可能です。

## クラス

### ColorMap

定義: image/ColorMap.ts:34

可視化のためのカラーマップを作成します。

#### 例

```ts
import * as je from "./jaxa.earth.esm.js";

// 0～6000を虹色に塗る場合
const cmap1 = new je.image.ColorMap({
	min: 0,
	max: 6000,
	colors: je.Colors.JET,
});

// 3000の値の色を取得
console.log(cmap1.getColor(3000)); //=> {r: 159, g: 246, b: 72, a: 255}
console.log(cmap1.getColorUint8ClampedArray(3000)); //=> Uint8ClampedArray(4) [159, 246, 72, 255]

// 凡例をHTMLCanvasElement（幅500px、高さ50px）としてブラウザ上に表示
document.body.appendChild(cmap1.createColorBarCanvas(500, 50))

// 0～3000を白→赤→青に塗り、3000～6000を青→黒に塗る場合
const cmap2 = new je.image.ColorMap([
	{ min: 0, max: 3000, colors: ["ffffff", "ff0000", "0000ff"] },
	{ min: 3000, max: 6000, colors: ["0000ff", "000000"] }
]);
```

#### コンストラクター

##### コンストラクター

> **new ColorMap**(`colorMapObject`): [`ColorMap`](#colormap)

定義: image/ColorMap.ts:42

[ColorMapObject](#colormapobject)を1個、または配列で複数個指定することでColorMapを作成します。
省略した場合は`{min: 0, max: 255, colors: ["000000", "ffffff"]}`を指定したものとして動作します。

###### パラメータ

###### colorMapObject

[`ColorMapObject`](#colormapobject) | [`ColorMapObject`](#colormapobject)[]

###### 戻り値

[`ColorMap`](#colormap)

#### メソッド

##### getColorMapObject()

> **getColorMapObject**(): [`ColorMapObject`](#colormapobject) \| [`ColorMapObject`](#colormapobject)[]

定義: image/ColorMap.ts:52

コンストラクターの引数として与えられた[ColorMapObject](#colormapobject)を返します。

###### 戻り値

[`ColorMapObject`](#colormapobject) \| [`ColorMapObject`](#colormapobject)[]

##### getColor()

> **getColor**(`x`): `object`

定義: image/ColorMap.ts:59

xの値における色を`{r(赤成分), g(緑成分), b(青成分), a(アルファ成分)}`のオブジェクトとして返します。各成分は0～255の値を持ちます。

###### パラメータ

###### x

`number`

###### 戻り値

`object`

###### r

> **r**: `number`

###### g

> **g**: `number`

###### b

> **b**: `number`

###### a

> **a**: `number`

##### getColorUint8ClampedArray()

> **getColorUint8ClampedArray**(`x`): `Uint8ClampedArray`

定義: image/ColorMap.ts:71

xの値における色を`Uint8ClampedArray`として返します。`Uint8ClampedArray`は`[R(赤成分), G(緑成分), B(青成分), A(アルファ成分)]`の配列で、各成分は0～255の値を持ちます。

###### パラメータ

###### x

`number`

###### 戻り値

`Uint8ClampedArray`

##### createColorBarCanvas()

> **createColorBarCanvas**(`width`, `height`): `HTMLCanvasElement`

定義: image/ColorMap.ts:81

このColorMapの凡例用画像を`HTMLCanvasElement`として返します。

###### パラメータ

###### width

`number`

画像の幅（ピクセル数）です。

###### height

`number`

画像の高さ（ピクセル数）です。

###### 戻り値

`HTMLCanvasElement`

###### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドでのみ利用可能です。</span>

##### createColorBarPng()

> **createColorBarPng**(`width`, `height`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

定義: image/ColorMap.ts:92

このColorMapの凡例用画像をPNG画像の`Uint8Array`として返します。

###### パラメータ

###### width

`number`

画像の幅（ピクセル数）です。

###### height

`number`

画像の高さ（ピクセル数）です。

###### 戻り値

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### createColorBarImageDataObject()

> **createColorBarImageDataObject**(`width`, `height`): [`ImageDataObject`](#imagedataobject)

定義: image/ColorMap.ts:101

このColorMapの凡例用画像を[ImageDataObject](#imagedataobject)として返します。

###### パラメータ

###### width

`number`

画像の幅（ピクセル数）です。

###### height

`number`

画像の高さ（ピクセル数）です。

###### 戻り値

[`ImageDataObject`](#imagedataobject)

##### createLegendCanvas()

> **createLegendCanvas**(`width`, `height`, `size`, `unit`): `HTMLCanvasElement`

定義: image/ColorMap.ts:113

このColorMapの凡例用画像（目盛りの数値と単位の文字列併記）を`HTMLCanvasElement`として返します。

###### パラメータ

###### width

`number`

目盛りや単位も含めた画像全体の幅（ピクセル数）です。

###### height

`number`

目盛りや単位も含めた画像全体の高さ（ピクセル数）です。

###### size

`number`

文字のサイズです。

###### unit

`string`

凡例画像内に併記する単位の文字です。

###### 戻り値

`HTMLCanvasElement`

###### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドでのみ利用可能です。</span>

## インターフェイス

### ColorMapObject

定義: image/ColorMapObject.ts:7

[ColorMap](#colormap)の引数として使うオブジェクトです。

#### プロパティ

##### min

> **min**: `number`

定義: image/ColorMapObject.ts:11

数値範囲の下限を指定します。

##### max

> **max**: `number`

定義: image/ColorMapObject.ts:16

数値範囲の上限を指定します。

##### colors?

> `optional` **colors**: `string`[] \| [`Colors`](#colors)

定義: image/ColorMapObject.ts:28

色を指定します。[Colors](#colors)から選択するか、カラーコードの配列を指定します。カラーコードはRRGGBBまたはRRGGBBAAです。AAはアルファ成分で透明00～不透明FFを表します。
指定しない場合は`colors: ["000000", "ffffff"]`の扱いになります。

###### 例

```ts
// Colorsから選択する場合
	colors: je.Colors.JET,

// カラーコードの配列を指定する場合
	colors: ["ff0000", "ffffff", "0000ffcc"],	//赤→白→半透明な青
```

##### nanColor?

> `optional` **nanColor**: `string`

定義: image/ColorMapObject.ts:36

値の欠損などにより値が`NaN`になっているピクセルに塗る色をカラーコードで指定します。指定しない場合は透明`nanColor: "00000000"`の扱いになります。

###### 例

```ts
// NaNのピクセルを赤く塗る場合
	nanColor: "ff0000",
```

##### deleteMin?

> `optional` **deleteMin**: `boolean`

定義: image/ColorMapObject.ts:41

minに指定した値よりも小さな値のピクセルを透明にする場合にはtrueを指定します。falseの場合はminよりも小さな値のピクセルは全てminの色で塗ります。

##### deleteMax?

> `optional` **deleteMax**: `boolean`

定義: image/ColorMapObject.ts:46

maxに指定した値よりも大きな値のピクセルを透明にする場合にはtrueを指定します。falseの場合はmaxよりも大きな値のピクセルは全てmaxの色で塗ります。

##### log?

> `optional` **log**: `boolean`

定義: image/ColorMapObject.ts:51

対数目盛にする場合にtrueを指定します。指定しない場合はfalseとして、等間隔の目盛りになります。

##### logOrigin?

> `optional` **logOrigin**: `number`

定義: image/ColorMapObject.ts:62

対数目盛の原点を指定します。

###### 例

```ts
// -10～1000を対数目盛にする場合
	min: -10,
	max: 1000,
	log: true,
	logOrigin: -10,
```

##### step?

> `optional` **step**: `number`

定義: image/ColorMapObject.ts:67

グラデーションでは無く、離散的なカラーマップにする場合の分割数です。

***

### ImageDataObject

定義: image/ImageDataObject.ts:16

[\`DataObject\`](#dataobject)を[ColorMap](#colormap)の条件により可視化した画像の中間データです。RGBAの色成分を`Uint8ClampedArray`として格納しています。
ブラウザやDenoの環境で利用できる`ImageData`とほぼ同じものですが、`ImageData`が利用できないNode.jsやBunの環境でも統一的に使用できるように独自に定義しています。

実行環境に応じて、次の関数を用いて最終的な画像に変換します。
- [createCanvasByImageDataObject](#createcanvasbyimagedataobject)（ブラウザのメインスレッド限定で、`HTMLCanvasElement`に変換する）
- [createOffscreenCanvasByImageDataObject](#createoffscreencanvasbyimagedataobject)（ブラウザのメインスレッドまたはウェブワーカー限定で、`OffscreenCanvas`に変換する）
- [createPngUint8ArrayByImageDataObject](#createpnguint8arraybyimagedataobject)（ブラウザ、Node.js、Deno、BunでPNG画像の`Uint8Array`に変換する）

ImageDataObjectが不要な場合は、次の関数を利用すると[\`DataObject\`](#dataobject)と[ColorMap](#colormap)から直接画像に変換可能です。
- [createCanvas](#createcanvas)（ブラウザのメインスレッド限定で、`HTMLCanvasElement`に変換する）
- [createOffscreenCanvas](#createoffscreencanvas)（ブラウザのメインスレッドまたはウェブワーカー限定で、`OffscreenCanvas`に変換する）
- [createPng](#createpng)（ブラウザ、Node.js、Deno、BunでPNG画像の`Uint8Array`に変換する）

#### プロパティ

##### width

> **width**: `number`

定義: image/ImageDataObject.ts:18

画像の幅(ピクセル数)です。

##### height

> **height**: `number`

定義: image/ImageDataObject.ts:21

画像の高さ(ピクセル数)です。

##### data

> **data**: `Uint8ClampedArray`

定義: image/ImageDataObject.ts:24

各ピクセルの色をR(赤成分)→G(緑成分)→B(青成分)→A(アルファ成分)の順番で、画像の左上→右上、上→下へと順に格納した1次元配列(`Uint8ClampedArray`)です。配列の要素数は`width * height * 4`個です。

## 関数

### createCanvas()

> **createCanvas**(`dataObject`, `colorMap`): `HTMLCanvasElement`

定義: image/createCanvas.ts:10

[DataObject](#dataobject)と[ColorMap](#colormap)から`HTMLCanvasElement`を作成します。[createCanvasByDataObject](#createcanvasbydataobject)を短く書くためのエイリアスです。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

##### colorMap

[`ColorMap`](#colormap)

#### 戻り値

`HTMLCanvasElement`

#### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドでのみ利用可能です。</span>

***

### createCanvasByDataObject()

> **createCanvasByDataObject**(`dataObject`, `colorMap`): `HTMLCanvasElement`

定義: image/createCanvasByDataObject.ts:16

[DataObject](#dataobject)と[ColorMap](#colormap)から`HTMLCanvasElement`を作成します。短く書くためには[createCanvas](#createcanvas)も利用できます。[createCanvasByImageDataObject](#createcanvasbyimagedataobject)([createImageDataObject](#createimagedataobject)(dataObject, colorMap))の処理と等価です。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

入力となる[DataObject](#dataobject)です。

##### colorMap

[`ColorMap`](#colormap)

入力となる[ColorMap](#colormap)です。

#### 戻り値

`HTMLCanvasElement`

#### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドでのみ利用可能です。</span>

***

### createCanvasByImageDataObject()

> **createCanvasByImageDataObject**(`imageDataObject`): `HTMLCanvasElement`

定義: image/createCanvasByImageDataObject.ts:11

[ImageDataObject](#imagedataobject)から`HTMLCanvasElement`を作成します。

#### パラメータ

##### imageDataObject

[`ImageDataObject`](#imagedataobject)

入力となる[ImageDataObject](#imagedataobject)です。

#### 戻り値

`HTMLCanvasElement`

#### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドでのみ利用可能です。</span>

***

### createImageDataObject()

> **createImageDataObject**(`dataObject`, `colorMap`): [`ImageDataObject`](#imagedataobject)

定義: image/createImageDataObject.ts:15

[DataObject](#dataobject)と[ColorMap](#colormap)から[ImageDataObject](#imagedataobject)を作成します。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

入力となる[DataObject](#dataobject)です。

##### colorMap

[`ColorMap`](#colormap)

入力となる[ColorMap](#colormap)です。

#### 戻り値

[`ImageDataObject`](#imagedataobject)

***

### createOffscreenCanvas()

> **createOffscreenCanvas**(`dataObject`, `colorMap`): `OffscreenCanvas`

定義: image/createOffscreenCanvas.ts:10

[DataObject](#dataobject)と[ColorMap](#colormap)から`OffscreenCanvas`を作成します。[createOffscreenCanvasByDataObject](#createoffscreencanvasbydataobject)を短く書くためのエイリアスです。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

##### colorMap

[`ColorMap`](#colormap)

#### 戻り値

`OffscreenCanvas`

#### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドまたはウェブワーカーでのみ利用可能です。</span>

***

### createOffscreenCanvasByDataObject()

> **createOffscreenCanvasByDataObject**(`dataObject`, `colorMap`): `OffscreenCanvas`

定義: image/createOffscreenCanvasByDataObject.ts:16

[DataObject](#dataobject)と[ColorMap](#colormap)から`OffscreenCanvas`を作成します。短く書くためには[createOffscreenCanvas](#createoffscreencanvas)も利用できます。[createOffscreenCanvasByImageDataObject](#createoffscreencanvasbyimagedataobject)([createImageDataObject](#createimagedataobject)(dataObject, colorMap))の処理と等価です。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

入力となる[DataObject](#dataobject)です。

##### colorMap

[`ColorMap`](#colormap)

入力となる[ColorMap](#colormap)です。

#### 戻り値

`OffscreenCanvas`

#### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドまたはウェブワーカーでのみ利用可能です。</span>

***

### createOffscreenCanvasByImageDataObject()

> **createOffscreenCanvasByImageDataObject**(`imageDataObject`): `OffscreenCanvas`

定義: image/createOffscreenCanvasByImageDataObject.ts:11

[ImageDataObject](#imagedataobject)から`OffscreenCanvas`を作成します。

#### パラメータ

##### imageDataObject

[`ImageDataObject`](#imagedataobject)

入力となる[ImageDataObject](#imagedataobject)です。

#### 戻り値

`OffscreenCanvas`

#### Remarks

<span style="color: red; font-weight: bold;">ブラウザのメインスレッドまたはウェブワーカーでのみ利用可能です。</span>

***

### createPng()

> **createPng**(`dataObject`, `colorMap`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

定義: image/createPng.ts:9

[DataObject](#dataobject)と[ColorMap](#colormap)からPNG画像の`Uint8Array`を作成します。[createPngUint8ArrayByDataObject](#createpnguint8arraybydataobject)を短く書くためのエイリアスです。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

##### colorMap

[`ColorMap`](#colormap)

#### 戻り値

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### createPngUint8ArrayByDataObject()

> **createPngUint8ArrayByDataObject**(`dataObject`, `colorMap`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

定義: image/createPngUint8ArrayByDataObject.ts:13

[DataObject](#dataobject)と[ColorMap](#colormap)からPNG画像の`Uint8Array`を作成します。短く書くためには[createPng](#createpng)も利用できます。[createPngUint8ArrayByImageDataObject](#createpnguint8arraybyimagedataobject)([createImageDataObject](#createimagedataobject)(dataObject, colorMap))の処理と等価です。

#### パラメータ

##### dataObject

[`DataObject`](#dataobject)

入力となる[DataObject](#dataobject)です。

##### colorMap

[`ColorMap`](#colormap)

入力となる[ColorMap](#colormap)です。

#### 戻り値

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### createPngUint8ArrayByImageDataObject()

> **createPngUint8ArrayByImageDataObject**(`imageDataObject`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

定義: image/createPngUint8ArrayByImageDataObject.ts:54

[ImageDataObject](#imagedataobject)からPNG画像の`Uint8Array`を作成します。

#### パラメータ

##### imageDataObject

[`ImageDataObject`](#imagedataobject)

入力となる[ImageDataObject](#imagedataobject)です。

#### 戻り値

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>


<a name="modulesmd"></a>

[**JAXA Earth API for JavaScript**](#readmemd)

***

# JAXA Earth API for JavaScript

## モジュール

- [index](#indexreadmemd)

## Getting Started

- [For Browsers](#documentsfor-browsersmd)
- [For Node.js, Deno, Bun](#documentsfor-nodejs-deno-bunmd)

## Overview

- [Overview](#documentsoverviewmd)

## Tutorial

- [MCP (STDIO)](documents/MCP-(STDIO).md)
- [MCP (Streamable HTTP)](documents/MCP-(Streamable-HTTP).md)
- [MCP Apps](#documentsmcp-appsmd)
- [MCP Demo1](#documentsmcp-demo1md)
