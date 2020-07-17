import Vue from 'vue';
import format from 'date-fns/format';

Vue.filter('format',
  (value) => value && format(new Date(value), 'dd/MM/yyyy HH:mm'));
