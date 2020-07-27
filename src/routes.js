import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

import Leaderboard from './views/Leaderboard.vue';
import Matches from './views/Matches.vue';
import Match from './views/Match.vue';
import Inscription from './views/Inscription.vue';
import CreateMatch from './views/CreateMatch.vue';
import Login from './views/Login.vue';
import Player from './views/Player.vue';
import Rules from './views/Rules.vue';

Vue.use(VueRouter);

Vue.config.productionTip = false;

const mustBeAuth = (to, from, next) => {
  if (store.getters['auth/isAuth']) {
    next();
  } else {
    next({ name: 'login', query: { redirect: to.path } });
  }
};

const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
  { name: 'home', path: '/', component: Leaderboard },
  {
    name: 'profile', path: '/profile', component: Player, beforeEnter: mustBeAuth,
  },
  { name: 'matches', path: '/matches', component: Matches },
  { name: 'rules', path: '/rules', component: Rules },
  {
    name: 'matches.new',
    path: '/matches/new',
    component: CreateMatch,
    beforeEnter: mustBeAuth,
  },
  { name: 'inscription', path: '/inscription', component: Inscription },
  {
    path: '/matches/:id',
    name: 'match',
    component: Match,
    beforeEnter: mustBeAuth,
  },
  {
    path: '/players/:id',
    name: 'player',
    component: Player,
    beforeEnter: mustBeAuth,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
