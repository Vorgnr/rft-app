import api from '@/lib/api';

const actions = {
  async signin({ commit }, form) {
    try {
      const request = await api
        .from('auth')
        .post('/signin', form);
      commit('setPlayer', request.data);
    } catch (err) {
      commit('setError', err);
    }
  },

  async signout({ commit }) {
    try {
      await api
        .from('auth')
        .post('/signout');
      commit('signout');
    } catch (err) {
      commit('setError', err);
    }
  },

  async getSession({ commit, state }) {
    if (!state.isAuth) {
      const request = await api
        .from('auth')
        .get('/');

      if (request.data) {
        commit('setPlayer', request.data);
      }
    }
    commit('loading', false);
  },
};

const mutations = {
  setError(state, error) {
    state.error = error;
  },
  setPlayer(state, player) {
    state.isAuth = true;
    state.player = player;
  },
  signout(state) {
    state.isAuth = false;
    state.player = null;
  },
  loading(state, value) {
    state.loading = value;
  },
};

const getters = {
  email: (state) => state.email,
  password: (state) => state.password,
  error: (state) => state.error,
  player: (state) => state.player,
  isAuth: (state) => state.isAuth,
  isAdmin: (state) => state.player && Boolean(state.player.is_admin),
  loading: (state) => state.loading,
};

export default {
  namespaced: true,
  state: {
    isAuth: false,
    email: null,
    password: null,
    error: null,
    player: null,
    loading: true,
  },
  actions,
  getters,
  mutations,
};
