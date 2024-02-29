import { Voronoi, BoundingBox, Site, Diagram, Edge } from "voronoijs";

type CalculateVoronoi = (points: Site[]) => Diagram;

export const calcVoronoi: CalculateVoronoi = (points): Diagram => {
    const voronoi = new Voronoi();
    let min_x = 0;
    let max_x = 0;
    let min_y = 0;
    let max_y = 0;
    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        if (point.x < min_x) min_x = point.x;
        if (point.x > max_x) max_x = point.x;
        if (point.y < min_y) min_y = point.y;
        if (point.y > max_y) max_y = point.y;
    }
    let bbox: BoundingBox = {xl: min_x, xr: max_x, yt: min_y, yb: max_y};
    return voronoi.compute(points, bbox);
}

export function shapeFromEdges(edges: Array<any>): string {
    if (!edges || edges.length === 0) return "";
    let result = [];
    const first_edge = edges.shift();
    let start = first_edge.getStartpoint();
    let end = first_edge.getEndpoint();
    result.push(`M ${start.x} ${start.y}`);
    result.push(`L ${end.x} ${end.y}`);
    for (let edge of edges) {
        let end = edge.getEndpoint();
        result.push(`L ${end.x} ${end.y}`);
    }
    result.push("Z");
    return result.join(" ");
}