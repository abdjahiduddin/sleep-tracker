exports.mapListTime = (rawData) => {
    const wakeUpList = [];
    const sleepList = [];
    const durationList = [];
  
    let sleepLessSix = 0;
    let sleepMoreEight = 0;
  
    const dataTable = []
    const dataChart = []
    for (const item of rawData) {
      const startTmp = new Date(item.start.toUTCString())
      const endTmp = new Date(item.end.toUTCString())

      console.log(startTmp)
      console.log(endTmp)

      const start = startTmp.toLocaleString("nl-NL", { timezone: item.timezone }).split(" ")
      console.log(start)

      //   Mapping chart data
      // const x = start[0].replace(/\//g, "-").replace(",", "")
      const dateTmp = start[0].split("-")
      const x = dateTmp[1] + "-" + dateTmp[0] + "-" + dateTmp[2] 
      const y = item.duration.hour
      dataChart.push({
          x: x,
          y: y
      })
  
      // Mapping table list
      // const date = start[0].replace(/\//g, "-").replace(",", "")
      const date = start[0]
      const sleepTime = start[1]
      const wakeUpTime = endTmp.toLocaleString("nl-NL", { timezone: item.timezone }).split(" ")[1]
      console.log(endTmp.toLocaleString("nl-NL", { timezone: item.timezone }).split(" "))
  
      let seconds = item.duration.seconds.toString();
      let minute = item.duration.minute.toString();
      let hour = item.duration.hour.toString();
  
      const duration =
        hour.padStart(2, "0") +
        ":" +
        minute.padStart(2, "0") +
        ":" +
        seconds.padStart(2, "0");
  
        dataTable.push({
            dataId: item._id.toString(),
            date: date,
            sleep: sleepTime,
            wakeUp: wakeUpTime,
            duration: duration
        })
      
      // Mapping wakeup sleep duration
      wakeUpList.push(wakeUpTime)
      sleepList.push(sleepTime)
      durationList.push(duration)
  
      // Mapping less 6 and more 8
      if(item.duration.hour < 6) {
          sleepLessSix++
      }
  
      if(item.duration.hour >= 8) {
          sleepMoreEight++
      }
    }
    
    return {
        dataChart: dataChart,
        dataTable: dataTable,
        sleepLessSix: sleepLessSix,
        sleepMoreEight: sleepMoreEight,
        wakeUpList: wakeUpList,
        sleepList: sleepList,
        durationList: durationList
    }
  };
// exports.mapDataChart = (rawData) => {
//   return rawData.map((item) => {
//     const x = item.start
//       .toLocaleString("en-US", { timeZone: item.timezone })
//       .split(" ")[0]
//       .replace(/\//g, "-");
//     const y = item.duration.hour;
//     return {
//       x: x,
//       y: y,
//     };
//   });
// };

// exports.mapDataTables = (rawData) => {
//   return rawData.map((item) => {
//     const start = item.start
//       .toLocaleString("nl-NL", { timeZone: item.timezone })
//       .split(" ");
//     const date = start[0];
//     const sleepTime = start[1];
//     const wakeUpTime = item.end
//       .toLocaleString("nl-NL", { timeZone: item.timezone })
//       .split(" ")[1];

//     let seconds = item.duration.seconds.toString();
//     let minute = item.duration.minute.toString();
//     let hour = item.duration.hour.toString();

//     const duration =
//       hour.padStart(2, 0) +
//       ":" +
//       minute.padStart(2, 0) +
//       ":" +
//       seconds.padStart(2, 0);

//     return {
//       date: date,
//       sleep: sleepTime,
//       wakeUp: wakeUpTime,
//       duration: duration,
//     };
//   });
// };