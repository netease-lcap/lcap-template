import { initRouter } from '@lcap/basic-template';

export default {
  install(Vue, options = {}) {
    initRouter(options);
  },
};
