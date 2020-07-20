import api from '@/lib/api';

const mutations = {
  setList(s, list) {
    s.isLazy = true;
    s.list = list;
    const [currentLeague] = list;
    s.currentLeagueId = currentLeague && currentLeague.id;
  },
};

const actions = {
  async list({ commit, state }) {
    const payload = {
      method: 'GET',
    };

    if (!state.isLazy) {
      const response = await api
        .from('leagues')
        .request(payload);

      commit('setList', response.data);
    }
  },
};

const getters = {
  list: (s) => s.list,
  currentLeagueId: (s) => s.currentLeagueId,
};

export default {
  namespaced: true,
  actions,
  mutations,
  state: {
    isLazy: false,
    list: [],
  },
  getters,
};
