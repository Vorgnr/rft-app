<template>
  <div class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <div class="container">
      <div class="navbar-brand">
        <img width="55" height="55" alt="Vue logo" src="../assets/logo.png" />
      </div>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <router-link tag="li" class="nav-item" to="/leaderboard">
            <a class="nav-link" href="#">Leaderboard</a>
          </router-link>
          <router-link tag="li" class="nav-item" to="/matches">
            <a class="nav-link" href="#">Matchs</a>
          </router-link>
          <router-link tag="li" class="nav-item" to="/matches/new">
            <a class="nav-link" href="#">Nouveau match</a>
          </router-link>
          <router-link tag="li" class="nav-item" to="/inscription">
            <a class="nav-link" href="#">Inscription</a>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopNav',
};
</script>
