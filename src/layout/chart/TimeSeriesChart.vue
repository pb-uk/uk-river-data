<template>
  <div ref="chartRef" style="height: 50vh"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue';
import {
  ChartSeriesType,
  ChartOptionsType,
  createTimeSeriesChart,
} from '../chart/index';

export default defineComponent({
  props: {
    // Pass data as an object with an arbitrary key.
    data: {
      type: Object,
      default: () => ({ x: [], y: [] }),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const chartRef: Ref<HTMLElement | null> = ref(null);
    watch(
      () => props.data,
      async () => {
        const { layout, config } = props.options;
        const options: ChartOptionsType = {
          layout, config
        };
        if (chartRef.value != null) {
          createTimeSeriesChart(chartRef.value, props.data, options);
        }
      }
    );

    return { chartRef };
  },
});
</script>
