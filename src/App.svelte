<script>
  import maplibre from "maplibre-gl";
  import reglLib from "regl";
  import reglTween from "regl-tween";
  import { csvParse, autoType } from "d3-dsv";
	import bbox from "@turf/bbox";
	import { Map, MapSource, MapLayer } from "@onsvisual/svelte-maps";
	import BarChart from "./components/BarChart.svelte";

	const bounds = [-7.5722, 49.9600, 1.6815, 58.6350];

	const plot = (coord) => {
    const proj = maplibre.MercatorCoordinate.fromLngLat({ lng: coord[0], lat: coord[1] });
    return [proj.x, proj.y];
  };

  let map, selected, hovered, highlighted, zoom;
  let regl, tween, scene, positionBuffer, opacityVals, uMatrix;
	let metadata, data;
  let points = {};
  let pos = "from";
	let highlight = "from";

  async function init() {
    const metadata_raw = await fetch("./data/area_metadata.csv");
    const metadata_array = csvParse(await metadata_raw.text());
    const metadata_indexed = {};
    metadata_array.forEach(d => metadata_indexed[d.areacd] = d);
		metadata = metadata_indexed;
		
    const data_raw = await fetch("./data/msoa_data.csv");
    const data_array = csvParse(await data_raw.text(), autoType);
    const data_indexed = {};
    data_array.forEach(d => data_indexed[d.areacd] = d);
		data = data_indexed;

    const points_raw = await fetch("./data/msoa_points.csv");
    points.array = csvParse(await points_raw.text(), autoType);
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
				scene.render({uMatrix, pointSize: zoom / 3});
			}
		})
  }

	function doSelect(e) {
		const code = e?.detail?.id;
		if (code) {
			selected = code;
			opacityVals({data: points.array.map(d => d[highlight] === code ? 0.9 : 0.1)});
			highlighted = [data[code].to1cd, data[code].to2cd, data[code].to3cd, data[code].to4cd, data[code].to5cd];
			const feature = e.detail.feature.toJSON();
			const bounds = bbox(feature);
			map.fitBounds(bounds, {padding: 200});
		}
	}

	function unSelect() {
		selected = null;
		highlighted = [];
		opacityVals({data: Array.from({length: points.array.length}, () => 0.7)});
	}

  function updatePos(newval) {
    if (pos !== newval) {
			positionBuffer.update(points[newval]);
    	pos = newval;
		}
  }

	function updateHighlight(newval) {
		if (selected && highlight !== newval) {
			opacityVals({data: points.array.map(d => d[newval] === selected ? 1 : 0.1)});
			highlight = newval;
		}
	}
</script>

<main class="container">
	<div class="info">
		{#each hovered ? [hovered] : selected ? [selected] : [] as code}
		<div class="big-text">
			{metadata[code].areanm}
			{#if code === selected}<span class="small-text"><button on:click={unSelect}>X</button></span>{/if}
		</div>
		<div class="grid">
			<button on:click={() => updateHighlight("from")} class:btn-active={highlight === "from"}>
				Resident population
				<div class="big-text">{data[code].resident.toLocaleString()}</div>
			</button>
			<button on:click={() => updateHighlight("to")} class:btn-active={highlight === "to"}>
				Workday population
				<div class="big-text">
					{data[code].workday.toLocaleString()}
					<span class="small-text">{(data[code].workday - data[code].resident).toLocaleString("en-GB", {signDisplay: "exceptZero"})}</span>
				</div>
			</button>
			<div style:grid-column="span 2">
				{#if highlight === "from"}
				<BarChart data={[
					{category: "Works from home", value: data[code].home},
					{category: `Works within ${metadata[code].areanm}`, value: data[code].within},
					{category: metadata[data[code].to1cd].areanm, value: data[code].to1},
					{category: metadata[data[code].to2cd].areanm, value: data[code].to2},
					{category: metadata[data[code].to3cd].areanm, value: data[code].to3},
					{category: metadata[data[code].to4cd].areanm, value: data[code].to4},
					{category: metadata[data[code].to5cd].areanm, value: data[code].to5},
					{category: "Works in another location", value: data[code].toother},
				]}/>
				{:else}
				<BarChart data={[
					{category: "Works from home", value: data[code].home},
					{category: `Lives within ${metadata[code].areanm}`, value: data[code].within},
					{category: metadata[data[code].from1cd].areanm, value: data[code].from1},
					{category: metadata[data[code].from2cd].areanm, value: data[code].from2},
					{category: metadata[data[code].from3cd].areanm, value: data[code].from3},
					{category: metadata[data[code].from4cd].areanm, value: data[code].from4},
					{category: metadata[data[code].from5cd].areanm, value: data[code].from5},
					{category: "Lives in another location", value: data[code].fromother},
				]}/>
				{/if}
			</div>
		</div>
		{/each}
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
			<MapSource
				id="msoa"
				type="vector"
				layer="msoa"
				promoteId="areacd"
				maxzoom={12}
				minzoom={6}
				url={"https://cdn.ons.gov.uk/maptiles/administrative/msoa/v2/boundaries/{z}/{x}/{y}.pbf"}>
				<MapLayer
					id="msoa-fill"
					type="fill"
					paint={{
						"fill-color": "rgba(0,0,0,0)"
					}}
					hover bind:hovered
					select {selected} on:select={doSelect}
					highlight {highlighted}/>
				<MapLayer
					id="msoa-line"
					type="line"
					paint={{
						"line-color": '#555',
						"line-width": 0.5
					}}/>
				<MapLayer
					id="msoa-highlight"
					type="line"
					paint={{
						"line-color": ['case',
							['==', ['feature-state', 'selected'], true], 'white',
							['==', ['feature-state', 'hovered'], true], 'white',
							['==', ['feature-state', 'highlighted'], true], '#aaa',
							'rgba(0,0,0,0)'
						],
						"line-width": ['case',
							['==', ['feature-state', 'selected'], true], 2,
							1
						]
					}}/>
			</MapSource>
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
	.map-legend > button {
		color: white;
		background-color: #333;
		border-color: #aaa;
	}
	.map-legend > button.btn-active {
		border-color: white;
		outline: 1px solid white;
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
	}
	.btn-active {
		border-color: black;
		outline: 1px solid black;
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