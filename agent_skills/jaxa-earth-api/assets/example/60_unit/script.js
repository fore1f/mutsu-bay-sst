import * as je from "../jaxa.earth.esm.js";


const dataObject = await je.getDataObject({
	collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json",
	band: "LST",
	bbox: [120, 30, 160, 50],
	width: 800,
	height: 400,
});

console.log(dataObject);


{	//元の単位のまま表示

	const colorMap = new je.image.ColorMap({
		min: -40 + 273.15,
		max: 40 + 273.15,
		colors: je.Colors.JET,
	});

	document.body.appendChild(document.createTextNode("----- 単位：" + dataObject.unit + " で表示-----"));
	document.body.appendChild(document.createElement("br"));
	document.body.appendChild(je.image.createCanvas(dataObject, colorMap));
	document.body.appendChild(colorMap.createLegendCanvas(500, 30, 10, dataObject.unit));
	console.log(je.data.stat(dataObject));
	console.log(je.data.globalStat(dataObject));
}

document.body.appendChild(document.createElement("br"));
document.body.appendChild(document.createElement("br"));

{	//℃単位で表示

	const dataObject2 = je.data.compute({
		dataObjects: [dataObject],				//データが1個であっても配列で指定してください
		operation: (value) => value - 273.15,
		unit: "degC",
		date: dataObject.date,
		formattedDate: dataObject.formattedDate,
	});
	console.log(dataObject2);

	const colorMap = new je.image.ColorMap({
		min: -40,
		max: 40,
		colors: je.Colors.JET,
	});

	document.body.appendChild(document.createTextNode("----- 単位：" + dataObject2.unit + " で表示-----"));
	document.body.appendChild(document.createElement("br"));
	document.body.appendChild(je.image.createCanvas(dataObject2, colorMap));
	document.body.appendChild(colorMap.createLegendCanvas(500, 30, 10, dataObject2.unit));
	console.log(je.data.stat(dataObject2));
	console.log(je.data.globalStat(dataObject2));
}