import api from '@/lib/api';

const state = {
  list: [],
};

const mutations = {
  setList(s, list) {
    s.list = list;
  },
};

const actions = {
  save(_, player) {
    const payload = {
      method: 'POST',
      data: player,
    };
    return api
      .from('matches')
      .request(payload);
  },

  async list({ commit }, obj = {}) {
    const payload = {
      method: 'GET',
      params: obj.params,
    };

    const response = await api
      .from('matches')
      .request(payload);

    commit('setList', response.data);
  },
};

const getters = {
  list: (s) => s.list,
};

export default {
  namespaced: true,
  actions,
  mutations,
  state,
  getters,
};
