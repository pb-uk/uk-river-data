<template>
  <DefaultPage>
    <div>
      Store readings
      <pre>
        {{ storeReadings }}
      </pre>
    </div>
    <div>{{ Object.keys(stations).length }} stations</div>
    <DataTable :data-object="stations" :columns="columns" />
    <!-- div v-for="station, key in stations" :key="key">
      Station {{ key }} {{ station.status === null ? 'null' : station.status }}
    </div -->
  </DefaultPage>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';
import { getStations, Stations } from './api-client';

// import StationsTable from './StationsTable.vue';

export default defineComponent({
  components: {
    // StationsTable,
  },

  setup() {
    // const storeReadings = computed(() => (store.state));
    const stations: Ref<Stations> = ref({});
    const columns = [
      { key: 'stationReference', label: 'Ref' },
      {
        key: 'status',
        label: 'Status',
        filter: true,
        filterValues: [false, [null]],
      },
    ];
    getStations().then((data) => {
      console.log(data);
      stations.value = data;
    });
    return {
      stations,
      columns,
      // storeReadings,
    };
  },
});
</script>
