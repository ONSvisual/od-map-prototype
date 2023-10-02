<script>
  import "@onsvisual/svelte-components/css/main.css";
  import { Theme } from "@onsvisual/svelte-components";
  import FlowMap from "$lib/layout/FlowMap.svelte";

  export let data;

  const geos = ["lad", "msoa"];
  const poss = ["from", "to"];
  const highlights = ["from", "to"];

  let interactive = true;
	let geo = geos[0];
  let pos = poss[0];
  let highlight = highlights[0];
</script>

<Theme theme="dark">
  <FlowMap {data} {interactive} {geo} {pos} {highlight}>
    <div class="toggles">
      <label>
        <input type="checkbox" bind:checked={interactive}/>
        Interactive
      </label>
      <label>
        Geo type<br/>
        <select bind:value={geo}>
          {#each geos as g}
          <option value={g}>{g}</option>
          {/each}
        </select>
      </label>
      <label>
        Point location<br/>
        <select bind:value={pos}>
          {#each poss as p}
          <option value={p}>{p === "from" ? "origin" : "destination"}</option>
          {/each}
        </select>
      </label>
      <label>
        Highlight<br/>
        <select bind:value={highlight}>
          {#each highlights as h}
          <option value={h}>{h === "from" ? "works here" : "lives here"}</option>
          {/each}
        </select>
      </label>
    </div>
  </FlowMap>
</Theme>

<style>
  .toggles {
    position: absolute;
    z-index: 1000;
    top: 100px;
    right: 0;
    width: 200px;
    padding: 24px;
    background: rgba(0,0,0,0.8);
    color: white;
  }
  .toggles label {
    display: inline-block;
    margin-right: 10px;
  }
</style>