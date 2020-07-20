export default {
  created() {
    const { title } = this.$options;
    if (title) {
      document.title = `${title} | ${process.env.VUE_APP_TITLE}`;
    }
  },
};
