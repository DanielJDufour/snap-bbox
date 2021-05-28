# snap-bbox
> Snap a Bounding Box to a Grid

# why
I often try to pull pixel values from GeoTIFFs to display on a web map.
However, the pixels are often displayed in a different projection (like web mercator)
than the projection of the data (often 4326).
Because our pixels are in a structured array and you can't request only part of an array item (try running `[1, 2, 3][0.5]`), we have to snap our bounding box to the grid structure of our data.

# install
```bash
npm install snap-bbox
```

# usage
```js
const snap = require("snap-bbox");

const result = snap({
  // a bounding box as [xmin, ymin, xmax, ymax]
  // in the same spatial reference system as the grid
  // example below is equivalent to the bounds of a web mercator tile at x=2154, y=3243 and z=13
  bbox: [ -85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418 ],

  // the origin of the grid, which is often the top left corner
  // example below is the north pole, [180th meridian, top of the world]
  origin: [-180, 90],

  // the size of each grid cell in [width, height]
  // width or height can be negative, which indicates that
  // the y value in the spatial reference system (e.g. latitude) decreases
  // as the y-value in cell grid space increases
  // This is equivalent to the ModelPixelScaleTag in GeoTIFF Metadata
  // http://geotiff.maptools.org/spec/geotiff2.6.html
  scale: [0.083333333333333, -0.083333333333333]
});
```
result will be something like:
```js
result is
{
  bbox_in_coordinate_system: [
    // xmin (longitude in this case)
    -85.41666666666706,

    // ymin (latitude in this case)
    35.00000000000022,

    // xmax (longitude in this case)
    -85.25000000000038,

    // ymax (latitude in this case)
    35.083333333333556
  ],

  bbox_in_grid_cells: [
    // xmin, the number of grid cells from the left edge of the grid
    1135,

    // ymin, the number of grid cells from the top edge of the grid
    660,

    // xmax, the number of grid cells from the left edge of the grid
    1137,

    // ymax, the number of grid cells from the top edge of the grid
    659
  ]
}
```