# geo
some codes to solve problems in projects of webgis

In application scenarios such as power underground cables, it is necessary to draw multiple lines between two cable wells to represent the number of cables, but WebGIS frameworks such as mapbox-gl only support single-line drawing by default, so we need a graphical algorithm to solve this problem.

example:

var drawCableLines = new DrawCableLines();

drawCableLines.createCableLines(point, dot, tablename, lineCounts, zoomNum, map);
