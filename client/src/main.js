import Vue from 'vue';
import DashBoard from './DashBoard.vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import VueApexCharts from 'vue-apexcharts';

require('./assets/css/bootstrap.min.css');
require('./assets/css/main.css');
require('./assets/css/charts.css');
require('./assets/css/dash.css');
require('./assets/css/structure.css');

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO('http://hydrobuddy.local:3000'),
  })
);

Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(DashBoard),
  components: {
    apexchart: VueApexCharts,
  },
}).$mount('#app');
