<script>
import { Bar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, { ...this.options, onClick: this.handleClick });
  },
  methods: {
    handleClick(point, items) {
      if (items.length) {
        const { _index: index } = items[0];
        this.$emit('on-click-point', {
          index,
        });
      }
    },
  },
};
</script>
