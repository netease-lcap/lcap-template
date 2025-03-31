<template>
  <VErrorBoundary>
    <config-provider :locale="locale">
      <router-view></router-view>
    </config-provider>
  </VErrorBoundary>
</template>

<script setup>
import VErrorBoundary from './VErrorBoundary.vue';
// TODO: 约定一种通用方式
const locale = window.$libraries?.ElementPlus?.locale?.zhCn;

</script>
