<script lang="ts">
    import { calcVoronoi, shapeFromEdges } from "./libs/voronoi";
    import { hemicycle } from "./libs/hemicycle";
    import type { Site } from "voronoijs";

    export let data: PartyData[] = [];
    export let r: number = 300;
    export let rows: number = 12;
    export let dotsize: number = 5;
  export let padding:
    | number
    | [number, number]
    | [number, number, number, number] = 10;
    export let total_seats: number;
    export let color = "white";
    export let font_size: number | string = 12;
    export let arc = 180;
  export let text_position: { x: number; y: number } | null = null;
  export let selectedShape: string = "circle";
  export let hcWidth = 0;
  export let hcHeight = 0;

    export let display = ["points", "text"];

    export let current_party: PartyData | null = null;

    let total_occupied_seats = 0;
    let points: Array<Point> = [];
    let voronoi: any = null;
    let clicked = false;
    let top_padding = 0;
    let bottom_padding = 0;
    let left_padding = 0;
    let right_padding = 0;

    let svgWidth = 0;
    let svgHeight = 0;
  let hexagonShape =
    "M86.60254037844386 12L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z";

    $: {
        if (arc < 10) arc = 10;
        if (arc > 360) arc = 360;

        calcPadding();
        data.sort((a, b) => b.count - a.count);
        total_occupied_seats = data.reduce((acc, cur) => acc + cur.count, 0);
        points = hemicycle(r, rows, total_seats, arc);
        let x = 0;
        for (let i in data) {
            for (let j = 0; j < data[i].count; j++) {
                points[x].data = data[i];
                x++;
            }
        }
        voronoi = calcVoronoi(points as Site[]);
    svgWidth = r * 2 + left_padding + right_padding;
    svgHeight = r * 2 + top_padding + bottom_padding;
    hcWidth = svgWidth;
    hcHeight = svgHeight;
    }

    function calcPadding() {
        if (Array.isArray(padding)) {
            if (padding.length === 2) {
                top_padding = padding[0];
                bottom_padding = padding[0];
                left_padding = padding[1];
                right_padding = padding[1];
            } else if (padding.length === 4) {
                top_padding = padding[0];
                bottom_padding = padding[1];
                left_padding = padding[2];
                right_padding = padding[3];
            }
        } else {
            top_padding = padding;
            bottom_padding = padding;
            left_padding = padding;
            right_padding = padding;
        }
    }

    function selectParty(point: Point) {
        if (point.data && !clicked) current_party = point.data;
    }

    function clickParty(point: Point) {
        if (!point.data) return;
        if (!current_party) {
            current_party = point.data;
            clicked = true;
        } else if (clicked && current_party.id === point.data.id) {
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
  <svg
    viewBox={`0 0 ${hcWidth} ${hcHeight}`}
    width={hcWidth}
    height={hcHeight}
    preserveAspectRatio="none"
  >
    <g
      id="arcs"
      transform={`translate(${r + left_padding}, ${r + top_padding})`}
      class:hide={!display.includes("arcs")}
    >
            {#each Array(rows) as _, i}
                <!-- Draw a semicircle for each row -->
        <path
          d={`M ${r - i * (r / rows)},0 A ${r - i * (r / rows)},${r - i * (r / rows)} 0 0,0 ${-(r - i * (r / rows))},0`}
          fill="transparent"
          stroke="white"
          stroke-width="1"
          opacity="0.4"
        />
            {/each}
        </g>
    <g
      id="points"
      transform={`translate(${r + left_padding}, ${r + top_padding})`}
      class:hide={!display.includes("points")}
    >
            {#each points as point}
        {#if selectedShape === "hexagon"}
                    <path
                        d={hexagonShape}
                        transform={`translate(${point.x},${point.y}) rotate(-5) scale(0.07)`}
                        data-party={point.data?.id}
                        fill={point.data?.color}
            opacity={current_party?.id
              ? point.data?.id === current_party?.id
                ? 1
                : 0.5
              : 1}
                    />
                {:else}
                    <circle
                        data-party={point.data?.id}
            cx={point.x}
            cy={point.y}
                        r={dotsize}
                        fill={point.data?.color}
            opacity={current_party?.id
              ? point.data?.id === current_party?.id
                ? 1
                : 0.5
              : 1}
                    />
                {/if}
            {/each}
        </g>
    <g
      id="numbers"
      transform={`translate(${r + left_padding}, ${r + top_padding})`}
      class:hide={!display.includes("numbers")}
    >
            {#each points as point, i}
        <text
          x={point.x}
          y={point.y}
          text-anchor="middle"
          alignment-baseline="middle"
          fill="white"
          font-size="8">{`${i}`}</text
        >
            {/each}
        </g>
    <g
      id="voronoi"
      transform={`translate(${r + left_padding}, ${r + top_padding})`}
    >
            <!-- Draw Voronoi -->
            {#each voronoi.cells as cell, i}
        {#if cell.halfedges?.length > 0}
                <path 
                    class="voronoi_path" 
                    d={shapeFromEdges(cell.halfedges).toString()} 
                    fill="transparent" 
                    stroke={display.includes("voronoi") ? "white" : "transparent"}
                    stroke-width={display.includes("voronoi") ? 1 : 0}
            on:mouseover={() => {
              selectParty(cell.site);
            }}
            on:focus={() => selectParty(cell.site)}
            on:mouseout={() => unselectParty()}
            on:blur={() => unselectParty()}
            role="button"
            tabindex={i}
            on:click={() => {
              clickParty(cell.site);
            }}
            on:keypress={(e) => {
              if (e.key === "Enter") {
                clickParty(cell.site);
              }
            }}
                />
                {/if}
            {/each}
        </g>
    <g
      id="text"
      transform={`translate(${text_position?.x || r + left_padding}, ${text_position?.y || r + top_padding + 20})`}
      class:hide={!display.includes("text")}
    >
            <!-- Input text data -->
      {#if current_party}
        <text
          x={0}
          y={0}
          text-anchor="middle"
          alignment-baseline="middle"
          fill={color}
          font-size={font_size}>{`${current_party.text}`}</text
        >
            {/if}
        </g>
    <g
      id="referencePoints"
      transform={`translate(${r + left_padding}, ${r + top_padding})`}
      class:hide={!display.includes("referencePoints")}
    >
            <g class="reference_points">
        <text
          x="0"
          y="10"
          text-anchor="middle"
          alignment-baseline="middle"
          fill="white"
          font-size="8">0, 0</text
        >
        <circle cx="0" cy="0" r="2" fill="white" />
            </g>
            <g class="reference_points">
        <text
          x={r}
          y="10"
          text-anchor="middle"
          alignment-baseline="middle"
          fill="white"
          font-size="8">{`${r}, ${0}`}</text
        >
        <circle cx={r} cy={0} r="2" fill="white" />
            </g>
            <g class="reference_points">
        <text
          x={r - 10}
          y={-r + 10}
          text-anchor="middle"
          alignment-baseline="middle"
          fill="white"
          font-size="8">{`${r}, ${-r}`}</text
        >
        <circle cx={r} cy={-r} r="2" fill="white" />
            </g>
            <g class="reference_points">
        <text
          x={-r + 10}
          y={-r + 10}
          text-anchor="middle"
          alignment-baseline="middle"
          fill="white"
          font-size="8">{`-${r}, ${-r}`}</text
        >
        <circle cx={-r} cy={-r} r="2" fill="white" />
            </g>
            <g class="reference_points">
        <text
          x={-r}
          y={10}
          text-anchor="middle"
          alignment-baseline="middle"
          fill="white"
          font-size="8">{`-${r}, ${0}`}</text
        >
        <circle cx={-r} cy={0} r="2" fill="white" />
            </g>
        </g>
    </svg>
</main>

<style>
    .hide {
        display: none;
    }
</style>
