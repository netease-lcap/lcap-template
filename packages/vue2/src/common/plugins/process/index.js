import { initProcess } from '@lcap/basic-template';

export default {
  install(Vue, options = {}) {
    initProcess(options);
  },
};
