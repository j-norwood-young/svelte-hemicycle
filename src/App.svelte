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
    };

    const r = 180;
    const arcs = 6;
    const dotsize = 5;
    const dotcount = 200;
    const width = 1000;
    const height = 1000;
    let points: Array<Point> = [];
    

    let party_results: PartyResult[] = [];
    let total_seats = 0;
    let degrees = 0;
    let degree_array: number[] = [];
    let dots = [];

    function hemicycle(radius: number, arcs: number, points: number, angle: number): Array<{ x: number; y: number }> {
        let result = [];
        let totalArcLength = 0;
        for (let i = 0; i < arcs; i++) {
            const r = radius * (i + 1);
            totalArcLength += angle / 180 * Math.PI * r;
        }
        const distanceBetweenPoints = totalArcLength / points;

        console.log({totalArcLength, distanceBetweenPoints})
        let total_points = 0;
        for (let i = 0; i < arcs; i++) {
            const r = radius * (i + 1);
            const arcLength = angle / 180 * Math.PI * r;
            let pointsInArc = Math.ceil(arcLength / distanceBetweenPoints);
            if (total_points + pointsInArc > points) {
                pointsInArc = points - total_points;
            }
            const localDistanceBetweenPoints = arcLength / pointsInArc;
            console.log({arcLength, pointsInArc})
            for (let j = 0; j < pointsInArc; j++) {
                total_points++;
                const angle = (j * localDistanceBetweenPoints / r) + (localDistanceBetweenPoints / r / 2);
                const x = r * Math.cos(angle);
                const y = -r * Math.sin(angle);
                result.push({x, y});
            }
        }
        return result;
    }

    onMount(() => {
        
        // console.log(seatdata);
        party_results = seatdata.PartyResults.filter(results => (results.Overall > 0)).sort((a, b) => b.Overall - a.Overall);
        // console.log(party_results);
        total_seats = party_results.reduce((acc, cur) => acc + cur.Overall, 0);
        console.log({total_seats});
        points = hemicycle(r, arcs, total_seats, 180);
        // degrees = arc / total_seats * rows;
        // for (let i = 0; i < arc; i = i + degrees) {
        //     degree_array.push(i);
        // }
        // degree_array = degree_array;
        // console.log({degree_array});
        // dots = calculate_dots(party_results,  total_seats, arcs);
    });
</script>

<main>
    <h1>Seat Calculation</h1>
    
    <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2}) scale(0.5)`}>
            <!-- Just some scaffolding so we can see what's happening -->
            {#each Array(arcs) as _, row }
                <path d={`M ${(row + 1) * r} 0 A ${(row + 1) * r} ${(row + 1) * r} 0 0 0 ${-(row + 1) * r} 0`} fill="none" stroke="white" stroke-width="1" />
            {/each}
            {#each points as point, i}
                <!-- <circle cx={point.x} cy={point.y} r={dotsize} fill="white" /> -->
                <!-- Write the number -->
                <text x={point.x} y={point.y} text-anchor="middle" alignment-baseline="middle" fill="white">{ i }</text>
            {/each}
        </g>
    </svg>
</main>

<style>
  
</style>
