<script>
  import "@onsvisual/svelte-components/css/main.css";
  import reglLib from "regl";
  import reglTween from "$lib/vendor/regl-tween";
  import { bounds } from "$lib/config";
  import { scaleLinear, getJourneys } from "$lib/utils";
  import { Theme, Header, Hero, Highlight, Section, Grid, Select, Em, Scroller, ScrollerSection, Footer } from "@onsvisual/svelte-components";
	import { Map, MapSource, MapLayer } from "@onsvisual/svelte-maps";
  import MapLegend from "$lib/ui/MapLegend.svelte";
  import Icon from "$lib/ui/Icon.svelte";
	// import BarChart from "$lib/charts/BarChart.svelte";

  export let data;
  const { arealist, areadata, metadata, sources, points } = data;
  const count = points.array.length;
  const scale = scaleLinear([5, 14], [0.5, 4]);
  const colors = {
    work: [39, 160, 204],
    migration: [246, 96, 104],
  };

  let map, selected, hovered, highlighted, zoom, journeys;
  let regl, tween, scene, positionBuffer, opacityVals, uMatrix;
	let geo = "lad";
  let pos = "from";
	let highlight = "to";
	let filter = true;
  let color = colors.work;

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
    const createScene = gl => {
      regl = reglLib(gl);
      tween = reglTween(regl);

      positionBuffer = tween.buffer(points.from, { duration: 5000, ease: 'linear' });
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
          pointSize: scale(zoom) * window.devicePixelRatio,
          pointColor: color.map(c => c / 255),
        });
			}
		}, "place_suburb");
    
    updatePos("to", 60000);

    scrollers["work-scroller"] = null;
    scrollers["migration-scroller"] = null;
  }

	function getHighlighted(data, code, highlight) {
		return [1, 2, 3, 4, 5].map(i => data[code][`${highlight === "to" ? "from" : "to"}${i}cd`]);
	}

	async function doSelect(e) {
    console.log(e)
		const code = typeof e === "string" ? e : e?.detail?.id ? e?.detail?.id : e?.detail?.areacd;
		if (code) {
      journeys = await getJourneys(code);
			selected = code;
			updateHighlight();
		}
	}

	function unSelect(e) {
		selected = null;
    journeys = null;
		highlighted = [];
		opacityVals({data: Array.from({length: points.array.length}, () => 0.7)});
		if (e) map.fitBounds(bounds.ew);
	}

  function updatePos(newval, duration = 5000) {
    if (pos !== newval) {
			positionBuffer.update(points[newval], duration ? {duration} : null);
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
			highlighted = getHighlighted(areadata, selected, newval);
			highlight = newval;
			fitBounds([metadata[selected], ...highlighted.map(cd => metadata[cd])]);
		}
	}

  const actions = {
    "work-scroller": {
      "start": () => {
        color = colors.work;
        updatePos("from", 500);
        unSelect();
        map.fitBounds(bounds.ew);
      },
      "london": () => {
        updatePos("from");
        unSelect();
        map.fitBounds(bounds.london);
      },
      "work": () => {
        updatePos("to");
        unSelect();
        map.fitBounds(bounds.london);
      },
      "select": () => {
        updatePos("from", 1);
        unSelect();
        map.fitBounds(bounds.ew);
      },
      "westminster1": () => {
        updatePos("from");
        map.fitBounds(bounds.london);
      },
      "westminster2": () => {
        color = colors.work;
        updatePos("to");
        map.fitBounds(bounds.london);
      },
    },
    "migration-scroller": {
      "start": () => {
        color = colors.migration;
        updatePos("to", 1);
        unSelect();
        map.fitBounds(bounds.ew);
      },
      "filtered": () => {
        color = colors.migration;
        updatePos("to");
        unSelect();
        map.fitBounds(bounds.ew);
      },
      "origin": () => {
        color = colors.migration;
        updatePos("from");
        unSelect();
        map.fitBounds(bounds.ew);
      },
      "world": () => {
        color = colors.migration;
        updatePos("from");
        unSelect();
        map.fitBounds(bounds.world);
      },
    },
  };
  const runAction = (e) => {
    console.log(e);
    const action = actions?.[e.detail.id]?.[e.detail.sectionId];
    if (action) action();
  };

  let scrollers = {};
</script>

<Theme theme="dark" global >
  <div class="map">
    <Map bind:map
			style="https://bothness.github.io/ons-basemaps/data/style-dark.json"
			location={{bounds: bounds.midlands}}
			options={{antialias: true}}
      interactive={false}
			on:load={init}>
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
  <Header compact />

  <Hero
    id="hero"
    theme="dark"
    background="rgba(0,0,0,0.4)"
    title="Visualising people flows"
    lede="An interactive introduction to Census 2011 origin-destination data"
    date="2024-01-01"
  >
    <!-- <Checkbox label="Enable animation" variant="ghost" checked={animation} noBorder/> -->
  </Hero>

  <Highlight theme="dark" background="#333" marginBottom="{false}">
    <p>Origin-destination data shows the movement of people from one location to another, allowing us to explore things like migration and commuting patterns. It is sometimes known as "flow data".</p>
    <p>This interactive article is here to guide you through some of the origin-destination data published for Census 2011.</p>
  </Highlight>

  <Section theme="dark" background="#111" marginTop>
    <p>Skip to a section:</p>
    <ul class="inline-list">
      <li><a href="#workplace"><Icon type="arrow" rotation={90}/> Workplace flow data</a></li>
      <li><a href="#migration"><Icon type="arrow" rotation={90}/> Migration flow data</a></li>
      <li><a href="#explore"><Icon type="arrow" rotation={90}/> Explore the data</a></li>
    </ul>
  </Section>

  <Section theme="dark" background="#222" title="Workplace flow data" id="workplace" marginTop="{true}">
    <p>
      Workplace flow data represent usual residents aged 16 and over who were working in the week before the census. They show the location of workplaces in relation to an individual's usual residence.
    </p>
    <p>
      It should be noted that the Covid 19 pandemic means that the travel patterns in this data do not reflect a normal condition, yet interesting and relevant patterns can still be observed.
    </p>
  </Section>

  <Scroller
    id="work-scroller"
    bind:index={scrollers["work-scroller"]}
    on:change="{runAction}"
  >
    <div slot="background" class="transparent-block">
      <MapLegend data={journeys} {highlight} {metadata} {selected} bind:hovered/>
    </div>
    <div slot="foreground">
      <ScrollerSection id="start">
        <p>
          Each <Em color="rgb({colors.work.join(",")})">blue point</Em> on this map represents 100 working people aged 16 and over, positioned based on their place of residence.
        </p>
      </ScrollerSection>
      <ScrollerSection id="london">
        <p>
          Zooming in on <Em>Greater London</Em>, we can start to see the individual points more clearly.
        </p>
      </ScrollerSection>
      <ScrollerSection id="work">
        <p>
          By animating these points, we can see the approximate journey to work of each of these people, including those who work from home.
        </p>
      </ScrollerSection>
      <ScrollerSection id="select">
        <label for="select-workplace">
          Find your area to explore its workplace flow data.
        </label>
        <Select id="select-workplace" mode="search" options={arealist} idKey="areacd" labelKey="areanm" on:change={doSelect}/>
      </ScrollerSection>
      <ScrollerSection id="westminster1">
        <p>
          We can start to understand these flows better if we highlight the place of residence of all the people who work in <Em>Westminster</Em>.
        </p>
      </ScrollerSection>
      <ScrollerSection id="westminster2">
        <p>
          And then animate their journeys to work. Note that many of the {areadata["E09000033"].workday.toLocaleString()} people who work in Westminster travel from outside of Greater London.
        </p>
      </ScrollerSection>
    </div>
  </Scroller>

  <Highlight theme="dark" background="#333" marginBottom="{false}">
    <p>We can visualise migration flow data on a map in much the same way as workplace flow data.</p>
  </Highlight>

  <Section theme="dark" background="#222" title="Migration flow data" id="migration" marginTop>
    <p>
      Migration flow data shows the movement of residents who had a different address one year before Census Day. This includes migration both within the UK and from outside of the UK.
    </p>
  </Section>

  <Scroller
    id="migration-scroller"
    bind:index={scrollers["migration-scroller"]}
    on:change="{runAction}"
  >
    <div slot="background" class="transparent-block"/>
    <div slot="foreground">
      <ScrollerSection id="start">
        <p>
          Each <Em color="rgb({colors.migration.join(",")})">pink point</Em> on this map represents 100 people, positioned based on their place of residence on census day.
        </p>
      </ScrollerSection>
      <ScrollerSection id="filtered">
        <p>
          We can then filter these points to show only the people who lived at a different address 12 months before the census.
        </p>
      </ScrollerSection>
      <ScrollerSection id="origin">
        <p>
          And we can animate these points to show where they migrated from.
        </p>
      </ScrollerSection>
      <ScrollerSection id="world">
        <p>
          People who migrated from outside of England and Wales (including other parts of the UK) are randomly placed within their country of origin.
        </p>
      </ScrollerSection>
    </div>
  </Scroller>

  <Section theme="dark" title="Explore the data" id="explore" marginTop>
    <p>
      You can use this section to explore the data at your own leisure.
    </p>
  </Section>

  <Grid>
    <div class="transparent-block"/>
  </Grid>

  <Section theme="dark" title="About the data" marginTop>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </Section>

  <Footer theme="dark" compact />
</Theme>

<style>
  :global(body) {
    background: none !important;
  }
  .map {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .transparent-block {
    display: block;
    height: 100vh;
    width: 100%;
    background: none !important;
    pointer-events: none;
  }
  ul.inline-list {
    list-style: none;
    padding: 0;
  }
  ul.inline-list > li {
    display: inline-block;
    margin-right: 12px;
    white-space: nowrap;
  }
  :global(.ons-page__container, .ons-page__container--narrow) {
    overflow: visible !important;
  }
  :global(.ons-scroller-section) {
    overflow: visible !important;
  }
  :global(.ons-header__top) {
    background: #222 !important;
  }
  :global(.ons-page__container--tall-height) {
    background: none !important;
  }
  :global(svelte-scroller-outer) {
    pointer-events: none;
  }
  :global(.ons-scroller-section) {
    pointer-events: all;
  }
</style>