import isPlainObject from "lodash/isPlainObject";

import { createService } from "../../utils";
import Global from "../../global";

let $services;

function initService(
  options: {
    servicesMap?: Record<string, any>;
  } = {},
) {
  const services = Object.assign({}, options.servicesMap);
  const keys = Object.keys(services);

  keys.forEach((key) => {
    if ($services && $services[key]) {
      throw new Error("services repeat:" + key);
    }

    const service = services[key];

    if (isPlainObject(service)) {
      services[key] = createService(service);
    }
  });

  if (keys.length) {
    $services = Object.assign({}, Global.prototype.$services, services);

    window.$services = $services;
    Global.prototype.$services = $services;
  }

  return {
    services: $services,
  };
}

export { initService };
