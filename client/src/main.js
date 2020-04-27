import Vue from 'vue';
import DashBoard from './DashBoard.vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';

const booleanFilter = function(value, trueText, falseText) {
  return value ? trueText || 'On' : falseText || 'Off';
};

Vue.filter('boolean', booleanFilter);

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
