const add = require("preciso/add.js");
const ceil = require("preciso/ceil.js");
const compare = require("preciso/compare.js");
const divide = require("preciso/divide.js");
const floor = require("preciso/floor.js");
const max = require("preciso/max.js");
const min = require("preciso/min.js");
const multiply = require("preciso/multiply.js");
const sign = require("preciso/sign.js");
const subtract = require("preciso/subtract.js");

function snap_precise_bbox({ bbox, container, debug, origin, overflow, padding, scale, size }) {
  if (debug) console.log("[snap-bbox] starting");
  if (debug) console.log("[snap-bbox] bbox:", bbox);
  if (debug) console.log("[snap-bbox] debug:", debug);
  if (debug) console.log("[snap-bbox] origin:", origin);
  if (debug) console.log("[snap-bbox] overflow:", overflow);
  if (debug) console.log("[snap-bbox] padding:", padding);
  if (debug) console.log("[snap-bbox] scale:", scale);

  const [originX, originY] = origin;
  if (debug) console.log("[snap-bbox] originX:", originX);
  if (debug) console.log("[snap-bbox] originY:", originY);

  const [padX, padY] = padding || ["0", "0"];
  if (debug) console.log("[snap-bbox] padX:", padX);
  if (debug) console.log("[snap-bbox] padY:", padY);

  const [scale_x, scale_y] = scale;
  if (debug) console.log("[snap-bbox] scale_x:", scale_x);
  if (debug) console.log("[snap-bbox] scale_y:", scale_y);

  // if sign is -1 then x/y value decreases
  // as grid cell number increases
  const sign_scale_x = sign(scale_x);
  const sign_scale_y = sign(scale_y);
  if (debug) console.log("[snap-bbox] sign_scale_x:", sign_scale_x);
  if (debug) console.log("[snap-bbox] sign_scale_y:", sign_scale_y);

  const [xmin, ymin, xmax, ymax] = bbox;
  if (debug) console.log("[snap-bbox] xmin:", xmin);
  if (debug) console.log("[snap-bbox] ymin:", ymin);
  if (debug) console.log("[snap-bbox] xmax:", xmax);
  if (debug) console.log("[snap-bbox] ymax:", ymax);

  const left = divide(subtract(xmin, originX), scale_x);
  const right = divide(subtract(xmax, originX), scale_x);
  const top = divide(subtract(ymax, originY), scale_y);
  const bottom = divide(subtract(ymin, originY), scale_y);
  if (debug) console.log("[snap-bbox] left:", left);
  if (debug) console.log("[snap-bbox] right:", right);
  if (debug) console.log("[snap-bbox] top:", top);
  if (debug) console.log("[snap-bbox] bottom:", bottom);

  // we're rounding here, so we don't ask for half a pixel
  let left_int = subtract(floor(left), padX);
  let right_int = add(ceil(right), padX);

  // top_int is the number of pixels from the top edge of the grid
  // so we want to subtract the padding
  let top_int = subtract(floor(top), padY);

  // bottom_int is the number of pixels from the top edge of the edge
  // so we want to increase the padding
  let bottom_int = add(ceil(bottom), padY);
  if (debug) console.log("[snap-bbox] left_int:", left_int);
  if (debug) console.log("[snap-bbox] right_int:", right_int);
  if (debug) console.log("[snap-bbox] top_int:", top_int);
  if (debug) console.log("[snap-bbox] bottom_int:", bottom_int);

  if (container) {
    if (debug) console.log("[snap-bbox] container:", container);
    const min_left = divide(subtract(container[0], originX), scale_x);
    const max_right = divide(subtract(container[2], originX), scale_x);
    const min_top = divide(subtract(container[3], originY), scale_y);
    const max_bottom = divide(subtract(container[1], originY), scale_y);
    if (debug) console.log("[snap-bbox] min_left:", min_left);
    if (debug) console.log("[snap-bbox] max_right:", max_right);
    if (debug) console.log("[snap-bbox] min_top:", min_top);
    if (debug) console.log("[snap-bbox] max_bottom:", max_bottom);

    const min_left_int = ceil(min_left);
    const max_right_int = floor(max_right);
    const min_top_int = ceil(min_top);
    const max_bottom_int = floor(max_bottom);
    if (debug) console.log("[snap-bbox] min_left_int:", min_left_int);
    if (debug) console.log("[snap-bbox] max_right_int:", max_right_int);
    if (debug) console.log("[snap-bbox] min_top_int:", min_top_int);
    if (debug) console.log("[snap-bbox] max_bottom_int:", max_bottom_int);

    left_int = max(left_int, min_left_int);
    right_int = min(right_int, max_right_int);
    top_int = max(top_int, min_top_int);
    bottom_int = min(bottom_int, max_bottom_int);
    if (debug) console.log("[snap-bbox] after containment, left_int:", left_int);
    if (debug) console.log("[snap-bbox] after containment, right_int:", right_int);
    if (debug) console.log("[snap-bbox] after containment, top_int:", top_int);
    if (debug) console.log("[snap-bbox] after containment, bottom_int:", bottom_int);
  }

  if (size && overflow === false) {
    if (debug) console.log("[snap-bbox] size:", size);
    const [width, height] = size;
    if (debug) console.log("[snap-bbox] width:", width);
    if (debug) console.log("[snap-bbox] height:", height);
    if (
      compare(left_int, width) === ">" ||
      compare(right_int, "0") === "<" ||
      compare(bottom_int, "0") === "<" ||
      compare(top_int, height) === ">"
    ) {
      throw new Error("[snap-bbox] bbox doesn't intersect the grid");
    }
    left_int = max(left_int, "0");
    right_int = min(right_int, width);
    top_int = max(top_int, "0");
    bottom_int = min(bottom_int, height);
  }

  // need ternary expresssions below because
  // top_int is sometimes -0, which fails
  // some NodeJS strict equality tests with 0
  // however, 0 === -0 evaluates to true in NodeJS
  const bbox_in_grid_cells = [left_int, bottom_int, right_int, top_int];
  if (debug) console.log("[snap-bbox] bbox_in_grid_cells:", bbox_in_grid_cells);

  const bbox_in_coordinate_system = [
    add(originX, multiply(left_int, scale_x)), // xmin
    add(originY, multiply(bottom_int, scale_y)), // ymin
    add(originX, multiply(right_int, scale_x)), // xmax
    add(originY, multiply(top_int, scale_y)) // ymax
  ];

  return { bbox_in_coordinate_system, bbox_in_grid_cells };
}

if (typeof define === "function" && define.amd)
  define(function () {
    return snap_precise_bbox;
  });
if (typeof module === "object") module.exports = snap_precise_bbox;
