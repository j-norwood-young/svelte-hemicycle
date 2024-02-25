// https://marian-caikovski.medium.com/drawing-sectors-and-pie-charts-with-svg-paths-b99b5b6bf7bd
export function getD(radius, startAngle, endAngle) {
    const isCircle = endAngle - startAngle === 360;
    if (isCircle) {
        endAngle--;
    }
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ];
    if (isCircle) {
        d.push("Z");
    }
    else {
        d.push("L", radius, radius, "L", start.x, start.y, "Z");
    }
    return d.join(" ");
}
function polarToCartesian(radius, angleInDegrees) {
    var radians = (angleInDegrees - 90) * Math.PI / 180;
    return {
        x: Math.round(radius + (radius * Math.cos(radians))),
        y: Math.round(radius + (radius * Math.sin(radians)))
    };
}
// end https://marian-caikovski.medium.com/drawing-sectors-and-pie-charts-with-svg-paths-b99b5b6bf7bd
