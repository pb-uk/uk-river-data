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
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

import ReadingsTable from './ReadingsTable.vue';

export default defineComponent({
  components: {
    ReadingsTable,
  },

  setup() {
    const store = useStore();
    const storeReadings = computed(() => (store.state));
    const readings = ref([22, 23]);
    store.dispatch('readings/get').then((data) => {
      readings.value = data;
    });
    return {
      readings,
      storeReadings,
    };
  },
});
</script>
