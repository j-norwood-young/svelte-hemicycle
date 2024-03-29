export function hemicycle(radius: number, rows: number, points: number, angle: number): Array<Point> {
    let result = [];
    let totalArcLength = 0;
    // Calculate the total arc length
    for (let i = rows; i >= 0; i--) {
        const r = radius - i * radius / rows;
        const arcLength = angle / 180 * Math.PI * r;
        totalArcLength += arcLength;
    }
    const distanceBetweenPoints = totalArcLength / points;

    // console.log({totalArcLength, distanceBetweenPoints})
    let total_points = 0;
    // Calculate the points
    let a = 0;
    for (let i = rows; i >= 0; i--) {
        const r = radius - i * radius / rows;
        const arcLength = angle / 180 * Math.PI * r;
        let pointsInArc = Math.ceil(arcLength / distanceBetweenPoints);
        if (total_points + pointsInArc > points) {
            pointsInArc = points - total_points;
        }
        const localDistanceBetweenPoints = arcLength / pointsInArc;
        const offset = (angle - 180) / 180 * Math.PI / 2;
        for (let j = 0; j < pointsInArc; j++) {
            total_points++;
            const angle = (j * localDistanceBetweenPoints / r) + (localDistanceBetweenPoints / r / 2);
            const x = -r * Math.cos(angle - offset);
            const y = -r * Math.sin(angle - offset);
            result.push({ id: i, x, y, a, angle });
        }
        a++;
    }
    result.sort((a, b) => a.angle - b.angle);
    return result;
}