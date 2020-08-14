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
            :options="leagues.map(({
              id, name, is_active: isActive }) => ({ label: name, code: id, isActive }))
            "
            v-model="currentLeague"
            @input="onLeagueChange"
            placeholder="Filtrer par saison"
          >
            <template v-slot:option="option">
              <span v-if="!option.isActive">[Archive]</span>
              {{ option.label }}
            </template>
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                Aucune saison trouvée pour
                <em>{{ search }}</em>.
              </template>
              <span v-else>Aucune saison</span>
            </template>
          </v-select>
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
            :multiple="true"
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
      this.matchStatus = this.matchStatus
        .reverse()
        .reduce((acc, filter) => {
          acc.code[filter.code] += 1;
          if (acc.code[filter.code] < 2) {
            acc.filters.push(filter);
          }
          return acc;
        }, { code: { moderatedAt: 0, completedAt: 0 }, filters: [] }).filters;
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
        this.matchStatus.forEach((s) => {
          payload[s.code] = s.filter;
        });
      }
      try {
        await this.fetchMoreMatches({ params: payload });
        this.page += 1;
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getMatches(params = {}) {
      this.page = 1;
      const payload = params;
      payload.perPage = this.perPage;
      payload.page = this.page;
      if (!params.name && this.search) {
        payload.name = this.search;
      }
      if (!payload.leagueId && this.currentLeague) {
        payload.leagueId = this.currentLeague.code;
      }
      if (this.matchStatus) {
        this.matchStatus.forEach((s) => {
          payload[s.code] = s.filter;
        });
      }
      try {
        await this.listMatches({ params: payload });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getLeagues() {
      try {
        await this.listLeagues({ showAll: true });
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
