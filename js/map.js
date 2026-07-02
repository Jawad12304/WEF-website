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

  // 1. Initialize Map with a default view (will be auto-centered later)
  const map = L.map('map', {
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    scrollWheelZoom: false // Disable scroll zoom by default for better user scrolling experience
  }).setView([35.85, 71.8], 10);

  // Enable scroll zoom on click / focus to make it interactive when intended
  map.on('click', () => {
    map.scrollWheelZoom.enable();
  });
  map.on('mouseout', () => {
    map.scrollWheelZoom.disable();
  });

  // 2. Base Map: CartoDB Voyager Tiles (Clean maps with English language labels)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
  }).addTo(map);

  // 3. Custom SVG Marker Icon
  // Designed to match the brand green color (#3a8a48) and support high-quality rendering
  const customIcon = L.divIcon({
    className: 'custom-marker-container',
    html: `
      <div class="marker-pin">
        <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Shadow/Glow -->
          <ellipse cx="14" cy="31" rx="6" ry="2" fill="rgba(0,0,0,0.2)" />
          <!-- Pin Shape -->
          <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 32 14 32C14 32 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#3a8a48" />
          <!-- Outer Ring/Border -->
          <path d="M14 1C6.82 1 1 6.82 1 14C1 23.75 14 30.85 14 30.85C14 30.85 27 23.75 27 14C27 6.82 21.18 1 14 1Z" fill="none" stroke="#ffffff" stroke-width="1.5" />
          <!-- Inner Dot -->
          <circle cx="14" cy="13" r="5.5" fill="#ffffff" />
          <circle cx="14" cy="13" r="3" fill="#d97b2a" />
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
          color: '#d97b2a', // brand accent orange
          weight: 2.5,
          opacity: 0.85,
          fillColor: '#d97b2a',
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
      map.fitBounds(borderLayer.getBounds(), {
        padding: [30, 30]
      });
    } else if (geojsonLayer && geojsonLayer.getBounds().isValid()) {
      // Fallback: Fit to markers if border failed to load
      map.fitBounds(geojsonLayer.getBounds(), {
        padding: [40, 40],
        maxZoom: 13
      });
    }
  });
}
