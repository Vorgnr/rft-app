<template>
  <div id="app">
    <top-nav />
    <notification />
    <div class="main container" >
      <router-view />
    </div>
  </div>
</template>

<script>

import TopNav from './components/TopNav.vue';
import Notification from './components/Notification.vue';

import './styles/main.scss';

export default {
  name: 'App',
  components: {
    TopNav,
    Notification,
  },
};
</script>

<style>
  body {
    padding-top: 100px;
  }
</style>
