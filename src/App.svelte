<script lang="ts">
    import seatdata from "../data/npeseatcalculationresults.json";
    import { onMount } from "svelte";
    type PartyResult = {
        ID: number;
        Name: string;
        Regional: number;
        NationalPR: number;
        Overall: number;
        Color?: string;
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

    function hemicycle(radius: number, rows: number, points: number, angle: number): Array<{ x: number; y: number, a: number, angle: number }> {
        let result = [];
        let totalArcLength = 0;
        // Calculate the total arc length
        for (let i = rows; i >= 0; i--) {
            const r = radius - i * radius / rows;
            const arcLength = angle / 180 * Math.PI * r;
            totalArcLength += arcLength;
            console.log({r, arcLength, totalArcLength})
        }
        const distanceBetweenPoints = totalArcLength / points;

        console.log({totalArcLength, distanceBetweenPoints})
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

    onMount(() => {
        party_results = seatdata.PartyResults.filter(results => (results.Overall > 0)).sort((a, b) => b.Overall - a.Overall);
        // console.log(party_results);
        total_seats = party_results.reduce((acc, cur) => acc + cur.Overall, 0);
        let col = 0;
        for (let seat of party_results) {
            // Generate color from x
            seat.Color = `hsl(${(col++ * 360 / party_results.length)}, 100%, 50%)`;
        }
        console.log({total_seats});
        points = hemicycle(r, rows, total_seats, 180);
        let x = 0;
        for (let i in party_results) {
            for (let j = 0; j < party_results[i].Overall; j++) {
                points[x++].data = party_results[i];
            }
        }
    });
</script>

<main>
    <h1>Seat Calculation</h1>
    
    <svg width={(r * 2) + padding} height={(r * 2) + padding}>
        <g transform={`translate(${r}, ${r})`}>
            <!-- Just some scaffolding so we can see what's happening -->
            <!-- {#each arcs as radius, i}
                <path d={`M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`} fill="none" stroke="white" stroke-width="1" />
            {/each} -->
            {#each points as point, i}
                <circle cx={point.x + padding / 2} cy={point.y + padding / 2} r={dotsize} fill={point.data?.Color} />
                <!-- Write the number -->
                <!-- <text x={point.x + padding / 2} y={point.y + padding / 2} text-anchor="middle" alignment-baseline="middle" fill="white">{ `${point.data?.ID}` }</text> -->
            {/each}
        </g>
    </svg>
</main>

<style>
  
</style>
