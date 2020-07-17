<template>
  <div class="row">
    <div class="col-lg-6">
    <h2>Nouveau joueur</h2>
      <form>
        <fieldset>
          <div class="form-group" :class="{'has-success':player.name}">
            <label for="name">Pseudo</label>
            <input
              class="form-control"
              v-model="player.name"
              type="text"
              placeholder="Pseudo"
              :class="{'is-valid':player.name}"
            />
          </div>
          <div class="form-group">
            <label for="name">Main</label>
            <character-select v-model="player.main_character" />
          </div>
        </fieldset>

        <button
          v-if="player.name"
          @click="submit"
          class="btn btn-secondary"
          type="button"
          :disabled="loading()"
        >
          <span
            v-if="loading()"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Get ready for ...
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CharacterSelect from '../components/CharacterSelect.vue';

export default {
  name: 'Inscription',
  components: {
    CharacterSelect,
  },

  data() {
    return {
      selectedCharacter: null,
      player: {
        name: '',
        main_character: null,
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
        this.$router.push({ name: 'leaderboard' });
      } catch (e) {
        this.notifyError(e);
      }
    },
  },
};
</script>
