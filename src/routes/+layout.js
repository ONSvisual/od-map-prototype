import { csvParse, autoType } from "d3-dsv";
import { feature } from "topojson-client";
import { base } from "$app/paths";
import { mapSources } from "$lib/config";
import { plot } from "$lib/utils";

export const prerender = true;
export const trailingSlash = 'always';

export async function load({ fetch }) {
  let sources = JSON.parse(JSON.stringify(mapSources));
  let areadata, metadata;
  let points = {};

	const lad_geojson = feature(await (await fetch(`${base}/data/lad11_bsc.json`)).json(), "lad");
  const metadata_lad_raw = await (await fetch(`${base}/data/lad11_metadata.csv`)).text();
  const metadata_msoa_raw = await (await fetch(`${base}/data/msoa11_metadata.csv`)).text();
  const metadata_array = [
    ...csvParse(await metadata_lad_raw, autoType),
    ...csvParse(await metadata_msoa_raw, autoType)
  ]
    .map(d => ({...d, x: (d.xmin + d.xmax) / 2, y: (d.ymin + d.ymax) / 2}))
    .sort((a, b) => a.areanm.localeCompare(b.areanm));
  const metadata_indexed = {};
  metadata_array.forEach(d => metadata_indexed[d.areacd] = d);
  metadata = metadata_indexed;
  sources[1].props.data = lad_geojson;
  
  const data_lad_raw = await fetch(`${base}/data/lad11_data.csv`);
  const data_msoa_raw = await fetch(`${base}/data/msoa11_data.csv`);
  const data_array = [
    ...csvParse(await data_lad_raw.text(), autoType),
    ...csvParse(await data_msoa_raw.text(), autoType),
  ];
  const data_indexed = {};
  data_array.forEach(d => data_indexed[d.areacd] = d);
  areadata = data_indexed;

  const points_raw = await fetch(`${base}/data/msoa11_points.csv`);
  points.array = csvParse(await points_raw.text(), (d) => {
    return {
      from_msoa: d.from, from_lad: metadata[d.from]?.parentcd || d.from,
      to_msoa: d.to, to_lad: metadata[d.to]?.parentcd || d.to,
      x1: +d.x1, y1: +d.y1, x2: +d.x2, y2: +d.y2
    };
  });
  
  points.from = points.array.map(d => plot([d.x1, d.y1]));
  points.to = points.array.map(d => plot([d.x2, d.y2]));

  const quads_raw = await fetch(`${base}/data/quads.csv`);
  const quads = {
    type: "GeometryCollection",
    geometries: csvParse(await quads_raw.text(), (d) => {
      return {
        type: "Point",
        coordinates: [+d.lng, +d.lat]
      };
    })
  };

  return { arealist: metadata_array, areadata, metadata, sources, points, quads };
}