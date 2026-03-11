
# 47都道府県のGeoJSONファイル

## 概要

地上分解能300m程度の地球観測データの統計処理に利用することを想定して、300m程度の解像度で軽量化した47都道府県のGeoJSONファイルです。

## ファイル一覧

1. [北海道](hokkaido.geojson)
2. [青森県](aomori.geojson)
3. [岩手県](iwate.geojson)
4. [宮城県](miyagi.geojson)
5. [秋田県](akita.geojson)
6. [山形県](yamagata.geojson)
7. [福島県](fukushima.geojson)
8. [茨城県](ibaraki.geojson)
9. [栃木県](tochigi.geojson)
10. [群馬県](gunma.geojson)
11. [埼玉県](saitama.geojson)
12. [千葉県](chiba.geojson)
13. [東京都(23区及び多摩地域)](tokyo.geojson), [東京都（島嶼部を含む全域）](tokyo_all.geojson)
14. [神奈川県](kanagawa.geojson)
15. [新潟県](niigata.geojson)
16. [富山県](toyama.geojson)
17. [石川県](ishikawa.geojson)
18. [福井県](fukui.geojson)
19. [山梨県](yamanashi.geojson)
20. [長野県](nagano.geojson)
21. [岐阜県](gifu.geojson)
22. [静岡県](shizuoka.geojson)
23. [愛知県](aichi.geojson)
24. [三重県](mie.geojson)
25. [滋賀県](shiga.geojson)
26. [京都府](kyoto.geojson)
27. [大阪府](osaka.geojson)
28. [兵庫県](hyogo.geojson)
29. [奈良県](nara.geojson)
30. [和歌山県](wakayama.geojson)
31. [鳥取県](tottori.geojson)
32. [島根県](shimane.geojson)
33. [岡山県](okayama.geojson)
34. [広島県](hiroshima.geojson)
35. [山口県](yamaguchi.geojson)
36. [徳島県](tokushima.geojson)
37. [香川県](kagawa.geojson)
38. [愛媛県](ehime.geojson)
39. [高知県](kochi.geojson)
40. [福岡県](fukuoka.geojson)
41. [佐賀県](saga.geojson)
42. [長崎県](nagasaki.geojson)
43. [熊本県](kumamoto.geojson)
44. [大分県](oita.geojson)
45. [宮崎県](miyazaki.geojson)
46. [鹿児島県](kagoshima.geojson)
47. [沖縄県](okinawa.geojson)

## 補足

解像度以下の島や形状については再現されていません。
都道府県ごとに軽量化しているため、隣接する都道府県同士の境界線は完全には一致しません。

東京都については、島嶼部（伊豆諸島及び小笠原諸島）を含むファイル(tokyo_all.geojson)と含まないファイル(tokyo.geojson)の２種類を用意しています。
気候や環境の特性を評価する場合は、本州部分（23区及び多摩地域）の特性を評価できるように島嶼部を含まないファイル(tokyo.geojson)を利用することを推奨します。

## 出典

[国土交通省 国土数値情報 行政区域データ](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2025.html)のN03-20250101_prefecture.geojsonを加工・編集(軽量化)して作成したものです。
ライセンス：オープンデータCC_BY_4.0
