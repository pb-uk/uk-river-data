<template>
  <DefaultPage>
    <h1>Stations</h1>
    <div>{{ Object.keys(stations).length }} stations</div>
    <div class="dark">
      <DataTable
        :data-object="stations"
        :columns="columns"
        :filters="filters"
      />
      <!-- div v-for="station, key in stations" :key="key">
      Station {{ key }} {{ station.status === null ? 'null' : station.status }}
    </div -->
    </div>
  </DefaultPage>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue';
import { getStations, Stations } from './api-client';

// import StationsTable from './StationsTable.vue';

export default defineComponent({
  components: {
    // StationsTable,
  },

  setup() {
    // const storeReadings = computed(() => (store.state));
    const stations: Ref<Stations> = ref({});
    const filters = {
      status: {
        values: [null],
      },
    };
    const columns = [
      { key: 'stationReference', label: 'Ref' },
      {
        key: 'status',
        label: 'Status',
        filter: true,
        filterValues: [false, [null]],
      },
      { key: 'name', label: 'Station' },
      { key: 'latlong', label: 'Lat, Long' },
      { key: 'stationReference', label: 'Ref' },
      { key: 'measures', label: 'Readings' },
    ];

    onMounted(async () => {
      getStations().then((data) => {
        stations.value = data;
      });
    });

    return {
      stations,
      columns,
      filters,
      // storeReadings,
    };
  },
});
</script>
