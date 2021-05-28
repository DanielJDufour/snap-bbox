module.exports = ({ bbox, debug, origin, scale }) => {
  if (debug) console.log("[snap-bbox] starting");
  if (debug) console.log("[snap-bbox] bbox:", bbox);
  if (debug) console.log("[snap-bbox] debug:", debug);
  if (debug) console.log("[snap-bbox] origin:", origin);
  if (debug) console.log("[snap-bbox] scale:", scale);

  const [originX, originY] = origin;
  if (debug) console.log("[snap-bbox] originX:", originX);
  if (debug) console.log("[snap-bbox] originY:", originY);

  const [scale_x, scale_y] = scale;
  if (debug) console.log("[snap-bbox] scale_x:", scale_x);
  if (debug) console.log("[snap-bbox] scale_y:", scale_y);

  const [xmin, ymin, xmax, ymax] = bbox;
  if (debug) console.log("[snap-bbox] xmin:", xmin);
  if (debug) console.log("[snap-bbox] ymin:", ymin);
  if (debug) console.log("[snap-bbox] xmax:", xmax);
  if (debug) console.log("[snap-bbox] ymax:", ymax);

  const left = (xmin - originX) / scale_x;
  const right = (xmax - originX) / scale_x;
  const top = (ymax - originY) / scale_y;
  const bottom = (ymin - originY) / scale_y;
  if (debug) console.log("[snap-bbox] left:", left);
  if (debug) console.log("[snap-bbox] right:", right);
  if (debug) console.log("[snap-bbox] top:", top);
  if (debug) console.log("[snap-bbox] bottom:", bottom);

  // we're rounding here, so we don't ask for half a pixel
  const left_int = Math.floor(left);
  const right_int = Math.ceil(right);
  const top_int = Math.floor(top);
  const bottom_int = Math.ceil(bottom);
  if (debug) console.log("[snap-bbox] left_int:", left_int);
  if (debug) console.log("[snap-bbox] right_int:", right_int);
  if (debug) console.log("[snap-bbox] top_int:", top_int);
  if (debug) console.log("[snap-bbox] bottom_int:", bottom_int);

  const bbox_in_grid_cells = [left_int, bottom_int, right_int, top_int];
  if (debug) console.log("[snap-bbox] bbox_in_grid_cells:", bbox_in_grid_cells);

  const bbox_in_coordinate_system = [
    originX + left_int * scale_x, // xmin
    originY + bottom_int * scale_y, // ymin
    originX + right_int * scale_x, // xmax
    originY + top_int * scale_y, // ymax
  ];

  return { bbox_in_coordinate_system, bbox_in_grid_cells };
};
