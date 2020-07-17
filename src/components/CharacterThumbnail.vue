<template>
  <div>
    <span
      v-for="character in getClasses" :key="character"
      class="characters"
      :class="character" />
  </div>
</template>

<script>
export default {
  name: 'CharacterThumbnail',

  props: {
    characters: String,
  },

  computed: {
    getClasses() { return this.characters.split(','); },
  },

};
</script>
