<template>
  <table>
    <tr v-for="(row, i) in data" :key="i">
      <td>{{ i }}</td>
      <td>{{ row }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    data: Array,
  },
  setup() {
    return {};
  },
});
</script>
