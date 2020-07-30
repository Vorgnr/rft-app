import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

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
    component: import('@/src/views/Login.vue'),
  },
  { name: 'home', path: '/', component: import('@/src/views/Leaderboard.vue') },
  {
    name: 'profile', path: '/profile', component: import('@/src/views/Player.vue'), beforeEnter: mustBeAuth,
  },
  { name: 'matches', path: '/matches', component: import('@/src/views/Matches.vue') },
  { name: 'rules', path: '/rules', component: import('@/src/views/Rules.vue') },
  {
    name: 'forgotten-password',
    path: '/forgotten-password',
    component: import('@/src/views/ForgottenPassword.vue'),
  },
  {
    name: 'password-recover',
    path: '/password-recover/:token',
    component: import('@/src/views/PasswordRecover.vue'),
  },
  {
    name: 'matches.new',
    path: '/matches/new',
    component: import('@/src/views/CreateMatch.vue'),
    beforeEnter: mustBeAuth,
  },
  { name: 'inscription', path: '/inscription', component: import('@/src/views/Inscription.vue') },
  {
    path: '/matches/:id',
    name: 'match',
    component: import('@/src/views/Match.vue'),
    beforeEnter: mustBeAuth,
  },
  {
    path: '/players/:id',
    name: 'player',
    component: import('@/src/views/Player.vue'),
    beforeEnter: mustBeAuth,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch('auth/getSession');
  next();
});

export default router;
