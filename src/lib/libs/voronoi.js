import Voronoi from "voronoi";

/**
 * Calculates the Voronoi diagram for a given set of points.
 * @param {Array<{x: number, y: number}>} points - The points to calculate the Voronoi diagram for.
 * @param {number} r - The radius of the Voronoi cells.
 * @param {number} padding - The padding around the Voronoi diagram.
 * @returns {Object} - The computed Voronoi diagram.
 */
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