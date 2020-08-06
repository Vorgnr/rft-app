import Vue from 'vue';

Vue.filter('percent', (number, total) => ((number / total) * 100).toFixed(2));
