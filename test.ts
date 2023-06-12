import test from "flug";
import snap from "./lib";

test("normal", ({ eq }) => {
  snap({
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418] as [number, number, number, number],
    debug: false,
    origin: [-180, 90] as [number, number],
    scale: [0.083333333333333, -0.083333333333333] as [number, number]
  });
});

test("precise", ({ eq }) => {
  snap({
    bbox: ["-85.34", "35.02", "-85.29", "35.06"] as [string, string, string, string],
    debug: false,
    origin: ["-180", "90"] as [string, string],
    padding: ["3", "3"] as [string, string],
    precise: true,
    scale: ["0.0833", "-0.0833"] as [string, string]
  });
});

test("padding", ({ eq }) => {
  snap({
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418] as [number, number, number, number],
    debug: false,
    origin: [-180, 90] as [number, number],
    padding: [3, 3] as [number, number],
    scale: [0.083333333333333, -0.083333333333333] as [number, number]
  });
});

test("example", ({ eq }) => {
  snap({
    bbox: [-85.341796875, 35.02999636902566, -85.2978515625, 35.06597313798418],
    debug: false,
    origin: [-180, 90],
    padding: [3, 0],
    scale: [0.083333333333333, -0.083333333333333]
  });
});

test("container", ({ eq }) => {
  snap({
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
});
