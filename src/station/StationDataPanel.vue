<template>
  <h2>Station {{ station.name }}</h2>
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
import { parseMeasureUrl } from '../api-client/index';
import { createTimeSeriesChart, ChartAxisType, ChartSeriesType, ChartLayoutType } from '../layout/chart/index';

import { fetchStation, StationInterface } from './station';
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

  emits: ['stationLoaded'],

  setup(props, { emit }) {

    const isLoading = ref(false);
    const isLoaded = ref(false);
    const isNotFound = ref(false);
    const chartRef: Ref<HTMLElement | null> = ref(null);
    // const chartData = ref<unknown[]>([]);
    // const chartOptions = ref<ChartOptionsType>({});
    const station = shallowRef<StationInterface | Record<string, never>>({});
    const readings = shallowRef<StationReadings | Record<string, never>>({});

    const load = async () => {
      isLoading.value = true;
      isLoaded.value = false;
      isNotFound.value = false;
      station.value = {};
      loadReadings();
      try {
        const fetched = await fetchStation(props.id);
        station.value = fetched;
        emit('stationLoaded', fetched);
      } catch {
        isNotFound.value = true;
      }
    };

    onMounted(load);

    const loadReadings = async () => {
      readings.value = {};
      try {
        const fetched = await fetchStationReadings(props.id);
        const data: Record<string, unknown>[] = [];
        const layout: ChartLayoutType = {
          layout: {
            title: 'Need a good title',
          },
        };
        Object.entries(fetched).forEach(([key, value], seriesIndex) => {
          const parsed = parseMeasureUrl(key);
          const axisId =
            seriesIndex === 0 ? 'yaxis' : `yaxis${seriesIndex + 1}`;
          const axis: ChartAxisType = {
            title: parsed.measureType,
          };
          if (seriesIndex > 0) {
            axis.side = 'right';
            axis.overlaying = 'y';
            axis.showgrid = false;
          }

          layout[axisId] = axis;

          const x: Date[] = [];
          const y: number[] = [];
          value.forEach(([dateTime, value]) => {
            x.push(dateTime);
            y.push(value);
          });
          const seriesData: ChartSeriesType = {
            x,
            y,
            type: 'scatter',
            name: parsed.measureType,
          };
          if (seriesIndex !== 0) {
            seriesData.yaxis = `y${seriesIndex + 1}`;
          }
          data.push(seriesData);
        });
        if (chartRef.value != null) {
          createTimeSeriesChart(chartRef.value, data, { layout });
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
