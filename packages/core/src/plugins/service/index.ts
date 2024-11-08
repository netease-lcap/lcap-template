import { initService } from "@lcap/basic-template";

export default {
  install(Vue, options = {}) {
    initService(options);
  },
};
