<template>
  <table class="table">
    <thead>
      <tr>
        <th>itemKey</th>
        <th>row</th>
        <th v-for="(column, i) in columns" :key="i">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(itemKey, i) in visibleRowKeys" :key="i">
        <td>itemKey: {{ itemKey }}</td>
        <td>row: {{ dataObject[itemKey] }}</td>
        <td v-for="(column, i) in columns" :key="i">
          {{ dataObject[itemKey][column.key] }}
        </td>
      </tr>
    </tbody>
  </table>

  <div>itemsPerPage: {{ itemsPerPage }}</div>
  <div>currentPage: {{ currentPage }}</div>
  <div>firstItem: {{ firstItem }}</div>
  <div>visibleRowKeys: {{ visibleRowKeys }}</div>
  <div>filteredRows: {{ filteredRows }}</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    // Pass data as an object with an arbitrary key.
    dataObject: {
      type: Object,
      default: () => ({}),
    },

    columns: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const itemsPerPage = ref(10);
    const currentPage = ref(1);
    const firstItem = ref(0);
    const ownColumns = ref(props.columns);

    const filteredRows = Object.keys(props.dataObject).map((key) => [
      key,
      true,
    ]);

    const visibleRowKeys = ref(Array(itemsPerPage.value));

    const setVisibleRowKeys = () => {
      let currentItemIndex = firstItem.value;
      for (let i = 0; i < visibleRowKeys.value.length; ++i) {
        let done = false;
        while (!done && currentItemIndex < filteredRows.length) {
          const maybeRow = filteredRows[currentItemIndex];
          if (maybeRow[1]) {
            visibleRowKeys.value[i] = maybeRow[0];
            done = true;
          }
          ++currentItemIndex;
        }
        if (!done) {
          visibleRowKeys.value[i] = null;
        }
      }
    };

    const applyFilters = () => {
      // This is back to front - need to build a filter and then apply to each.
      /*
      ownColumns.value.forEach((column) => {
        if (column.filter) {
          for (let i = 0; i < filteredRows.length; ++i) {
            const [key] = filteredRows[i];
            if (props.dataObject[key][column.key] === null) {
              filteredRows[i][1] = false;
            }
          }
        }
      });
      */
    };

    applyFilters();
    setVisibleRowKeys();

    watch(props.dataObject, () => {
      console.log('Rerendering');
      setVisibleRowKeys();
    });

    return {
      currentPage,
      filteredRows,
      firstItem,
      itemsPerPage,
      visibleRowKeys,
    };
  },
});
</script>
