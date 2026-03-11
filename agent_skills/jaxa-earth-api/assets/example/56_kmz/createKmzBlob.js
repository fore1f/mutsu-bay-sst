
//KMZファイルをBlob形式で作る関数
//toBlobがcallbackを引数としている形式のため、引数として渡されたcallbackに結果を返す形式にしています
//EPSG:4326のデータのみに対応しています
export default ({title, description, canvas, bbox, callback}) => {
	
	const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
	<Folder>
		<name>${title}</name>
		<description>${description}</description>
		<GroundOverlay>
			<Icon>
				<href>files/image.png</href>
			</Icon>
			<LatLonBox>
				<west>${bbox[0]}</west>
				<south>${bbox[1]}</south>
				<east>${bbox[2]}</east>
				<north>${bbox[3]}</north>
				<rotation>0</rotation>
			</LatLonBox>
		</GroundOverlay>
	</Folder>
</kml>`;

	canvas.toBlob(png => {
		// console.log(imgBlob);

		const zip = new JSZip();

		zip.file("doc.kml", kml);
		zip.file("files/image.png", png, { compression: "STORE" });

		zip.generateAsync({
			type: "blob",
			compression: "DEFLATE",
		}).then(blob => {
			callback(new Blob([blob], { type: "application/vnd.google-earth.kmz" }));
		});
	});
}