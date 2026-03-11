
const args = process.argv.slice(2);
if (args.length == 0) {
	console.log("Usage: node getLinks.js <collectionUrl> <band> [date]");
	console.log("Example: node getLinks.js https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json DSM");
	process.exit(1);
}

const collectionUrl = args[0];
const band = args[1];
const date = args[2] ? new Date(args[2]) : new Date();

const id = collectionUrl.split("/").filter(s => s !== "").slice(-2)[0];

const links = `Below you will find links to data for the specified conditions.
	
Detailed information about this dataset can be accessed by the following URL:
https://data.earth.jaxa.jp/en/datasets/#/id/${id}

If you want to check the STAC/COG file structure in more detail, access the following URL.
https://data.earth.jaxa.jp/app/stac/v1/?url=${collectionUrl}

To open a simple map display, access the following URL.
https://data.earth.jaxa.jp/app/viewer/v1/?collection=${collectionUrl}&band=${band}&date=${date.toISOString()}

Detailed information about all datasets can be accessed by the following URL:
https://data.earth.jaxa.jp/en/datasets/

Detailed information about the JAXA Earth API can be accessed by the following URL:
https://data.earth.jaxa.jp/
`;

console.log(links);
