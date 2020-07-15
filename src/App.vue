<template>
  <div id="app">
    <TopNav />
    <Notification />
    <div class="main container" >
      <router-view />
    </div>
    <Loader />
  </div>
</template>

<script>

import TopNav from './components/TopNav.vue';
import Notification from './components/Notification.vue';
import Loader from './components/Loader.vue';

export default {
  name: 'App',
  components: {
    TopNav,
    Loader,
    Notification,
  },
};
</script>

<style>
  body {
    padding-top: 100px;
  }
</style>
