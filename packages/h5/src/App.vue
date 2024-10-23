<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
import { localCacheVariableMixin } from '@lcap/core-template';

export default {
    mixins: [localCacheVariableMixin],
};
</script>
