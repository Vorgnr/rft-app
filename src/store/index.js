import Vue from 'vue';
import Vuex from 'vuex';

import players from './players';
import matches from './matches';
import net from './net';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    players,
    matches,
    net,
  },
});
