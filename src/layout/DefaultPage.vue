<template>
  <PageHeader />
  <slot></slot>
  <PageFooter />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageHeader from './PageHeader.vue';
import PageFooter from './PageFooter.vue';

export default defineComponent({
  components: {
    PageHeader,
    PageFooter,
  },
});
</script>
