module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = process.env.APP_VUE_TITLE;
        return args;
      });
  },
};
