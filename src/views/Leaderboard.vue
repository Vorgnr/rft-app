<template>
  <div>
    <h2>Leaderboard</h2>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <select class="custom-select" @change="onLeagueChange($event)">
            <option
              v-for="league in leagues"
              :key="league.id" :value="league.id"
            >{{ league.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <input
            v-model="search"
            @input="debounceSearch"
            class="form-control"
            placeholder="Rechercher par pseudo...">
        </div>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Pseudo</th>
          <th>Elo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ player, elo } in players" :key="player.id" class="table-dark">
          <td>{{player.name}}</td>
          <td>{{ elo.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Players',

  data() {
    return {
      search: '',
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

    debounceSearch(event) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.message = event.target.value;
        this.getPlayers({ leagueId: this.currentLeague.id, name: this.search });
      }, 600);
    },

    onLeagueChange(event) {
      this.getPlayers({ leagueId: event.target.value, name: this.search });
    },

    async getPlayers({ leagueId, name }) {
      try {
        await this.listPlayers({ params: { leagueId, name } });
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
  },

  async mounted() {
    await this.getLeagues();
    await this.getPlayers({ leagueId: this.currentLeague.id });
  },
};
</script>
