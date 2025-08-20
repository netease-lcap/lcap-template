module.exports = [
  {
    path: '/src/App.vue',
    action: 'modify',
    content: `<template>
    <div style="height: 100%;">
        <router-view></router-view>
    </div>
</template>

<script>
import { localCacheVariableMixin } from '@/common';

export default {
    mixins: [localCacheVariableMixin],
};
</script>`,
  },
  {
    path: '/src/ErrorBoundary.vue',
    action: 'remove',
  },
];
