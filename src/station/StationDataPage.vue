<template>
  <DefaultPage>
    <h1>Station {{ id }} watched { watchedId }}</h1>
    <StationDataPanel :id="id" />
  </DefaultPage>
</template>

<script lang="ts">
import { defineComponent, ComputedRef, computed } from 'vue';
import { useRoute } from 'vue-router';
import StationDataPanel from './StationDataPanel.vue';

// import StationsTable from './StationsTable.vue';

export default defineComponent({
  components: {
    StationDataPanel,
  },
  setup() {
    const route = useRoute();
    // A route param may be an array so cast it to a string.
    const id: ComputedRef<string> = computed(() => `${route.params.id}`);

    return { id };
  },
});
</script>
