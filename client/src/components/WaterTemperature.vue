<template>
  <div>
    <span>Current Temp: {{ temp }}</span>
    <br />
    <line-chart :chart-data="datacollection"></line-chart>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import LineChart from './LineChart.vue';

export default {
  name: 'WaterTemperature',
  components: { LineChart },
  data() {
    return {
      temp: null,
      date: null,
      datacollection: {},
    };
  },
  created() {
    this.fetchData();
    this.fillData();
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      let end = new Date().getTime();
      let start = new Date().setTime(end - 12 * 60 * 60 * 1000);

      axios
        .get(
          'http://hydrobuddy.local:3000/api/stats/reservoir.temperature?start=' +
            start +
            'end=' +
            end
        )
        .then((response) => {
          let results = response.data;

          let dateresult = results.map((a) =>
            moment(a.timestamp).format('ddd Do, H:m')
          );
          let valueresult = results.map((a) => a.value);

          this.value = valueresult;
          this.date = dateresult;

          this.datacollection = {
            labels: this.date,
            datasets: [
              {
                label: 'Temperature',
                backgroundColor: '#3498db',
                data: this.value,
              },
            ],
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchData() {
      this.sockets.subscribe('reservoir.temperature', (data) => {
        let results = data.newTemperature.data;

        let dateresult = moment().unix;
        let valueresult = results.map((a) => a.value);

        this.value = valueresult;
        this.date = dateresult;

        this.datacollection = {
          labels: this.date,
          datasets: [
            {
              label: 'Temperature',
              backgroundColor: '#3498db',
              data: this.value,
            },
          ],
        };
      });
    },
  },
};
</script>

<style></style>
