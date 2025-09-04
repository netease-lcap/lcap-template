import { createLogics } from '../../utils';
import Config from '../../config';

function initLogic(
  options: {
    logicsMap?: Record<string, any>;
  } = {},
) {
  const logics = createLogics(options.logicsMap || {});

  Config.globalProperties.set('$logics', logics);

  return {
    logics: logics,
  };
}

export { initLogic };
