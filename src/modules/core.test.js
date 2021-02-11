import { initStationsMap, renderStations } from './core'

let state = {
  hasBikes: false,
  hasDocks: false,
  position: null
};

const stationsObj = {
  "last_updated": 1613083566,
  "ttl": 10,
  "data": {
    "stations": [
      {
        "station_id": "2280",
        "name": "Klingenberggata",
        "address": "Olav Vs Gate 5",
        "lat": 59.913150534075015,
        "lon": 10.732281291700133,
        "capacity": 15
      },
      {
        "station_id": "2270",
        "name": "Lørenporten",
        "address": "Lørenveien 63",
        "lat": 59.92883258499495,
        "lon": 10.799770383800876,
        "capacity": 20
      }
    ]
  }
};

const statusObj = {
  "last_updated": 1613083566,
  "ttl": 10,
  "data": {
    "stations": [
      {
        "station_id": "2280",
        "is_installed": 1,
        "is_renting": 1,
        "is_returning": 1,
        "last_reported": 1613083566,
        "num_bikes_available": 0,
        "num_docks_available": 15,
        "distance": 6.712174892438918
      },
      {
        "station_id": "2270",
        "is_installed": 1,
        "is_renting": 1,
        "is_returning": 1,
        "last_reported": 1613083566,
        "num_bikes_available": 2,
        "num_docks_available": 18,
        "distance": 6.8847871871107875
      }
    ]
  }
};

state.stationsObj = stationsObj;
state.statusObj = statusObj;
state.stationsMap = initStationsMap(stationsObj);

test('Mapping in initStationsMap works.', () => {
  const stationsMap = initStationsMap(stationsObj);
  expect(Object.keys(stationsMap).length).toBe(2);
})

test('Renders stations correctly', () => {
  // Set up our markup
  document.body.innerHTML =
    '<div>' +
    '<h3>Totally <span id="totalCount">0</span>, last updated on <span id="lastUpdated">...</span>.</h3>' +
    ' <ul id="stations" class="stations"></ul>' +
    ' <div id="mapid" class="map-container"></div>' +
    '</div>';

  renderStations(state, false)

  expect(document.getElementById('totalCount').innerHTML).toBe('2');
  expect(document.getElementsByTagName("LI").length).toBe(2);
})
