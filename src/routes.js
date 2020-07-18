import Vue from 'vue';
import VueRouter from 'vue-router';

import Leaderboard from './views/Leaderboard.vue';
import Matches from './views/Matches.vue';
import Match from './views/Match.vue';
import Inscription from './views/Inscription.vue';
import CreateMatch from './views/CreateMatch.vue';

Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
  { name: 'leaderboard', path: '/leaderboard', component: Leaderboard },
  { name: 'matches', path: '/matches', component: Matches },
  { name: 'matches.new', path: '/matches/new', component: CreateMatch },
  { name: 'inscription', path: '/inscription', component: Inscription },
  {
    path: '/matches/:id',
    name: 'match',
    component: Match,
  },
];

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
