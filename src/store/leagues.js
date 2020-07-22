import api from '@/lib/api';

const mutations = {
  setList(s, list) {
    s.isLazy = true;
    s.list = list;
    const [currentLeague] = list;
    if (currentLeague) {
      s.currentSelectedLeague = { code: currentLeague.id, label: currentLeague.name };
    }
  },
  setCurrentLeague(s, selectedLeague) {
    s.currentSelectedLeague = selectedLeague;
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

  setCurrentLeague({ commit }, selectedLeague) {
    commit('setCurrentLeague', selectedLeague);
  },
};

const getters = {
  list: (s) => s.list,
  currentLeagueId: (s) => s.currentLeagueId,
  currentSelectedLeague: (s) => s.currentSelectedLeague,
};

export default {
  namespaced: true,
  actions,
  mutations,
  state: {
    isLazy: false,
    list: [],
    currentSelectedLeague: null,
  },
  getters,
};
