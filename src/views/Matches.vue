<template>
  <div>
    <h1>Matchs</h1>
    <div class="row">
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
      <div class="col">
        <div class="form-group">
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            v-model="currentLeague"
            @input="onLeagueChange"
            placeholder="Filtrer par league"
          />
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <v-select
            :options="[
              { label: 'Non modérés', code: 'moderatedAt', filter: '0' },
              { label: 'Modérés', code: 'moderatedAt', filter: '1' },
              { label: 'Non terminés', code: 'completedAt', filter: '0' },
              { label: 'Terminés', code: 'completedAt', filter: '1' },
            ]"
            v-model="matchStatus"
            @input="onStatusChange"
            placeholder="Filtrer par statut de match"
          />
        </div>
      </div>
    </div>
    <match-table :matches="matches" @open="open" :is-auth="isAuth" />
    <button
      v-if="!noMoreMatches"
      @click="getMoreMatches"
      type="button"
      class="btn btn-outline-primary btn-lg btn-block"
    >Voir plus</button>
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
      matchStatus: null,
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
    ...mapGetters('auth', {
      isAuth: 'isAuth',
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

    debounceSearch() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.getMatches();
      }, 600);
    },

    onLeagueChange() {
      this.getMatches();
    },

    onStatusChange() {
      this.getMatches();
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
      if (this.matchStatus) {
        payload[this.matchStatus] = 'null';
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
      if (!params.name && this.search) {
        payload.name = this.search;
      }
      if (!payload.leagueId && this.currentLeague) {
        payload.leagueId = this.currentLeague.code;
      }
      if (this.matchStatus) {
        payload[this.matchStatus.code] = this.matchStatus.filter;
      }
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
