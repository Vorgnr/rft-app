import api from '@/lib/api';

const state = {
  list: [],
  noMoreItems: false,
};

const mutations = {
  setList(s, list) {
    s.list = list;
    s.noMoreItems = !list.length;
  },
  appendToList(s, list) {
    if (list.length) {
      s.list = [...s.list, ...list];
    } else {
      s.noMoreItems = true;
    }
  },
};

const callList = (obj) => {
  const payload = {
    method: 'GET',
    params: obj.params,
  };

  return api
    .from('players')
    .request(payload);
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

  async fetchMore({ commit }, obj = {}) {
    const response = await callList(obj);
    commit('appendToList', response.data);
  },

  async list({ commit }, obj = {}) {
    const response = await callList(obj);
    commit('setList', response.data);
  },
};

const getters = {
  list: (s) => s.list,
  noMoreItems: (s) => s.noMoreItems,
};

export default {
  namespaced: true,
  actions,
  mutations,
  state,
  getters,
};
