<template>
    <div id="alert-container">
      <div v-for="n in notifications" :key="n.id">
        <div
          class="alert"
          :class="{
            'alert-success': n.type === 'success',
            'alert-warning': n.type === 'error',
          }"
        >
          <strong>{{ n.title }} </strong> {{ n.message }}
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Notification',
  computed: {
    ...mapGetters({
      notifications: 'notifications/list',
    }),
  },
};
</script>

<style scoped>
  #alert-container {
    position: fixed;
    top: 20vh;
    right: 20px;
    z-index: 5000;
  }
</style>
