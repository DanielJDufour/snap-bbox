const test = require("flug");
const snap = require("./snap-bbox");

test("chattanooga", ({ eq }) => {
  const result = snap({
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418],
    debug: true,
    origin: [-180, 90],
    scale: [0.083333333333333, -0.083333333333333],
  });
  console.log("result:", result);
  eq(result, {
    bbox_in_coordinate_system: [
      -85.41666666666706,
      35.00000000000022,
      -85.25000000000038,
      35.083333333333556,
    ],
    bbox_in_grid_cells: [1135, 660, 1137, 659],
  });
});

test("padding", ({ eq }) => {
  test("chattanooga", ({ eq }) => {
    const result = snap({
      bbox: [
        -85.341796875,
        35.02999636902566,
        -85.2978515625,
        35.06597313798418,
      ],
      debug: true,
      origin: [-180, 90],
      padding: [1, 1],
      scale: [0.083333333333333, -0.083333333333333],
    });
    console.log("result:", result);
    eq(result, {
      bbox_in_coordinate_system: [
        -85.50000000000038,
        35.083333333333556,
        -85.16666666666706,
        35.00000000000022,
      ],
      bbox_in_grid_cells: [1134, 659, 1138, 660],
    });
  });
});
