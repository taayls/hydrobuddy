import Vue from 'vue';
import DashBoard from './DashBoard.vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO('http://hydrobuddy.local:3000'),
  })
);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(DashBoard),
}).$mount('#app');
