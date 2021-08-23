# snap-bbox
> Snap a Bounding Box to a Grid

| before | after |
| ------ | ----- |
| the bounding box partially cuts off some of the pixel grid cells | the bounding box expands to the pixel grid cell boundaries |
| ![before](https://github.com/DanielJDufour/snap-bbox/raw/main/before.png) | ![before](https://github.com/DanielJDufour/snap-bbox/raw/main/after.png) |

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
  // width or height can be negative, which in the case below indicates that
  // the y value in the spatial reference system (e.g. latitude) decreases
  // as the y-value in cell grid space increases
  // This is equivalent to the ModelPixelScaleTag in GeoTIFF Metadata
  // http://geotiff.maptools.org/spec/geotiff2.6.html
  scale: [0.083333333333333, -0.083333333333333],

  // an optional array of two numbers, which represents
  // x-padding (horizontal) and y-padding (vertical)
  // the padding is applied to both sides of the bbox along an axis.
  // in the example below with x-padding of 3 and y-padding of 0,
  // the width of the result will increase by 6 grid cells, being padded
  // on both the left and right by 3 grid cells.
  padding: [3, 0],

  // another bbox that limits how much "bbox" can be expanded via snapping and padding
  // in the example below, we contain the result to the northern hemisphere
  container: [ -180, 0, 180, 90 ]
});
```
result will be something like:
```js
result is
{
  bbox_in_coordinate_system: [
    // xmin (longitude in this case)
    -85.66666666666706,

    // ymin (latitude in this case)
    35.00000000000022,

    // xmax (longitude in this case)
    -85.00000000000038,

    // ymax (latitude in this case)
    35.083333333333556
  ],

  bbox_in_grid_cells: [
    // xmin, the number of grid cells from the left edge of the grid
    1132,

    // ymin, the number of grid cells from the top edge of the grid
    660,

    // xmax, the number of grid cells from the left edge of the grid
    1140,

    // ymax, the number of grid cells from the top edge of the grid
    659
  ]
}
```
