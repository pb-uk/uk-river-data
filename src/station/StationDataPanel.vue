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
    <TimeSeriesChart
      :data="chartData"
      :layout="chartLayout"
      :config="chartConfig"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, shallowRef } from 'vue';
import { dateTimeFormat } from '../helpers/format';
import { parseMeasureUrl } from '../api-client/index';
import {
  ChartLayoutType,
  ChartConfigType,
  ChartDataType,
  ChartAxisType,
} from '../layout/TimeSeriesChart.vue';

import { fetchStation, StationInterface } from './station';
import { fetchStationReadings, StationReadings } from '../readings/reading';

// import StationsTable from './StationsTable.vue';

export default defineComponent({
  props: {
    id: {
      type: String,
      default: '',
    },
  },

  emits: ['stationLoaded'],

  setup(params) {
    const isLoading = ref(false);
    const isLoaded = ref(false);
    const isNotFound = ref(false);
    const chartData = ref<unknown[]>([]);
    const chartLayout = ref<ChartLayoutType>({});
    const chartConfig = ref<ChartConfigType>({});
    const station = shallowRef<StationInterface | Record<string, never>>({});
    const readings = shallowRef<StationReadings | Record<string, never>>({});

    const load = async () => {
      isLoading.value = true;
      isLoaded.value = false;
      isNotFound.value = false;
      station.value = {};
      loadReadings();
      try {
        const fetched = await fetchStation(params.id);
        station.value = fetched;
        // emit('stationLoaded', fetched);
      } catch {
        isNotFound.value = true;
      }
    };

    const loadReadings = async () => {
      readings.value = {};
      try {
        const fetched = await fetchStationReadings(params.id);
        const data: Record<string, unknown>[] = [];
        const layout: ChartLayoutType = {
          title: 'Need a good title',
        };
        console.log('Here', Object.keys(fetched));
        Object.entries(fetched).forEach(([key, value], seriesIndex) => {
          const parsed = parseMeasureUrl(key);
          console.log('Now', key, parsed);
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
          const seriesData: ChartDataType = {
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
        chartData.value = data;
        chartLayout.value = layout;
        readings.value = fetched;
        console.log({ layout, data });
      } catch {
        // Silently fail if no readings for station.
      }
    };

    load();
    watch(() => params.id, load);

    return {
      chartData,
      chartLayout,
      chartConfig,
      dateTimeFormat,
      station,
      readings,
      isNotFound,
    };
  },
});
</script>
