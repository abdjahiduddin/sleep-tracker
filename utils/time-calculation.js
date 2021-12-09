exports.milisecondsToTime = (s) => {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  const time = {
    hour: +hrs,
    minute: +mins,
    seconds: +secs,
  };

  return time;
};

exports.findAverageTime = (listTime) => {
  let count = 0;

  let totalTime = 0;

  for (const list of listTime) {
    totalTime = totalTime + this.stringToSeconds(list);
    count++
  }

  const secondAvg = totalTime / count;

  const timeAvg = this.secondsToString(secondAvg);

  return timeAvg;
};

exports.stringToSeconds = (str) => {
  const timeArray = str.split(":");
  const hour = Number(timeArray[0]);
  const minute = Number(timeArray[1]);
  const second = Number(timeArray[2]);

  const seconds = hour * 3600 + minute * 60 + second;

  return seconds;
};

exports.secondsToString = (seconds) => {
  let hour = Math.floor(seconds / 3600);
  let minute = Math.floor((seconds % 3600) / 60);
  let second = (seconds % 3600) % 60;

  hour = String(hour).padStart(2, "0");
  minute = String(minute).padStart(2, "0");
  second = String(second).padStart(2, "0");

  // return hour + ":" + minute + ":" + second;
  return hour + ":" + minute;
};
