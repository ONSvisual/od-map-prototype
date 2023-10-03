import { base } from "$app/paths";
import { csvParse, autoType } from 'd3-dsv';
import maplibre from "maplibre-gl";
import ckmeans from "ckmeans";
import { colors } from "./config";

// CORE FUNCTIONS
export function setColors(themes, theme) {
  for (let color in themes[theme]) {
    document.documentElement.style.setProperty('--' + color, themes[theme][color]);
  }
}

export function getMotion() {
  let mediaQuery = true; // window.matchMedia("(prefers-reduced-motion: reduce)"); // Check if browser prefers reduced motion
	return !mediaQuery || mediaQuery.matches ? false : true; // return true for motion, false for no motion
}

// PROJECT-SPECIFIC FUNCTIONS
export async function getData(url, fetch = window.fetch) {
  let response = await fetch(url);
  let string = await response.text();
  let data = csvParse(string, autoType);
  return data.sort((a, b) => a.areanm.localeCompare(b.areanm));
}

export const plot = (coord) => {
  const proj = maplibre.MercatorCoordinate.fromLngLat({ lng: coord[0], lat: coord[1] });
  return [proj.x, proj.y];
};

export const scaleLinear = (input, output) => (val) => {
  return val < input[0] ? output[0] :
    val > input[1] ? output[1] :
    ((val - input[0]) * ((output[1] - output[0]) / (input[1] - input[0]))) + output[0]; 
};

function getColor(value, breaks, colors) {
  for (let i = 0; i < breaks.length - 2; i ++) {
    if (value < breaks[i + 1]) return colors[i];
  }
  return colors[breaks.length - 2];
}

export async function getJourneys(code) {
  const path = `${base}/data/chunks/wu01ew_${code.slice(0, 8)}.csv`;
  const rows = csvParse(await (await fetch(path)).text(), autoType);
  const toData = rows.filter(d => d.from === code).filter(d => !["OD", "N9", "S9"].includes(d.to.slice(0, 2))).map(d => ({code: d.to, value: d.value}));
  const toVals = toData.filter(d => d.code !== code).map(d => d.value).sort((a, b) => a - b);
  const fromData = rows.filter(d => d.to === code).filter(d => !["OD", "N9", "S9"].includes(d.from.slice(0, 2))).map(d => ({code: d.from, value: d.value}));
  const fromVals = fromData.filter(d => d.code !== code).map(d => d.value).sort((a, b) => a - b);
  const data = {};
  data.toBreaks = [...ckmeans(toVals, 5).slice(0, 4), toVals[toVals.length - 1]];
  data.fromBreaks = [...ckmeans(fromVals, 5).slice(0, 4), fromVals[fromVals.length - 1]];
  data.to = toData.sort((a, b) => b.value - a.value).map(d => ({...d, color: getColor(d.value, data.toBreaks, colors.choro)}));
  data.from = fromData.sort((a, b) => b.value - a.value).map(d => ({...d, color: getColor(d.value, data.fromBreaks, colors.choro)}));
  data.toLookup = {};
  data.fromLookup = {};
  data.to.forEach(d => data.toLookup[d.code] = d.value);
  data.from.forEach(d => data.fromLookup[d.code] = d.value);
  return data;
}

const makeGeomCollection = (geometries = []) => ({type: "GeometryCollection", geometries});
const makePoint = (coordinates) => ({type: "Point", coordinates});
const makeLine = (coordinates) => ({type: "LineString", coordinates});
const avg = (val1, val2) => (val1 + val2) / 2;

export const makeOverlayGeom = (a = null, b = null) => {
  if (!a || !b || (a.x === b.x && a.y === b.y)) return {
    points: makeGeomCollection(),
    lines: makeGeomCollection(),
    midpoint: a ? [a.x, a.y] : null
  };
  const points = makeGeomCollection([makePoint([a.x, a.y]), makePoint([b.x, b.y])]);
  const lines = makeGeomCollection([makeLine([[a.x, a.y], [b.x, b.y]])]);
  const midpoint = [avg(a.x, b.x), avg(a.y, b.y)];
  return {points, lines, midpoint};
};