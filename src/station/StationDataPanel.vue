<template>
  <h2>Station {{ station.name }}</h2>
  <div>
    Flow {{ station.measures?.flow?.value }} {{ station.measures?.flow?.unit }}
  </div>
  <div>
    Level {{ station.measures?.level?.value }}
    {{ station.measures?.level?.unit }}
  </div>

  <pre>{{ station.measures }}</pre>

  <div v-if="isNotFound">Not Found</div>
  <!-- div v-for="measure, measureKey in readings" :key="measureKey">
    <h3>{{ measureKey }}</h3>
    <div v-for="[dateTime, value], i in measure" :key="i">
      {{ dateTimeFormat(dateTime) }} {{ value }}
    </div>
  </div -->
  <div>
    <div ref="chartRef" style="height: 50vh"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, Ref, ref, shallowRef, onMounted } from 'vue';
import { dateTimeFormat } from '../helpers/format';
import { parseMeasureUrl } from '../api-client/measure';
import {
  createTimeSeriesChart,
  ChartAxisOptions,
  ChartSeries,
  ChartLayoutOptions,
} from '../layout/chart/index';

import { fetchStation, Station } from '../api-client/station';
import { fetchStationReadings, StationReadings } from '../readings/reading';

// import StationsTable from './StationsTable.vue';

const dataTypes = {
  data: 'data',
  'level-flow': 'levelFlow',
};

export default defineComponent({
  props: {
    id: {
      type: String,
      default: '',
    },
    dataType: {
      type: String,
      default: 'unknown',
    },
  },

  emits: ['ready'],

  setup(props, { emit }) {
    const isLoading = ref(false);
    const isLoaded = ref(false);
    const isNotFound = ref(false);
    const chartRef: Ref<HTMLElement | null> = ref(null);
    // const chartData = ref<unknown[]>([]);
    // const chartOptions = ref<ChartOptions>({});
    const station = shallowRef<Station | Record<string, never>>({});
    const readings = shallowRef<StationReadings | Record<string, never>>({});

    const load = async () => {
      isLoading.value = true;
      isLoaded.value = false;
      isNotFound.value = false;
      station.value = {};
      try {
        const fetched = await fetchStation(props.id);
        station.value = fetched;

        loadReadings();
        emit('ready', fetched);
      } catch {
        isNotFound.value = true;
      }
    };

    onMounted(load);

    const loadReadings = async () => {
      readings.value = {};
      try {
        const fetched = await fetchStationReadings(props.id);
        const series: ChartSeries[] = [];
        const layout: ChartLayoutOptions = {
          title: {
            text: `${station.value.name}`,
          },
        };
        Object.entries(fetched).forEach(([key, value], seriesIndex) => {
          const parsed = parseMeasureUrl(key);
          const axisId =
            seriesIndex === 0 ? 'yaxis' : `yaxis${seriesIndex + 1}`;
          const axis: ChartAxisOptions = {
            title: parsed.type,
          };
          if (seriesIndex > 0) {
            axis.side = 'right';
            axis.overlaying = 'y';
            axis.showgrid = false;
          }

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore-next-line
          layout[axisId] = axis;

          const x: Date[] = [];
          const y: number[] = [];
          value.forEach(([dateTime, value]) => {
            x.push(dateTime);
            y.push(value);
          });
          const seriesData: ChartSeries = {
            x,
            y,
            type: 'scatter',
            fill: 'tozeroy',

            name: parsed.type,
          };
          if (seriesIndex !== 0) {
            seriesData.yaxis = `y${seriesIndex + 1}`;
          }
          series.push(seriesData);
        });
        if (chartRef.value != null) {
          createTimeSeriesChart(chartRef.value, series, { layout });
        }
        readings.value = fetched;
      } catch {
        // Silently fail if no readings for station.
      }
    };

    watch(() => props.id, load);

    return {
      chartRef,
      dateTimeFormat,
      station,
      readings,
      isNotFound,
    };
  },
});
</script>
