export function hemicycle(radius, rows, points, angle) {
    let result = [];
    let totalArcLength = 0;
    // Calculate the total arc length
    for (let i = rows; i >= 0; i--) {
        const r = radius - i * radius / rows;
        const arcLength = angle / 180 * Math.PI * r;
        totalArcLength += arcLength;
        // console.log({r, arcLength, totalArcLength})
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
        // console.log({arcLength, pointsInArc})
        for (let j = 0; j < pointsInArc; j++) {
            total_points++;
            const angle = (j * localDistanceBetweenPoints / r) + (localDistanceBetweenPoints / r / 2);
            const x = -r * Math.cos(angle);
            const y = -r * Math.sin(angle);
            result.push({ x, y, a, angle });
        }
        a++;
    }
    result.sort((a, b) => a.angle - b.angle);
    return result;
}
