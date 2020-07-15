import api from '@/lib/api';

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
};

export default {
  namespaced: true,
  actions,
};
