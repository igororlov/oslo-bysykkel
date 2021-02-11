import { initStationsMap, renderStations } from './modules/core'
import { getDistanceFromLatLonInKm } from './modules/geometry';
import Map from './modules/map';

// As we don't use any framework and need to dynamically update the list, we will store the state in window object.
window.state = {
  hasBikes: false,
  hasDocks: false,
  position: null
};

// Called on initial data load
const initAndRenderStations = (stationsObj, statusObj) => {
  Map.render('mapid');

  let stationsMap = initStationsMap(stationsObj);

  // Store both objects and map in window state
  window.state.statusObj = statusObj;
  window.state.stationsObj = stationsObj;
  window.state.stationsMap = stationsMap;

  renderStations(window.state);
};

// Init listeners for checkboxes
const hasBikes = document.querySelector("input[name=hasBikes]");
if (!!hasBikes) {
  hasBikes.addEventListener('change', (e) => {
    window.state.hasBikes = e.target.checked;
    renderStations(window.state);
  });
}

const hasDocks = document.querySelector("input[name=hasDocks]");
if (!!hasDocks) {
  hasDocks.addEventListener('change', (e) => {
    window.state.hasDocks = e.target.checked;
    renderStations(window.state);
  });
}

// Request position
if (navigator && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    if (!!window.state.statusObj) {
      window.state.position = position;
      window.state.statusObj.data.stations.forEach(s => {
        s.distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, window.state.stationsMap[s.station_id].lat, window.state.stationsMap[s.station_id].lon);
      });
      renderStations(window.state);
    }
  });
}

// Fetch and render the initial list
let fetchStations = fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json');
let fetchStationStatus = fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json');
Promise.all([fetchStations, fetchStationStatus])
  .then(responses => {
    for (let response of responses) {
      console.log(`Requesting ${response.url}: ${response.status}`); // shows 200 for every url
    }

    return responses;
  })
  // TODO error handling HTTP OK!
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(jsons => initAndRenderStations(...jsons))
  .catch(() => alert("Error when fetching stations data."));

