<template>
  <div>
    <h2>Leaderboard</h2>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            @input="onLeagueChange"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                Aucune league trouvée pour <em>{{ search }}</em>.
              </template>
              <span v-else> Aucune league </span>
            </template>
          </v-select>
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <input
            v-model="search"
            @input="debounceSearch"
            class="form-control"
            placeholder="Rechercher par pseudo..."
          />
        </div>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th></th>
          <th>Pseudo</th>
          <th>Matchs joués</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ player, elo } in players" :key="player.id">
          <td class="character-thumbnail">
            <character-thumbnail :characters="player.main_character" />
          </td>
          <td>{{player.name}}</td>
          <td>{{ elo.played_matches }}</td>
          <td>{{ elo.value }}</td>
        </tr>
      </tbody>
    </table>
    <button
      v-if="!noMorePlayers"
      @click="getMorePlayers"
      type="button"
      class="btn btn-outline-primary btn-lg btn-block">
      Voir plus
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import vSelect from 'vue-select';
import CharacterThumbnail from '../components/CharacterThumbnail.vue';

export default {
  name: 'Leaderboard',
  title: 'Leaderboard',
  components: { vSelect, CharacterThumbnail },

  data() {
    return {
      perPage: 30,
      page: 1,
      search: '',
    };
  },

  computed: {
    ...mapGetters('players', {
      players: 'list',
      noMorePlayers: 'noMoreItems',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
      currentLeagueId: 'currentLeagueId',
    }),
  },

  methods: {
    ...mapActions('players', {
      fetchMorePlayers: 'fetchMore',
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
        this.getPlayers({ leagueId: this.currentLeagueId, name: this.search });
      }, 600);
    },

    onLeagueChange(option) {
      this.getPlayers({ leagueId: option.code, name: this.search });
    },

    async getPlayers({ leagueId, name }) {
      try {
        await this.listPlayers({
          params: {
            leagueId, name, withElo: 1, page: 1, perPage: this.perPage,
          },
        });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getMorePlayers() {
      const payload = {
        name: this.search,
        perPage: this.perPage,
        page: this.page + 1,
        withElo: 1,
      };
      if (this.currentLeague) {
        payload.leagueId = this.currentLeague.code;
      }
      try {
        await this.fetchMorePlayers({ params: payload });
        this.page += 1;
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
    await this.getPlayers({ leagueId: this.currentLeagueId });
  },
};
</script>
