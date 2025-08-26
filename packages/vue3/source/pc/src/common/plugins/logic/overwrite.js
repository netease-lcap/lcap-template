import { Config } from '@lcap/basic-template';
import { get, pick } from 'lodash';

export function initLogicOverwrite(options = {}) {
  const { logicsMap, naslAPP } = options;
  const logics = {};
  const context = {
    app: naslAPP,
  };

  const entityRE = /entities\.(\w+?)\.logics/;

  Object.keys(logicsMap).forEach((path) => {
    const isEntity = entityRE.test(path);
    const backendPath = path.replace(entityRE, 'entities.$1Entity');
    const prevPath = backendPath.split('.').slice(0, -1).join('.');

    logics[path] = async function ({ query, body }) {
      const func = get(context, backendPath);
      const obj = get(context, prevPath);
      body = body === undefined ? undefined : JSON.parse(JSON.stringify(body));

      let result;
      if (isEntity) {
        if (path.endsWith('.get') || path.endsWith('.delete')) {
          query = query === undefined ? undefined : JSON.parse(JSON.stringify(query));
          result = func.call(obj, Object.values(query)[0]);
        } else if (path.endsWith('.update')) {
          if (body.properties) {
            if (body.entity) body.entity = pick(body.entity, body.properties);
            if (body.entities) body.entities = body.entities.map((entity) => pick(entity, body.properties));
          }
          result = func.call(obj, body.entity);
        } else {
          result = func.call(obj, body);
        }
      } else {
        const argNames = func.toString().match(/function\s*\w*\((.*?)\)/)?.[1]?.split(',').map(name => name.replace(/=.*$/, '').trim()) || [];
        const args = argNames.map(name => body[name]);
        result = func.call(obj, ...args);
      }

      return result === undefined ? undefined : JSON.parse(JSON.stringify(result));
    };
  });

  Config.globalProperties.set("$logics", logics);

  return {
    logics,
  };
}