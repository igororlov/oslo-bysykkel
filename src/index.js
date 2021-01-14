"use strict";

// As we don't use any framework and need to dynamically update the list, we will store the state in window object.
window.state = {
  hasBikes: false,
  hasDocks: false,
  position: null
};

// Ref: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
const formatTime = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
};

const renderItem = (statusItem, stationItem) => {
  return `<p class="title">${stationItem.name} - max. ${stationItem.capacity} <a class="linkToMap" target="_blank" href="http://maps.google.com/?q=${stationItem.lat},${stationItem.lon}"><i class="fas fa-map-marker-alt"></i></a> <span class="distance">${statusItem.distance ? statusItem.distance.toFixed(2) + ' km' : ''}</span></p>
    <p class="status"><span class="bikes" title="Available bikes"><i class="fas fa-bicycle"></i> ${statusItem.num_bikes_available}</span> <span class="docks" title="Available docks"><i class="fas fa-parking"></i> ${statusItem.num_docks_available}</span></p>`
};

const renderStations = () => {
  console.log('in renderStations. Current state:', window.state);

  // Clear list
  document.getElementById('stations').innerHTML = "";

  // Filter by hasBikes and hasDocks
  let stationsStatusList = window.state.statusObj.data.stations.filter((s) => !window.state.hasBikes || s.num_bikes_available > 0);
  stationsStatusList = stationsStatusList.filter((s) => !window.state.hasDocks || s.num_docks_available > 0);
  // Sort if position is known
  if (!!window.state.position) {
    stationsStatusList = stationsStatusList.sort((s1, s2) => { return s1.distance - s2.distance; });
  }

  document.getElementById('totalCount').textContent = stationsStatusList.length;
  document.getElementById('lastUpdated').textContent = formatTime(window.state.statusObj.last_updated);

  const stationsList = document.getElementById('stations');
  stationsStatusList.forEach(stationStatus => {
    let stationItem = document.createElement('li');
    const itemHTML = renderItem(stationStatus, window.state.stationsMap[stationStatus.station_id]);
    stationItem.innerHTML = itemHTML;
    stationsList.appendChild(stationItem);
  });
};

// Called on initial data load
const initAndRenderStations = (stationsObj, statusObj) => {
  console.log('stationsObj', stationsObj, 'statusObj', statusObj)

  let stationsMap = {};
  stationsObj.data.stations.forEach(station => {
    stationsMap[station.station_id] = station;
  });
  
  // Store both objects and map in window state
  console.log('stationsMap', stationsMap);
  window.state.statusObj = statusObj;
  window.state.stationsObj = stationsObj;
  window.state.stationsMap = stationsMap;

  renderStations();
};

// Init listeners for checkboxes
const hasBikes = document.querySelector("input[name=hasBikes]");
hasBikes.addEventListener('change', (e) => {
  window.state.hasBikes = e.target.checked;
  renderStations();
});
const hasDocks = document.querySelector("input[name=hasDocks]");
hasDocks.addEventListener('change', (e) => {
  window.state.hasDocks = e.target.checked;
  renderStations();
});

// Functions for calculating distance between coordinates
// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
const deg2rad = (deg) => {
  return deg * (Math.PI/180)
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
};

// Request position
navigator.geolocation.getCurrentPosition((position) => {
  window.state.position = position;
  window.state.statusObj.data.stations.forEach(s => {
    s.distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, window.state.stationsMap[s.station_id].lat, window.state.stationsMap[s.station_id].lon);
  });
  renderStations();
});


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
