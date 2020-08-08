import Vue from 'vue';
import format from 'date-fns/format';

Vue.filter('formatPrettier',
  (value) => value && format(new Date(value), "'le' dd/MM/yyyy 'à' HH:mm"));

Vue.filter('formatPrettierAndWeek',
  (value) => value && format(new Date(value), "'le' dd/MM/yyyy 'à' HH:mm 'Semaine' w"));

Vue.filter('formatForServer',
  (value) => value && format(new Date(value), 'yyyy-MM-dd HH:mm:ss'));
