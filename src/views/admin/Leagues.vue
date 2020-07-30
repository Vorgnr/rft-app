<template>
  <div>
    <a href="#" @click="$router.go(-1)">
      <v-icon name="arrow-left" />Retour
    </a>
    <h1 class="mt-2">Administration des leagues</h1>
    <div class="row mt-4">
      <div class="col">
        <table class="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Active</th>
              <th>Pt. départ</th>
              <th>Pt. victoire</th>
              <th>Pt. défaite</th>
              <th>RQ</th>
              <th>Palier rang</th>
              <th>Ratio calcul</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(league) in leagues"
              :key="league.id"
              :class="{'table-active': league.is_active}">
              <td><touch-edit
                :value="league.name"
                @input="onLeagueNameChanged(league, $event)"
              /></td>
              <td>
                <v-select
                  :options="[
                    { label: 'Active', code: 1 },
                    { label: 'Inactive', code: 0 }
                  ,]"
                  :value="league.is_active
                    ? { label: 'Active', code: 1 } : { label: 'Inactive', code: 0
                  }"
                  :clearable="false"
                  @input="onLeagueActiveChanged(league, $event)"
                />
              </td>
              <td>{{ league.starting_elo }}</td>
              <td>{{ league.winning_base_elo }}</td>
              <td>{{ league.losing_base_elo }}</td>
              <td>{{ league.ragequit_penalty }}</td>
              <td>{{ league.rank_treshold }}</td>
              <td>{{ league.rank_diff_ratio }}</td>
              <td><button
                class="btn btn-primary"
                v-if="league.isUpdated"
                @click="submit(league)"
              > Valider </button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import vSelect from 'vue-select';
import TouchEdit from '@/components/TouchEdit.vue';

export default {
  name: 'Leagues',
  components: { vSelect, TouchEdit },

  computed: {
    ...mapGetters('leagues', {
      leagues: 'list',
    }),
  },

  methods: {
    ...mapActions('leagues', {
      listLeagues: 'list',
      update: 'update',
    }),

    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    onLeagueNameChanged(league, name) {
      if (league.name !== name) {
        league.isUpdated = true;
      }
      league.name = name;
    },

    onLeagueActiveChanged(league, event) {
      if (league.is_active !== event.code) {
        league.isUpdated = true;
      }
      league.is_active = event.code;
    },

    async submit(league) {
      try {
        await this.update({
          leagueId: league.id,
          body: {
            name: league.name,
            is_active: league.is_active,
          },
        });
        this.notify({ title: 'League mise à jour', type: 'success' });
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
  },

  async mounted() {
    await this.getLeagues();
  },
};
</script>
