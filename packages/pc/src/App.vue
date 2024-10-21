<template>
    <VErrorBoundaryVue>
        <router-view></router-view>
    </VErrorBoundaryVue>
</template>

<script>
import { localCacheVariableMixin } from '@lcap/core-template';
import VErrorBoundaryVue from './VErrorBoundary.vue';

export default {
    mixins: [localCacheVariableMixin],
    components: {
        VErrorBoundaryVue,
    },
};
</script>
