<script>
  import { onMount } from "svelte";
  import maplibre from "maplibre-gl";
  import reglLib from "regl";
  import reglTween from "regl-tween";
  import { csvParse, autoType } from "d3-dsv";

  const plot = (coords) => {
    const proj = maplibre.MercatorCoordinate.fromLngLat({ lng: coords[0], lat: coords[1] });
    return [proj.x, proj.y];
  };

  let el;
  let map;
  let regl, tween, scene, positionBuffer, uMatrix, zoom;
  let points = {};

  async function init() {
    const metadata_raw = await fetch("./data/area_metadata.csv");
    const metadata_array = csvParse(await metadata_raw.text());
    const metadata = {};
    metadata_array.forEach(d => metadata[d.areacd] = d);

    const data_raw = await fetch("./data/msoa_points.csv");
    const data = csvParse(await data_raw.text(), autoType);
    const count = data.length;
    
    points.from = data.map(d => plot([d.x1, d.y1]));
    points.to = data.map(d => plot([d.x2, d.y2]));
    map = new maplibre.Map({
      container: el,
      style: 'https://bothness.github.io/ons-basemaps/data/style-dark.json',
      zoom: 4,
      center: [0, 53],
      antialias: true
    });
    map.addControl(new maplibre.NavigationControl());

    const createScene = gl => {
      regl = reglLib(gl);
      tween = reglTween(regl);

      positionBuffer = tween.buffer(points.from, { duration: 2000, ease: 'expo-in-out' });

      const render = tween({
        vert: `
      uniform mat4 uMatrix;
      uniform float pointSize;
      precision lowp float;
      attribute vec2 position;

      void main() {
        gl_PointSize = pointSize;
        gl_Position = uMatrix * vec4(position, 0, 1);
      }
        `,
        frag: `
      precision lowp float;
      void main() {
        if (length(gl_PointCoord.xy - 0.5) > 0.5) {
          discard;
        }
        gl_FragColor = vec4(0.8, 0.8, 0.8, 0.5);
      }
      `,

        attributes: {
          position: positionBuffer
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

    map.on('style.load', () => {
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
          scene.render({uMatrix, pointSize: zoom / 4});
        }
      })
    })
  }

  let pos = "from";
  function updateBuffer() {
    pos = pos === "from" ? "to" : "from";
    positionBuffer.update(points[pos]);
  }

  onMount(init);
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@3.3.0/dist/maplibre-gl.css"/>
</svelte:head>

<button on:click={updateBuffer}>Update positions</button>

<div id="map" bind:this={el}/>

<style>
  #map {
    width: 100%;
    height: 500px;
  }
  #map :global(button) {
    margin: 0;
  }
</style>