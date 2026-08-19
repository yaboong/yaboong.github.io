#!/usr/bin/env node
// Regenerates navlog/data/airports.json + airports.meta.json from OurAirports' public
// CSV mirror (public domain, no auth). Run this the same way locally and in CI
// (.github/workflows/update-airport-db.yml) — it's the exact same code path, so a local
// run is a real dry-run of what the scheduled job will do.
//
// Usage: node scripts/update-airport-db.mjs

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "data");
const AIRPORTS_CSV_URL = "https://davidmegginson.github.io/ourairports-data/airports.csv";
const RUNWAYS_CSV_URL = "https://davidmegginson.github.io/ourairports-data/runways.csv";

// US-only: OurAirports' surface/identifier data outside the US turned out to be far
// messier (inconsistent surface codes, ~2% of identifiers colliding between distinct
// airports) than the clean US snapshot this DB started as. Went global once, found real
// data-quality problems, scoped back down — see plan discussion. International users get
// a manual-entry mode in the app instead (state.meta.airportDb === "Global").
const KEEP_TYPES = new Set(["small_airport", "medium_airport", "large_airport", "seaplane_base"]);
const KEEP_COUNTRY = "US";

// refuse to write if the key count drops more than this vs. the previously committed
// file, or if any of these well-known airports fail to resolve — guards against a
// broken/partial upstream export silently corrupting the live DB
const MAX_DROP_RATIO = 0.10;
const SPOT_CHECK = ["KJFK", "KBOS", "KLCI"];

// ---- minimal RFC4180 CSV parser (quoted fields, embedded commas/quotes) ----
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift();
  return rows.map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

async function fetchCSV(url) {
  const res = await fetch(url, { headers: { "User-Agent": "yaboong.github.io airport-db updater" } });
  if (!res.ok) throw new Error(`fetch failed ${res.status}: ${url}`);
  return parseCSV(await res.text());
}

// OurAirports' "surface" column is free text sourced from many national databases —
// nowhere near as clean as the app's own SURF_NAMES codes (navlog/index.html). Map the
// common variants down to those codes; anything genuinely unrecognized is passed through
// as-is rather than guessed, since expandSurface() already falls back to showing the raw
// code for keys that aren't in SURF_NAMES (navlog/index.html ~line 1620).
function normalizeSurface(raw) {
  const s = (raw || "").trim().toUpperCase().replace(/[-\s](G|F|P)$/, "");
  if (!s || s === "X" || s === "N" || s === "UNK") return "UNK";
  if (/^(ASP|BIT|PEM)/.test(s)) return "ASP";
  if (/^(CON|PCC)/.test(s)) return "CON";
  if (/^(TURF|GRASS|SOD)/.test(s) || s === "GRS") return "TRF";
  if (/^(GRAVEL|GRVL|GVL)/.test(s)) return "GRV";
  if (/^(DIRT|EARTH|CLAY|SAND)/.test(s)) return "DRT";
  if (/^WAT/.test(s)) return "WAT";
  if (/^(MAT|PSP)/.test(s)) return "MAT";
  if (/^(SNOW|SNW|ICE)/.test(s)) return "SNW";
  if (s === "HARD" || s === "HRD" || s === "PAVED") return "HRD";
  return s;
}

function buildRunwayString(runways) {
  return runways
    .filter(r => r.closed !== "1")
    .flatMap(r => {
      const len = r.length_ft || "0";
      const surf = normalizeSurface(r.surface);
      const out = [];
      if (r.le_ident) out.push(`${r.le_ident}:${len}:${surf}`);
      if (r.he_ident) out.push(`${r.he_ident}:${len}:${surf}`);
      return out;
    })
    .join(",");
}

async function main() {
  const [airportRows, runwayRows] = await Promise.all([
    fetchCSV(AIRPORTS_CSV_URL),
    fetchCSV(RUNWAYS_CSV_URL),
  ]);

  const runwaysByIdent = new Map();
  for (const r of runwayRows) {
    if (!r.airport_ident) continue;
    if (!runwaysByIdent.has(r.airport_ident)) runwaysByIdent.set(r.airport_ident, []);
    runwaysByIdent.get(r.airport_ident).push(r);
  }

  const db = {};
  let airportCount = 0;
  for (const a of airportRows) {
    if (!KEEP_TYPES.has(a.type) || a.iso_country !== KEEP_COUNTRY) continue;
    const lat = parseFloat(a.latitude_deg);
    const lon = parseFloat(a.longitude_deg);
    if (Number.isNaN(lat) || Number.isNaN(lon)) continue;
    const elev = a.elevation_ft === "" ? null : Math.round(parseFloat(a.elevation_ft));

    const rwyString = buildRunwayString(runwaysByIdent.get(a.ident) || []);
    // 6 decimal places (~11cm) is already far more precision than VFR nav needs —
    // rounding here just strips the floating-point noise some source rows carry
    // (e.g. raw 42.5499992371) without losing anything a pilot could use.
    const entry = [elev, round6(lat), round6(lon), rwyString, a.name || ""];

    const idents = new Set([a.ident, a.icao_code, a.gps_code, a.local_code].filter(Boolean));
    if (idents.size === 0) continue;
    for (const id of idents) db[id] = entry;
    airportCount++;
  }

  // ---- safety gate: compare against whatever is currently committed ----
  const outPath = path.join(OUT_DIR, "airports.json");
  let prevCount = null;
  try {
    prevCount = Object.keys(JSON.parse(await readFile(outPath, "utf-8"))).length;
  } catch {
    // no previous file (first run) — nothing to compare against, skip the drop check
  }

  const newKeyCount = Object.keys(db).length;
  if (prevCount !== null && newKeyCount < prevCount * (1 - MAX_DROP_RATIO)) {
    throw new Error(
      `refusing to write: key count dropped from ${prevCount} to ${newKeyCount} ` +
      `(more than ${MAX_DROP_RATIO * 100}% — looks like a broken/partial upstream export)`
    );
  }
  for (const code of SPOT_CHECK) {
    const e = db[code];
    if (!e || typeof e[1] !== "number" || typeof e[2] !== "number") {
      throw new Error(`refusing to write: spot-check airport "${code}" missing or malformed`);
    }
  }

  // ---- write (sorted + one key per line so future diffs are per-airport, not one blob) ----
  const sortedKeys = Object.keys(db).sort();
  const lines = sortedKeys.map((k, i) =>
    `  ${JSON.stringify(k)}: ${JSON.stringify(db[k])}${i < sortedKeys.length - 1 ? "," : ""}`
  );
  await writeFile(outPath, "{\n" + lines.join("\n") + "\n}\n");

  const meta = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "OurAirports",
    recordCount: newKeyCount,
    airportCount,
  };
  await writeFile(path.join(OUT_DIR, "airports.meta.json"), JSON.stringify(meta, null, 2) + "\n");

  console.log(
    `airports: ${airportCount} airports, ${newKeyCount} keys` +
    (prevCount !== null ? ` (previously ${prevCount} keys)` : " (first run)")
  );
}

function round6(n) { return Math.round(n * 1e6) / 1e6; }

main().catch(err => { console.error(err); process.exit(1); });
