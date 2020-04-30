import Vue from 'vue';
import Router from 'vue-router';
import DashBoard from '@/components/DashBoard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DashBoard',
      component: DashBoard,
    },
  ],
});
