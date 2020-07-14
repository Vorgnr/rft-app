import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import api from './lib/api';
import store from './store';

import Players from './views/Players.vue';
import Matches from './views/Matches.vue';

api.connectStore(store);

Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
  { path: '/players', component: Players },
  { path: '/matches', component: Matches },
];

const router = new VueRouter({
  routes,
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
