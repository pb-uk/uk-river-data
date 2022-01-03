<template>
    <h2>Station {{ id }}</h2>
    <div v-if="isNotFound">Not Found</div>
      {{ station.name }}
      {{ station.id }}
      {{ station.idasd }}
      {{ station._props }}
</template>

<script lang="ts">

import { defineComponent, watch, shallowRef, ref } from 'vue';

import { fetchStation, StationInterface } from './station';

// import StationsTable from './StationsTable.vue';

export default defineComponent({
  props: {
    id: {
      type: String,
      default: '',
    }
  },

  emits: ['stationLoaded'],

  setup(params) {
    const isNotFound = ref(false);
    const station = ref<StationInterface | Record<string, never>>({});

    watch(() => params.id, async () => {
      isNotFound.value = false;
      station.value = {};
      try {
        const fetched = await fetchStation(params.id);
        console.log('Fetched', fetched, fetched.name);
        station.value = fetched;
        // emit('stationLoaded', fetched);
      } catch {
        isNotFound.value = true;
      }
    });

    return {
      station,
      isNotFound,
    };
  },
});
</script>
