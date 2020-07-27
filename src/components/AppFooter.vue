<template>
  <footer style="margin-top: 1.5rem" class="page-footer font-small pt-4 bg-dark">
    <div class="container text-center">
      <div class="row">
        <div class="col">
          <p>
            <router-link tag="a" to="/" class="center">Retour</router-link>
          </p>
        </div>
        <div class="col">
          <p>
            <a href="#top">Haut de la page</a>
          </p>
        </div>
        <div class="col">
          <p>
            <router-link tag="a" to="/rules" class="center">Règles du ranking</router-link>
          </p>
        </div>
        <div class="col">
          <p>
            © 2020 Copyright
            <a href="http://ranking-tekken.fr/">
              <strong>RFT</strong>
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>
