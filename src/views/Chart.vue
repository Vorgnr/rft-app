<template>
  <div v-if="!loading && player">
    <div class="row">
      <div class="col">
        <h1>{{ title }}</h1>
      </div>
      <div class="col mt-2">
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            :value="selectedLeague"
            @input="onSelectedLeagueChanged"
            placeholder="Filtrer par league"
          />
      </div>
    </div>
    <div v-if="matches.length" class="row">
      <div class="col">
        <line-chart :chart-data="chartData" :options="chartOptions" :styles="{ height: '24em' }" />
      </div>
    </div>
    <player-stats class="mt-3" v-bind="playerStats" :elo="playerElo" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import formatISO from 'date-fns/formatISO';
import vSelect from 'vue-select';
import LineChart from '@/components/LineChart.vue';
import PlayerStats from '@/components/PlayerStats.vue';

export default {
  name: 'Matches',
  title: 'Matchs',
  components: { vSelect, LineChart, PlayerStats },

  data() {
    return {
      loading: true,
      selectedLeague: null,
    };
  },

  computed: {
    ...mapGetters('players', {
      player: 'item',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
      currentSelectedLeague: 'currentSelectedLeague',
    }),
    ...mapGetters('matches', {
      matches: 'list',
    }),
    ...mapGetters('auth', {
      authPlayer: 'player',
    }),

    title() {
      if (this.isProfileMode) {
        return 'Mes stats';
      }
      return `Stats de ${this.player.name}`;
    },

    isProfileMode() {
      return !this.$route.params.id;
    },

    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0,
          },
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              distribution: 'linear',
              time: {
                unit: 'week',
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            title(items, data) {
              const { index } = items[0];
              const { completedAt } = data.datasets[0].data[index];
              return completedAt;
            },
            label(item, data) {
              const { index } = item;
              const { player1, player2 } = data.datasets[0].data[index];
              return `${player1} vs ${player2}`;
            },
            afterLabel(item, data) {
              const { index } = item;
              const { label } = data.datasets[0].data[index];
              return label;
            },
          },
        },
      };
    },

    playerElo() {
      const matches = this.matchesData;
      const { previousElo, elo } = this.matchesData[matches.length - 1];
      return previousElo + elo;
    },

    matchesData() {
      return this.matches
        .filter(({ match }) => match.completed_at && match.moderated_at)
        .map(({ match, player1, player2 }) => {
          let previousElo;
          let elo;
          if (match.player1_id === this.player.id) {
            previousElo = match.player1_previous_elo;
            elo = match.player1_elo;
          } else {
            previousElo = match.player2_previous_elo;
            elo = match.player2_elo;
          }
          const eloStr = elo.toString();
          const isLost = eloStr.indexOf('-') === 0;

          const dt = new Date(match.completed_at);
          let y = previousElo + elo;
          if (y < 0) {
            y = 0;
          }
          const label = `${previousElo} ${
            isLost ? `- ${eloStr.substr(1)}` : `+ ${eloStr}`
          } = ${y}`;

          return {
            t: formatISO(dt),
            y,
            isLost,
            player1: player1.name,
            player2: player2.name,
            label,
            previousElo,
            elo,
            completedAt: this.$options.filters.format(dt),
          };
        });
    },

    chartData() {
      return {
        datasets: [
          {
            label: `Matchs de ${this.player.name}`,
            borderColor: '#B58900',
            backgroundColor: '#B58900',
            fill: false,
            data: this.matchesData,
          },
        ],
      };
    },

    playerStats() {
      const data = this.matchesData.reduce(
        (acc, match) => {
          if (match.isLost) {
            acc.loose += 1;
          } else {
            acc.win += 1;
          }
          acc.total += 1;
          return acc;
        },
        {
          win: 0,
          loose: 0,
          total: 0,
        },
      );
      return data;
    },
  },

  methods: {
    ...mapActions('players', {
      getById: 'getById',
    }),
    ...mapActions('leagues', {
      listLeagues: 'list',
    }),
    ...mapActions('matches', {
      listMatches: 'list',
    }),

    async onSelectedLeagueChanged(league) {
      this.selectedLeague = league;
      await this.getMatches();
    },

    async getPlayer() {
      try {
        const playerId = this.isProfileMode
          ? this.authPlayer.id
          : this.$route.params.id;
        await this.getById({ playerId });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getMatches(params = {}) {
      const payload = params;
      payload.leagueId = this.selectedLeague.code;
      payload.name = this.player.name;
      payload.orderBy = 'completed_at';
      try {
        await this.listMatches({ params: payload });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getLeagues() {
      try {
        await this.listLeagues();
        this.selectedLeague = this.currentSelectedLeague;
      } catch (e) {
        this.notifyError(e);
      }
    },
  },

  async created() {
    this.loading = true;
    await this.getPlayer();
    await this.getLeagues();
    await this.getMatches();
    this.loading = false;
  },
};
</script>
