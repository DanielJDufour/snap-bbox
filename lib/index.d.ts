export interface SnapOptions {
    bbox: [number, number, number, number];
    origin: [number, number];
    scale: [number, number];
    container?: [number, number, number, number];
    debug?: boolean;
    padding?: [number, number];
    overflow?: boolean;
    precise?: false;
    size?: [number, number];
}

export interface SnapOptionsPrecise {
    bbox: [string, string, string, string];
    origin: [string, string];
    scale: [string, string];
    container?: [string, string, string, string];
    debug?: boolean;
    overflow?: boolean;
    precise: true;
    padding?: [string, string];
    size?: [number, number];
}

export interface SnapResultPrecise {
    bbox_in_coordinate_system: [string, string, string, string];
    bbox_in_grid_cells: [string, string, string, string];
}

export interface SnapResult {
    bbox_in_coordinate_system: [number, number, number, number];
    bbox_in_grid_cells: [number, number, number, number];
}

export default function snap(options: SnapOptions): SnapResult;
export default function snap(options: SnapOptionsPrecise): SnapResultPrecise;