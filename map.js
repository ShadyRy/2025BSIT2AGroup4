// =====================================================================
// Map Page Specific Logic
// =====================================================================

/**
 * Populates the "Safe Routes" list on the map page.
 */
function setupSafeRoutes() {
    const routeList = document.getElementById("routeList");
    if (!routeList) return;

    const routes = [
        { name: "Route A", details: "Dalton St, The Upper East", safety: "Safe", className: "route-safe" },
        { name: "Route B", details: "Galo St, The Upper East", safety: "Moderate", className: "route-medium" },
        { name: "Route C", details: "Lopez Jaena St, Brgy. 30", safety: "Unsafe", className: "route-low" }
    ];

  routeList.innerHTML = ''; // Clear existing
    routes.forEach(route => {
        const div = document.createElement("div");
        div.className = `route-card ${route.className}`;
        div.innerHTML = `
            <div class="route-name">${route.name}</div>
            <div class="route-details">${route.details}</div>
            <div class="route-safety">Safety: ${route.safety}</div>
            `;
        routeList.appendChild(div);
    });
}

/**
 * Populates the "Weather Alerts" list on the map page.
 */
function setupWeatherAlerts() {
    const weatherContainer = document.getElementById("weatherAlerts");
        if (!weatherContainer) return; 

        const weatherAlerts = [
            { icon: "fas fa-cloud-rain", message: "Heavy rain expected at 4 PM" },
            { icon: "fas fa-bolt", message: "Thunderstorm warning until 6 PM" },
            { icon: "fas fa-temperature-high", message: "Heat index at 38°C" }
        ];

  weatherContainer.innerHTML = ''; // Clear existing
    weatherAlerts.forEach(alert => {
        const div = document.createElement("div");
        div.className = "weather-alert";
        div.innerHTML = `
            <i class="${alert.icon}"></i>
            <span>${alert.message}</span>
        `;
        weatherContainer.appendChild(div);
    });
}

/**
 * Initializes the Leaflet map if the map container and Leaflet are present.
 * Assumes 'map' is a global variable (from main.js).
 */
async function initLeafletIfPresent() {
    const mapEl = document.getElementById("map-container");
        if (!mapEl || typeof L === 'undefined') {
        if (mapEl) console.error('Leaflet (L) is not defined. Make sure leaflet.js is loaded.');
        return;
    }

    // global map (top of script has `let map;`)
    map = L.map(mapEl, { zoomControl: false }).setView([10.664648, 122.962439], 17);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Helper: check if an image URL loads
    function imageExists(url) {
        return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        });
    }

    // --- Custom Icons (wet always uses wetRoad.png) ---
    const wetIcon = L.icon({
        iconUrl: 'images/wetRoad.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    // Try to preload blocked icon; if it fails, fall back to default icon
    const blockedIconUrl = 'images/blockRoad.png';
    const blockedIconAvailable = await imageExists(blockedIconUrl);

    const blockedIcon = blockedIconAvailable
        ? L.icon({ iconUrl: blockedIconUrl, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] })
        : null; // null means use default below

    if (!blockedIconAvailable) {
        console.warn(`[Leaflet] blocked icon "${blockedIconUrl}" failed to load — falling back to default marker icon.`);
    }

    // --- Coordinates ---
    const wetPositions = [ // Wet Roads
        [10.663395, 122.965486],
        [10.664237, 122.962064]
    ];

    const crowdPositions = [ // Crowd Tracker
        [10.666379, 122.960089],
        [10.664954, 122.959263]
    ];

    const blockedPositions = [ // Blocked Roads
        [10.662413, 122.965347],
        [10.663197, 122.963485]
    ];

    // --- Suggested Route Coordinates

    const lineCoordinates1 = [ // Green (Upper East)
        [10.665460, 122.959038],
        [10.664206, 122.961946]
    ];

    const lineCoordinates2 = [ // Yellow (Cirucmferrential)
        [10.661371, 122.966301],
        [10.664048, 122.967728]
    ];

    const lineCoordinates3 = [ // Red (Bangga Patyo)
        [10.665323, 122.957300],
        [10.667979, 122.958491]
    ];

    // --- Create layer objects (not added yet) ---
    const wetMarkers = wetPositions.map(coords =>
        L.marker(coords, { icon: wetIcon }).bindPopup("Wet Road Reported")
    );

    const crowdCircles = crowdPositions.map(coords =>
        L.circle(coords, {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: 75
        }).bindPopup("Crowd Reported")
    );

    const roadLine1 = L.polyline(lineCoordinates1, {
        color: "#4CAF50",
        weight: 4,
        opacity: 0.8,
    }).bindPopup("Road connection or route");

    const roadLine2 = L.polyline(lineCoordinates2, {
        color: "#FFC107",
        weight: 4,
        opacity: 0.8,
    }).bindPopup("Road connection or route");

    const roadLine3 = L.polyline(lineCoordinates3, {
        color: "#F44336",
        weight: 4,
        opacity: 0.8,
    }).bindPopup("Road connection or route");

    roadLine1.addTo(map);
    roadLine2.addTo(map);
    roadLine3.addTo(map);

        // If blockedIcon is null, create markers with default icon
    const blockedMarkers = blockedPositions.map(coords => {
        if (blockedIcon) {
            return L.marker(coords, { icon: blockedIcon }).bindPopup("Blocked Road Ahead");
        } else {
            return L.marker(coords).bindPopup("Blocked Road Ahead");
        }
    });

    // Helpers: add/remove arrays of layers
    function addLayerArray(arr, note) {
        arr.forEach(layer => {
            if (!map.hasLayer(layer)) layer.addTo(map);
        });
            if (note) console.log(`Added ${arr.length} ${note} to map.`);
        }
    function removeLayerArray(arr, note) {
            arr.forEach(layer => {
            if (map.hasLayer(layer)) map.removeLayer(layer);
        });
            if (note) console.log(`Removed ${arr.length} ${note} from map.`);
        }

    // --- Checkbox references (these exist in your map.php) ---
    const wetCheckbox = document.getElementById("wet");
    const crowdCheckbox = document.getElementById("crowd");
    const blockedCheckbox = document.getElementById("blocked");

    // Ensure initial visibility according to checkbox state
    if (wetCheckbox) {
        if (wetCheckbox.checked) addLayerArray(wetMarkers, 'wet markers');
            wetCheckbox.addEventListener("change", () => {
            wetCheckbox.checked ? addLayerArray(wetMarkers, 'wet markers') : removeLayerArray(wetMarkers, 'wet markers');
        });
    }

    if (crowdCheckbox) {
        if (crowdCheckbox.checked) addLayerArray(crowdCircles, 'crowd circles');
        crowdCheckbox.addEventListener("change", () => {
        crowdCheckbox.checked ? addLayerArray(crowdCircles, 'crowd circles') : removeLayerArray(crowdCircles, 'crowd circles');
        });
    }

    if (blockedCheckbox) {
        if (blockedCheckbox.checked) addLayerArray(blockedMarkers, 'blocked markers');
        blockedCheckbox.addEventListener("change", () => {
        blockedCheckbox.checked ? addLayerArray(blockedMarkers, 'blocked markers') : removeLayerArray(blockedMarkers, 'blocked markers');
        });
    }


    // --- Custom Zoom Control (unchanged) ---
    const ZoomControl = L.Control.extend({
        options: { position: "topright" },
        onAdd: function(mapInstance) {
        const container = L.DomUtil.create("div", "leaflet-control custom-zoom-control");

        const btnIn = L.DomUtil.create("a", "zoom-btn", container);
            btnIn.innerHTML = '<i class="fas fa-plus"></i>';
            btnIn.href = "#";
            btnIn.title = "Zoom In";

        const btnOut = L.DomUtil.create("a", "zoom-btn", container);
            btnOut.innerHTML = '<i class="fas fa-minus"></i>';
            btnOut.href = "#";
            btnOut.title = "Zoom Out";

        L.DomEvent.on(btnIn, "click", L.DomEvent.stopPropagation)
            .on(btnIn, "click", L.DomEvent.preventDefault)
            .on(btnIn, "click", () => mapInstance.zoomIn());

        L.DomEvent.on(btnOut, "click", L.DomEvent.stopPropagation)
            .on(btnOut, "click", L.DomEvent.preventDefault)
            .on(btnOut, "click", () => mapInstance.zoomOut());

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        return container;
        }
    });

    map.addControl(new ZoomControl());
}
