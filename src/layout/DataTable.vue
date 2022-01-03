<template>
  <table class="table table-striped table-sm">
    <thead>
      <tr>
        <th>row</th>
        <th v-for="(column, i) in columns" :key="i">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in visibleRows" :key="i">
        <td>row: {{ row }}</td>
        <td v-for="(column, i) in columns" :key="i">
          {{ row[column.key] }}
        </td>
      </tr>
    </tbody>
  </table>

  <div>itemsPerPage: {{ itemsPerPage }}</div>
  <div>currentPageNumber: {{ currentPageNumber }}</div>
  <div>visibleRows: {{ visibleRows }}</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue';

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

    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const itemsPerPage = ref(10);
    const currentPageNumber = ref(1);
    console.log(props.dataObject);
    const filteredRows = Object.keys(props.dataObject).map((key): [key: string, isVisible: boolean] => ([
      key,
      true,
    ]));

    const visibleRows: Ref<Array<Record<string, unknown>>> = ref([]);

    const refreshVisibleRows = () => {
      let currentItemIndex = 0;
      const visible = [];
      while (visible.length < itemsPerPage.value && currentItemIndex < filteredRows.length) {
        const [key, passesFilter] = filteredRows[currentItemIndex];
        if (passesFilter) {
          visible.push(props.dataObject[key]);
        }
        ++currentItemIndex;
      }
      visibleRows.value = visible;
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
    // setVisibleRowKeys();
    refreshVisibleRows();
    watch(props.dataObject, () => {
      applyFilters();
      refreshVisibleRows();
    });

    return {
      currentPageNumber,
      itemsPerPage,
      visibleRows,
    };
  },
});
</script>
