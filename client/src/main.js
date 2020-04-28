import Vue from 'vue';
import DashBoard from './DashBoard.vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import VueApexCharts from 'vue-apexcharts';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

require('./assets/css/bootstrap.min.css');
require('./assets/css/main.css');
require('./assets/css/charts.css');
require('./assets/css/dash.css');
require('./assets/css/structure.css');

library.add(faCogs);

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO('http://hydrobuddy.local:3000'),
  })
);

Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(DashBoard),
  components: {
    apexchart: VueApexCharts,
  },
}).$mount('#app');
