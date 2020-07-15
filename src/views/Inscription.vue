<template>
  <div class="row">
    <div class="col-lg-6">
      <form>
        <fieldset>
          <legend>Nouveau joueur</legend>
          <div class="form-group" :class="{'has-success':player.name}">
            <label for="name">Pseudo</label>
              <input
                class="form-control"
                v-model="player.name"
                type="text"
                placeholder="Pseudo"
                :class="{'is-valid':player.name}"
              >
          </div>
        </fieldset>
        <button
          v-if="player.name"
          @click="submit"
          class="btn btn-secondary"
          type="button"
          :disabled="loading()"
        >
          <span v-if="loading()"
            class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
          ></span>
          Enregistrer
        </button>
      </form>
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Inscription',

  data() {
    return {
      player: {
        name: '',
      },
    };
  },

  methods: {
    ...mapActions('players', {
      save: 'save',
    }),

    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    ...mapGetters({
      loading: 'net/loading',
    }),

    async submit() {
      try {
        await this.save(this.player);
        this.notify({ title: 'Joueur enregistré', type: 'success' });
        this.$router.push({ name: 'players' });
      } catch (e) {
        this.notifyError(e);
      }
    },
  },

};
</script>
