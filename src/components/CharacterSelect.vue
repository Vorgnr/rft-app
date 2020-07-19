<template>
  <v-select
    :options="characters"
    :placeholder="placeholder"
    :multiple="multiple"
    @input="onChange"
    v-model="selected"
  >
    <template v-slot:option="option" >
      <div class="characters" :class="option.code" style="padding-left: 80px; height: 50px">
        <div style="padding-top: 11px">{{ option.label }}</div>
      </div>
    </template>
  </v-select>
</template>

<script>

import vSelect from 'vue-select';

const characters = [
  'akuma',
  'alisa',
  'anna',
  'armorking',
  'asuka',
  'bob',
  'bryan',
  'claudio',
  'deviljin',
  'dragunov',
  'eddy',
  'eliza',
  'fahkumram',
  'feng',
  'ganryu',
  'geese',
  'gigas',
  'heihachi',
  'hwoarang',
  'jack',
  'jin',
  'josie',
  'julia',
  'katarina',
  'kazumi',
  'kazuya',
  'lars',
  'law',
  'lee',
  'lei',
  'leo',
  'leroy',
  'lili',
  'lucky',
  'marduk',
  'miguel',
  'nina',
  'negan',
  'noctis',
  'panda',
  'paul',
  'raven',
  'shaheen',
  'steve',
  'xiaoyu',
  'yoshimitsu',
  'zafina',
];

export default {
  name: 'CharacterSelect',
  components: { vSelect },

  props: {
    placeholder: {
      type: String,
      default: 'Select your character',
    },
    multiple: Boolean,
  },

  data() {
    return {
      selected: '',
      ch: characters,
    };
  },

  methods: {
    onChange() {
      let code;
      if (this.multiple) {
        code = this.selected.map((s) => s.code).join(',');
      } else {
        ({ code } = this.selected);
      }
      this.$emit('input', code);
    },
  },

  computed: {
    characters() {
      return this.ch.map((c) => (
        { label: this.$options.filters.capitalize(c), code: c }
      ));
    },
  },

};
</script>
