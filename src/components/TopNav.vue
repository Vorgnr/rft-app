<template>
  <div class="uk-navbar-container uk-navbar-transparent top-nav">
    <nav uk-navbar>
      <div class="uk-navbar-left uk-light">
        <div style="padding-left: 40px; padding-right: 35px">
          <img width="55" height="55" alt="Vue logo" src="../assets/logo.png">
        </div>
        <ul class="uk-navbar-nav">
          <router-link tag="li" to="/matches">
            <a href="#">Matchs</a>
          </router-link>
          <router-link tag="li" to="/players">
            <a href="#">Joueurs</a>
          </router-link>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'TopNav',
};
</script>

<style>
  .top-nav {
    background-color: #3B3F59
  }
</style>
