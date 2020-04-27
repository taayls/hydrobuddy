import Vue from 'vue';
import DashBoard from './DashBoard.vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';

require('./assets/css/main.css');

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO('http://hydrobuddy.local:3000'),
  })
);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(DashBoard),
}).$mount('#app');
