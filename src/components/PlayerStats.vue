<template>
  <div class="row">
    <div class="col">
      <div class="jumbotron jumbotron-small first text-primary">
        <h2>{{ total }} Matchs</h2>
        <p>Points: {{ elo }} </p>
      </div>
    </div>
    <div class="col">
      <div class="jumbotron jumbotron-small text-success">
        <h2 class="">{{ win }} Victoires</h2>
        <p>{{ ((win / total) * 100).toFixed(2) }} %</p>
      </div>
    </div>
    <div class="col">
      <div class="jumbotron jumbotron-small text-danger">
        <h2>{{ loose }} Défaites</h2>
        <p>{{ ((loose / total) * 100).toFixed(2) }} %</p>
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
