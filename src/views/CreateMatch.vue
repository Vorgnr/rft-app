<template>
  <div>
    <h4>Nouveau match</h4>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label>League</label>
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            v-model="selectedLeague"
            @input="validForm"
          />
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label for="name">FT</label>
          <input class="form-control col-md-2" type="number" placeholder="FT" v-model="match.ft" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label>Player 1</label>
          <player-select
            :players="selectedPlayer2
              ? players.filter(p => selectedPlayer2.code !== p.id)
              : players"
            v-model="selectedPlayer1"
            @input="validForm"
          />
        </div>
      </div>
      <div class="col">
        <div class="form-group" v-if="selectedPlayer1">
          <label>Player 2</label>
          <player-select
            :players="players.filter(p => selectedPlayer1.code !== p.id)"
            v-model="selectedPlayer2"
            @input="validForm"
          />
        </div>
      </div>
    </div>
    <div v-if="selectedPlayer1 && selectedPlayer2">
      <div class="row">
        <div class="col">
          <div class="alert alert-dismissible alert-info">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            Vous pouvez laisser les scores vides si la rencontre n'a pas encore eu lieu.
          </div>
        </div>
      </div>
      <div class="row" >
        <div class="col">
          <div class="form-group">
            <label for="name">Score player 1</label>
            <input
              class="form-control col-md-4"
              type="number"
              placeholder="Score player 1"
              v-model="match.player1_score"
            />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="name">Score player 2</label>
            <input
              class="form-control col-md-4"
              type="number"
              placeholder="Score player 2"
              v-model="match.player2_score"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button
          v-if="matchIsValid"
          @click="submit"
          class="btn btn-primary"
          type="button"
          :disabled="loading()"
        >
          <span
            v-if="loading()"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Fight
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import { mapActions, mapGetters } from 'vuex';
import PlayerSelect from '../components/PlayerSelect.vue';

export default {
  name: 'Leaderboard',
  components: { vSelect, PlayerSelect },

  data() {
    return {
      matchIsValid: false,
      selectedLeague: null,
      selectedPlayer1: null,
      selectedPlayer2: null,
      match: {
        ft: 10,
      },
    };
  },

  computed: {
    ...mapGetters('players', {
      players: 'list',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
      currentLeague: 'currentLeague',
    }),
  },

  methods: {
    ...mapActions('matches', {
      save: 'save',
    }),
    ...mapActions('players', {
      listPlayers: 'list',
    }),
    ...mapActions('leagues', {
      listLeagues: 'list',
    }),
    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    ...mapGetters({
      loading: 'net/loading',
    }),

    async getPlayers() {
      try {
        await this.listPlayers();
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getLeagues() {
      try {
        await this.listLeagues();
      } catch (e) {
        this.notifyError(e);
      }
    },

    async submit() {
      const match = {
        ...this.match,
        player1_id: this.selectedPlayer1.code,
        player2_id: this.selectedPlayer2.code,
        league_id: this.selectedLeague.code,
      };
      try {
        await this.save(match);
        this.notify({ title: 'Match enregistré', type: 'success' });
        this.$router.push({ name: 'matches' });
      } catch (e) {
        this.notifyError(e);
      }
    },

    validForm() {
      if (
        this.selectedPlayer1
        && this.selectedPlayer2
        && this.match.ft > 0
        && this.selectedLeague
      ) {
        this.matchIsValid = true;
      } else {
        this.matchIsValid = false;
      }
    },
  },

  async mounted() {
    await this.getLeagues();
    await this.getPlayers();
  },
};
</script>
