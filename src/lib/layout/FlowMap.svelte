<script>
  import reglLib from "regl";
  import reglTween from "$lib/vendor/regl-tween";
  import { base } from "$app/paths";
  import { bounds } from "../config";
  import { scaleLinear, getJourneys, makeOverlayGeom } from "../utils";
  import maplibre from "maplibre-gl";
  import { Map, MapSource, MapLayer } from "@onsvisual/svelte-maps";
  import InfoPalette from "./InfoPalette.svelte";
  import BreaksPalette from "./BreaksPalette.svelte";

  const scale = scaleLinear([5, 14], [0.5, 4]);
  const colors = {
    work: [39, 160, 204],
    migration: [246, 96, 104],
  };

  export let data;
  export let map = null;
  export let selected;
  export let hovered;
  export let highlighted;
  export let journeys;
	export let geo = "lad";
  export let pos = "from";
	export let highlight = null;
	export let filter = true;
  export let color = colors.work;
  export let pixelRatio = 1;

  export let interactive = true;
  export let showInfo = true;
  export let showBreaks = true;

  let sources, points, count, zoom, tooltip;
  let regl, tween, scene, positionBuffer, opacityVals, uMatrix;

  let overlayGeom = makeOverlayGeom();

  function init() {
    sources = data.sources;
    points = data.points;
    count = points.array.length

    // Define function to create REGL WebGL dots layer
    const createScene = gl => {
      regl = reglLib(gl);
      tween = reglTween(regl);

      positionBuffer = tween.buffer(points[pos], { duration: 5000, ease: 'linear' });
			opacityVals = regl.buffer(Array.from({length: count}, () => 0.7));

      const render = tween({
        vert: `
      precision lowp float;
      uniform mat4 uMatrix;
      uniform float pointSize;
      uniform vec3 pointColor;
      attribute vec2 position;
			attribute float opacity;
			varying vec4 fragColor;

      void main() {
        gl_PointSize = pointSize;
        gl_Position = uMatrix * vec4(position, 0, 1);
        fragColor = vec4(pointColor, opacity);
      }
        `,
        frag: `
      precision lowp float;
			varying vec4 fragColor;

      void main() {
        if (length(gl_PointCoord.xy - 0.5) > 0.5) {
          discard;
        }
        gl_FragColor = fragColor;
      }
      `,

        attributes: {
          position: positionBuffer,
					opacity: opacityVals
        },

        uniforms: {
          pointSize: regl.prop('pointSize') || 2,
          pointColor: regl.prop('pointColor'),
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

    // Limit Maplibre pixel ratio to 1.5 to improve performance on retina devices
    pixelRatio = window.devicePixelRatio > 1.5 ? 1.5 : window.devicePixelRatio;
    map.setPixelRatio(pixelRatio);

    // Add REGL custom dots layer to Maplibre map
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
				scene.render({
          uMatrix,
          pointSize: scale(zoom) * pixelRatio,
          pointColor: color.map(c => c / 255),
        });
			}
		}, "place_suburb");

    map.on("moveend", () => {if (!selected) setGeoType()});

    tooltip = new maplibre.Popup({
      closeButton: false,
      closeOnClick: false
    });
  }

  let _highlight = highlight;
  function updateHighlight(highlight = _highlight) {
		if (selected) {
			opacityVals({data: filter ?
				points.array.map(d => !highlight || d[`${highlight === "to" ? "from" : "to"}_${geo}`] === selected ? 1 : 0.01) :
				Array.from({length: points.array.length}, () => 0.7)});
			// highlighted = getHighlighted(areadata, selected, newval);
			_highlight = highlight;
		}
	}
  $: updateHighlight(highlight);

  let _interactive = interactive;
  function toggleInteractivity(interactive) {
    const handlers = [
      "boxZoom",
      "doubleClickZoom",
      "dragPan",
      "dragRotate",
      "keyboard",
      "scrollZoom",
      "touchPitch",
      "touchZoomRotate"
    ];
    if (_interactive !== interactive) {
      for (const handler of handlers) {
        if (map && interactive) map[handler].enable();
        else if (map) map[handler].disable();
      }
      _interactive = interactive;
    }
  }
  $: toggleInteractivity(interactive);

  let _pos = pos;
  function updatePos(pos, duration = 5000) {
    if (_pos !== pos) {
			positionBuffer.update(points[pos], duration ? {duration} : null);
    	_pos = pos;
		}
  }
  $: updatePos(pos);

  function getMaxBounds(journeys) {
    const from = journeys.from.slice(0, journeys.from.map(j => j.color).indexOf("rgba(255,255,255,0.1)"));
    const to = journeys.to.slice(0, journeys.from.map(j => j.color).indexOf("rgba(255,255,255,0.1)"));
    const codes = Array.from(new Set([...from.map(d => d.code), ...to.map(d => d.code)]));
    const bounds = codes.map(code => {
      const d = data.metadata[code];
      return [d.xmin, d.ymin, d.xmax, d.ymax];
    }).reduce((a, b) => [
      Math.min(a[0], b[0]),
      Math.min(a[1], b[1]),
      Math.max(a[2], b[2]),
      Math.max(a[3], b[3])]);
    return bounds;
  }

  async function doSelect(e) {
    const code = typeof e === "string" ? e : e?.detail?.id || e?.detail?.areacd;
    console.debug("select", e, code);

    if (code) {
      journeys = await getJourneys(code);
      selected = code;
      geo = ["E02", "W02"].includes(code.slice(0, 3)) ? "msoa" : "lad";
      updateHighlight();
      const bbox = getMaxBounds(journeys);
      map.fitBounds(bbox, {padding: 20});
    }
  }

  async function unSelect() {
    selected = null;
    journeys = null;
    updateHighlight();
    setGeoType();
  }

  function doHover(e) {
    const code = typeof e === "string" ? e : e?.detail?.id || e?.detail?.areacd;
    overlayGeom = selected && highlight ?
      makeOverlayGeom(data.metadata?.[selected], data.metadata?.[code]) :
      makeOverlayGeom();
    console.log(overlayGeom.points);
    if (overlayGeom.midpoint) {
      const sel = data.metadata[selected].areanm;
      const hov = data.metadata[hovered].areanm;
      let content;
      if (hov === sel) {
        const d = data.areadata[selected];
        content = `<b>Within ${sel}</b><br/>${d.within.toLocaleString()} internal trips<br/>${d.home.toLocaleString()} work from home`
      } else {
        const count = highlight === "to" ? journeys.toLookup[hovered] || 0 : journeys.fromLookup[hovered] || 0;
        content = `<b>${highlight === "to" ? `${sel} &rarr; ${hov}` : `${hov} &rarr; ${sel}`}</b><br/>${count.toLocaleString()} trips`;
      }
      tooltip.setLngLat(overlayGeom.midpoint).setHTML(content).addTo(map);
    } else {
      tooltip.remove();
    }
  }

  function setGeoType() {
    const features = map?.queryRenderedFeatures({ layers: ["quads"] });
    if (Array.isArray(features)) {
      const count = features.length;
      const canvas = map.getCanvas();
      const pixelArea = canvas.clientWidth * canvas.clientHeight;
      geo = (count * 1e6) / pixelArea > 40 ? "lad" : "msoa";
    }
  }
</script>

<div class="map">
  <slot/>
  {#if showInfo}
  <InfoPalette {data} {selected} {hovered} {highlight} on:change={doSelect} on:clear={unSelect}/>
  {/if}
  {#if showBreaks && highlight}
  <BreaksPalette {data} {journeys} {selected} {highlight} bind:hovered on:hover={doHover}/>
  {/if}
  <Map bind:map
    style="{base}/data/style.json"
    location={{bounds: bounds.ew}}
    options={{antialias: true}}
    {interactive}
    controls={interactive}
    on:load={init}>
    <MapSource
      id="quads"
      type="geojson"
      data={data.quads}>
      <MapLayer
        id="quads"
        type="circle"
        paint={{"circle-radius": 1, "circle-color": "rgba(0,0,0,1)"}}/>
    </MapSource>
    {#if sources[1].props.data}
    {#each sources as s}
    <MapSource
      id="{s.key}"
      type="{s.type}"
      promoteId="areacd"
      {...s.props}>
      <MapLayer
        id="{s.key}-fill"
        type="fill"
        data={journeys && highlight ? journeys[highlight] : []}
        idKey="code"
        paint={{
          "fill-color": ['case',
            ['!=', ['feature-state', 'color'], null], ['feature-state', 'color'],
            'rgba(0, 0, 0, 0)'
          ],
          "fill-opacity": 0.7
        }}
        order="place_suburb"
        hover bind:hovered
        on:hover={doHover}
        select {selected} on:select={doSelect}
        highlight {highlighted}
        visible={geo === s.key}
        />
      <MapLayer
        id="{s.key}-line"
        type="line"
        paint={geo === s.key ? {"line-color": '#555', "line-width": 0.5} : {"line-color": '#777', "line-width": 0.75}}
        order="place_other"
        visible={s.key === "lad" || geo === s.key}/>
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
    <MapSource
      id="overlay-lines"
      type="geojson"
      data={overlayGeom.lines}>
      <MapLayer
        id="overlay-lines"
        type="line"
        paint={{
          "line-color": 'white',
          "line-width": 1
        }}
        order="place_other"/>
    </MapSource>
    <MapSource
      id="overlay-points"
      type="geojson"
      data={overlayGeom.points}>
      <MapLayer
        id="overlay-points"
        type="circle"
        paint={{
          "circle-color": 'white',
          "circle-radius": 3
        }}
        order="place_other"/>
    </MapSource>
    {/if}
  </Map>
</div>

<style>
  .map {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .map :global(.maplibregl-popup-content) {
    background: black;
    padding: 4px 8px;
    pointer-events: none;
  }
  .map :global(.maplibregl-popup-tip) {
    border-top-color: black;
  }
</style>