const test = require("flug");
const snap = require("./lib");

// convert numbers to strings
const convert = inpt => {
  if (Array.isArray(inpt)) return inpt.map(it => convert(it));
  if (typeof inpt === "number") return inpt.toString();
  if (typeof inpt === "object") return Object.fromEntries(Object.entries(inpt).map(([k, v]) => [k, convert(v)]));
  return inpt;
};

test("chattanooga", ({ eq }) => {
  const params = {
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418],
    debug: false,
    origin: [-180, 90],
    scale: [0.083333333333333, -0.083333333333333]
  };
  eq(snap(params), {
    bbox_in_coordinate_system: [-85.41666666666706, 35.00000000000022, -85.25000000000038, 35.083333333333556],
    bbox_in_grid_cells: [1135, 660, 1137, 659]
  });
  eq(snap({ ...convert(params), debug: true, precise: true }), {
    bbox_in_coordinate_system: [
      "-85.416666666667045",
      "35.00000000000022",
      "-85.250000000000379",
      "35.083333333333553"
    ],
    bbox_in_grid_cells: ["1135", "660", "1137", "659"]
  });
});

test("padding", ({ eq }) => {
  const params = {
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418],
    debug: false,
    origin: [-180, 90],
    scale: [0.083333333333333, -0.083333333333333]
  };
  const precise_params = convert(params);
  const result_without_padding = snap(params);
  const result_with_padding = snap({ ...params, padding: [1, 1] });
  const precise_result_without_padding = snap({
    ...precise_params,
    precise: true
  });
  const precise_result_with_padding = snap({
    ...precise_params,
    padding: ["1", "1"],
    precise: true
  });

  // xmin with padding should be lesser than without
  eq(result_with_padding.bbox_in_coordinate_system[0] < result_without_padding.bbox_in_coordinate_system[0], true);

  // ymin with padding should be lesser than without
  eq(result_with_padding.bbox_in_coordinate_system[1] < result_without_padding.bbox_in_coordinate_system[1], true);

  // xmax with padding should be greater than without
  eq(result_with_padding.bbox_in_coordinate_system[2] > result_without_padding.bbox_in_coordinate_system[2], true);

  // ymax with padding should be greater than without
  eq(result_with_padding.bbox_in_coordinate_system[3] > result_without_padding.bbox_in_coordinate_system[3], true);

  eq(result_without_padding, {
    bbox_in_coordinate_system: [-85.41666666666706, 35.00000000000022, -85.25000000000038, 35.083333333333556],
    bbox_in_grid_cells: [
      1135,
      660, // ymin, distance from top edge of the grid in grid cells
      1137,
      659 // ymax, distance from the top edge of the grid in grid cells
    ]
  });

  eq(result_with_padding, {
    bbox_in_coordinate_system: [-85.50000000000038, 34.91666666666689, -85.16666666666706, 35.16666666666689],
    bbox_in_grid_cells: [
      1134,
      661, // ymin, distance from top edge of the grid in grid cells
      1138,
      658 // ymax, distance from the top edge of the grid in grid cells
    ]
  });

  eq(precise_result_with_padding, {
    bbox_in_coordinate_system: [
      "-85.500000000000378",
      "34.916666666666887",
      "-85.166666666667046",
      "35.166666666666886"
    ],
    bbox_in_grid_cells: ["1134", "661", "1138", "658"]
  });
});

test("example", ({ eq }) => {
  const params = {
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418],
    debug: false,
    origin: [-180, 90],
    padding: [3, 0],
    scale: [0.083333333333333, -0.083333333333333]
  };
  const precise_params = { ...convert(params), precise: true };
  eq(snap(params), {
    bbox_in_coordinate_system: [-85.66666666666706, 35.00000000000022, -85.00000000000038, 35.083333333333556],
    bbox_in_grid_cells: [1132, 660, 1140, 659]
  });
  eq(snap(precise_params), {
    bbox_in_coordinate_system: ["-85.666666666667044", "35.00000000000022", "-85.00000000000038", "35.083333333333553"],
    bbox_in_grid_cells: ["1132", "660", "1140", "659"]
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
