// ANALYTICS CONFIG
export const analyticsId = "GTM-MBCBVQS";

export const analyticsProps = {
	"contentTitle": "Product title", // Insert the title of the product here
	"releaseDate": "YYYYMMDD",
	"contentType": "content-type", // Optional: eg. scrollytelling, exploratory, edutainment?
	"outputSeries": "url-slug-for-output-series" // Should match the slug for the release on CMS
};

// CORE CONFIG
export const themes = {
  'light': {
    'text': '#222',
    'muted': '#777',
    'pale': '#f0f0f0',
    'background': '#fff'
  },
  'dark': {
    'text': '#fff',
    'muted': '#bbb',
    'pale': '#333',
    'background': '#222'
  },
  'lightblue': {
    'text': '#206095',
    'muted': '#707070',
    'pale': '#f0f0f0',
    'background': 'rgb(188, 207, 222)'
  }
}

// PROJECT-SPECIFIC CONFIG
export const bounds = {
  initial: [-3, 51.5, 0, 53],
  ew: [-6.3603, 49.8823, 1.7637, 55.8112],
  midlands: [-2.20688, 52.34774, -1.42394, 52.66273],
  london: [-0.51028, 51.28676, 0.33402, 51.69188],
  world: [-180, -55, 180, 75],
};

export const mapSources = [
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
