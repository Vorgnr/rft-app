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
      .from('players')
      .request(payload);
  },

  async list({ commit }, { params }) {
    const payload = {
      method: 'GET',
      params,
    };

    const response = await api
      .from('players')
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
