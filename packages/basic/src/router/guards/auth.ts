import Global from "../../global";

import { filterRoutes, parsePath } from "../../utils/route";
import { getBasePath } from "../../utils/encodeUrl";

/**
 * 是否有无权限页面
 * @param {*} routes
 */
export function findNoAuthView(routes) {
  if (Array.isArray(routes)) {
    return routes.find((route) => route?.path === `${getBasePath()}/noAuth`);
  }
}

const ROOT_PATH = "/";

const getParentPath = (path) =>
  path === ROOT_PATH
    ? null
    : path.substring(0, path.lastIndexOf("/")) || ROOT_PATH;

/**
 * 过滤无权限页面（X2.22_0629调整），如子页面绑定了角色父页面未绑定，则子页面无法访问。
 * 更多边界情况参考用例: tests\unit\global\routes\route.spec.js
 * @param {*} resources
 */
export function filterAuthResources(resources) {
  if (!Array.isArray(resources) || !resources.length) return [];

  const bases = generatePaths(getBasePath());

  const validPaths = resources.reduce(
    (map, item) => {
      map.set(item.resourceValue, 1);
      return map;
    },
    new Map([
      [ROOT_PATH, 1],
      ...bases,
    ])
  ); // 需注意，路由起始都具备basePath（PC&H5都有不固定起始路由）

  const isValidPath = (path) => {
    let parentPath = getParentPath(path);
    while (parentPath && validPaths.has(parentPath))
      parentPath = getParentPath(parentPath);
    return !parentPath;
  };
  return resources.filter((item) => isValidPath(item.resourceValue));
}

function generatePaths(str) {
  let parts = str.split('/');
  let paths = [];

  for (let i = 0; i < parts.length; i++) {
    let path = parts.slice(0, i + 1).join('/');
    path && paths.push([path, 1]);
  }

  return paths;
}