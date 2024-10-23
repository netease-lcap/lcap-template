<template>
    <div style="height:100%">
        <router-view></router-view>
    </div>
</template>

<script>
import { localCacheVariableMixin } from '@lcap/core-template';

export default {
    mixins: [localCacheVariableMixin],
};
</script>
