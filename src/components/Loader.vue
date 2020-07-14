<template>
  <div uk-spinner v-if="loading" />
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Loader',
  computed: {
    ...mapGetters({
      loading: 'net/loading',
    }),
  },
};
</script>
