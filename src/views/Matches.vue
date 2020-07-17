<template>
  <div>
    <h2>Matches</h2>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            v-model="currentLeague"
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
            placeholder="Rechercher par pseudo..."
          />
        </div>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Player 1</th>
          <th></th>
          <th>Elo</th>
          <th>Score</th>
          <th class="borderl allignr">Score 2</th>
          <th>Elo</th>
          <th></th>
          <th class="allignr">Player 2</th>
          <th class="borderl">Terminé</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ player1, player2, match } in matches" :key="match.id">
          <td :class="getMatchCssClass(1, match)" class="character-thumbnail">
            <character-thumbnail :characters="match.character1 || player1.main_character" />
          </td>
          <td :class="getMatchCssClass(1, match)">{{ player1.name }}</td>
          <td :class="getMatchCssClass(1, match)">{{ match.player1_elo }}</td>
          <td :class="getMatchCssClass(1, match)">{{ match.player1_score }}</td>
          <td class="borderl allignr"
            :class="getMatchCssClass(2, match)">{{ match.player2_score }}</td>
          <td :class="getMatchCssClass(2, match)">{{ match.player2_elo }}</td>
          <td class="allignr" :class="getMatchCssClass(2, match)">{{ player2.name }}</td>
          <td :class="getMatchCssClass(2, match)" class="character-thumbnail allignr">
            <character-thumbnail :characters="match.character2 || player2.main_character" />
          </td>
          <td class="borderl">{{ match.completed_at | format }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import vSelect from 'vue-select';
import CharacterThumbnail from '../components/CharacterThumbnail.vue';

export default {
  name: 'Matches',
  components: { vSelect, CharacterThumbnail },

  data() {
    return {
      currentLeague: null,
      search: '',
    };
  },

  computed: {
    ...mapGetters('leagues', {
      leagues: 'list',
    }),
    ...mapGetters('matches', {
      matches: 'list',
    }),
  },

  methods: {
    ...mapActions('leagues', {
      listLeagues: 'list',
    }),
    ...mapActions('matches', {
      listMatches: 'list',
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
        const payload = {
          name: this.search,
        };
        if (this.currentLeague) {
          payload.leagueId = this.currentLeague.code;
        }
        this.getMatches(payload);
      }, 600);
    },

    getMatchCssClass: (player, match) => {
      if (!match.completed_at) {
        return 'not-completed';
      }
      if (player === 1) {
        return match.player1_score > match.player2_score ? 'winner' : 'loser';
      }
      return match.player2_score > match.player1_score ? 'winner' : 'loser';
    },

    onLeagueChange(option) {
      const paylaod = {
        name: this.search,
      };
      if (option) {
        paylaod.leagueId = option.code;
      }
      this.getMatches(paylaod);
    },

    async getMatches(params) {
      try {
        await this.listMatches({ params });
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
    await this.getMatches();
  },
};
</script>
