import axios from 'axios';

const instances = new Map();
const apiEndpoint = process.env.VUE_APP_API_ENDPOINT;

console.log('p.env', process.env);

if (!apiEndpoint) {
  console.error('Not registered api ');
}

export default {
  connectStore(store) {
    this.store = store;
  },

  from(prefix, useLoader = true) {
    const instKey = prefix + useLoader;
    if (!instances.has(instKey)) {
      const inst = axios.create({
        baseURL: `${apiEndpoint}/${prefix ? `${prefix}/` : ''}`,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json',
      });

      if (useLoader) {
        inst.interceptors.request.use((config) => {
          this.store.commit('net/increment');
          return config;
        });

        inst.interceptors.response.use((response) => {
          this.store.commit('net/decrement');
          return response;
        }, (error) => {
          console.error(error.response);
          this.store.commit('net/decrement');
        });
      }

      instances.set(instKey, inst);
    }
    return instances.get(instKey);
  },
};
