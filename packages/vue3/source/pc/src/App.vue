<template>
    <VErrorBoundary>
        <router-view></router-view>
    </VErrorBoundary>
</template>

<script>
import { useProvideGlobalMixin } from '@/global-variables';
import VErrorBoundary from './VErrorBoundary.vue';

export default {
    mixins: [useProvideGlobalMixin()],
    components: {
        VErrorBoundary,
    },
};
</script>
