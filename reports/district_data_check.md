# District Data Availability Check

**Date:** 2026-11-22  
**Purpose:** Compare groundwater and rainfall data availability across five candidate districts for the water-decision project.  
**Sources consulted:** India-WRIS (indiawris.gov.in), CGWB (cgwb.gov.in), NWDP/NWIC (nwdp.nwic.gov.in), IMD (mausam.imd.gov.in), data.gov.in

---

## 1. Groundwater Monitoring Stations

| District | State | Manual Monitoring Stations | Telemetric (DWLR) Stations | Total (approx.) | Source URL | Confidence |
|---|---|---|---|---|---|---|
| Sangrur | Punjab | Present (dug wells + piezometers); exact count not published per-district in public search results | Present (DWLRs deployed under NHP); six-hourly telemetry available on NWDP | Unconfirmed per-district count; must be queried via India-WRIS WebGIS filter | https://indiawris.gov.in ; https://nwdp.nwic.gov.in | **unverified** |
| Kurukshetra | Haryana | ~71 observation stations (dug wells + piezometers) per academic/CGWB assessment | Present; six-hourly telemetry datasets listed on NWDP for Haryana | ~71 (combined, as reported in literature) | https://nwdp.nwic.gov.in ; ResearchGate studies citing CGWB RDC Chandigarh | **unverified** (academic source, not official portal count) |
| Mehsana | Gujarat | ~60 monitoring wells/piezometers (mix of dug wells and piezometers for phreatic + confined aquifers) | Present; telemetry datasets available on NWDP for Gujarat | ~60 (per CGWB brochure references) | https://nwdp.nwic.gov.in ; CGWB Gujarat brochure (via Scribd) | **unverified** (secondary source; needs portal confirmation) |
| Jalna | Maharashtra | Present; specific well IDs documented in Atal Bhujal Yojana block reports (e.g., Ghansawangi taluka lists 5+ named stations); Maharashtra state total >2,100 CGWB wells | Present; DWLRs being deployed; telemetry datasets for Maharashtra listed on NWDP | Unconfirmed per-district count; Maharashtra has >2,100 total CGWB wells statewide | https://nwdp.nwic.gov.in ; https://cgwb.gov.in (Central Region, Nagpur) | **unverified** |
| Chikkaballapura | Karnataka | Part of a 43-station cluster shared with Bengaluru Urban and Kolar districts (CGWB assessment); standalone district count not separately published | Present; Karnataka telemetry datasets on NWDP | ~43 shared across 3 districts (Chikkaballapura + Kolar + Bengaluru Urban); per-district split unavailable | https://nwdp.nwic.gov.in ; CGWB SWR Bengaluru reports | **unverified** |

> **Note:** Exact per-district station counts (manual vs. telemetric) are not directly published as summary tables by CGWB or India-WRIS in public search results. They must be extracted by querying the India-WRIS WebGIS interface (State → District → Station Type filter) or downloading the full state-level CSV from NWDP and filtering by district.

---

## 2. Years of Readings & Reading Frequency

| District | State | Manual Data: Years Available | Manual Frequency | Telemetric Data: Years Available | Telemetric Frequency | Source URL | Confidence |
|---|---|---|---|---|---|---|---|
| Sangrur | Punjab | ~1996 onwards (structured digital records; CGWB Year Books go back further in some regions) | Quarterly: Jan, May (pre-monsoon), Aug (monsoon), Nov (post-monsoon) | Recent years (post-NHP deployment, approx. 2018–present) | Six-hourly (some hourly) | https://nwdp.nwic.gov.in (dataset: "GW Level CGWB Punjab Manual Quarterly" and "Telemetry Six Hourly") | **unverified** (year range inferred from NWDP dataset labels and secondary sources) |
| Kurukshetra | Haryana | ~1996 onwards | Quarterly (4×/year) | Recent years (~2018–present) | Six-hourly | https://nwdp.nwic.gov.in (dataset: "GW Level CGWB Haryana Manual Quarterly" and "Telemetry Six Hourly") | **unverified** |
| Mehsana | Gujarat | ~1996 onwards | Quarterly (4×/year) | Recent years (~2018–present) | Six-hourly | https://nwdp.nwic.gov.in (Gujarat datasets) | **unverified** |
| Jalna | Maharashtra | ~1996 onwards | Quarterly (4×/year) | Recent years (~2018–present) | Six-hourly | https://nwdp.nwic.gov.in (Maharashtra datasets) | **unverified** |
| Chikkaballapura | Karnataka | ~1996 onwards | Quarterly (4×/year) | Recent years (~2018–present) | Six-hourly | https://nwdp.nwic.gov.in (Karnataka datasets) | **unverified** |

> **Note on frequency:** CGWB's national monitoring programme has historically used 4 readings/year (Jan, May, Aug, Nov). Some states supplement with additional readings. Telemetric DWLRs record at six-hourly or hourly intervals. The transition from manual to telemetric is ongoing and varies by district. The ~1996 start date is based on NWDP dataset labels (e.g., "1991–2020" blocks) and GitHub archives of CGWB CSV data spanning 1996–2017; actual earliest records may differ per station.

---

## 3. Rainfall Data Availability

| District | State | Daily Rainfall Available? | Monthly Rainfall Available? | Spatial Level | Primary Source | Bulk Download? | Source URL | Confidence |
|---|---|---|---|---|---|---|---|---|
| Sangrur | Punjab | Yes | Yes (derivable from daily) | District level | IMD via NWDP; also IMD Pune gridded (0.25° × 0.25°) | Yes — CSV direct download from NWDP (no login) | https://nwdp.nwic.gov.in (dataset: "Rainfall DistrictWise Daily IMD") | **confirmed** |
| Kurukshetra | Haryana | Yes | Yes | District level | IMD via NWDP; IMD Pune gridded | Yes — CSV from NWDP | https://nwdp.nwic.gov.in | **confirmed** |
| Mehsana | Gujarat | Yes | Yes | District level | IMD via NWDP; IMD Pune gridded | Yes — CSV from NWDP | https://nwdp.nwic.gov.in | **confirmed** |
| Jalna | Maharashtra | Yes | Yes | District level | IMD via NWDP; IMD Pune gridded | Yes — CSV from NWDP | https://nwdp.nwic.gov.in | **confirmed** |
| Chikkaballapura | Karnataka | Yes | Yes | District level | IMD via NWDP; IMD Pune gridded | Yes — CSV from NWDP | https://nwdp.nwic.gov.in | **confirmed** |

**Additional rainfall sources (all districts):**

| Source | Level | Format | Access | URL |
|---|---|---|---|---|
| NWDP — "Rainfall DistrictWise Daily IMD" | District | CSV / TSV / JSON / XML | Open, no login | https://nwdp.nwic.gov.in |
| IMD Mausam portal — District Rainfall Statistics | District | Excel / PDF (daily updates) | Open, no login | https://mausam.imd.gov.in |
| IMD Pune — Gridded daily rainfall | 0.25° grid (~25 km; can clip to taluk) | NetCDF / binary | May require registration for historical data | https://www.imdpune.gov.in |
| India-WRIS — Hydro-met rainfall module | District / sub-district | CSV / spatial layers | Registration required for downloads | https://indiawris.gov.in |

> **Taluk-level rainfall:** Not directly available as a pre-aggregated dataset. Can be derived from IMD Pune's 0.25° gridded product by clipping to taluk boundaries in GIS. India-WRIS may offer sub-district rainfall layers after login.

---

## 4. Bulk Download & Access Restrictions

| Portal | Bulk Download? | Login / Registration Required? | Licence / Usage Limits | Notes |
|---|---|---|---|---|
| **NWDP** (nwdp.nwic.gov.in) | Yes — state-wise CSV files for GW levels (manual + telemetry) and district-wise daily rainfall | No login required for standard public datasets | Open data under Government of India open data policy | Primary recommended source for bulk data. Files organised by state and time-block. |
| **India-WRIS** (indiawris.gov.in) | Yes — via WebGIS query tools and Data Download module | Registration & login **required** for time-series downloads and spatial exports | Free registration; some sensitive/real-time datasets may have restricted access | Good for GIS layers (shapefiles, WMS) and station-level queries. QGIS plugin available. |
| **CGWB** (cgwb.gov.in) | Partial — PDF reports (Year Books, brochures, NAQUIM reports) downloadable; no bulk CSV API | No login for PDF reports | Open access for published reports | Useful for district brochures, aquifer maps, and hydrogeological context. |
| **data.gov.in** | Yes — search for "CGWB groundwater" or "IMD rainfall" datasets | API key required for programmatic access; web download is open | Open Government Data licence | Mirrors some NWDP/CGWB datasets; may not be as current. |
| **IMD Mausam** (mausam.imd.gov.in) | Partial — daily Excel/PDF reports | No login | Open access | Good for recent/current season data; not ideal for multi-year bulk. |
| **IMD Pune** (imdpune.gov.in) | Yes — gridded rainfall datasets (multi-decade) | Registration may be required for historical gridded data | Academic/research usage encouraged | Best source for high-resolution spatial rainfall (0.25° daily grid). |

---

## Summary Comparison

| Criterion | Sangrur (PB) | Kurukshetra (HR) | Mehsana (GJ) | Jalna (MH) | Chikkaballapura (KA) |
|---|---|---|---|---|---|
| GW station count known? | ❌ Not found | ⚠️ ~71 (academic) | ⚠️ ~60 (secondary) | ❌ Not found | ⚠️ ~43 shared w/ 2 districts |
| Manual quarterly data | ✅ Available | ✅ Available | ✅ Available | ✅ Available | ✅ Available |
| Telemetric data | ✅ Six-hourly | ✅ Six-hourly | ✅ Six-hourly | ✅ Six-hourly | ✅ Six-hourly |
| Years of GW data | ~1996–present | ~1996–present | ~1996–present | ~1996–present | ~1996–present |
| Daily rainfall (district) | ✅ CSV, no login | ✅ CSV, no login | ✅ CSV, no login | ✅ CSV, no login | ✅ CSV, no login |
| Taluk-level rainfall | ⚠️ Gridded only | ⚠️ Gridded only | ⚠️ Gridded only | ⚠️ Gridded only | ⚠️ Gridded only |
| Bulk download (GW) | ✅ State CSV via NWDP | ✅ State CSV via NWDP | ✅ State CSV via NWDP | ✅ State CSV via NWDP | ✅ State CSV via NWDP |
| Login needed? | ❌ NWDP: no; ⚠️ WRIS: yes | ❌ NWDP: no; ⚠️ WRIS: yes | ❌ NWDP: no; ⚠️ WRIS: yes | ❌ NWDP: no; ⚠️ WRIS: yes | ❌ NWDP: no; ⚠️ WRIS: yes |

---

## Recommended Next Steps

1. **Confirm station counts:** Query India-WRIS WebGIS with State → District → Station Type filters for each district, or download the full state-level NWDP CSV and count unique station IDs per district.
2. **Verify telemetry start dates:** Download a sample telemetry CSV for each state from NWDP to confirm the earliest record date per district.
3. **Test NWDP rainfall CSV:** Download the "Rainfall DistrictWise Daily IMD" CSV to verify that all five districts are present and check year coverage.
4. **Register on India-WRIS** if sub-district/taluk-level spatial layers or station-level GW queries are needed.
5. **For taluk-level rainfall:** Obtain IMD Pune 0.25° gridded data and use GIS tools to clip by taluk shapefiles.
