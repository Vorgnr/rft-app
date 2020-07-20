<template>
  <div>
    <h2>Matchs</h2>
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
    <match-table :matches="matches" @open="open"/>
    <button
      v-if="!noMoreMatches"
      @click="getMoreMatches"
      type="button"
      class="btn btn-outline-primary btn-lg btn-block">
      Voir plus
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import vSelect from 'vue-select';
import MatchTable from '../components/MatchTable.vue';

export default {
  name: 'Matches',
  title: 'Matchs',
  components: { vSelect, MatchTable },

  data() {
    return {
      perPage: 30,
      page: 1,
      currentLeague: null,
      search: null,
    };
  },

  computed: {
    ...mapGetters('leagues', {
      leagues: 'list',
    }),
    ...mapGetters('matches', {
      matches: 'list',
      noMoreMatches: 'noMoreItems',
    }),
  },

  methods: {
    ...mapActions('leagues', {
      listLeagues: 'list',
    }),
    ...mapActions('matches', {
      fetchMoreMatches: 'fetchMore',
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

    onLeagueChange(option) {
      const paylaod = {
        name: this.search,
      };
      if (option) {
        paylaod.leagueId = option.code;
      }
      this.getMatches(paylaod);
    },

    async getMoreMatches() {
      const payload = {
        name: this.search,
        perPage: this.perPage,
        page: this.page + 1,
      };
      if (this.currentLeague) {
        payload.leagueId = this.currentLeague.code;
      }
      try {
        await this.fetchMoreMatches({ params: payload });
        this.page += 1;
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getMatches(params = {}) {
      const payload = params;
      payload.perPage = this.perPage;
      payload.page = 1;
      try {
        await this.listMatches({ params: payload });
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
      this.$router.push({ name: 'match', params: { id } });
    },
  },

  async created() {
    await this.getLeagues();
    await this.getMatches();
  },
};
</script>
