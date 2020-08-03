<template>
  <div>
    <h1>Leaderboard</h1>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <v-select
            :options="leagues.map(({ id, name, rank_treshold: rankTreshold }) => (
              { label: name, code: id, rankTreshold  }
            ))"
            @input="onLeagueChange"
            :v-model="currentSelectedLeague"
            placeholder="Selectionnez une league"
            :clearable="false"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                Aucune league trouvée pour
                <em>{{ search }}</em>.
              </template>
              <span v-else>Aucune league</span>
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
          <th>Pos</th>
          <th>Char</th>
          <th>Pseudo</th>
          <th>Matchs</th>
          <th>Points</th>
          <th>Palier</th>
          <th v-if="isAuth"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({ player, elo }, index) in players" :key="player.id">
          <td>
            <span v-if="elo.value !== null">{{index+1}}</span>
          </td>
          <td class="character-thumbnail">
            <character-thumbnail :characters="player.main_character" />
          </td>
          <td>{{player.name}}</td>
          <td>{{ elo.played_matches }}</td>
          <td>{{ elo.value }}</td>
          <td>{{ getRank(elo.value) }}</td>
          <td>
            <router-link tag="a" :to="`/chart/${player.id}`" class="mr-3">
              <v-icon name="bar-chart-2" />
            </router-link>
                        <router-link v-if="isAuth" tag="a" :to="`/players/${player.id}`">
              <v-icon name="edit" />
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      v-if="!noMorePlayers"
      @click="getMorePlayers"
      type="button"
      class="btn btn-outline-primary btn-lg btn-block"
    >Voir plus</button>
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
      currentSelectedLeague: 'currentSelectedLeague',
    }),
    ...mapGetters('auth', {
      isAuth: 'isAuth',
    }),
  },

  methods: {
    ...mapActions('players', {
      fetchMorePlayers: 'fetchMore',
      listPlayers: 'list',
    }),
    ...mapActions('leagues', {
      listLeagues: 'list',
      setCurrentLeague: 'setCurrentLeague',
    }),
    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    ...mapGetters({
      loading: 'net/loading',
    }),

    getRank(eloValue) {
      if (eloValue === null) {
        return null;
      }

      if (!this.currentSelectedLeague) {
        return null;
      }

      return Math.floor(eloValue / this.currentSelectedLeague.rankTreshold);
    },

    debounceSearch(event) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.message = event.target.value;
        this.getPlayers({
          leagueId: this.currentSelectedLeague.code,
          name: this.search,
        });
      }, 600);
    },

    onLeagueChange(option) {
      this.setCurrentLeague(option);
      this.getPlayers({ leagueId: option.code, name: this.search });
    },

    async getPlayers({ leagueId, name }) {
      try {
        await this.listPlayers({
          params: {
            leagueId,
            name,
            withElo: 1,
            page: 1,
            perPage: this.perPage,
          },
        });
        this.page = 1;
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
        leagueId: this.currentSelectedLeague.code,
      };

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

    open(id) {
      this.$router.push({ name: 'player', params: { id } });
    },
  },

  async mounted() {
    await this.getLeagues();
    await this.getPlayers({ leagueId: this.currentSelectedLeague.code });
  },
};
</script>
