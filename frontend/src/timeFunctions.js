export function timeString(time) {
  if (time < 60) {
    return `${time.toFixed(0)} seconds`;
  } if (time < 120) {
    return `${(time / 60).toFixed(0)} minute`;
  } if (time < 3600) {
    return `${(time / 60).toFixed(0)} minutes`;
  } if (time < 7200) {
    return `${(time / 3600).toFixed(0)} hour`;
  } if (time < 86400) {
    return `${(time / 3600).toFixed(0)} hours`;
  }
  return `${(time / 86400).toFixed(0)} days`;
}

export function timeConvert(num) {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours}:${(`0${minutes}`).slice(-2)}`;
}
