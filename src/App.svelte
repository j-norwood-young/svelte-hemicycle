<script lang="ts">
    import Hemicycle from "./lib/Hemicycle.svelte";
    import data_2019 from "../data/npe_seat_calculation_results-2019.json";
    import data_2024 from "../data/npe_seat_calculation_results-2024.json";
    
    const r = 300;
    const rows = 12;
    const dotsize = 5;
    const padding = 30;
    const total_seats = 400;
    const color = "white";
    const font_size = "0.8em";
    let data = data_2019;
</script>

<main>
    <button on:click={() => data = data_2019}>2019</button>
    <button on:click={() => data = data_2024}>2024</button>
    <h1>{ data.ElectoralEvent }</h1>
    
    <Hemicycle {r} {rows} {padding} {dotsize} {total_seats} {data} {color} {font_size} />
</main>

<style>
    
</style>
