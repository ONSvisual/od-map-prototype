<script>
  import BreaksChart from "../charts/BreaksChart.svelte";

  export let data;
  export let journeys;
  export let selected;
  export let hovered;
  export let highlight;
</script>

{#if journeys}
<div class="breaks-palette">
  <BreaksChart data={journeys[highlight]} breaks={journeys[`${highlight}Breaks`]} idKey="code" bind:hovered on:hover/>
</div>
{/if}

<style>
  .breaks-palette {
    position: absolute;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    padding: 24px;
    font-size: 16px;
    background: rgba(0,0,0,0.8);
    color: white;
  }
</style>