import Vue from 'vue';
import VueRouter from 'vue-router';

import Leaderboard from './views/Leaderboard.vue';
import Matches from './views/Matches.vue';
import Inscription from './views/Inscription.vue';

Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
  { name: 'leaderboard', path: '/leaderboard', component: Leaderboard },
  { name: 'matches', path: '/matches', component: Matches },
  { name: 'inscription', path: '/inscription', component: Inscription },
];

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
