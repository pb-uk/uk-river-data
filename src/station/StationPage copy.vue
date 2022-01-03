<template>
  <DefaultPage>
    <h1>Station</h1>
    {{ station }}
  </DefaultPage>
</template>

<script lang="ts">
import { defineComponent, watch, ComputedRef, ref, Ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { fetchStation, StationInterface } from './station';

// import StationsTable from './StationsTable.vue';

const updateStation = async (id: string, station: Ref) => {
  fetchStation(id)
    .then((res) => {
      station.value = res;
    })
    .catch(() => {
      station.value = null;
    });
};

export default defineComponent({
  components: {
    // StationsTable,
  },

  setup() {
    const route = useRoute();
    const station: Ref<StationInterface | null> = ref(null);

    watch(
      () => route.params.id,
      () => {
        console.log('Route id changed', route);
        updateStation(`${route.params.id}`, station);
      }
    );

    // onMounted(async () => {});

    return {
      station,
    };
  },
});
</script>
