import { createApp } from 'vue';
import './registerServiceWorker';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import App from './App.vue';

import layout from './layout/index';
import HomePage from './HomePage.vue';
import readings from './readings/index';

const routes: Array<RouteRecordRaw> = [
  ...readings.routes,
  { path: '/', component: HomePage },
  /*
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" * / '../views/AboutView.vue')
  }
  */
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App)
  .component('DefaultPage', layout.components.DefaultPage)
  .use(router)
  .mount('#app');
