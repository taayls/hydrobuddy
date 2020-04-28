<template>
  <div class="widget widget-chart-three">
    <div class="widget-heading">
      <div class="">
        <h5 class="">PH Level - {{ ph }}</h5>
      </div>
    </div>
    <div class="widget-content" style="position: relative;">
      <div style="min-height: 365px;">
        <apexchart
          type="area"
          ref="phLevelChart"
          height="350"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'PHLevels',
  data() {
    return {
      ph: 0,
      date: null,
      datacollection: {},
      series: [
        {
          name: 'PH',
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        xaxis: {
          categories: [],
          type: 'datetime',
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontSize: '14px',
          markers: {
            width: 10,
            height: 10,
          },
          itemMargin: {
            horizontal: 0,
            vertical: 8,
          },
        },
        yaxis: {
          opposite: true,
        },
        colors: ['#e2a03f'],
        grid: {
          borderColor: '#191e3a',
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: true,
            format: 'dd/MM/yy HH:mm',
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            type: 'vertical',
            shadeIntensity: 1,
            inverseColors: !1,
            opacityFrom: 0.4,
            opacityTo: 0.05,
            stops: [45, 100],
          },
        },
      },
    };
  },
  created() {
    this.fillChart();
    this.fetchData();
  },
  mounted() {},
  methods: {
    fillChart() {
      let end = new Date().getTime();
      let start = new Date().setTime(end - 24 * 60 * 60 * 1000);

      axios
        .get(
          'http://hydrobuddy.local:3000/api/stats/reservoir.ph?start=' +
            start +
            'end=' +
            end
        )
        .then((response) => {
          let results = response.data;
          let dateresult = results.map((a) => moment(a.timestamp).format());
          let valueresult = results.map((a) => a.value);

          this.series = [
            {
              data: valueresult,
            },
          ];

          this.chartOptions = {
            xaxis: {
              categories: dateresult,
            },
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchData() {
      this.sockets.subscribe('reservoir.ph', (data) => {
        this.ph = data;
        this.fillChart();
      });
    },
  },
};
</script>

<style></style>
