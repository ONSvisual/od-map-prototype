<script>
  import { Select } from "@onsvisual/svelte-components";
  import AlluvialChart from "../charts/AlluvialChart.svelte";

  export let data;
  export let selected;
  export let highlight;
</script>

<div class="info-palette">
  <Select
    id="select"
    mode="search"
    options={data.arealist}
    idKey="areacd" labelKey="areanm"
    placeholder="Find an area..."
    autoClear
    on:change/>
    {#each selected ? [data.metadata[selected]] : [] as area}
      {#each [data.areadata[selected]] as d}
        <h2>{area.areanm}</h2>
        <div class="info-grid">
          <div>Living here <strong class="text-big">{d.resident.toLocaleString()}</strong></div>
          <div class="text-muted">Travelling from another area <strong>{(d.workday - d.home - d.within).toLocaleString()}</strong></div>
        </div>
        <AlluvialChart data={[
          {from: "a", to: "a", value: d.home + d.within},
          {from: "a", to: "b", value: d.resident - d.home - d.within},
          {from: "b", to: "a", value: d.workday - d.home - d.within},
          ]}
          highlight="{highlight === "from" ? ["to", "a"] : highlight === "to" ? ["from", "a"] : "a"}"/>
        <div class="info-grid">
          <div>
            Working here<br/>
            <strong class="text-big">{d.workday.toLocaleString()}</strong><br/>
            <span class="text-muted">{(d.workday - d.resident).toLocaleString("en-GB", {signDisplay: "exceptZero"})}</span>
          </div>
          <div class="text-muted">Travelling to another area <strong>{(d.resident - d.home - d.within).toLocaleString()}</strong></div>
        </div>
      {/each}
    {/each}
</div>

<style>
  .info-palette {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 300px;
    padding: 24px;
    background: rgba(0,0,0,0.8);
    color: white;
  }
  .info-grid {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    font-size: 16px;
    line-height: 1.2;
  }
  .info-grid > div:nth-of-type(even) {
    text-align: right;
  }
  .text-big {
    font-size: 28px;
  }
  .text-muted {
    color: #bbb;
  }
</style>