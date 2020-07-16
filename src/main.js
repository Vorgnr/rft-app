import Vue from 'vue';
import App from './App.vue';
import api from './lib/api';
import store from './store';
import router from './routes';

api.connectStore(store);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
