const test = require("flug");
const snap = require("./snap-bbox");

test("chattanooga", ({ eq }) => {
  const result = snap({
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418],
    debug: false,
    origin: [-180, 90],
    scale: [0.083333333333333, -0.083333333333333]
  });
  eq(result, {
    bbox_in_coordinate_system: [
      -85.41666666666706,
      35.00000000000022,
      -85.25000000000038,
      35.083333333333556
    ],
    bbox_in_grid_cells: [1135, 660, 1137, 659]
  });
});

test("padding", ({ eq }) => {
  const params = {
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418],
    debug: false,
    origin: [-180, 90],
    scale: [0.083333333333333, -0.083333333333333]
  };
  const result_without_padding = snap(params);
  const result_with_padding = snap({ ...params, padding: [1, 1] });

  // xmin with padding should be lesser than without
  eq(
    result_with_padding.bbox_in_coordinate_system[0] <
      result_without_padding.bbox_in_coordinate_system[0],
    true
  );

  // ymin with padding should be lesser than without
  eq(
    result_with_padding.bbox_in_coordinate_system[1] <
      result_without_padding.bbox_in_coordinate_system[1],
    true
  );

  // xmax with padding should be greater than without
  eq(
    result_with_padding.bbox_in_coordinate_system[2] >
      result_without_padding.bbox_in_coordinate_system[2],
    true
  );

  // ymax with padding should be greater than without
  eq(
    result_with_padding.bbox_in_coordinate_system[3] >
      result_without_padding.bbox_in_coordinate_system[3],
    true
  );

  eq(result_without_padding, {
    bbox_in_coordinate_system: [
      -85.41666666666706,
      35.00000000000022,
      -85.25000000000038,
      35.083333333333556
    ],
    bbox_in_grid_cells: [
      1135,
      660, // ymin, distance from top edge of the grid in grid cells
      1137,
      659 // ymax, distance from the top edge of the grid in grid cells
    ]
  });

  eq(result_with_padding, {
    bbox_in_coordinate_system: [
      -85.50000000000038,
      34.91666666666689,
      -85.16666666666706,
      35.16666666666689
    ],
    bbox_in_grid_cells: [
      1134,
      661, // ymin, distance from top edge of the grid in grid cells
      1138,
      658 // ymax, distance from the top edge of the grid in grid cells
    ]
  });
});

test("example", ({ eq }) => {
  const result = snap({
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418],
    debug: false,
    origin: [-180, 90],
    padding: [3, 0],
    scale: [0.083333333333333, -0.083333333333333]
  });
  eq(result, {
    bbox_in_coordinate_system: [
      -85.66666666666706,
      35.00000000000022,
      -85.00000000000038,
      35.083333333333556
    ],
    bbox_in_grid_cells: [1132, 660, 1140, 659]
  });
});

test("container", ({ eq }) => {
  const result = snap({
    // the current bbox
    bbox: [256, 256, 512, 512],

    // can't extend pass container
    container: [256, 256, 512, 512],

    debug: false,

    // the starting point of the grid system
    // in this case the top left corner
    origin: [256, 512],

    // pad result by 1 grid cell on each edge
    // but no further than the container will allow
    padding: [1, 1],

    scale: [
      1, // as grid cell number increases, x increases in grid system
      -1 // as grid cell number increases, y decreases in grid system
    ]
  });
  eq(result, {
    bbox_in_coordinate_system: [256, 256, 512, 512],
    bbox_in_grid_cells: [0, 256, 256, 0]
  });
});
