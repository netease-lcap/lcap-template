<template>
    <error-boundary>
        <router-view></router-view>
    </error-boundary>
</template>

<script>
import { localCacheVariableMixin } from '@/common';
import ErrorBoundary from './VErrorBoundary.vue';

export default {
    mixins: [localCacheVariableMixin],
    components: {
        'error-boundary': ErrorBoundary,
    },
};
</script>
