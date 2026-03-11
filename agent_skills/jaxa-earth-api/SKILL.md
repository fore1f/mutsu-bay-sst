---
name: jaxa-earth-api
description: JAXA Earth API for JavaScriptを利用して、地形（標高、DSM）、地表面温度（LST）、海面水温（SST）、植生指数（NDVI）、降水量、クロロフィルa濃度（CHLA）、土壌水分量（SMC）などの地球観測データを画像や数値で取得することが可能です。地球観測データを使ったウェブアプリケーション（HTML、JavaScript）も開発できます。
---

# Agent Skills by JAXA Earth API for JavaScript

## Overview

このスキルを使用すると、地球観測データを画像や数値で取得することが可能です。
利用できるデータは地形（標高、DSM）、地表面温度（LST）、海面水温（SST）、植生指数（NDVI）、降水量、クロロフィルa濃度（CHLA）、土壌水分量（SMC）などです。

必要に応じて次の処理を実行してください。
- データセットカタログを読んで、必要なデータセットを選択すること。
- scriptsにあるコマンドラインツールの引数にデータセット名や緯度経度などを指定することで簡易的に実行し、STDIO出力の文字列として統計値などを取得したり、PNG画像として保存すること。
- 既存のコマンドラインツールでは機能が足りない場合は、APIドキュメントを理解し、scriptsにあるコマンドラインツールやassetsにあるexampleを参考に新たなコマンドラインツールを作成し、実行すること。
- ブラウザ上でデータをより高度に表現、利用したい場合は、HTMLでウェブアプリケーションを作成すること。
- 得られたデータを提示する際は、どのデータセットを用いて、どのように取得、処理した結果なのかを明示すること。また、`getLinks.js`で得られる詳細情報へのリンクも提示すること。
- 得られたデータを解説するための知見については公開情報を検索し、地球科学や気象、宇宙工学の専門知識を生かして解説すること。

## Keywords

JAXA, Earth Observation Data, API

## Local Resources

JAXA Earth API for JavaScriptを利用する上で必要となる知識です。

### データセットカタログ `references/catalog.v2.md`

JAXA Earth APIで使用できるデータセットの一覧と属性の情報です。このカタログから必要なデータを選択してください。
[https://data.earth.jaxa.jp/app/mcp/catalog.v2.md](https://data.earth.jaxa.jp/app/mcp/catalog.v2.md)でも公開されています。

### APIドキュメント `references/docs.md`

JAXA Earth API for JavaScript v2.0.0のAPIドキュメントです。新たなコマンドラインツールやウェブアプリケーションを開発する場合に参照してください。
[https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/docs.md](https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/docs.md)でも公開されています。

### APIモジュール `scripts/jaxa.earth.esm.js`

JAXA Earth API for JavaScript v2.0.0のAPIモジュールのファイルです。新たなコマンドラインツールやウェブアプリケーションを開発する場合に使用してください。
[https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js](https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js)でも公開されています。

CommonJSでも利用可能なUMD形式のモジュールが必要な場合は、次のURLで公開されているものをダウンロードして利用してください。
[https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.js](https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.js)

### APIモジュールの型定義ファイル `scripts/jaxa.earth.esm.d.ts`

JAXA Earth API for JavaScript v2.0.0のAPIモジュールの型定義ファイルです。新たなコマンドラインツールやウェブアプリケーションを開発する場合に使用してください。
[https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.d.ts](https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.d.ts)でも公開されています。

CommonJSでも利用可能なUMD形式のモジュール用が必要な場合は、次のURLで公開されているものをダウンロードして利用してください。
[https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.d.ts](https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.umd.d.ts)

### サンプルコード `assets/example/`

JAXA Earth API for JavaScript v2.0.0のサンプルコードです。
ただしブラウザ向けの仕様となっているため、コマンドラインツールを作成するためには一部をNode.js向けに改変する必要があります。
[https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/](https://data.earth.jaxa.jp/api/javascript/v2.0.0/ja/example/)でも公開されています。

### GeoJSON `assets/geojson/`

都道府県単位の統計処理を実施する場合に必要となる都道府県のポリゴン形状を示すGeoJSONファイルです。
ファイルの仕様やファイル名一覧については、`assets/geojson/README.md`を参照してください。

## How to select a dataset

データセットカタログを読んで回答に必要なデータセットを探します。次の優先度で選択することを推奨します。

1. データセットカタログに書かれているMain Recommended Dataにあるものから優先的に選びます。
2. 季節変化を把握したい場合は月次データ(temporalResolution: monthly)を選ぶことで、欠損が少なめで空間分布を把握しやすいデータを利用できます。なるべく細かな時間単位で調べたい場合は日別データ(temporalResolution: daily)のものを選びます。ただし、観測範囲外や雲の下などの一部のピクセルが欠損している場合があります。
3. 同じ物理量のデータセットでも空間解像度(spatialResolution)が異なるものがある場合があります。なるべく良いもの(km単位の数値が小さいもの)を選んでください。
4. 観測値(normal: false)か平年値(normal: true)かにも注意してください。平年値は、平年との差を計算する場合に基準として利用するものです。

複数の候補が見つかった場合はそれぞれの長所と短所を示したうえで、ユーザーに選択を求めてください。
また、最終的な結果を出力する際は、どのデータセットを使用したのかを理由とともに明確に表示してください。

## How to use CLI tools

簡易的な実行のために次のコマンドラインツールを利用できます。
保存されたファイルはユーザーが分かりやすいように現在の作業ディレクトリに移動させるか、作業ディレクトリからコマンドラインツールを相対パスで指定して実行してください。

エラーが発生した場合は、collectionUrlとbandの組み合わせがデータセットカタログの情報と完全に一致しているか、指定した日付がデータセットの提供期間内であるかを再確認してください。

また、このスキルを実行する端末のネットワーク条件によってはSSLエラーが発生する場合もあります。
その場合は、コマンドラインツールの行頭に、`process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";`を記載してSSLエラーを回避してください。

### `getImage.js`

指定した緯度経度範囲のデータをPNG画像として取得できるコマンドラインツールです。

#### Usage
```bash
node getImage.js <collectionUrl> <band> <lng> <lat> <dl> [date]
```

- `<collectionUrl>`: 取得したいデータのcollection.jsonのURLです。必須。
- `<band>`: 取得したいデータのbandです。必須。
- `<lng>`: データを取得する中心位置の経度です。-180(deg)～+180(deg)の範囲で指定します。必須。
- `<lat>`: データを取得する中心位置の緯度です。-90(deg)～+90(deg)の範囲で指定します。必須。
- `<dl>`: データを取得する範囲です。すなわち中心位置から緯度経度半径dl(deg)の範囲に外接する矩形領域でデータを取得します。必須。
- `[date]`: データを取得する日時です。ISO8601形式で指定します。省略可能。省略した場合は利用可能な最新のデータを取得します。

#### Result

PNG画像を保存します。保存したファイル名はSTDIOに出力します。
関連する統計値などの属性情報もSTDIOに出力します。

#### Examples
- **Mt. Fuji Elevation**: `node getImage.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM 138.73 35.36 0.2`
- **LST of Japan (2026/01/01 UTC)**: `node getImage.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json LST 137.0 36.0 10.0 2026-01-01T00:00:00Z`

#### Note

上記Usageの`<lng>`,`<lat>`,`<dl>`の定義はEPSG:4326のデータセットの場合のものです。
EPSG:3995またはEPSG:3031のデータセットの場合は、mを単位とした`X`,`Y`,`dl`として引数を与えても使用できます。

### `getPixelGridCsv.js`

指定した緯度経度範囲のデータをCSVファイルとして取得できるコマンドラインツールです。
100px四方でデータを取得し、`getImage.js`で得られる画像のピクセルの並び順、すなわち行優先 (row-major) の並び順で値をCSVファイルとして保存します。
緯度経度との対応を明確にしたい場合は`getLngLatValuesCsv.js`を使用してください。

#### Usage
```bash
node getPixelGridCsv.js <collectionUrl> <band> <lng> <lat> <dl> [date]
```

- `<collectionUrl>`: 取得したいデータのcollection.jsonのURLです。必須。
- `<band>`: 取得したいデータのbandです。必須。
- `<lng>`: データを取得する中心位置の経度です。-180(deg)～+180(deg)の範囲で指定します。必須。
- `<lat>`: データを取得する中心位置の緯度です。-90(deg)～+90(deg)の範囲で指定します。必須。
- `<dl>`: データを取得する範囲です。すなわち中心位置から緯度経度半径dl(deg)の範囲に外接する矩形領域でデータを取得します。必須。
- `[date]`: データを取得する日時です。ISO8601形式で指定します。省略可能。省略した場合は利用可能な最新のデータを取得します。

#### Result

CSVファイルを保存します。保存したファイル名はSTDIOに出力します。
関連する統計値などの属性情報もSTDIOに出力します。

#### Examples
- **Mt. Fuji Elevation**: `node getPixelGridCsv.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM 138.73 35.36 0.2`
- **LST of Japan (2026/01/01 UTC)**: `node getPixelGridCsv.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json LST 137.0 36.0 10.0 2026-01-01T00:00:00Z`

#### Note

上記Usageの`<lng>`,`<lat>`,`<dl>`の定義はEPSG:4326のデータセットの場合のものです。
EPSG:3995またはEPSG:3031のデータセットの場合は、mを単位とした`X`,`Y`,`dl`として引数を与えても使用できます。

### `getLngLatValuesCsv.js`

指定した緯度経度範囲のデータをCSVファイルとして取得できるコマンドラインツールです。
100px四方でデータを取得し、経度、緯度、値の組を10000件列挙したCSVファイルとして保存します。
`getImage.js`で得られる画像のピクセルの並び順で値のみを取得したい場合は`getPixelGridCsv.js`を使用してください。

#### Usage
```bash
node getLngLatValuesCsv.js <collectionUrl> <band> <lng> <lat> <dl> [date]
```

- `<collectionUrl>`: 取得したいデータのcollection.jsonのURLです。必須。
- `<band>`: 取得したいデータのbandです。必須。
- `<lng>`: データを取得する中心位置の経度です。-180(deg)～+180(deg)の範囲で指定します。必須。
- `<lat>`: データを取得する中心位置の緯度です。-90(deg)～+90(deg)の範囲で指定します。必須。
- `<dl>`: データを取得する範囲です。すなわち中心位置から緯度経度半径dl(deg)の範囲に外接する矩形領域でデータを取得します。必須。
- `[date]`: データを取得する日時です。ISO8601形式で指定します。省略可能。省略した場合は利用可能な最新のデータを取得します。

#### Result

CSVファイルを保存します。保存したファイル名はSTDIOに出力します。
関連する統計値などの属性情報もSTDIOに出力します。

#### Examples
- **Mt. Fuji Elevation**: `node getLngLatValuesCsv.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM 138.73 35.36 0.2`
- **LST of Japan (2026/01/01 UTC)**: `node getLngLatValuesCsv.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json LST 137.0 36.0 10.0 2026-01-01T00:00:00Z`

#### Note

上記Usageの`<lng>`,`<lat>`,`<dl>`の定義はEPSG:4326のデータセットの場合のものです。
EPSG:3995またはEPSG:3031のデータセットの場合は、mを単位とした`X`,`Y`,`dl`として引数を与えても使用できます。

### `getValue.js`

指定した緯度経度位置のデータを値として取得できるコマンドラインツールです。
指定した緯度経度位置の1点のデータのみ取得します。

#### Usage
```bash
node getValue.js <collectionUrl> <band> <lng> <lat> [date]
```

- `<collectionUrl>`: 取得したいデータのcollection.jsonのURLです。必須。
- `<band>`: 取得したいデータのbandです。必須。
- `<lng>`: データを取得する中心位置の経度です。-180(deg)～+180(deg)の範囲で指定します。必須。
- `<lat>`: データを取得する中心位置の緯度です。-90(deg)～+90(deg)の範囲で指定します。必須。
- `[date]`: データを取得する日時です。ISO8601形式で指定します。省略可能。省略した場合は利用可能な最新のデータを取得します。

#### Result

得られた値と関連情報をSTDIOに出力します。指定された条件で観測できていない欠損値の場合はNaNを返します。

#### Examples
- **Mt. Fuji Elevation**: `node getValue.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM 138.73 35.36`
- **LST of Japan (2026/01/01 UTC)**: `node getValue.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json LST 137.0 36.0 2026-01-01T00:00:00Z`

### `getMonthlyTimeSeriesValues.js`

指定した緯度経度位置の時系列データ（月単位）をCSVとして取得できるコマンドラインツールです。
月単位の値としては毎月1日の値を代表として取得します。

#### Usage
```bash
node node getMonthlyTimeSeriesValues.js <collectionUrl> <band> <lng> <lat> <start> <end>
```

- `<collectionUrl>`: 取得したいデータのcollection.jsonのURLです。必須。
- `<band>`: 取得したいデータのbandです。必須。
- `<lng>`: データを取得する中心位置の経度です。-180(deg)～+180(deg)の範囲で指定します。必須。
- `<lat>`: データを取得する中心位置の緯度です。-90(deg)～+90(deg)の範囲で指定します。必須。
- `<start>`: データを取得する最初の日時です。YYYY-MM形式で指定します。必須。
- `<end>`: データを取得する最後の日時です。YYYY-MM形式で指定します。必須。

#### Result

CSVファイルを保存します。保存したファイル名とテーブル形式の表もSTDIOに出力します。
指定された条件で観測できていない欠損値の場合はNaNが入ります。

#### Examples
- **TimeSeries LST of Mt. Fuji**: `node getMonthlyTimeSeriesValues.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json LST 138.73 35.36 2024-01 2025-12`

#### Note

`<start>`と`<end>`については、使用するデータセットの観測期間外にならないようにご注意ください。観測期間外の値は`NaN`が入ります。
また、`je.getDataObject`の仕様上、最終観測時期より未来の日付をした場合は最終観測時の値が入ります。

上記Usageの`<lng>`,`<lat>`,`<dl>`の定義はEPSG:4326のデータセットの場合のものです。
EPSG:3995またはEPSG:3031のデータセットの場合は、mを単位とした`X`,`Y`,`dl`として引数を与えても使用できます。

### `getDailyTimeSeriesValues.js`

指定した緯度経度位置の時系列データ（日単位）をCSVとして取得できるコマンドラインツールです。

#### Usage
```bash
node node getDailyTimeSeriesValues.js <collectionUrl> <band> <lng> <lat> <start> <end>
```

- `<collectionUrl>`: 取得したいデータのcollection.jsonのURLです。必須。
- `<band>`: 取得したいデータのbandです。必須。
- `<lng>`: データを取得する中心位置の経度です。-180(deg)～+180(deg)の範囲で指定します。必須。
- `<lat>`: データを取得する中心位置の緯度です。-90(deg)～+90(deg)の範囲で指定します。必須。
- `<start>`: データを取得する最初の日時です。YYYY-MM-DD形式で指定します。必須。
- `<end>`: データを取得する最後の日時です。YYYY-MM-DD形式で指定します。必須。

#### Result

CSVファイルを保存します。保存したファイル名とテーブル形式の表もSTDIOに出力します。
指定された条件で観測できていない欠損値の場合はNaNが入ります。Dailyのデータの場合、当日の観測範囲の外であったり、雲で観測できていない場合はNaNになる可能性が高くなります。

#### Examples
- **TimeSeries LST of Mt. Fuji**: `node getDailyTimeSeriesValues.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_daily/collection.json LST 138.73 35.36 2025-01-01 2025-03-31`

#### Note

`<collectionUrl>`についてはtemporalResolution: dailyか、temporalResolution: half-monthlyのデータセットを使うことを想定してください。
temporalResolution: monthlyのデータセットを利用すると、月内の全ての日付に同じ値が入るような挙動となります。

`<start>`と`<end>`については、使用するデータセットの観測期間外にならないようにご注意ください。観測期間外の値は`NaN`が入ります。
また、`je.getDataObject`の仕様上、最終観測時期より未来の日付をした場合は最終観測時の値が入ります。
また、長期間のデータを取得しようとすると時間がかかるため、`<start>`と`<end>`については、おおむね1か月～3か月程度の期間を指定してください。

上記Usageの`<lng>`,`<lat>`,`<dl>`の定義はEPSG:4326のデータセットの場合のものです。
EPSG:3995またはEPSG:3031のデータセットの場合は、mを単位とした`X`,`Y`,`dl`として引数を与えても使用できます。

### `getLinks.js`

指定したデータセットの関連リンクを取得できるコマンドラインツールです。

#### Usage
```bash
node getLinks.js <collectionUrl> <band> [date]
```

- `<collectionUrl>`: 取得したいデータのcollection.jsonのURLです。必須。
- `<band>`: 取得したいデータのbandです。必須。
- `[date]`: データを取得する日時です。ISO8601形式で指定します。省略可能。省略した場合は利用可能な最新のデータを取得します。

#### Result

指定したデータセットの詳細を確認できる関連URLを返します。

#### Examples
- **Elevation**: `node getLinks.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM`
- **LST (2026/01/01 UTC)**: `node getLinks.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json LST 2026-01-01T00:00:00Z`

## How to create CLI tools

既存のコマンドラインツールでは機能が足りない場合は、APIドキュメントやサンプルコードをもとに新たなコマンドラインツールを作成して実行してください。
生成するソースコードは作業ディレクトリに保存して実行するようにしてください。

なお、全てのサンプルコードは拡張子を`.js`としたESモジュール形式で作成されているため、新規作成の際にもそれに従って、
```
{
  "type": "module"
}
```
を記載したpackage.jsonの利用を推奨します。モジュールファイル`jaxa.earth.esm.js`は作業フォルダにコピーするか、`scripts`内のファイルへの相対パスで指定してください。

## How to calculate statistics

取得されたdataObjectに対して統計値を計算するためには、`je.data.stat`または`je.data.globalStat`を利用します。
`je.data.stat`では実際の地球表面上におけるピクセルごとの面積の違いは考慮していません。
緯度経度範囲が十分に狭く、ピクセルごとの面積の違いを無視できる場合はこの簡易的な計算でも問題ありませんが、ピクセルごとの面積の違いがある広い緯度経度範囲のデータで厳密な評価を行なうためには、`je.data.globalStat`を利用してください。

また、都道府県単位での統計値を取得したい場合は、`assets/example/65_mask/`のソースコードを参考にGeoJSONでマスク処理することで計算可能です。
各都道府県のGeoJSONは`assets/geojson/`に保存されています。

## How to search a location with specific value

緯度経度を指定して値を取得するのではなく、最大の場所、最小の場所、のように特定の条件を持つ場所を逆引きで探す場合は、`getLngLatValuesCsv.js`を利用してください。
1. `getLngLatValuesCsv.js`を利用して、まずは広域にデータを取得し、その中から候補となる場所を絞り込む。
2. さらにその候補地周辺の狭い範囲に対して`getLngLatValuesCsv.js`を実行し、高い精度で場所を特定する。
3. 場所が特定された場合は、その場所の意味や、そのような値を持つ理由も専門的な知見を活かして解説してください。

## How to search a date with specific value

日時を指定して値を取得するのではなく、最大の時期、最小の時期、のように特定の条件を持つ日時を逆引きで探す場合は、`getMonthlyTimeSeriesValues.js`や`getDailyTimeSeriesValues.js`を利用してください。
1. `getMonthlyTimeSeriesValues.js`を利用して、まずは年単位のデータを取得し、その中から候補となる時期を絞り込む。利用するデータセットはMonthlyのものを使うことを推奨します。
2. その候補となる期間に対して、`getDailyTimeSeriesValues.js`を利用して、該当する条件の日付を絞り込む。利用するデータセットはDailyやHalf-monthlyのものを使うことを推奨します。
3. 日付が特定された場合は、その日時の季節を踏まえた理由も専門的な知見を活かして解説してください。

## How to create web applications

`assets/example/`内のサンプルコードを参考にしつつ、APIドキュメントを理解し、現在の作業ディレクトリにHTMLを作成してください。

なお、サンプルコードとは異なりますが、`jaxa.earth.esm.js`については、`import * as je from "https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js";`のように書けばオンラインから直接取得できるため、コピーを作成する必要がなくなります。

## How to select colors

新しいコマンドラインツールやウェブアプリケーションを作成する際の、画像出力時の`je.image.ColorMapObject`の設定については下記を推奨します。

### colors

`je.image.ColorMapObject#colors`については次の通りです。

- **je.Colors.GRAY**: 黒→白に塗ります。ユーザーから白黒の画像を求められた場合にのみ使用してください。
- **je.Colors.JET**: 青→水色→緑→黄色→赤 (虹色)に塗ります。下記に該当しない場合は優先的に使用してください。
- **je.Colors.NDVI**: 茶→緑に塗ります。植生指数を可視化する場合に適しています。数値が小さいほど植物が少ない（枯れた）様子、数値が大きいほど植物の緑が多い様子を表現できます。
- **je.Colors.SMC**: 赤→白→青に塗ります。土壌水分量を可視化する場合に適しています。数値が小さいほど赤く乾燥した様子、数値が大きいほど湿っている様子を表現できます。
- **je.Colors.IC**: 紺→白に塗ります。海氷密接度を可視化する場合に適しています。数値が小さいほど氷が少ない様子、数値が大きいほど氷が多い様子を表現できます。

上記以外にも任意の色コード文字列の配列でも指定できます。効果的なデータの可視化に必要な色の組み合わせを提案することを推奨します。
例えば、値の範囲がゼロを中心とする-10～+10のような場合、マイナスを青、中央の0を白、プラスを赤としたい場合は、`colors: ["0000ff", "ffffff", "ff0000"]`のように指定します。

### min, max

値の範囲`je.image.ColorMapObject#min`、`je.image.ColorMapObject#max`については、画像を1枚だけ出力する際には`je.data.stat(dataObject)`によって得られる`min`、`max`に動的に合わせることも可能ですが、時系列でアニメーションにする時には画像ごとに値の範囲が変わってしまうのは適切ではありません。

そのような場合には、主なデータセットに関しては下記の値に指定することを推奨します。

- **地形（標高、DSM）**: 全球規模の場合は0～6000m、日本域の場合は0～4000m。
- **地表面温度（LST）**: 全球規模の場合は-50～50℃、日本域の場合は-20～50℃。データセットがケルビン単位の場合はそれぞれ273.15を加算してください。
- **海面水温（SST）**: 0～40℃。データセットがケルビン単位の場合はそれぞれ273.15を加算してください。
- **植生指数（NDVI）**: 0～1
- **降水量**: 0～10mm/hr。`je.image.ColorMapObject#log: true`を指定して対数スケールにしてください。
- **クロロフィルa濃度（CHLA）**: 0～100mg/m^3。`je.image.ColorMapObject#log: true`を指定して対数スケールにしてください。
- **土壌水分量（SMC）**: 0～30%。
- **海氷密接度（IC）**: 0～100%。

同じ物理量でも単位が異なると値が大きく異なる場合があります。
特に温度関連のデータセットについては摂氏単位のものとケルビン単位のものがありますので、単位によって値の範囲指定を間違えないようにしてください。
データセットを決定後に`getValue.js`を実行することで、そのデータセットの単位を確かめられます。

また、地表面温度と海面水温を同時に表示させるような場合には、両方の値の範囲を合わせるのも効果的です。

## How to select bbox, width, height

`je.getDataObject`に指定する`bbox`, `width`, `height`については縦横比が崩れないように気を付けてください。
関心領域に合わせて`bbox`を決め、画面のサイズから`width=1000`程度に固定し、縦横比が崩れないような`height`を求めて利用することを推奨します。

## License

[https://data.earth.jaxa.jp/license/](https://data.earth.jaxa.jp/license/)の通りです。
一部のデータセットを利用する場合を除き、商用利用も可能です。様々な用途にJAXAの地球観測データとJAXA Earth APIをご活用ください。
出力する結果やウェブアプリケーションには、ライセンスに従い「出典：JAXA Earth APIを利用してデータを取得しています」などの出典を記載してください。
また、生成AIの出力結果そのままの場合は間違いがある可能性がある場合もある旨も必ず明記してください。
