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
  {
    path: '/src/utils/create-error-layout.js',
    action: 'remove',
  },
  {
    path: '/src/utils/index.js',
    action: 'modify',
    content: `import dataSourceUtils from './datasource-utils';

export function unsafeEval(code) {
  try {
    return eval(code);
  } catch (error) {
    console.error('Error evaluating code:', error);
    return null;
  }
}

export const setFavicon = (iconUrl) => {
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = iconUrl;
};

export default {
  dataSourceUtils,
};
`,
  },
];
