<template>
  <div class="row">
    <div class="col-md-4 col-12">
      <div class="jumbotron jumbotron-small first text-primary">
        <h2>{{ total }} Matchs</h2>
        <p v-if="elo => 0">Points: {{ elo }} </p>
      </div>
    </div>
    <div class="col-md-4 col-12">
      <div class="jumbotron jumbotron-small text-success">
        <h2 class="">{{ win }} Victoires</h2>
        <p v-if="total">{{ win | percent(total) }} %</p>
      </div>
    </div>
    <div class="col-md-4 col-12">
      <div class="jumbotron jumbotron-small text-danger">
        <h2>{{ loose }} Défaites</h2>
        <p v-if="total">{{ loose | percent(total) }} %</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerStats',

  props: {
    win: Number,
    loose: Number,
    total: Number,
    elo: Number,
  },
};
</script>
