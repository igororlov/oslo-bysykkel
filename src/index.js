document.addEventListener("DOMContentLoaded", function(event) {
  const element = document.createElement('h1')
  element.innerHTML = "Hello World"
  document.body.appendChild(element)
})

let fetchStations = fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json');
let fetchStationStatus = fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json');


const renderStations = (stationsObj, statusObj) => {
  console.log('stationsObj', stationsObj, 'statusObj', statusObj)

  let stationsMap = {};
  stationsObj.data.stations.forEach(station => {
    stationsMap[station.station_id] = station;
  });
  
  console.log('stationsMap', stationsMap);
};

Promise.all([fetchStations, fetchStationStatus])
  .then(responses => {
    for (let response of responses) {
      console.log(`Requesting ${response.url}: ${response.status}`); // shows 200 for every url
    }

    return responses;
  })
  // TODO error handling HTTP OK!
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(jsons => renderStations(...jsons))
  .catch(() => alert("Error when fetching stations data."));
