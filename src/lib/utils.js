import { base } from "$app/paths";
import { csvParse, autoType } from 'd3-dsv';
import maplibre from "maplibre-gl";

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

export async function getJourneys(code) {
  const path = `${base}/data/chunks/wu01ew_${code.slice(0, 8)}.csv`;
  const rows = csvParse(await (await fetch(path)).text(), autoType);
  const data = {};
  data.to = rows.filter(d => d.to === code).map(d => ({code: d.from, value: d.value})).sort((a, b) => b.value - a.value).slice(0, 100);
  data.from = rows.filter(d => d.from === code).map(d => ({code: d.to, value: d.value})).sort((a, b) => b.value - a.value).slice(0, 100);
  console.log(data);
  return data;
}