<template>
  <error-boundary>
    <keep-alive 
      v-if="enableRootKeepAlive"
      :key="$route.fullPath"
      :include="rootKeepAliveInclude"
      :exclude="rootKeepAliveExclude"
      :max="rootKeepAliveMax"
    >
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
  computed: {
    rootKeepAliveInclude() {
      return this.enableRootKeepAlive?.include;
    },
    rootKeepAliveExclude() {
      return this.enableRootKeepAlive?.exclude;
    },
    rootKeepAliveMax() {
      return this.enableRootKeepAlive?.max;
    },
  },
  mixins: [localCacheVariableMixin],
  components: {
    'error-boundary': ErrorBoundary,
  },
};
</script>
