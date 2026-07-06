/* ============================================
   Worldwide Education Foundation — Map JS
   Leaflet.js Integration for ECD Centers Map
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initECDMap();
});

function initECDMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // 1. Define multiple base layers (Street, Satellite, Hybrid, Terrain views)
  const streetMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
  });

  const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  const hybridMap = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Map data &copy; Google'
  });

  const terrainMap = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Map data &copy; Google'
  });

  // Initialize Map with Google Hybrid view by default (richer, satellite feel)
  const map = L.map('map', {
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    scrollWheelZoom: false, // Disable scroll zoom by default for better user scrolling experience
    layers: [hybridMap]
  }).setView([35.85, 71.8], 10);

  // Enable scroll zoom on click / focus to make it interactive when intended
  map.on('click', () => {
    map.scrollWheelZoom.enable();
  });
  map.on('mouseout', () => {
    map.scrollWheelZoom.disable();
  });

  // Add Layer Switcher Control (just like Google Earth)
  const baseMaps = {
    "Satellite (Google Hybrid)": hybridMap,
    "Street Map": streetMap,
    "Satellite (Esri)": satelliteMap,
    "Terrain View": terrainMap
  };
  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

  // Add "See All" Reset View Control
  const SeeAllControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function (map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.style.backgroundColor = '#ffffff';
      container.style.padding = '8px 12px';
      container.style.cursor = 'pointer';
      container.style.fontWeight = '600';
      container.style.color = '#121417';
      container.style.fontFamily = 'Inter, sans-serif';
      container.style.boxShadow = '0 2px 8px rgba(18, 20, 23, 0.1)';
      container.innerHTML = 'View All Centers';
      container.title = 'Reset Map View';

      container.onmouseover = function() { container.style.backgroundColor = '#f4f5f6'; };
      container.onmouseout = function() { container.style.backgroundColor = '#ffffff'; };

      container.onclick = function (e) {
        L.DomEvent.stopPropagation(e);
        if (window.mapBounds) {
          map.fitBounds(window.mapBounds, { padding: [30, 30], animate: true, duration: 1.0 });
        }
      }
      return container;
    }
  });
  map.addControl(new SeeAllControl());

  // 3. Custom SVG Marker Icon
  // Designed to match the brand green color (#0e611d) and support high-quality rendering
  const customIcon = L.divIcon({
    className: 'custom-marker-container',
    html: `
      <div class="marker-pin">
        <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Shadow/Glow -->
          <ellipse cx="14" cy="31" rx="6" ry="2" fill="rgba(0,0,0,0.2)" />
          <!-- Pin Shape -->
          <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 32 14 32C14 32 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#0e611d" />
          <!-- Outer Ring/Border -->
          <path d="M14 1C6.82 1 1 6.82 1 14C1 23.75 14 30.85 14 30.85C14 30.85 27 23.75 27 14C27 6.82 21.18 1 14 1Z" fill="none" stroke="#ffffff" stroke-width="1.5" />
          <!-- Inner Dot -->
          <circle cx="14" cy="13" r="5.5" fill="#ffffff" />
          <circle cx="14" cy="13" r="3" fill="#c4691c" />
        </svg>
      </div>
    `,
    iconSize: [28, 34],
    iconAnchor: [14, 32],
    popupAnchor: [0, -32]
  });

  // 4. Fetch the Chitral District border GeoJSON
  const fetchBorder = fetch('assets/chitral_border.geojson')
    .then(response => {
      if (!response.ok) throw new Error('Border failed to load');
      return response.json();
    })
    .then(borderData => {
      // Create GeoJSON border layer styled with brand accent orange dashed outline
      const borderLayer = L.geoJSON(borderData, {
        style: {
          color: '#c4691c', // brand accent orange
          weight: 2.5,
          opacity: 0.85,
          fillColor: '#c4691c',
          fillOpacity: 0.04,
          dashArray: '6, 6',
          interactive: false // Clicks pass through border layer to markers
        }
      }).addTo(map);
      return borderLayer;
    })
    .catch(error => {
      console.error('Error loading Chitral border:', error);
      return null;
    });

  // 5. Fetch the locations.geojson file containing center markers
  const fetchLocations = fetch('assets/locations.geojson')
    .then(response => {
      if (!response.ok) throw new Error('Locations failed to load');
      return response.json();
    })
    .then(locationsData => {
      // Create GeoJSON layer with custom marker pins and click popups
      const geojsonLayer = L.geoJSON(locationsData, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, { icon: customIcon });
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties;
          const [lon, lat] = feature.geometry.coordinates;

          // HTML markup for popups matching Design System (Outfit + Inter fonts)
          const popupContent = `
            <div class="custom-popup-content">
              <h3 class="popup-title">${props.name || 'ECD Center'}</h3>
              <div class="popup-info-row">
                <span class="popup-label">Village:</span>
                <span class="popup-value">${props.village || 'N/A'}</span>
              </div>
              <div class="popup-info-row">
                <span class="popup-label">Coordinates:</span>
                <span class="popup-value">${lat.toFixed(5)}°, ${lon.toFixed(5)}°</span>
              </div>
            </div>
          `;

          layer.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-leaflet-popup'
          });

          // Zoom into the clicked location
          layer.on('click', (e) => {
            map.setView(e.latlng, 18, {
              animate: true,
              duration: 0.8
            });
          });
        }
      }).addTo(map);
      return geojsonLayer;
    })
    .catch(error => {
      console.error('Error loading locations:', error);
      mapElement.innerHTML = `
        <div class="map-error-message">
          <p>⚠️ Unable to load the interactive map data. Please check back later.</p>
        </div>
      `;
      return null;
    });

  // 6. Auto-Centering to fit all layers perfectly on screen
  Promise.all([fetchBorder, fetchLocations]).then(([borderLayer, geojsonLayer]) => {
    if (borderLayer && borderLayer.getBounds().isValid()) {
      // Fit to Chitral District border for full-district context
      window.mapBounds = borderLayer.getBounds();
      map.fitBounds(window.mapBounds, {
        padding: [30, 30]
      });
    } else if (geojsonLayer && geojsonLayer.getBounds().isValid()) {
      // Fallback: Fit to markers if border failed to load
      window.mapBounds = geojsonLayer.getBounds();
      map.fitBounds(window.mapBounds, {
        padding: [40, 40],
        maxZoom: 13
      });
    }
  });
}
