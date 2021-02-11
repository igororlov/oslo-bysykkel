// Ref: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
const formatTimestampToTime = (timestamp) => {
  if (!timestamp) {
    throw new Error('Timestamp is required');
  }

  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
};

export { formatTimestampToTime };