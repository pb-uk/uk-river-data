<template>
  <h2>Station {{ station.name }} summary page</h2>
  <div v-if="isNotFound">Not Found</div>
  <!-- div v-for="measure, measureKey in readings" :key="measureKey">
    <h3>{{ measureKey }}</h3>
    <div v-for="[dateTime, value], i in measure" :key="i">
      {{ dateTimeFormat(dateTime) }} {{ value }}
    </div>
  </div -->
  <div><TimeSeriesChart :data="chartData" /></div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, shallowRef } from 'vue';
import { dateTimeFormat } from '../helpers/format';

import { fetchStation, StationInterface } from '../api-client/station';
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
        readings.value = fetched;
        const data: Record<string, unknown>[] = [];
        Object.entries(fetched).forEach(([, value]) => {
          const x: Date[] = [];
          const y: number[] = [];
          value.forEach(([dateTime, value]) => {
            x.push(dateTime);
            y.push(value);
          });
          data.push({ x, y, type: 'scatter' });
        });
        chartData.value = data;
      } catch {
        // Silently fail if no readings for station.
      }
    };

    load();
    watch(() => params.id, load);

    return {
      chartData,
      dateTimeFormat,
      station,
      readings,
      isNotFound,
    };
  },
});
</script>
