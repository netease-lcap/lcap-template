import pick from "lodash/pick";
import { createLogicService } from "../../utils";

import Global from "../../global";
import Config from "../../config";

function initLogic(
  options: {
    logicsMap?: Record<string, any>;
  } = {},
) {
  const logicsMap = Object.assign({}, options.logicsMap);

  Object.keys(logicsMap)
    .filter((key) =>
      /app\.dataSources\.[^.]+.entities.[^.]+.logics.(update|updateBy|createOrUpdate|batchUpdate)/.test(key),
    )
    .forEach((key) => {
      logicsMap[key].config.preprocess = (info) => {
        const body = info.url.body;
        if (body.properties) {
          if (body.entity) body.entity = pick(body.entity, body.properties);
          if (body.entities) body.entities = body.entities.map((entity) => pick(entity, body.properties));
        }
        return info;
      };
    });

  const logics = createLogicService(logicsMap);

  Config.globalProperties.set("$logics", logics);

  return {
    logics: logics,
  };
}

export { initLogic };
