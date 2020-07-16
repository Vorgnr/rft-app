<template>
  <v-select
    :options="characters"
    placeholder="Select your character"
    @input="$emit('update:selected', selected.code);"
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

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default {
  name: 'CharactersSelect',
  components: { vSelect },

  data() {
    return {
      selected: '',
      ch: characters,
    };
  },

  computed: {
    characters() { return this.ch.map((c) => ({ label: capitalize(c), code: c })); },
  },

};
</script>
