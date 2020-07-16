<template>
  <div>
    <h2>Leaderboard</h2>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            @input="onLeagueChange"
          />
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
          <th></th>
          <th>Pseudo</th>
          <th>Elo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ player, elo } in players" :key="player.id" class="table-dark">
          <td class="characters" :class="player.main_character" />
          <td>{{player.name}}</td>
          <td>{{ elo.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import vSelect from 'vue-select';

export default {
  name: 'Players',
  components: { vSelect },

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

    onLeagueChange(option) {
      this.getPlayers({ leagueId: option.code, name: this.search });
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
