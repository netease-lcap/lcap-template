<template>
    <VErrorBoundary>
        <router-view></router-view>
    </VErrorBoundary>
</template>

<script>
import { localCacheVariableMixin } from '@lcap/core-template';
import VErrorBoundary from './VErrorBoundary.vue';

export default {
    mixins: [localCacheVariableMixin],
    components: {
        VErrorBoundary,
    },
};
</script>
