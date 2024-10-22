import processService from './processService';
import { initService as initSystemProcessV2Service } from "../../apis/system/processV2";

export default {
    install(Vue, options = {}) {
        /**
         * 流程接口注册
         */
        Vue.prototype.$process = processService;
        // 可以直接返回response.data
        Vue.prototype.$processV2 = initSystemProcessV2Service();
        // 需要取出response.data.Data
        Vue.prototype.$systemProcessV2 = initSystemProcessV2Service({
          config: {
            priority: {
              shortResponseForSystemProcess: 99
            },
            shortResponseForSystemProcess: true,
          }
        });
    },
};
