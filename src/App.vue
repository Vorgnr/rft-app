<template>
  <div id="app">
    <top-nav @signout="submitSignout" :is-auth="isAuth" v-if="$route.name !== 'login'" />
    <notification />
    <div class="main container">
      <router-view v-if="!loading" />
      <div v-if="loading" class="d-flex justify-content-center" style="padding-top: 25vh">
        <div class="spinner-border text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <app-footer v-if="$route.name !== 'login'" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TopNav from './components/TopNav.vue';
import AppFooter from './components/AppFooter.vue';
import Notification from './components/Notification.vue';

import './styles/main.scss';

export default {
  name: 'App',
  components: {
    TopNav,
    Notification,
    AppFooter,
  },

  computed: {
    ...mapGetters('auth', {
      isAuth: 'isAuth',
      loading: 'loading',
    }),
  },

  methods: {
    ...mapActions('auth', {
      getSession: 'getSession',
      signout: 'signout',
    }),

    async submitSignout() {
      await this.signout();
      this.$router.push({ name: 'home' });
    },
  },

  async created() {
    await this.getSession();
  },
};
</script>
