<template>
  <DefaultPage>
    <ReadingsTable :data="readings" />
  </DefaultPage>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

import ReadingsTable from './ReadingsTable.vue';

export default defineComponent({
  components: {
    ReadingsTable,
  },

  setup() {
    const store = useStore();
    const readings = ref([22, 23]);
    store.dispatch('readings/get').then((data) => {
      readings.value = data;
    });
    return {
      readings,
    };
  },
});
</script>
