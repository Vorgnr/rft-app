<template>
  <div id="app">
    <TopNav />
    <div class="main uk-container uk-light" >
      <router-view />
    </div>
    <Loader />
  </div>
</template>

<script>

import TopNav from './components/TopNav.vue';
import Loader from './components/Loader.vue';

export default {
  name: 'App',
  components: {
    TopNav,
    Loader,
  },
};
</script>

<style>
  /* https://www.colorffy.com/palettes/60 */
  body {
    background-color: #5D688A;
    min-height: 100vh;
  }
</style>
