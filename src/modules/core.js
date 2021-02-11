import Map from './map';
import { formatTimestampToTime } from './time';

const initStationsMap = (stationsObj) => {
  let stationsMap = {};
  stationsObj.data.stations.forEach(station => {
    stationsMap[station.station_id] = station;
  });
  return stationsMap;
}

const renderItem = (statusItem, stationItem) => {
  return `<p class="title">${stationItem.name} - max. ${stationItem.capacity} <a class="linkToMap" target="_blank" href="http://maps.google.com/?q=${stationItem.lat},${stationItem.lon}"><i class="fas fa-map-marker-alt"></i></a> <span class="distance">${statusItem.distance ? statusItem.distance.toFixed(2) + ' km' : ''}</span></p>
    <p class="status"><span class="bikes" title="Available bikes"><i class="fas fa-bicycle"></i> ${statusItem.num_bikes_available}</span> <span class="docks" title="Available docks"><i class="fas fa-parking"></i> ${statusItem.num_docks_available}</span></p>`
};

const renderStations = (stateObj, withMap = true) => {
  // Clear list
  document.getElementById('stations').innerHTML = "";

  // Filter by hasBikes and hasDocks
  let stationsStatusList = stateObj.statusObj.data.stations.filter((s) => !stateObj.hasBikes || s.num_bikes_available > 0);
  stationsStatusList = stationsStatusList.filter((s) => !stateObj.hasDocks || s.num_docks_available > 0);
  // Sort if position is known
  if (!!stateObj.position) {
    stationsStatusList = stationsStatusList.sort((s1, s2) => { return s1.distance - s2.distance; });
  }

  document.getElementById('totalCount').textContent = stationsStatusList.length;
  document.getElementById('lastUpdated').textContent = formatTimestampToTime(stateObj.statusObj.last_updated);

  if (withMap) {
    Map.clearMarkers();
  }

  const stationsList = document.getElementById('stations');
  stationsStatusList.forEach(stationStatus => {
    let stationItem = document.createElement('li');
    let station = stateObj.stationsMap[stationStatus.station_id];
    const itemHTML = renderItem(stationStatus, station);

    if (withMap) {
      let marker = Map.addMarker(station.lat, station.lon, `<b>${station.name}</b><br>${stationStatus.num_bikes_available} bikes available<br>${stationStatus.num_docks_available} docks available`);
      // No memory leak here as both marker and stationItem are being deleted on re-render
      const showPopup = () => marker.openPopup();
      stationItem.addEventListener('click', showPopup);
    }

    stationItem.innerHTML = itemHTML;
    stationsList.appendChild(stationItem);
  });
};


export { initStationsMap, renderStations };