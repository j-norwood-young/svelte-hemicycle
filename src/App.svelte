<script lang="ts">
    import Hemicycle from "./lib/Hemicycle.svelte";
    import data_2019 from "../data/npe_seat_calculation_results-2019.json";
    import data_2024 from "../data/npe_seat_calculation_results-2024.json";
    
    const r = 300;
    const rows = 12;
    const dotsize = 5;
    const padding = 30;
    const total_seats = 400;
    let data = data_2019;
</script>

<main>
    <button on:click={() => data = data_2019}>2019</button>
    <button on:click={() => data = data_2024}>2024</button>
    <h1>{ data.ElectoralEvent }</h1>
    
    <Hemicycle {r} {rows} {padding} {dotsize} {total_seats} {data} />
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
