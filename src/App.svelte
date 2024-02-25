<script lang="ts">
    
    import seatdata from "../data/npeseatcalculationresults.json";
    import { onMount } from "svelte";
    import { calcVoronoi, arcFromEdges } from "./libs/voronoi";
    import { hemicycle } from "./libs/hemicycle";
    import { colour } from "./libs/colour";
    
    const r = 300;
    const rows = 12;
    const dotsize = 5;
    let points: Array<Point> = [];
    const padding = 30;
    let party_results: PartyResult[] = [];
    let total_seats = 0;
    let current_party: PartyResult | null = null;
    let test_pos = [{x: 0, y: 0}, {x: 0, y: 0}];
    let voronoi: any;

    onMount(() => {
        party_results = seatdata.PartyResults.filter(results => (results.Overall > 0)).sort((a, b) => b.Overall - a.Overall);
        // console.log(party_results);
        total_seats = party_results.reduce((acc, cur) => acc + cur.Overall, 0);
        
        points = hemicycle(r, rows, total_seats, 180);
        let party_index = 0;
        for (let seat of party_results) {
            // Generate color from x
            seat.index = party_index++;
            seat.Color = colour(seat.index, 100);
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
        voronoi = calcVoronoi(points, r, padding);
        console.log(voronoi);
        console.log(party_results.length)
    });

    function highlightParty(point: Point) {
        for (let p of points) {
            if (p.data?.ID === point.data?.ID) {
                if (p.data?.ID && p.data?.index !== undefined) {
                    p.data.Color = colour(p.data.index, 100);
                }
            } else {
                if (p.data?.ID && p.data?.index !== undefined) {
                    p.data.Color = colour(p.data.index, 60);
                }
            }
        }
        points = points;
        if (point.data) current_party = point.data;
    }

    function unhighlightParties() {
        for (let p of points) {
            if (p.data?.ID && p.data?.index !== undefined) {
                p.data.Color = colour(p.data.index, 100);
            }
        }
        points = points;
        current_party = null;
    }

    
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
