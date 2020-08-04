<template>
  <div v-if="match.match">
    <div class="row mb-3">
      <div class="col">
        <a href="#" @click="$router.go(-1)">
          <v-icon name="arrow-left" />Retour
        </a>
      </div>
    </div>
    <div class="card border-primary mb-3" style="max-width: 40rem;">
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
          <li
            v-if="match.match.moderated_at"
            class="card-text"
          >Moderé le {{ match.match.moderated_at | format }}</li>
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
          <div class="card mb-3">
            <div class="card-header">{{ match.player1.name }}</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">Score</label>
                <input
                  :disabled="matchIsCompleted"
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
              <div class="row" v-if="!matchIsCompleted">
                <div class="col">
                  <div class="form-group">
                    <button
                      @click="toogleForfeit(1)"
                      class="btn"
                      :class="!match.match.player1_forfeit ? 'btn-outline-warning' : 'btn-warning'"
                    >
                      <span
                        v-if="match.match.player1_forfeit"
                      >{{ match.player1.name }} ne s'est pas présenté</span>
                      <span v-if="!match.match.player1_forfeit">Non effectué</span>
                    </button>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <button
                      @click="toogleRageQuit(1)"
                      class="btn"
                      :class="!match.match.player1_ragequit ? 'btn-outline-warning' : 'btn-warning'"
                    >
                      <span
                        v-if="match.match.player1_ragequit"
                      >{{ match.player1.name }} à quitté le match</span>
                      <span v-if="!match.match.player1_ragequit">RQ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mb-3">
            <div class="card-header">{{ match.player2.name }}</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">Score</label>
                <input
                  :disabled="matchIsCompleted"
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
              <div class="row" v-if="!matchIsCompleted">
                <div class="col">
                  <div class="form-group">
                    <button
                      @click="toogleForfeit(2)"
                      class="btn"
                      :class="!match.match.player2_forfeit ? 'btn-outline-warning' : 'btn-warning'"
                    >
                      <span
                        v-if="match.match.player2_forfeit"
                      >{{ match.player2.name }} ne s'est pas présenté</span>
                      <span v-if="!match.match.player2_forfeit">Non effectué</span>
                    </button>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <button
                      @click="toogleRageQuit(2)"
                      class="btn"
                      :class="!match.match.player2_ragequit ? 'btn-outline-warning' : 'btn-warning'"
                    >
                      <span
                        v-if="match.match.player2_ragequit"
                      >{{ match.player2.name }} à quitté le match</span>
                      <span v-if="!match.match.player2_ragequit">RQ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="matchIsCompleted">
      <div class="col-md-6">
        <date-time
          :value="match.match.completed_at"
          title="Terminé le"
          @input="formatCompletedAtDate"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-auto mr-auto">
        <button
          v-if="canUpdate"
          @click="submit"
          class="btn btn-primary" type="button">Mettre à jour</button>
        <button
          v-if="canModerate"
          @click="submitModerate"
          class="btn btn-primary"
          type="button"
        >Valider et distribuer les points</button>
      </div>
      <div class="col-auto" v-if="!this.match.match.moderated_at">
        <button @click="cancelMatch" class="btn btn-warning">Annuler le match</button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import { mapActions, mapGetters } from 'vuex';
import CharacterSelect from '../components/CharacterSelect.vue';
import DateTime from '../components/DateTime.vue';

export default {
  name: 'Match',
  title: 'Match',

  components: { vSelect, CharacterSelect, DateTime },

  data() {
    return {
      completed_at_date: null,
      completed_at_hour: null,
      completed_at_minute: null,
    };
  },

  computed: {
    ...mapGetters('matches', {
      match: 'item',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
    }),
    ...mapGetters('auth', {
      isAdmin: 'isAdmin',
      authPlayer: 'player',
    }),

    matchIsCompleted() {
      return Boolean(this.match.match.completed_at);
    },

    canModerate() {
      return (
        this.matchIsCompleted && !this.match.match.moderated_at && this.isAdmin
      );
    },

    canUpdate() {
      if (this.isAdmin) {
        return true;
      }

      return (
        [this.match.match.player1_id, this.match.match.player2_id].indexOf(
          this.authPlayer.id,
        ) > -1
      );
    },
  },

  methods: {
    ...mapActions('matches', {
      getById: 'getById',
      update: 'update',
      moderate: 'moderate',
      cancel: 'cancel',
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

    toogleForfeit(playerIndex) {
      if (playerIndex === 1) {
        this.match.match.player1_forfeit = !this.match.match.player1_forfeit;
        if (this.match.match.player1_forfeit) {
          this.match.match.player2_forfeit = false;
          this.match.match.player1_ragequit = false;
          this.match.match.player2_ragequit = false;
        }
      }

      if (playerIndex === 2) {
        this.match.match.player2_forfeit = !this.match.match.player2_forfeit;
        if (this.match.match.player2_forfeit) {
          this.match.match.player1_forfeit = false;
          this.match.match.player1_ragequit = false;
          this.match.match.player2_ragequit = false;
        }
      }
    },

    toogleRageQuit(playerIndex) {
      if (playerIndex === 1) {
        this.match.match.player1_ragequit = !this.match.match.player1_ragequit;
        if (this.match.match.player1_ragequit) {
          this.match.match.player2_ragequit = false;
          this.match.match.player1_forfeit = false;
          this.match.match.player2_forfeit = false;
        }
      }

      if (playerIndex === 2) {
        this.match.match.player2_ragequit = !this.match.match.player2_ragequit;
        if (this.match.match.player2_ragequit) {
          this.match.match.player1_ragequit = false;
          this.match.match.player1_forfeit = false;
          this.match.match.player2_forfeit = false;
        }
      }
    },

    formatCompletedAtDate(date) {
      this.match.match.completed_at = date;
    },

    cancelMatch() {
      this.$confirm({
        message: 'Annuler le match ?',
        button: {
          no: 'Non',
          yes: 'Oui',
        },
        callback: async (confirm) => {
          if (confirm) {
            try {
              await this.cancel({ matchId: this.$route.params.id });
              this.notify({ title: 'Match annulé', type: 'success' });
              this.$router.push({ name: 'matches' });
            } catch (e) {
              this.notifyError(e);
            }
          }
        },
      });
    },

    async submit() {
      if (this.match.match.completed_at) {
        this.match
          .match.completed_at = this.$options
            .filters.formatForServer(this.match.match.completed_at);
      }

      try {
        await this.update({
          matchId: this.$route.params.id,
          body: this.match.match,
        });
        this.notify({ title: 'Match mis à jour', type: 'success' });
        this.$router.push({ name: 'matches' });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async submitModerate() {
      this.$confirm({
        message: 'Modérer le match et distribuer les points ?',
        button: {
          no: 'Non',
          yes: 'Oui',
        },
        callback: async (confirm) => {
          if (confirm) {
            try {
              await this.moderate({ matchId: this.$route.params.id });
              this.notify({ title: 'Match modéré', type: 'success' });
              this.$router.push({ name: 'matches' });
            } catch (e) {
              this.notifyError(e);
            }
          }
        },
      });
    },
  },

  async created() {
    await this.getMatch();
  },
};
</script>
