<template>
  <div class="widget widget-one_hybrid">
    <div class="widget-heading">
      <p class="w-value">{{ temp }} C</p>
      <h5 class>Air Temp</h5>
    </div>
    <div class="widget-content">
      <div class="w-chart" style="position: relative;">
        <div style="min-height: 160px;">
          <apexchart
            type="area"
            ref="airTempChart"
            height="185"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "AirTemperature",
  data() {
    return {
      temp: 0,
      date: null,
      datacollection: {},
      series: [
        {
          name: "Temp",
          data: []
        }
      ],
      chartOptions: {
        chart: {
          type: "area",
          height: 160,
          sparkline: {
            enabled: true
          },
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 1000
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: 2
        },
        xaxis: {
          categories: [],
          type: "datetime"
        },

        yaxis: {
          opposite: true
        },
        colors: ["#009688"],
        tooltip: {
          theme: "dark",
          x: {
            show: true,
            format: "dd/MM/yy HH:mm"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            type: "vertical",
            shadeIntensity: 1,
            inverseColors: !1,
            opacityFrom: 0.4,
            opacityTo: 0.05,
            stops: [45, 100]
          }
        }
      }
    };
  },
  created() {
    this.fillChart();
    this.fetchData();
    this.refreshChart();
  },
  mounted() {},
  methods: {
    fillChart() {
      let end = new Date().getTime();
      let start = new Date().setTime(end - 24 * 60 * 60 * 1000);

      axios
        .get(
          "http://hydrobuddy.local:3000/api/stats/room.temperature?start=" +
            start +
            "end=" +
            end
        )
        .then(response => {
          let results = response.data;
          let dateresult = results.map(a => moment(a.timestamp).format());
          let valueresult = results.map(a => a.value);

          this.series = [
            {
              data: valueresult
            }
          ];

          this.chartOptions = {
            xaxis: {
              categories: dateresult
            }
          };
        })
        .catch(error => {
          console.log(error);
        });
    },
    fetchData() {
      this.sockets.subscribe("room.temperature", data => {
        this.temp = data;
      });
    },
    refreshChart() {
      setInterval(() => {
        this.fillChart();
      }, 300000);
    }
  },
  beforeDestroy() {
    clearInterval(this.refreshChart);
  }
};
</script>

<style></style>
