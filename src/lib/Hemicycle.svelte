<script lang="ts">
    import { calcVoronoi, arcFromEdges } from "./libs/voronoi";
    import { hemicycle } from "./libs/hemicycle";
    import { colour } from "./libs/colour";
    
    export let data: any;
    export let r: number;
    export let rows: number;
    export let dotsize: number;
    export let padding: number;
    export let total_seats: number;
    export let color = "white";
    export let font_size = 12;
    export let voronoi_stroke = "transparent";

    let total_occupied_seats = 0;
    let points: Array<Point> = [];
    let party_results: PartyResult[] = [];
    let current_party: PartyResult | null = null;
    let test_pos = [{x: 0, y: 0}, {x: 0, y: 0}];
    let voronoi: any;
    let clicked = false;

    $: {
        party_results = 
            data.PartyResults
            .filter((results: PartyResult) => (results.Overall > 0))
            .sort((a: PartyResult, b: PartyResult) => b.Overall - a.Overall);
        total_occupied_seats = party_results.reduce((acc, cur) => acc + cur.Overall, 0);
        points = hemicycle(r, rows, total_seats, 180);
        let party_index = 0;
        for (let seat of party_results) {
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
    }

    function selectParty(point: Point) {
        if (point.data && !clicked) current_party = point.data;
    }

    function clickParty(point: Point) {
        if (!point.data) return;
        if (!current_party) {
            current_party = point.data;
            clicked = true;
        } else if (clicked && current_party.ID === point.data.ID) {
            current_party = null;
            clicked = false;
        } else {
            current_party = point.data;
            clicked = true;
        }
    }

    function unselectParty() {
        if (!clicked) current_party = null;
    }
    
</script>

<main>
    <svg width={(r * 2) + padding} height={(r) + padding + 100}>
        <g transform={`translate(${r}, ${r})`}>
            <!-- Just some scaffolding so we can see what's happening -->
            <!-- {#each arcs as radius, i}
                <path d={`M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`} fill="none" stroke="white" stroke-width="1" />
            {/each} -->
            <g>
            {#each points as point, i}
                <circle data-party={point.data?.ID} cx={point.x + padding / 2} cy={point.y + padding / 2} r={dotsize} fill={point.data?.Color} opacity={current_party?.ID ? point.data?.ID === current_party?.ID ? 1 : 0.5 : 1} />
                <!-- Write the number -->
                <!-- <text x={point.x + padding / 2} y={point.y + padding / 2} text-anchor="middle" alignment-baseline="middle" fill="white" font-size="8">{ `${i}` }</text> -->
            {/each}
            </g>
        </g>
        <g transform={`translate(${r + padding / 2}, ${r + padding / 2})`}>
            <!-- Draw Voronoi -->
            {#if voronoi}
                {#each voronoi.cells as cell, i}
                    {#if (cell.halfedges?.length > 0)}
                    <path 
                        class="voronoi_path" 
                        d={arcFromEdges(cell.halfedges).toString()} 
                        fill="transparent" 
                        stroke={voronoi_stroke}
                        stroke-width={voronoi_stroke === "transparent" ? 0 : 1}
                        on:mouseover={() => {selectParty(cell.site);}} 
                        on:focus={() => selectParty(cell.site)} on:mouseout={() => unselectParty()} 
                        on:blur={() => unselectParty()} role="button" tabindex={i}
                        on:click={() => { clickParty(cell.site)}}
                        on:keypress={(e) => {if (e.key === "Enter") {clickParty(cell.site);}}}
                    />
                    {/if}
                {/each}
            {/if}
        </g>
        <g transform={`translate(${padding/2}, ${padding/2})`}>
            <!-- Draw a filled arc for each party from min_angle to max_angle -->
            <!-- <path d={`${getD(r, -90, 15)}`} fill="white" stroke="white" stroke-width="2" opacity="0.4" /> -->
        </g>
        <g transform={`translate(${r+padding/2}, ${r + (padding + 10)})`}>
            <!-- Input text data -->
            <text x={0} y={0} text-anchor="middle" alignment-baseline="middle" fill={color} font-size={font_size}>{`${clicked}`}</text>
            {#if (current_party)}
            <text x={0} y={0} text-anchor="middle" alignment-baseline="middle" fill={color} font-size={font_size}>{`${current_party.Name} : ${current_party.Overall} seats; ${current_party.Regional} provincial; ${current_party.NationalPR} national`}</text>
            {/if}
        </g>
    </svg>
</main>

<style>

    .voronoi_path {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
</style>
