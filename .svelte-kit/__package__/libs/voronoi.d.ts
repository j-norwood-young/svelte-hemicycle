import { Site, Diagram } from "voronoijs";
type CalculateVoronoi = (points: Site[]) => Diagram;
export declare const calcVoronoi: CalculateVoronoi;
export declare function shapeFromEdges(edges: Array<any>): string;
export {};
