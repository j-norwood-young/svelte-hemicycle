import Voronoi from "voronoi";

export function calcVoronoi(points, r, padding) {
    const voronoi = new Voronoi();
    let bbox = {xl: -1 * (r + padding), xr: r + padding, yt: -1 * (r + padding), yb: 0};
    return voronoi.compute(points, bbox);
}

export function arcFromEdges(edges) {
    if (!edges || edges.length === 0) return [];
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