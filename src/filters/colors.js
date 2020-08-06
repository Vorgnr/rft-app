import Vue from 'vue';

Vue.filter('hexToRgb',
  (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  });

Vue.filter('stringToColour',
  (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i += 1) {
    // eslint-disable-next-line no-bitwise
      const value = (hash >> (i * 8)) & 0xFF;
      colour += (`00${value.toString(16)}`).substr(-2);
    }
    return colour;
  });
