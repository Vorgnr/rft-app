import Vue from 'vue';
import icon from 'vue-icon';
import App from './App.vue';
import store from './store';
import api from './lib/api';
import router from './routes';
import title from './mixins/title';
import './filters';

Vue.use(icon, 'v-icon');
Vue.mixin(title);

api.connectStore(store);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
