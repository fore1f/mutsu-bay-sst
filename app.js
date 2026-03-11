import * as je from "https://data.earth.jaxa.jp/api/javascript/v2.0.0/jaxa.earth.esm.js";

const tileSize = 256;
const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-SST.daytime.v3_global_monthly/collection.json";
const band = "SST";

const COLOR_MIN = -2;  // -2 ℃
const COLOR_MAX = 35;  // 35 ℃

// Map bounds for Mutsu Bay to limit fetched data
// Coordinate bounds for Aomori area (Sea of Japan side -> Pacific side incl. Tsugaru Strait)
const AOMORI_BBOX = [139.5, 40.5, 142.1, 41.6];

// Data Limit (Latest available data as of Mar 2026 is Feb 2026)
const LATEST_YEAR = 2026;
const LATEST_MONTH_INDEX = 1; // 0=Jan, 1=Feb

// State
let currentMonthIndex = 0; // 0 (Jan) to 11 (Dec)
let isPlaying = false;
let playInterval = null;

let yearLeft = 2019;
let yearRight = 2025;

let mapLeft = null;
let mapRight = null;

// Caches for fast switching
const tgCache = { left: {}, right: {} };
const inspectorCache = { left: {}, right: {} };

let activeTgLeft = null;
let activeTgRight = null;

// Global JAXA Image Collection
let globalImageCollection = null;

// UI Elements
const tooltip = document.getElementById("hover-tooltip");
const loadingLeft = document.getElementById("loading-left");
const loadingRight = document.getElementById("loading-right");
const monthLabel = document.getElementById("month-label");
const monthSlider = document.getElementById("month-slider");
const prevMonthBtn = document.getElementById("prev-month-btn");
const nextMonthBtn = document.getElementById("next-month-btn");
const playBtn = document.getElementById("play-btn");
const yearSelectLeft = document.getElementById("year-left");
const yearSelectRight = document.getElementById("year-right");

// Get a Date object for a specific year and month
function getDateFor(year, monthIndex) {
    return new Date(Date.UTC(year, monthIndex, 1));
}

async function getOrInitTileGenerator(mapSide, year, monthIndex) {
    const cacheKey = `${year}-${monthIndex}`;
    
    // Return existing Promise or initialized TileGenerator
    if (tgCache[mapSide][cacheKey]) {
        return await tgCache[mapSide][cacheKey];
    }

    const initPromise = (async () => {
        const tg = new je.TileGenerator({
            collectionUrl: collectionUrl,
            date: getDateFor(year, monthIndex),
            band: band,
            colorMapObject: {
                min: COLOR_MIN,
                max: COLOR_MAX,
                colors: je.Colors.JET,
            },
            tileSize: tileSize,
            delay: 50,
        });
        await tg.init();
        return tg;
    })();

    tgCache[mapSide][cacheKey] = initPromise;
    
    try {
        const tg = await initPromise;
        tgCache[mapSide][cacheKey] = tg; 
        return tg;
    } catch(e) {
        delete tgCache[mapSide][cacheKey];
        throw e;
    }
}

async function prepareInspector(mapSide, year, monthIndex) {
    const cacheKey = `${year}-${monthIndex}`;
    if (inspectorCache[mapSide][cacheKey]) return; // Already loading or loaded
    inspectorCache[mapSide][cacheKey] = 'loading'; // Prevent duplicate fetches

    try {
        if (!globalImageCollection) return;

        const image = await globalImageCollection.getImage({
            date: getDateFor(year, monthIndex),
            band: band
        });

        const dataObj = await image.getDataObject({
            bbox: AOMORI_BBOX,
            width: 500, // Reasonable resolution for tooltip
            height: 500
        });

        inspectorCache[mapSide][cacheKey] = new je.data.Inspector(dataObj);
    } catch (e) {
        console.error("Failed to load DataObject for Inspector", e);
        inspectorCache[mapSide][cacheKey] = null;
    }
}

function initMapInstance(containerId) {
    return new maplibregl.Map({
        container: containerId,
        pixelRatio: 1,
        style: {
            "version": 8,
            "sources": {
                "gsi-blank": {
                    "type": "raster",
                    "tiles": ["https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png"],
                    "tileSize": 256,
                    "attribution": "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>国土地理院 (GSI)</a>"
                }
            },
            "layers": [
                {
                    "id": "gsi-blank",
                    "type": "raster",
                    "source": "gsi-blank",
                    "paint": {
                        "raster-opacity": 0.8
                    }
                }
            ]
        },
        center: [141.0, 41.05], // Slightly shifted to center Mutsu Bay
        zoom: window.innerWidth < 768 ? 7.6 : 8.5,
        interactive: true
    });
}

// MapLibre Sync Plugin inspired logic
function syncMaps(mapA, mapB) {
    let isSyncingLeft = false;
    let isSyncingRight = false;

    mapA.on('move', () => {
        if (isSyncingRight) return;
        isSyncingLeft = true;
        mapB.jumpTo({
            center: mapA.getCenter(),
            zoom: mapA.getZoom(),
            bearing: mapA.getBearing(),
            pitch: mapA.getPitch()
        });
        isSyncingLeft = false;
    });

    mapB.on('move', () => {
        if (isSyncingLeft) return;
        isSyncingRight = true;
        mapA.jumpTo({
            center: mapB.getCenter(),
            zoom: mapB.getZoom(),
            bearing: mapB.getBearing(),
            pitch: mapB.getPitch()
        });
        isSyncingRight = false;
    });
}

async function setupMap(map, sourceId, layerId, mapSide, loaderEl) {
    return new Promise((resolve) => {
        map.on("load", async () => {
            // Register protocol specific to this map side
            const protocolName = `je-${mapSide}`;
            maplibregl.addProtocol(protocolName, async (params, abortController) => {
                const tg = mapSide === 'left' ? activeTgLeft : activeTgRight;
                if (!tg) throw new Error("TileGenerator not ready");
                const [z, x, y] = params.url.split("/").slice(-3).map(v => parseInt(v));
                return tg.getPng(x, y, z, abortController.signal).then((png) => {
                    return { data: png.buffer };
                }).catch(e => {
                    throw e;
                });
            });

            map.addSource(sourceId, {
                type: "raster",
                tiles: [`${protocolName}://{z}/{x}/{y}?t=${Date.now()}`],
                tileSize: tileSize,
                attribution: "<a href='https://data.earth.jaxa.jp' target='_blank'>JAXA Earth API</a>",
            });

            map.addLayer({
                id: layerId,
                type: "raster",
                source: sourceId,
                paint: {
                    "raster-opacity": 0.8
                }
            });

            // Hover tooltip logic
            map.on('mousemove', (e) => {
                const lng = e.lngLat.lng;
                const lat = e.lngLat.lat;

                const cacheKeyLeft = `${yearLeft}-${currentMonthIndex}`;
                const inspectorLeft = inspectorCache['left'][cacheKeyLeft];
                
                const cacheKeyRight = `${yearRight}-${currentMonthIndex}`;
                const inspectorRight = inspectorCache['right'][cacheKeyRight];

                let leftVal = '--';
                if (inspectorLeft && inspectorLeft !== 'loading') {
                    const v = inspectorLeft.getValueByCoordinateXY(lng, lat);
                    if (v !== null && !isNaN(v)) leftVal = v.toFixed(1) + ' ℃';
                }

                let rightVal = '--';
                if (inspectorRight && inspectorRight !== 'loading') {
                    const v = inspectorRight.getValueByCoordinateXY(lng, lat);
                    if (v !== null && !isNaN(v)) rightVal = v.toFixed(1) + ' ℃';
                }

                if (leftVal !== '--' || rightVal !== '--') {
                    tooltip.style.display = 'block';
                    tooltip.style.left = (e.originalEvent.pageX + 15) + 'px';
                    tooltip.style.top = (e.originalEvent.pageY + 15) + 'px';
                    tooltip.innerText = `${yearLeft}年: ${leftVal}\n${yearRight}年: ${rightVal}`;
                } else {
                    tooltip.style.display = 'none';
                }
            });

            map.on('mouseleave', () => {
                tooltip.style.display = 'none';
            });

            map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
            loaderEl.style.display = "none";
            resolve();
        });
    });
}

async function updateMapData(mapSide, isManualAction = true) {
    const isLeft = mapSide === 'left';
    const year = isLeft ? yearLeft : yearRight;
    const map = isLeft ? mapLeft : mapRight;
    const loader = isLeft ? loadingLeft : loadingRight;
    const sourceId = isLeft ? "jeSourceLeft" : "jeSourceRight";

    // Show loader only if manual action (like changing year/slider) AND not cached yet.
    // If we are just playing animation, we skip showing the loader for a smoother feel.
    const cacheKey = `${year}-${currentMonthIndex}`;
    if (isManualAction && !tgCache[mapSide][cacheKey]) {
        loader.style.display = "block";
    }

    try {
        // 1. Get cached or create new TileGenerator
        const tg = await getOrInitTileGenerator(mapSide, year, currentMonthIndex);
        
        // 2. Pre-fetch DataObject for Inspector (async, don't await)
        prepareInspector(mapSide, year, currentMonthIndex);
        
        // Also Pre-fetch the *next* month's data to make animation smoother
        const nextMonth = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;
        prepareInspector(mapSide, year, nextMonth);
        getOrInitTileGenerator(mapSide, year, nextMonth); // Promise will cache

        // 3. Assign to global active
        if (isLeft) {
            activeTgLeft = tg;
        } else {
            activeTgRight = tg;
        }

        // 4. Force MapLibre to reload tiles
        if (map && map.getSource(sourceId)) {
            const protocolName = `je-${mapSide}`;
            const layerId = isLeft ? "jeLayerLeft" : "jeLayerRight";
            
            map.removeLayer(layerId);
            map.removeSource(sourceId);
            
            map.addSource(sourceId, {
                type: "raster",
                tiles: [`${protocolName}://{z}/{x}/{y}?t=${Date.now()}`],
                tileSize: tileSize,
                attribution: "<a href='https://data.earth.jaxa.jp' target='_blank'>JAXA Earth API</a>",
            });
            
            map.addLayer({
                id: layerId,
                type: "raster",
                source: sourceId,
                paint: {
                    "raster-opacity": 0.8
                }
            });
        }
    } catch(e) {
        console.error("Error updating map data:", e);
    } finally {
        loader.style.display = "none";
    }
}

async function initApp() {
    loadingLeft.style.display = "block";
    loadingRight.style.display = "block";

    // 1. Init Global Image Collection (Run exactly once)
    globalImageCollection = new je.ImageCollection({ collectionUrl: collectionUrl });
    await globalImageCollection.init();

    // 2. Init Logic Maps
    yearLeft = parseInt(yearSelectLeft.value);
    yearRight = parseInt(yearSelectRight.value);
    
    activeTgLeft = await getOrInitTileGenerator('left', yearLeft, currentMonthIndex);
    activeTgRight = await getOrInitTileGenerator('right', yearRight, currentMonthIndex);
    
    prepareInspector('left', yearLeft, currentMonthIndex);
    prepareInspector('right', yearRight, currentMonthIndex);

    // Init Maps
    mapLeft = initMapInstance("map-left");
    mapRight = initMapInstance("map-right");

    syncMaps(mapLeft, mapRight);

    await Promise.all([
        setupMap(mapLeft, "jeSourceLeft", "jeLayerLeft", "left", loadingLeft),
        setupMap(mapRight, "jeSourceRight", "jeLayerRight", "right", loadingRight)
    ]);

    setupUI();
}

function setupUI() {
    async function setMonth(index, isManualAction = true) {
        // Guard for 2026 data limit
        let targetIndex = index;
        if (yearLeft === LATEST_YEAR || yearRight === LATEST_YEAR) {
            if (targetIndex > LATEST_MONTH_INDEX) targetIndex = LATEST_MONTH_INDEX;
        }

        currentMonthIndex = targetIndex;
        const displayNum = (currentMonthIndex + 1).toString().padStart(2, '0');
        monthLabel.innerText = displayNum;
        monthSlider.value = currentMonthIndex + 1;
        
        await Promise.all([
            updateMapData('left', isManualAction),
            updateMapData('right', isManualAction)
        ]);
    }

    // Slider Event
    let sliderDebounce = null;
    monthSlider.addEventListener("input", (e) => {
        if (isPlaying) stopPlay();
        const val = parseInt(e.target.value) - 1;
        const displayNum = (val + 1).toString().padStart(2, '0');
        monthLabel.innerText = displayNum;

        clearTimeout(sliderDebounce);
        sliderDebounce = setTimeout(() => {
            setMonth(val, true);
        }, 150);
    });

    // Prev/Next Month Events
    prevMonthBtn.addEventListener("click", () => {
        if (isPlaying) stopPlay();
        let newMonth = currentMonthIndex - 1;
        if (newMonth < 0) newMonth = 11;
        setMonth(newMonth, true);
    });

    nextMonthBtn.addEventListener("click", () => {
        if (isPlaying) stopPlay();
        let newMonth = currentMonthIndex + 1;
        if (newMonth > 11) newMonth = 0;

        // Check availability
        if ((yearLeft === LATEST_YEAR || yearRight === LATEST_YEAR) && newMonth > LATEST_MONTH_INDEX) {
            // If at Feb 2026, don't allow going forward
            return;
        }

        setMonth(newMonth, true);
    });

    // Play/Pause Event
    function startPlay() {
        isPlaying = true;
        playBtn.innerHTML = "⏸ Pause";
        playInterval = setInterval(() => {
            let next = currentMonthIndex + 1;
            
            // Loop or Stop at limit
            if (yearLeft === LATEST_YEAR || yearRight === LATEST_YEAR) {
                if (next > LATEST_MONTH_INDEX) {
                    stopPlay();
                    return;
                }
            }

            if (next > 11) next = 0;
            setMonth(next, false); // isManualAction = false
        }, 1500); // 1.5 second delay per frame with preloading
    }

    function stopPlay() {
        isPlaying = false;
        playBtn.innerHTML = "▶ Play";
        clearInterval(playInterval);
    }

    playBtn.addEventListener("click", () => {
        if (isPlaying) stopPlay();
        else startPlay();
    });

    // Year Change Events
    yearSelectLeft.addEventListener("change", (e) => {
        yearLeft = parseInt(e.target.value);
        if (yearLeft === LATEST_YEAR && currentMonthIndex > LATEST_MONTH_INDEX) {
            setMonth(LATEST_MONTH_INDEX, true);
        } else {
            updateMapData('left');
        }
    });

    yearSelectRight.addEventListener("change", (e) => {
        yearRight = parseInt(e.target.value);
        if (yearRight === LATEST_YEAR && currentMonthIndex > LATEST_MONTH_INDEX) {
            setMonth(LATEST_MONTH_INDEX, true);
        } else {
            updateMapData('right');
        }
    });
}

window.onload = initApp;
