<script>
  import { Select, Dropdown } from "@onsvisual/svelte-components";
  import AlluvialChart from "../charts/AlluvialChart.svelte";

  export let data;
  export let selected;
  export let hovered;
  export let highlight;

  $: area = (!highlight || !selected) && hovered ? {...data.metadata[hovered], d: data.areadata[hovered], state: "hovered"} :
    selected ? {...data.metadata[selected], d: data.areadata[selected], state: "selected"} :
    null;
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
    {#if area}
      <h2>{area.areanm}</h2>
      <div class="info-grid">
        {#if !highlight || highlight === "to"}
        <div>Living here <strong class="text-big">{area.d.resident.toLocaleString()}</strong></div>
        {:else}
        <div class="text-muted">Living and working here <strong>{(area.d.home + area.d.within).toLocaleString()}</strong></div>
        {/if}
        {#if !highlight || highlight === "from"}
        <div class="text-muted text-right">Travelling from another area <strong>{(area.d.workday - area.d.home - area.d.within).toLocaleString()}</strong></div>
        {/if}
        <div style:grid-column="span 2" style:line-height={0}>
          <AlluvialChart data={[
            {from: "a", to: "a", value: area.d.home + area.d.within},
            {from: "a", to: "b", value: area.d.resident - area.d.home - area.d.within},
            {from: "b", to: "a", value: area.d.workday - area.d.home - area.d.within},
            ]}
            highlight="{highlight === "from" ? ["to", "a"] : highlight === "to" ? ["from", "a"] : "a"}"/>
        </div>
        {#if !highlight || highlight === "from"}
        <div>
          Working here <strong class="text-big">{area.d.workday.toLocaleString()}</strong>
          <!-- <span class="text-muted">{(d.workday - d.resident).toLocaleString("en-GB", {signDisplay: "exceptZero"})}</span> -->
        </div>
        {:else}
        <div class="text-muted">Living and working here <strong>{(area.d.home + area.d.within).toLocaleString()}</strong></div>
        {/if}
        {#if !highlight || highlight === "to"}
        <div class="text-muted text-right">Travelling to another area <strong>{(area.d.resident - area.d.home - area.d.within).toLocaleString()}</strong></div>
        {/if}
      </div>
    {/if}
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
  .info-palette h2 {
    margin: 6px 0 12px;
  }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 4px;
    width: 100%;
    font-size: 16px;
    line-height: 1.2;
  }
  .info-grid > div {
    padding: 0;
    margin: 0;
  }
  .text-right {
    text-align: right;
  }
  .text-big {
    display: block;
    font-size: 28px;
  }
  .text-muted {
    color: #bbb;
  }
</style>