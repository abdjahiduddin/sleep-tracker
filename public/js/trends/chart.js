const options = {
  chart: {
    height: 350,
    width: "100%",
    type: "area",
    animations: {
      initialAnimation: {
        enabled: false,
      },
    },
    zoom: {
      type: "x",
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: "zoom",
    },
  },
  series: [
    {
      name: "Sleep duration",
      data: [],
    },
  ],
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 3,
  },
  title: {
    text: "Sleep Trends",
    align: "left",
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      datetimeUTC: false,
    },
  },
  annotations: {
    yaxis: [
      {
        y: 8,
        borderColor: "#FEB019",
        label: {
          borderColor: "#FEB019",
          // style: {
          //   color: "#fff",
          //   background: "#00E396",
          // },
          text: "Sleep more then 8 hour",
        },
      },
      {
        y: 6,
        borderColor: "#FEB019",
        label: {
          borderColor: "#FEB019",
          // style: {
          //   color: "#fff",
          //   background: "#00E396",
          // },
          text: "Sleep less then 6 hour",
        },
      },
    ],
  },
};

const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
