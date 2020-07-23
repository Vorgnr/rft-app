<template>
  <div class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <div class="container">
      <router-link tag="a" class="nav-brand" to="/">
        <img width="70" height="28" alt="Vue logo" src="../assets/logo.png" />
      </router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <router-link tag="li" class="nav-item" to="/matches">
            <a class="nav-link" href="#">Matchs</a>
          </router-link>
          <router-link v-if="isAuth" tag="li" class="nav-item" to="/matches/new">
            <a class="nav-link" href="#">Nouveau match</a>
          </router-link>
        </ul>
        <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
          <router-link v-if="isAuth" tag="li" class="nav-item" to="/profile">
            <a class="nav-link" href="#"><v-icon name="user" /></a>
          </router-link>
          <router-link v-if="!isAuth" tag="li" class="nav-item" to="/inscription">
            <a class="nav-link" href="#">Inscription</a>
          </router-link>
          <router-link v-if="!isAuth" tag="li" class="nav-item" to="/login">
            <a class="nav-link" href="#">Login</a>
          </router-link>
          <li v-if="isAuth" @click="$emit('signout')" class="nav-item">
            <a class="nav-link" href="#">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopNav',

  props: {
    isAuth: Boolean,
  },
};
</script>
