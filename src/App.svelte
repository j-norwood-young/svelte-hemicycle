<script lang="ts">
    import Voronoi from "voronoi";
    import seatdata from "../data/npeseatcalculationresults.json";
    import { onMount } from "svelte";
    type PartyResult = {
        ID: number;
        Name: string;
        Regional: number;
        NationalPR: number;
        Overall: number;
        Color?: string;
        index?: number;
        min?: number;
        max?: number;
    };
    type Point = {
        x: number;
        y: number;
        a: number;
        angle: number;
        data?: PartyResult;
    };

    const r = 300;
    const rows = 12;
    const dotsize = 5;
    let points: Array<Point> = [];
    const padding = 30;
    let party_results: PartyResult[] = [];
    let total_seats = 0;
    let focussed_id = -1;
    let current_party: PartyResult | null = null;
    let test_pos = [{x: 0, y: 0}, {x: 0, y: 0}];
    let voronoi: any;

    function hemicycle(radius: number, rows: number, points: number, angle: number): Array<Point> {
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
                result.push({x, y, a, angle });
            }
            a++;
        }
        result.sort((a, b) => a.angle - b.angle);
        return result;
    }

    function calcVoronoi(points: Array<Point>) {
        const voronoi = new Voronoi();
        let bbox = {xl: -1 * (r + padding), xr: r + padding, yt: -1 * (r + padding), yb: 0};
        return voronoi.compute(points, bbox);
    }

    function arcFromEdges(edges) {
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

    onMount(() => {
        party_results = seatdata.PartyResults.filter(results => (results.Overall > 0)).sort((a, b) => b.Overall - a.Overall);
        // console.log(party_results);
        total_seats = party_results.reduce((acc, cur) => acc + cur.Overall, 0);
        
        points = hemicycle(r, rows, total_seats, 180);
        let party_index = 0;
        for (let seat of party_results) {
            // Generate color from x
            seat.index = party_index++;
            seat.Color = colour(seat.index, 80, 70);
        }
        let x = 0;
        for (let i in party_results) {
            for (let j = 0; j < party_results[i].Overall; j++) {
                points[x].data = party_results[i];
                x++;
            }
        }
        let first_party_id = party_results[0].ID;
        let test_points = points.filter(p => p.data?.ID === first_party_id);
        let last_test_point = test_points[test_points.length - 1];
        test_pos = [{x: last_test_point.x, y: last_test_point.y}, {x: last_test_point.x, y: last_test_point.y}];
        voronoi = calcVoronoi(points);
        console.log(voronoi);
        console.log(points)
    });

    function highlightParty(point: Point) {
        for (let p of points) {
            if (p.data?.ID === point.data?.ID) {
                if (p.data?.ID && p.data?.index) {
                    p.data.Color = colour(p.data.index, 100, 50);
                }
            } else {
                if (p.data?.ID && p.data?.index) {
                    p.data.Color = colour(p.data.index, 80, 70);
                }
            }
        }
        points = points;
        if (point.data) current_party = point.data;
        console.log(current_party);
    }

    function unhighlightParties() {
        focussed_id = -1;
        for (let p of points) {
            if (p.data?.ID && p.data?.index) {
                p.data.Color = colour(p.data.index, 80, 70);
            }
        }
        points = points;
        current_party = null;
    }

    function colour(i: number, s: number = 100, l: number = 50) {
        return `hsl(${i * 360 / party_results.length}, ${s}%, ${l}%)`;
    }

    // https://marian-caikovski.medium.com/drawing-sectors-and-pie-charts-with-svg-paths-b99b5b6bf7bd
    function getD(radius: number, startAngle: number, endAngle: number) {
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
        } else {
            d.push("L", radius, radius,
                "L", start.x, start.y,
                "Z");
        }
        return d.join(" ");
    }

    function polarToCartesian(radius: number, angleInDegrees: number) {
        var radians = (angleInDegrees - 90) * Math.PI / 180;
        return {
            x: Math.round(radius + (radius * Math.cos(radians))),
            y: Math.round(radius + (radius * Math.sin(radians)))
        };
    }
    // end https://marian-caikovski.medium.com/drawing-sectors-and-pie-charts-with-svg-paths-b99b5b6bf7bd
</script>

<main>
    <h1>Seat Calculation</h1>
    
    <svg width={(r * 2) + padding} height={(r * 2) + padding}>
        <g transform={`translate(${r}, ${r})`}>
            <!-- Just some scaffolding so we can see what's happening -->
            <!-- {#each arcs as radius, i}
                <path d={`M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`} fill="none" stroke="white" stroke-width="1" />
            {/each} -->
            <g>
            {#each points as point, i}
                <circle data-party={point.data?.ID} cx={point.x + padding / 2} cy={point.y + padding / 2} r={dotsize} fill={point.data?.Color} />
                <!-- Create a clickable overlay that's bigger -->
                <!-- <circle cx={point.x + padding / 2} cy={point.y + padding / 2} r={dotsize * 3} fill="white" opacity="0.5" on:mouseover={() => highlightParty(point)} on:focus={() => highlightParty(point)} on:mouseout={() => unhighlightParties()} on:blur={() => unhighlightParties()} role="button" tabindex={i} /> -->
                <!-- Write the number -->
                <!-- <text x={point.x + padding / 2} y={point.y + padding / 2} text-anchor="middle" alignment-baseline="middle" fill="white">{ `${point.data?.ID}` }</text> -->
            {/each}
            </g>
            
        </g>
        <g transform={`translate(${r + padding / 2}, ${r + padding / 2})`}>
            <!-- Draw Voronoi -->
            {#if voronoi}
            {#each voronoi.cells as cell, i}
                {#if (cell.halfedges?.length > 0)}
                <path d={arcFromEdges(cell.halfedges)} fill="white" fill-opacity="0" stroke="transparent" stroke-width="1"
                on:mouseover={() => highlightParty(cell.site)} on:focus={() => highlightParty(cell.site)} on:mouseout={() => unhighlightParties()} on:blur={() => unhighlightParties()} role="button" tabindex={i}
                 />
                {/if}
            {/each}
            {/if}
        </g>
        <g transform={`translate(${padding/2}, ${padding/2})`}>
            <!-- Draw a filled arc for each party from min_angle to max_angle -->
            <!-- <path d={`${getD(r, -90, 15)}`} fill="white" stroke="white" stroke-width="2" opacity="0.4" /> -->
        </g>
    </svg>
    <div class="tooltip">
        {#if current_party}
            <h2>{current_party.Name}</h2>
            <p>Regional: {current_party.Regional}</p>
            <p>National PR: {current_party.NationalPR}</p>
            <p>Overall: {current_party.Overall}</p>
        {/if}
    </div>
</main>

<style>
    .tooltip {
        position: absolute;
        top: 0;
        right: 0;
        background-color: white;
        color: black;
        padding: 10px;
        border: 1px solid black;
    }
</style>
