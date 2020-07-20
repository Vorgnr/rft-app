import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

import Leaderboard from './views/Leaderboard.vue';
import Matches from './views/Matches.vue';
import Match from './views/Match.vue';
import Inscription from './views/Inscription.vue';
import CreateMatch from './views/CreateMatch.vue';
import Login from './views/Login.vue';

Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      mustNotBeAuth: true,
    },
  },
  { name: 'home', path: '/', component: Leaderboard },
  { name: 'matches', path: '/matches', component: Matches },
  {
    name: 'matches.new',
    path: '/matches/new',
    component: CreateMatch,
    meta: {
      mustBeAuth: true,
    },
  },
  { name: 'inscription', path: '/inscription', component: Inscription },
  {
    path: '/matches/:id',
    name: 'match',
    component: Match,
    meta: {
      mustBeAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = store.getters['auth/isAuth'];
  if (to.meta.mustBeAuth && !isAuth) {
    next({ name: 'login', query: { redirect: to.path } });
  }

  if (to.meta.mustNotBeAuth && isAuth) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
