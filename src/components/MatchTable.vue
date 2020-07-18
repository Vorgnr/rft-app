<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th>Player 1</th>
        <th></th>
        <th>Points</th>
        <th>Score</th>
        <th class="borderl allignr">Score</th>
        <th>Points</th>
        <th></th>
        <th class="allignr">Player 2</th>
        <th class="borderl">Terminé</th>
      </tr>
    </thead>
    <tbody>
      <tr
        @click="$emit('open', match.id)"
        v-for="{ player1, player2, match } in matches"
        :key="match.id">
        <td :class="getMatchCssClass(1, match)" class="character-thumbnail">
          <character-thumbnail :characters="match.character1 || player1.main_character" />
        </td>
        <td :class="getMatchCssClass(1, match)">{{ player1.name }}</td>
        <td :class="getMatchCssClass(1, match)">{{ match.player1_elo }}</td>
        <td :class="getMatchCssClass(1, match)">{{ match.player1_score }}</td>
        <td
          class="borderl allignr"
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
</template>

<script>
import CharacterThumbnail from './CharacterThumbnail.vue';

export default {
  name: 'MatchTable',

  components: {
    CharacterThumbnail,
  },

  props: {
    matches: Array,
  },

  methods: {
    getMatchCssClass: (player, match) => {
      if (!match.completed_at) {
        return 'not-completed';
      }
      if (player === 1) {
        return match.player1_score > match.player2_score ? 'winner' : 'loser';
      }
      return match.player2_score > match.player1_score ? 'winner' : 'loser';
    },
  },
};
</script>
