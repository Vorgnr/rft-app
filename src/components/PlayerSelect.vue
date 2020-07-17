<template>
  <v-select
    :options="options"
    :placeholder="placeholder"
    @input="onChange"
    v-model="selected"
  >
    <template v-slot:option="option" >
      <div
        class="characters"
        :class="option.mainCharacter"
        style="padding-left: 80px; height: 50px">
        <div style="padding-top: 11px">{{ option.label }}</div>
      </div>
    </template>
  </v-select>
</template>

<script>

import vSelect from 'vue-select';

export default {
  name: 'PlayerSelect',
  components: { vSelect },

  props: {
    players: Array,
    placeholder: String,
  },

  data() {
    return {
      selected: null,
    };
  },

  methods: {
    onChange() {
      this.$emit('input', this.selected.code);
    },
  },

  computed: {
    options() {
      return this.players.map((p) => ({
        label: p.name,
        code: p.id,
        mainCharacter: p.main_character,
      }));
    },
  },

};
</script>
