const snap_bbox = require("./snap-bbox.js");
const snap_precise_bbox = require("./snap-precise-bbox.js");

function snap({ precise = false, ...rest }) {
  if (precise) {
    return snap_precise_bbox(rest);
  } else {
    return snap_bbox(rest);
  }
}

if (typeof define === "function" && define.amd)
  define(function () {
    return snap;
  });
if (typeof module === "object") module.exports = snap;
