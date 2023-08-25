<script>
  import maplibre from "maplibre-gl";
  import reglLib from "regl";
  import reglTween from "regl-tween";
  import { csvParse, autoType } from "d3-dsv";
	import { feature } from "topojson-client";
	import { Map, MapSource, MapLayer } from "@onsvisual/svelte-maps";
	import BarChart from "./components/BarChart.svelte";

	const bounds = [-6.3603,49.8823,1.7637,55.8112];

	const mapSources = [
		{
			key: "msoa",
			type: "vector",
			props: {
				url: "https://cdn.ons.gov.uk/maptiles/administrative/msoa/v2/boundaries/{z}/{x}/{y}.pbf",
				layer: "msoa",
				maxzoom: 12,
				minzoom: 6
			}
		},
		{
			key: "lad",
			type: "geojson",
			props: {}
		}
	];

	const plot = (coord) => {
    const proj = maplibre.MercatorCoordinate.fromLngLat({ lng: coord[0], lat: coord[1] });
    return [proj.x, proj.y];
  };

	const scaleLinear = (input, output) => (val) => {
		return val < input[0] ? output[0] :
			val > input[1] ? output[1] :
			((val - input[0]) * ((output[1] - output[0]) / (input[1] - input[0]))) + output[0]; 
	};
	const scale = scaleLinear([5, 14], [1, 8]);

  let map, selected, hovered, highlighted, zoom;
  let regl, tween, scene, positionBuffer, opacityVals, uMatrix;
	let metadata, data;
  let points = {};
	let geo = "lad";
  let pos = "from";
	let highlight = "from";
	let filter = true;

	function fitBounds(features) {
		const bounds = [
			Math.min(...features.map(f => f.xmin)),
			Math.min(...features.map(f => f.ymin)),
			Math.max(...features.map(f => f.xmax)),
			Math.max(...features.map(f => f.ymax))
		];
		map.fitBounds(bounds, {padding: 50});
	}

  async function init() {
		const lad_geojson = feature(await (await fetch("./data/lad11_bsc.json")).json(), "lad");
    const metadata_lad_raw = await (await fetch("./data/lad11_metadata.csv")).text();
    const metadata_msoa_raw = await (await fetch("./data/msoa11_metadata.csv")).text();
    const metadata_array = [
			...csvParse(await metadata_lad_raw),
			...csvParse(await metadata_msoa_raw)
		];
    const metadata_indexed = {};
    metadata_array.forEach(d => metadata_indexed[d.areacd] = d);
		metadata = metadata_indexed;
		mapSources[1].props.data = lad_geojson;
		
		const data_lad_raw = await fetch("./data/lad11_data.csv");
		const data_msoa_raw = await fetch("./data/msoa11_data.csv");
    const data_array = [
			...csvParse(await data_lad_raw.text(), autoType),
			...csvParse(await data_msoa_raw.text(), autoType),
		];
    const data_indexed = {};
    data_array.forEach(d => data_indexed[d.areacd] = d);
		data = data_indexed;

    const points_raw = await fetch("./data/msoa11_points.csv");
    points.array = csvParse(await points_raw.text(), (d) => {
			return {
				from_msoa: d.from, from_lad: metadata[d.from]?.parentcd || d.from,
				to_msoa: d.to, to_lad: metadata[d.to]?.parentcd || d.to,
				x1: +d.x1, y1: +d.y1, x2: +d.x2, y2: +d.y2
			};
		});
    const count = points.array.length;
    
    points.from = points.array.map(d => plot([d.x1, d.y1]));
    points.to = points.array.map(d => plot([d.x2, d.y2]));

    const createScene = gl => {
      regl = reglLib(gl);
      tween = reglTween(regl);

      positionBuffer = tween.buffer(points.from, { duration: 5000, ease: 'expo-in-out' });
			opacityVals = regl.buffer(Array.from({length: count}, () => 0.7));

      const render = tween({
        vert: `
      uniform mat4 uMatrix;
      uniform float pointSize;
      precision lowp float;
      attribute vec2 position;
			attribute float opacity;
			varying float fragOpacity;

      void main() {
        gl_PointSize = pointSize;
        gl_Position = uMatrix * vec4(position, 0, 1);
				fragOpacity = opacity;
      }
        `,
        frag: `
      precision lowp float;
			varying float fragOpacity;

      void main() {
        if (length(gl_PointCoord.xy - 0.5) > 0.5) {
          discard;
        }
        gl_FragColor = vec4(0.145, 0.627, 0.8, fragOpacity);
      }
      `,

        attributes: {
          position: positionBuffer,
					opacity: opacityVals
        },

        uniforms: {
          pointSize: regl.prop('pointSize') || 2,
          uMatrix: regl.prop('uMatrix')
        },

        blend: {
          enable: true,
          func: {
            srcRGB: 'src alpha',
            srcAlpha: 'src alpha',
            dstRGB: 'one minus src alpha',
            dstAlpha: 'one minus src alpha',
          },
        },

        depth: { enable: false },

        count: count,
        primitive: 'points'
      });
      
      return { render }
    }

    map.addLayer({
			id: 'custom_layer',
			type: 'custom',
			onAdd: (map, gl) => {
				scene = createScene(gl);
				regl.frame(() => {
					if (map && zoom) map.triggerRepaint();
				});
			},
			render: function(gl, matrix) {
				uMatrix = matrix;
				zoom = map.getZoom();
				scene.render({uMatrix, pointSize: scale(zoom)});
			}
		}, "place_suburb");
  }

	function getHighlighted(data, code, highlight) {
		return [1, 2, 3, 4, 5].map(i => data[code][`${highlight === "to" ? "from" : "to"}${i}cd`]);
	}

	function doSelect(e) {
		const code = typeof e === "string" ? e : e?.detail?.id;
		if (code) {
			selected = code;
			updateHighlight();
		}
	}

	function unSelect(e) {
		selected = null;
		highlighted = [];
		opacityVals({data: Array.from({length: points.array.length}, () => 0.7)});
		if (e) map.fitBounds(bounds);
	}

  function updatePos(newval) {
    if (pos !== newval) {
			positionBuffer.update(points[newval]);
    	pos = newval;
		}
  }

	function updateGeo(newval) {
    if (geo !== newval) {
    	geo = newval;
			if (selected && newval === "lad") {
				doSelect(metadata[selected].parentcd);
			} else {
				unSelect();
			}
		}
  }

	function updateHighlight(newval = highlight) {
		if (selected) {
			opacityVals({data: filter ?
				points.array.map(d => d[`${newval}_${geo}`] === selected ? 1 : 0.1) :
				Array.from({length: points.array.length}, () => 0.7)});
			highlighted = getHighlighted(data, selected, newval);
			highlight = newval;
			fitBounds([metadata[selected], ...highlighted.map(cd => metadata[cd])]);
		}
	}
</script>

<main class="container">
	<div class="info">
		<div class="grid">
			<button on:click={() => updateGeo("lad")} class:btn-active={geo === "lad"}>Local authorities</button>
			<button on:click={() => updateGeo("msoa")} class:btn-active={geo === "msoa"}>Neighbourhoods</button>
			{#each hovered ? [hovered] : selected ? [selected] : [] as code}
			<div class="big-text" style:grid-column="span 2">
				{metadata[code].areanm}
				{#if code === selected}<button on:click={unSelect} class="btn-link">Deselect</button>{/if}
			</div>
			<button on:click={() => updateHighlight("from")} class:btn-active={highlight === "from"}>
				Resident population
				<div class="big-text">{data[code].resident.toLocaleString()}</div>
			</button>
			<button on:click={() => updateHighlight("to")} class:btn-active={highlight === "to"}>
				Workday population
				<div class="big-text">{data[code].workday.toLocaleString()}</div>
				<div class="small-text">{(data[code].workday - data[code].resident).toLocaleString("en-GB", {signDisplay: "exceptZero"})}</div>
			</button>
			<div style:grid-column="span 2">
				{#if highlight === "from"}
				<BarChart data={[
					{category: "Works from home", value: data[code].home, color: 0},
					{category: `Works within ${metadata[code].areanm}`, value: data[code].within, color: 0},
					...[1, 2, 3, 4, 5].map(i => ({
						category: `Works in ${metadata[data[code][`to${i}cd`]].areanm}`,
						value: data[code][`to${i}`],
						color: 1
					})),
					{category: "Works in another location", value: data[code].toother, color: 2},
				]}/>
				{:else}
				<BarChart data={[
					{category: "Works from home", value: data[code].home, color: 0},
					{category: `Lives within ${metadata[code].areanm}`, value: data[code].within, color: 0},
					...[1, 2, 3, 4, 5].map(i => ({
						category: `Lives in ${metadata[data[code][`from${i}cd`]].areanm}`,
						value: data[code][`from${i}`],
						color: 1
					})),
					{category: "Lives in another location", value: data[code].fromother, color: 2},
				]}/>
				{/if}
			</div>
			<div style:grid-column="span 2">
				<label>
					<input type="checkbox" bind:checked={filter} on:change={() => updateHighlight()}/>
					Highlight points for this area on map
				</label>
			</div>
			{/each}
			{#if !selected && !hovered}
			<div class="big-text" style:grid-column="span 2">
				2011 Census travel to work data
			</div>
			<div style:grid-column="span 2">
				<p>Using this experimental tool, you can:</p>
				<ul>
					<li>animate commutes on a map, by clicking "place of work".</li>
					<li>see commutes for individual area, by hovering or clicking an area on the map.</li>
				</ul>
				<p>Note: The data in this tool is from 2011, not the latest 2021 census.</p>
			</div>
			{/if}
		</div>
	</div>

	<div class="map">
		<div class="map-legend">
			<button on:click={() => updatePos("from")} class:btn-active={pos === "from"}>Place of residence</button>
			<button on:click={() => updatePos("to")} class:btn-active={pos === "to"}>Place of work</button>
			<span>1 dot = 100 working people</span>
		</div>
		<Map bind:map
			style="https://bothness.github.io/ons-basemaps/data/style-dark.json"
			location={{bounds}}
			options={{antialias: true}}
			minzoom={6}
			controls
			on:load={init}>
			{#if mapSources[1].props.data}
			{#each mapSources as s}
			<MapSource
				id="{s.key}"
				type="{s.type}"
				promoteId="areacd"
				{...s.props}>
				<MapLayer
					id="{s.key}-fill"
					type="fill"
					paint={{
						"fill-color": "rgba(0,0,0,0)"
					}}
					order="water"
					hover bind:hovered
					select {selected} on:select={doSelect}
					highlight {highlighted}
					visible={geo === s.key}
					/>
				<MapLayer
					id="{s.key}-line"
					type="line"
					paint={{
						"line-color": '#555',
						"line-width": 0.5
					}}
					order="place_other"
					visible={geo === s.key}/>
				<MapLayer
					id="{s.key}-highlighted"
					type="line"
					paint={{
						"line-color": ['case',
							['==', ['feature-state', 'highlighted'], true], '#aaa',
							'rgba(0,0,0,0)'
						],
						"line-width": 1
					}}
					order="place_other"
					visible={geo === s.key}/>
				<MapLayer
					id="{s.key}-selected"
					type="line"
					paint={{
						"line-color": ['case',
							['==', ['feature-state', 'selected'], true], 'white',
							['==', ['feature-state', 'hovered'], true], 'white',
							'rgba(0,0,0,0)'
						],
						"line-width": ['case',
							['==', ['feature-state', 'selected'], true], 2.5,
							1
						]
					}}
					order="place_other"
					visible={geo === s.key}/>
			</MapSource>
			{/each}
			{/if}
		</Map>
	</div>
</main>

<style>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: row-reverse;
	}
	.map {
		position: relative;
		flex-grow: 10;
		min-width: 350px;
		height: 100vh;
	}
	.map-legend {
		position: absolute;
		z-index: 10;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,0.5);
		padding: 12px;
	}
	.map-legend > span {
		display: block;
		color: white;
		font-size: 12px;
	}
	.info {
		flex-grow: 1;
		min-width: 350px;
		max-width: 350px;
		min-height: 300px;
		padding: 12px
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 8px;
	}
	button {
		text-align: left;
		display: inline-flex;
		flex-direction: column;
	}
	.btn-active {
		border-color: white;
		outline: 2px solid white;
	}
	.btn-link {
		margin: 0;
		padding: 0;
		background: none;
		border: none;
		color: #27A0CC;
		font-size: 12px;
	}
	.btn-link:hover {
		text-decoration: underline;
	}
	.big-text {
		font-size: 1.8em;
		font-weight: bold;
		margin-top: -8px;
	}
	.small-text {
		font-size: 1rem;
		font-weight: default;
	}
</style>