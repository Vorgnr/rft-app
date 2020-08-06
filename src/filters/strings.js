import Vue from 'vue';

Vue.filter('capitalize', (value) => {
  if (typeof value !== 'string') return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('pluralize', (value, count) => {
  if (count > 1) {
    return `${value}s`;
  }
  return value;
});
