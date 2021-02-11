const OSLO_CITY_CENTER = [59.922209742135124, 10.74066706745044];
const ZOOM_LEVEL = 13;
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaWdvcm9ybG92IiwiYSI6ImNra3k4bnQwajBkdTcycHAwYzlxN3R3NW0ifQ.SCY6H4FD_JeQBSaebVORtw';

const Map = {
  markers: []
}

Map.render = (elementId) => {
  const map = L.map(elementId).setView(OSLO_CITY_CENTER, ZOOM_LEVEL);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: MAPBOX_ACCESS_TOKEN
  }).addTo(map);
  Map.map = map;
  return map;
}

Map.addMarker = (latitute, longitude, popupContent) => {
  let marker = L.marker([latitute, longitude]).addTo(Map.map);
  if (popupContent) {
    marker.bindPopup(popupContent);
  }
  Map.markers.push(marker);
  return marker;
  return null;
}

Map.clearMarkers = () => {
  Map.markers.forEach((marker) => Map.map.removeLayer(marker))
  Map.markers = [];
}

export default Map;
