<template>
    <VErrorBoundary>
      <router-view></router-view>
    </VErrorBoundary>
  </template>
  
  <script setup>
  import VErrorBoundary from './VErrorBoundary.vue';
  </script>