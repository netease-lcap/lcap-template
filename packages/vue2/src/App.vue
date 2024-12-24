<template>
    <VErrorBoundary>
        <router-view></router-view>
    </VErrorBoundary>
</template>

<script>
import { localCacheVariableMixin } from '@/common';
import VErrorBoundary from './VErrorBoundary.vue';

export default {
    mixins: [localCacheVariableMixin],
    components: {
        VErrorBoundary,
    },
};
</script>
