<template>
  <div v-if="match.match">
    <div
      :class="match.match.completed_at ? 'border-primary' : 'border-info'"
      class="card border-primary mb-3"
      style="max-width: 40rem;"
    >
      <div class="card-body">
        <h4 class="card-title">
          {{match.player1.name}} Vs {{match.player2.name}}
          <span
            v-if="match.match.player1_score"
          >{{match.match.player1_score}}-{{match.match.player2_score}}</span>
        </h4>
        <ul>
          <li>Crée le {{ match.match.created_at | format }}</li>
          <li
            v-if="match.match.completed_at"
            class="card-text"
          >Terminé le {{ match.match.completed_at | format }}</li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label>League</label>
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            :value="match.match.league_id"
            disabled
          />
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label for="name">FT</label>
          <input
            disabled
            class="form-control col-md-2"
            type="number"
            placeholder="FT"
            :value="match.match.ft"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="row">
        <div class="col">
          <div class="card border-info mb-3">
            <div class="card-header">{{ match.player1.name }}</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">Score</label>
                <input
                  :disabled="disabled"
                  class="form-control col-md-4"
                  type="number"
                  :placeholder="`Score ${match.player1.name}`"
                  v-model="match.match.player1_score"
                />
              </div>
              <div class="form-group">
                <label>Perso {{ match.player1.name }}</label>
                <character-select
                  v-model="match.match.character1"
                  :placeholder="`Perso ${match.player1.name}`"
                  multiple
                />
              </div>
              <div class="form-group">
                <button
                  class="btn"
                  :disabled="disabled"
                  @click="toogleRageQuit(1)"
                  :class="!match.match.player1_ragequit ? 'btn-outline-warning' : 'btn-warning'"
                >
                  <span
                    v-if="match.match.player1_ragequit"
                  >
                    {{ match.player1.name }} à abandonné
                  </span>
                  <span v-if="!match.match.player1_ragequit">Abandon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card border-warning mb-3">
            <div class="card-header">{{ match.player2.name }}</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">Score</label>
                <input
                  :disabled="disabled"
                  class="form-control col-md-4"
                  type="number"
                  :placeholder="`Score ${match.player2.name}`"
                  v-model="match.match.player2_score"
                />
              </div>
              <div class="form-group">
                <label>Perso {{ match.player2.name }}</label>
                <character-select
                  v-model="match.match.character1"
                  :placeholder="`Perso ${match.player2.name}`"
                  multiple
                />
              </div>
              <div class="form-group">
                <button
                  :disabled="disabled"
                  @click="toogleRageQuit(2)"
                  class="btn"
                  :class="!match.match.player2_ragequit ? 'btn-outline-warning' : 'btn-warning'"
                >
                  <span
                    v-if="match.match.player2_ragequit"
                  >
                    {{ match.player2.name }} à abandonné
                  </span>
                  <span v-if="!match.match.player2_ragequit">Abandon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="!disabled">
      <div class="col">
        <button @click="submit" class="btn btn-primary" type="button">Mettre à jour</button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import { mapActions, mapGetters } from 'vuex';
import CharacterSelect from '../components/CharacterSelect.vue';

export default {
  name: 'Match',

  components: { vSelect, CharacterSelect },

  computed: {
    ...mapGetters('matches', {
      match: 'item',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
    }),

    disabled() {
      return !!this.match.match.completed_at;
    },
  },

  methods: {
    ...mapActions('matches', {
      getById: 'getById',
      update: 'update',
    }),
    ...mapActions('leagues', {
      listLeagues: 'list',
    }),
    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    async getMatch() {
      try {
        await this.getById({ matchId: this.$route.params.id });
      } catch (e) {
        this.notifyError(e);
      }
    },

    toogleRageQuit(playerIndex) {
      if (playerIndex === 1) {
        this.match.match.player1_ragequit = !this.match.match.player1_ragequit;
        if (this.match.match.player1_ragequit) {
          this.match.match.player2_ragequit = false;
        }
      }

      if (playerIndex === 2) {
        this.match.match.player2_ragequit = !this.match.match.player2_ragequit;
        if (this.match.match.player2_ragequit) {
          this.match.match.player1_ragequit = false;
        }
      }
    },

    async submit() {
      const body = {
        player1_score: this.match.match.player1_score,
        player2_score: this.match.match.player2_score,
        character1: this.match.match.character1,
        character2: this.match.match.character2,
      };
      try {
        await this.update({ matchId: this.$route.params.id, body });
        this.notify({ title: 'Match mis à jour', type: 'success' });
        this.$router.push({ name: 'matches' });
      } catch (e) {
        this.notifyError(e);
      }
    },
  },

  async created() {
    await this.getMatch();
  },
};
</script>
