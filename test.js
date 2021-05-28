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
});
