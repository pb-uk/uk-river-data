<template>
  <DefaultPage>
    <div>
      Store readings
      <pre>
        {{ storeReadings }}
      </pre>
    </div>
    <div v-for="reading, key in readings" :key="key">
      {{ key }}
    <ReadingsTable :data="reading" />
    </div>
  </DefaultPage>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';

import ReadingsTable from './ReadingsTable.vue';
import { getSince, Readings } from './store';

export default defineComponent({
  components: {
    ReadingsTable,
  },

  setup() {
    // const storeReadings = computed(() => (store.state));
    const readings: Ref<Readings> = ref({});
    getSince().then((data) => {
      console.log(data);
      readings.value = data;
    });
    return {
      readings,
      // storeReadings,
    };
  },
});
</script>
