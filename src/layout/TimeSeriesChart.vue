<template>
  <div id="myChartId" style="height: 50vh">Chart here</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue';
import { fetchPlotly } from './chart';

export type ChartDataType = {
  x: Date[];
  y: number[];
  type?: string;
  name?: string;
  yaxis?: string;
};

export type ChartAxisType = {
  title?: string;
  titlefont?: { color: string };
  tickfont?: { color: string };
  side?: string;
  overlaying?: string;
  showgrid?: boolean;
};

export interface ChartLayoutType extends Record<string, unknown> {
  title?: string;
  yaxis?: ChartAxisType;
  name?: string;
}

export type ChartConfigType = {
  name?: string;
};

export default defineComponent({
  props: {
    // Pass data as an object with an arbitrary key.
    data: {
      type: Object,
      default: () => ({}),
    },
    layout: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    watch(
      () => props.data,
      async () => {
        console.log('Reacting');
        const el = document.getElementById('myChartId');
        // props.data[0]
        const { newPlot } = await fetchPlotly();
        const layout = {
          // margin: { t: 0 },
          xaxis: {
            autorange: true,

            // range: ['2015-02-17', '2017-02-16'],

            rangeselector: {
              buttons: [
                {
                  count: 12,
                  label: '12h',
                  step: 'hour',
                  stepmode: 'backward',
                },
                {
                  count: 1,
                  label: '1d',
                  step: 'day',
                  stepmode: 'backward',
                },
                {
                  count: 7,
                  label: '1w',
                  step: 'day',
                  stepmode: 'backward',
                },
                { step: 'all' },
              ],
            },

            // rangeslider: { range: ['2015-02-17', '2017-02-16'] },
            type: 'date',
          },
          ...props.layout,
        };
        const config = {
          responsive: true,
        };
        console.log('Plotting', props.data, layout, config);
        newPlot(el, props.data, layout, config);
      }
    );

    return {};
  },
});
</script>
