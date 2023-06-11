export interface SnapOptions {
    bbox: [number, number, number, number];
    origin: [number, number];
    scale: [number, number];
    padding?: [number, number];
    container?: [number, number, number, number];
    precise?: false;
    debug?: boolean;
}

export interface SnapOptionsPrecise {
    bbox: [string, string, string, string];
    origin: [string, string];
    scale: [string, string];
    padding?: [string, string];
    container?: [string, string, string, string];
    precise: true;
    debug?: boolean;
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