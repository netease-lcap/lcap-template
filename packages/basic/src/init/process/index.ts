import { initSystemProcessV2Service } from '../../apis';
import Global from '../../global';
import Config from '../../config';
import processService from './processService';

function initProcess() {
  /**
   * 流程接口注册
   */
  Config.globalProperties.set('$process', processService);
  Config.globalProperties.set('$processV2', initSystemProcessV2Service());
  Config.globalProperties.set(
    '$systemProcessV2',
    initSystemProcessV2Service({
      config: {
        priority: {
          shortResponseForSystemProcess: 99,
        },
        shortResponseForSystemProcess: true,
      },
    }),
  );
}

export { initProcess, processService };

export { processPorts } from './processPorts';
