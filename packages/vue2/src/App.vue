<template>
  <error-boundary>
    <keep-alive v-if="enableRootKeepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </error-boundary>
</template>

<script>
import { localCacheVariableMixin } from '@/common';
import ErrorBoundary from './ErrorBoundary.vue';

export default {
  data() {
    return {
      enableRootKeepAlive: window.LcapEnableRootKeepAlive || false,
    }
  },
  mixins: [localCacheVariableMixin],
  components: {
    'error-boundary': ErrorBoundary,
  },
};
</script>
