import { initSystemProcessV2Service } from "../../apis";
import Global from "../../global";
import processService from "./processService";

function initProcess() {
  /**
   * 流程接口注册
   */
  Global.prototype.$process = processService;
  Global.prototype.$processV2 = initSystemProcessV2Service();
  Global.prototype.$systemProcessV2 = initSystemProcessV2Service({
    config: {
      priority: {
        shortResponseForSystemProcess: 99,
      },
      shortResponseForSystemProcess: true,
    },
  });
}

export { initProcess, processService };

export { processPorts } from "./processPorts";
