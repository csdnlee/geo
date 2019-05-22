# geo
some codes to solve problems in projects of webgis

In application scenarios such as power underground cables, it is necessary to draw multiple lines between two cable wells to represent the number of cables, but WebGIS frameworks such as mapbox-gl only support single-line drawing by default, so we need a graphical algorithm to solve this problem.

example:

var drawCableLines = new DrawCableLines();

if (zoomNum > 15) {
    var featureCollection = {
        "type": "FeatureCollection",
        "features": []
    };
    if (lineData.features.length > 0) {
        for (var i = 0; i < lineData.features.length; i++) {
            var lonlat = lineData.features[i].geometry.coordinates;
            var point = new mapboxgl.Point(lonlat[0][0], lonlat[0][1]);
            var dot = new mapboxgl.Point(lonlat[lonlat.length - 1][0], lonlat[lonlat.length - 1][1]);
            var lines = drawCableLines.createCableLines(point, dot, lineData.features[i].properties.tablename, 3, zoomNum, map);
            featureCollection.features = featureCollection.features.concat(lines.features);
        }
        map.getSource("cableLineData").setData(featureCollection);
    }
}
