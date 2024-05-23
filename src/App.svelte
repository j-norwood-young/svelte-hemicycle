<script lang="ts">
    import Hemicycle from "./lib/Hemicycle.svelte";
    import data_2019 from "../data/npe_seat_calculation_results-2019.json";
    import data_2014 from "../data/npe_seat_calculation_results-2014.json";
    import { colour } from "./lib/libs/colour";
    
    let r = 300;
    let rows = 12;
    let dotsize = 5;
    let padding = 30;
    let total_seats = 400;
    const color = "white";
    const font_size = "0.8em";
    let arc = 180;
    let source_data = data_2019;
    let data: PartyData[] = [];
    let display = ["points", "text"];
    let shape = 'hexagon';
    let display_width = 600;
    let display_height = 300;

    $: {
        data = source_data.PartyResults
            .filter((results: PartyResult) => (results.Overall > 0))
            .sort((a: PartyResult, b: PartyResult) => b.Overall - a.Overall)
            .map((party: PartyResult, index: number) => {
                return {
                    id: party.ID,
                    text: `${party.Name} (${party.Overall})`,
                    color: colour(index, 100),
                    count: party.Overall
                }
            });
    }

    const changeDisplay = (e: any) => {
        const value = (e.target as HTMLInputElement)?.value;
        if (!value) return;
        if (display.includes(value)) {
            display = display.filter(d => d !== value);
        } else {
            display = [...display, value];
        }
        display = display;
    }
</script>

<main>
    <nav class="links">
        <a href="https://www.npmjs.com/package/svelte-hemicycle" target="_blank">
            <img src="https://img.shields.io/npm/v/svelte-hemicycle?style=flat-square" alt="npm version" />
        </a>
        <a href="https://github.com/j-norwood-young/svelte-hemicycle/tree/main" target="_blank">
            <img src="https://img.shields.io/github/stars/j-norwood-young/svelte-hemicycle?style=flat-square" alt="github stars" />
        </a>
    </nav>
    <button on:click={() => source_data = data_2014} class:active={source_data === data_2014}>2014</button>
    <button on:click={() => source_data = data_2019} class:active={source_data === data_2019}>2019</button>
    <h1>{ source_data.ElectoralEvent }</h1>
    <div class="controls">
        <div class="control">
            <p>Arc</p>
            <input type="range" min="10" max="360" bind:value={arc} />
        </div>
        <div class="control">
            <p>Dot size</p>
            <input type="range" min="1" max="10" bind:value={dotsize} />
        </div>
        <div class="control">
            <p>Rows</p>
            <input type="range" min="1" max="20" bind:value={rows} />
        </div>
        <div class="control">
            <p>Radius</p>
            <input type="range" min="100" max="500" bind:value={r} />
        </div>
    </div>
    <div class="controls">
        <div class="control">
            <p>Points</p>
            <input type="checkbox" on:change={changeDisplay} value="points" checked={display.includes("points")} />
        </div>
        <div class="control">
            <p>Text</p>
            <input type="checkbox" on:change={changeDisplay} value="text" checked={display.includes("text")} />
        </div>
        <div class="control">
            <p>Voronoi</p>
            <input type="checkbox" on:change={changeDisplay} value="voronoi" checked={display.includes("voronoi")} />
        </div>
        <div class="control">
            <p>Arcs</p>
            <input type="checkbox" on:change={changeDisplay} value="arcs" checked={display.includes("arcs")} />
        </div>
        <div class="control">
            <p>Numbers</p>
            <input type="checkbox" on:change={changeDisplay} value="numbers" checked={display.includes("numbers")} />
        </div>
    </div>
    <div class="controls">
        <div class="control">
            <p>Shape</p>
            <select bind:value={shape}>
                <option value="hexagon">Hexagon</option>
                <option value="circle">Circle</option>
            </select>
        </div>
        <div class="control">
            <p>Display Width</p>
            <input type="display_width" min="10" max="1000" bind:value={display_width} />
        </div>
        <div class="control">
            <p>Display Height</p>
            <input type="display_height" min="10" max="1000" bind:value={display_height} />
        </div>
    </div>
    <div style="border: #FFF 1px solid; margin-top: 30px">
        <Hemicycle {r} {rows} {padding} {dotsize} {total_seats} {data} {color} {font_size} {arc} {display} {shape} {display_height} {display_width} />
    </div>
    
</main>

<style>
    .controls {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .control {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 10px;
    }

    .links {
        display: flex;
        flex-direction: row;
        align-items: right;
        justify-content: right;
        margin: 10px 0;
        width: 100%;
    }

    .links a {
        margin: 0 10px;
    }

    button.active {
        background-color: #f0f0f0;
        color: #000;
    }
</style>
