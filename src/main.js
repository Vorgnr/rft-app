import Vue from 'vue';
import icon from 'vue-icon';
import { VTooltip } from 'v-tooltip';
import VueConfirmDialog from 'vue-confirm-dialog';
import App from './App.vue';
import store from './store';
import api from './lib/api';
import router from './routes';
import title from './mixins/title';
import './filters';

Vue.use(VueConfirmDialog);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default);

Vue.use(VTooltip);
Vue.use(icon, 'v-icon');

Vue.directive('tooltip', VTooltip);
Vue.mixin(title);

api.connectStore(store);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
