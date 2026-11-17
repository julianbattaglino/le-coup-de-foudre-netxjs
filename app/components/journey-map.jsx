"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MAP_SOURCES = {
  france: "https://raw.githubusercontent.com/BenPortner/geojson-atlas/main/geojson/natural_earth/countries/10m/FR-main.geojson",
  argentina: "https://raw.githubusercontent.com/BenPortner/geojson-atlas/main/geojson/natural_earth/countries/10m/AR.geojson",
  uruguay: "https://raw.githubusercontent.com/BenPortner/geojson-atlas/main/geojson/natural_earth/countries/10m/UY.geojson",
};

const LOCAL_MAP_SOURCES = {
  france: "/GeoJSON/france-regions.geojson",
  argentina: "/GeoJSON/argentina-provinces.geojson",
  uruguay: "/GeoJSON/uruguay-departments.geojson",
};

const mapCache = new Map();

const chapters = [
  {
    id: "france", country: "France", boundaryLabel: "Metropolitan regions", title: "The French chapter",
    text: "From the quiet rituals of Paris to the light of the Mediterranean.", map: "france",
    stops: [
      ["paris", "Paris", "Île-de-France", [2.3522, 48.8566], "eiffel", [5, 5], [-3.4, 4.3]],
      ["chantilly-senlis", "Chantilly & Senlis", "Hauts-de-France", [2.47, 49.19], "chateau", [0, -6], [-3.1, -7.2]],
      ["normandy", "Normandy", "Étretat", [0.23, 49.71], "cliffs", [-5, -3]],
      ["champagne", "Champagne", "Reims", [4.03, 49.26], "bottle", [5, 1]],
      ["loire-valley", "Loire Valley", "Centre-Val de Loire", [0.9, 47.4], "castle", [-5, 5]],
      ["burgundy", "Burgundy", "Dijon", [5.04, 47.32], "vineyard", [5, 5]],
      ["bordeaux", "Bordeaux", "Nouvelle-Aquitaine", [-0.58, 44.84], "wine", [-5, 6]],
      ["provence", "Provence", "Aix-en-Provence", [5.45, 43.53], "lavender", [-5, 5], [-4, -3]],
      ["saint-tropez", "Saint-Tropez", "Var", [6.64, 43.27], "sails", [0, 8], [3.2, 4.6]],
      ["french-riviera", "French Riviera", "Nice", [7.26, 43.7], "sun", [-7, -4], [2.5, -4]],
    ],
  },
  {
    id: "crossing", country: "Across the Atlantic", title: "A change of hemisphere",
    text: "From Paris airport, the journey arcs across the Atlantic towards Buenos Aires.", map: "globe", stops: [],
  },
  {
    id: "argentina", country: "Argentina", boundaryLabel: "Provinces", title: "The Argentine chapter",
    text: "A country of city nights, open grasslands, vineyards and vast southern horizons.", map: "argentina",
    stops: [
      ["buenos-aires", "Buenos Aires", "Ciudad de Buenos Aires", [-58.3816, -34.6037], "obelisk", [6, -2]],
      ["pampa", "The Pampas", "Buenos Aires Province", [-62.85, -36.35], "pampas", [6, 6]],
      ["mendoza", "Mendoza", "Mendoza Province", [-68.8458, -32.8895], "mountain", [-6, 3]],
      ["salta", "Salta", "Salta Province", [-65.4117, -24.7821], "cactus", [6, -2]],
      ["patagonia-andina", "Andean Patagonia", "Río Negro", [-71.308, -41.1335], "peaks", [-6, 5]],
      ["patagonia-atlantica", "Atlantic Patagonia", "Chubut", [-65.0385, -42.7692], "whale", [6, 6]],
    ],
  },
  {
    id: "uruguay", country: "Uruguay", boundaryLabel: "Departments", title: "The last, luminous stop",
    text: "Cross the Río de la Plata to José Ignacio, where the land opens onto the sea.", map: "uruguay",
    stops: [["jose-ignacio", "José Ignacio", "Maldonado", [-54.63, -34.84], "lighthouse", [6, -3]]],
  },
];

const stopsBySlug = Object.fromEntries(chapters.flatMap((chapter) => chapter.stops.map(([slug, title, region, point, landmark]) => [slug, { title, region, point, landmark }])));

function coordinateRings(geometry) {
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
}

function makeProjection(features) {
  const points = features.flatMap((feature) => coordinateRings(feature.geometry).flat());
  const latitude = points.reduce((total, [, lat]) => total + lat, 0) / points.length;
  const longitudeFactor = Math.cos((latitude * Math.PI) / 180);
  const xs = points.map(([lon]) => lon * longitudeFactor);
  const ys = points.map(([, lat]) => lat);
  const minX = Math.min(...xs); const maxX = Math.max(...xs);
  const minY = Math.min(...ys); const maxY = Math.max(...ys);
  const scale = Math.min(88 / (maxX - minX), 88 / (maxY - minY));
  const offsetX = (100 - (maxX - minX) * scale) / 2;
  const offsetY = (100 - (maxY - minY) * scale) / 2;
  return ([lon, lat]) => [offsetX + (lon * longitudeFactor - minX) * scale, 100 - offsetY - (lat - minY) * scale];
}

function pathForGeometry(geometry, project) {
  return coordinateRings(geometry).map((ring) => ring.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ") + " Z").join(" ");
}

function Landmark({ type }) {
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 0.9 };
  const marks = {
    eiffel: <path {...common} d="M-3 4 L0-5 L3 4 M-4 4 H4 M-1.7-.5 H1.7 M-2.5 1.8 H2.5" />,
    chateau: <path {...common} d="M-4 4 V-1 L-2.2-3.5 0-1 2.2-3.5 4-1 V4 Z M-4 4 H4 M-1 4 V1 H1 V4" />,
    cliffs: <path {...common} d="M-5 3 C-3 0-2 1 0-2 C2-4 3-1 5-4 M-5 4 H5" />,
    bottle: <path {...common} d="M-1.4-5 H1.4 V-2 L2.4 0 V4 H-2.4 V0 L-1.4-2 Z M-2.4 1 H2.4" />,
    castle: <path {...common} d="M-4 4 V-2 H-2 V-4 H0 V-2 H2 V-4 H4 V4 Z M-4 1 H4 M-1 4 V1 H1 V4" />,
    vineyard: <path {...common} d="M-4 4 L-2-3 M0 4 L0-4 M4 4 L2-3 M-4 1 H4" />,
    wine: <path {...common} d="M-2.3-5 H2.3 V-2.4 C2.3-.4 1.2.5 0 .5 C-1.2.5-2.3-.4-2.3-2.4 Z M0 .5 V3.5 M-2.5 3.5 H2.5" />,
    lavender: <path {...common} d="M0 4 V-3 M0-1.5 L-2-3 M0 .3 L2-2 M-3-3.4 L-1-4.3 M1-4.3 L3-3.4" />,
    sails: <path {...common} d="M0 4 V-5 M0-4 L3 2 H0 M-.5-2 L-3 2 H-.5 M-4 4 H4" />,
    sun: <><circle {...common} cx="0" cy="0" r="2.1" /><path {...common} d="M0-5 V-3.5 M0 3.5 V5 M-5 0 H-3.5 M3.5 0 H5 M-3.5-3.5 L-2.5-2.5 M2.5 2.5 L3.5 3.5" /></>,
    obelisk: <path {...common} d="M0-5 L2.2 4 H-2.2 Z M-3 4 H3" />,
    pampas: <path {...common} d="M-5 3 H5 M-2.5 3 V-4 M-2.5-2 L-4-3.5 M-2.5-1 L-1-3.5 M2 3 V-2 M2-1 L.5-2.7" />,
    mountain: <path {...common} d="M-5 4 L-1-3 1 0 3-4 5 4 Z M-1-3 L0-1" />,
    cactus: <path {...common} d="M0 4 V-5 M0-1 H-2 V-3 M0 1 H2 V-1 M-2 4 H2" />,
    peaks: <path {...common} d="M-5 4 L-2-3 0 0 2-4 5 4 Z M-2-3 L-1-1.5 M2-4 L3-1.5" />,
    whale: <path {...common} d="M-5 3 C-2 1 2 1 5 3 M0 3 C-.2-1-3-1-3-4 M0 3 C.2-1 3-1 3-4" />,
    lighthouse: <path {...common} d="M-2.5 4 L-1-3 H1 L2.5 4 Z M-2.5 4 H2.5 M-2-3 H2 M-4-1 H-2 M2-1 H4" />,
  };
  return <g className="journey-map__landmark">{marks[type]}</g>;
}

function GeographicMap({ chapter, activeStop, onStop, sourceMode, reduceMotion }) {
  const sourceKey = `${sourceMode}:${chapter.map}`;
  const sources = sourceMode === "local" ? LOCAL_MAP_SOURCES : MAP_SOURCES;
  const [map, setMap] = useState(mapCache.get(sourceKey));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    setFailed(false);
    if (mapCache.has(sourceKey)) { setMap(mapCache.get(sourceKey)); return undefined; }
    setMap(null);
    fetch(sources[chapter.map])
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Map unavailable")))
      .then((data) => { mapCache.set(sourceKey, data); if (live) setMap(data); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [chapter.map, sourceKey, sources]);

  const features = map?.features ?? [];
  const project = useMemo(() => features.length ? makeProjection(features) : null, [features]);
  const route = project ? chapter.stops.map(([, , , point]) => project(point).map((value) => value.toFixed(2)).join(" ")).join(" L ") : "";

  return <figure className="journey-map__geo-figure">
    <svg className={`journey-map__geographic journey-map__geographic--${chapter.id}`} viewBox="0 0 100 100" role="img" aria-label={`Administrative map of ${chapter.country}`}>
      {project && features.map((feature) => <path className="journey-map__territory" d={pathForGeometry(feature.geometry, project)} key={feature.id ?? feature.properties?.name} />)}
      {project && chapter.stops.length > 1 && <path className="journey-map__route" d={`M ${route}`} />}
      {project && chapter.stops.map(([slug, title, , point, landmark, [labelX, labelY], markerOffset = [0, 0]]) => {
        const [x, y] = project(point);
        const [markerX, markerY] = [x + markerOffset[0], y + markerOffset[1]];
        const isActive = activeStop === slug;
        const markerSize = sourceMode === "local" ? 3.25 : 4;
        const iconScale = sourceMode === "local" ? 0.76 : 1;
        return <g key={slug}>{(markerOffset[0] || markerOffset[1]) && <line className="journey-map__marker-connector" x1={x} y1={y} x2={markerX} y2={markerY} />}<g className={`journey-map__marker${isActive ? " is-active" : ""}`} transform={`translate(${markerX} ${markerY})`} role="button" tabIndex="0" aria-label={`View ${title}`} onClick={() => onStop(slug)} onKeyDown={(event) => event.key === "Enter" && onStop(slug)}>{isActive && <circle className="journey-map__marker-halo" r={markerSize + 1.6}>{!reduceMotion && <><animate attributeName="r" values={`${markerSize + 1};${markerSize + 3.3};${markerSize + 1}`} dur="1.7s" repeatCount="indefinite" /><animate attributeName="opacity" values=".74;0;.74" dur="1.7s" repeatCount="indefinite" /></>}</circle>}<circle r={markerSize} /><g transform={`scale(${iconScale})`}><Landmark type={landmark} /></g><text className="journey-map__city-label" x={labelX} y={labelY} textAnchor={labelX < 0 ? "end" : labelX > 0 ? "start" : "middle"}>{title}</text></g></g>;
      })}
      {!map && !failed && <text className="journey-map__map-status" x="50" y="50" textAnchor="middle">Drawing the map</text>}
      {failed && <text className="journey-map__map-status" x="50" y="50" textAnchor="middle">Map unavailable</text>}
    </svg>
    <figcaption>{chapter.boundaryLabel} · {sourceMode === "local" ? "Stored locally" : <a href="https://github.com/BenPortner/geojson-atlas" target="_blank" rel="noreferrer">Map data</a>}</figcaption>
  </figure>;
}

function Globe({ reduceMotion }) {
  const flightPath = "M50 153 C135 8 260 9 350 104";
  return <div className="journey-map__globe" aria-label="Flight from Paris to Buenos Aires" role="img"><div className="journey-map__globe-lines" /><div className="journey-map__globe-city journey-map__globe-city--paris">Paris</div><div className="journey-map__globe-city journey-map__globe-city--buenos">Buenos Aires</div><svg className="journey-map__flight" viewBox="0 0 400 220" aria-hidden="true"><path d={flightPath} /><g className="journey-map__plane"><path d="M-11 -3 L11 0 L-11 3 L-6 0 Z" />{!reduceMotion && <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" path={flightPath} />}</g></svg></div>;
}

export default function JourneyMap({ sourceMode = "remote" }) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const chapter = chapters[chapterIndex];
  const [activeStop, setActiveStop] = useState(chapters[0].stops[0][0]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const selected = activeStop ? stopsBySlug[activeStop] : null;
  const countrySlug = { france: "france", argentina: "argentina", uruguay: "uruguay" }[chapter.id];

  useEffect(() => { setActiveStop(chapter.stops[0]?.[0] ?? null); }, [chapter]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);
  const go = (change) => setChapterIndex((current) => Math.min(chapters.length - 1, Math.max(0, current + change)));

  return <main className={`journey-map${sourceMode === "local" ? " journey-map--local" : ""}`}>
    <section className="journey-map__hero"><h1>Follow the <em>journey.</em></h1><p>Seventeen places, connected by the moments that make a journey personal. Begin in France and travel south, one considered stop at a time.</p></section>
    <section className="journey-map__experience" aria-labelledby="journey-chapter-title">
      <div className="journey-map__topline"><span>{chapter.country}</span><span>{String(chapterIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span></div>
      <div className="journey-map__canvas">
        <div className="journey-map__chapter-copy"><h2 id="journey-chapter-title">{chapter.title}</h2><p>{chapter.text}</p></div>
        <div className="journey-map__visual">{chapter.map === "globe" ? <Globe reduceMotion={reduceMotion} /> : <GeographicMap chapter={chapter} activeStop={activeStop} onStop={setActiveStop} sourceMode={sourceMode} reduceMotion={reduceMotion} />}</div>
        {selected && <div className="journey-map__place"><span>{selected.region}</span><strong>{selected.title}</strong><Link href={`/destinations/${countrySlug}/${activeStop}`}>Discover this destination <i aria-hidden="true">↗</i></Link></div>}
      </div>
      <div className="journey-map__controls"><button type="button" onClick={() => go(-1)} disabled={!chapterIndex}>Previous</button><div className="journey-map__progress" aria-label={`Chapter ${chapterIndex + 1} of ${chapters.length}`}>{chapters.map((item, index) => <button type="button" className={index === chapterIndex ? "is-current" : ""} onClick={() => setChapterIndex(index)} aria-label={`Go to ${item.country}`} key={item.id} />)}</div><button type="button" onClick={() => go(1)} disabled={chapterIndex === chapters.length - 1}>Next</button></div>
      {chapter.stops.length > 1 && <div className="journey-map__stops" aria-label="Destinations in this chapter">{chapter.stops.map(([slug, title], index) => <button key={slug} className={slug === activeStop ? "is-active" : ""} onClick={() => setActiveStop(slug)}><span>{String(index + 1).padStart(2, "0")}</span>{title}</button>)}</div>}
    </section>
    {sourceMode === "local" && <nav className="journey-map__dock" aria-label="Journey chapters"><button type="button" onClick={() => go(-1)} disabled={!chapterIndex}>Previous</button><div>{chapters.map((item, index) => <button type="button" className={index === chapterIndex ? "is-current" : ""} onClick={() => setChapterIndex(index)} aria-label={`Go to ${item.country}`} key={item.id} />)}</div><button type="button" onClick={() => go(1)} disabled={chapterIndex === chapters.length - 1}>Next</button></nav>}
  </main>;
}
