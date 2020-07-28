import Vue from 'vue';
import format from 'date-fns/format';

Vue.filter('format',
  (value) => value && format(new Date(value), 'dd/MM/yyyy HH:mm'));

Vue.filter('formatForServer',
  (value) => value && format(new Date(value), 'yyyy-MM-dd HH:mm:ss'));
