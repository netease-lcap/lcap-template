import qs from 'qs';

import { initAuthService, initLowauthService } from '../../apis';
import { getBasePath, cookie } from '../../utils';
import Global from '../../global';
import Config from '../../config';

export const getBaseHeaders = () => {
  type Headers = {
    Env: string;
    Authorization?: string;
  };
  const headers: Headers = {
    Env: window.appInfo && window.appInfo.env,
  };
  if (cookie.get('authorization')) {
    headers.Authorization = cookie.get('authorization');
  }
  return headers;
};

// FIXME 替换成真实类型
export type NASLUserInfo = {
  UserName: string;
  UserId: string;
};

export interface IService {
  start: () => void;
  getUserInfo: () => Promise<NASLUserInfo | undefined>;
  getUserResources: (DomainName: string) => Promise<any>;
  getKeycloakLogoutUrl: () => Promise<string>;
  logout: () => Promise<any>;
  loginH5: (data: any) => Promise<any>;
  getNuims: (query: any) => Promise<any>;
  getConfig: () => Promise<any>;
  parse: (query: string) => any;
  stringify: (query: any) => string;
  isInit: () => boolean;
  init: (domainName: string) => Promise<any>;
  has: (authPath: string) => boolean;
  hasSub?: (subPath: string) => boolean;
  hasFullPath?: (path: string) => boolean;
  // 隐藏方法，用于自定义修改权限项
  _setCustomResources?: (
    list: Array<{
      resourceValue: string;
      resourceType: string;
    }>,
  ) => void;
}

let _map;
let authService;
let lowauthService;

const Service: IService = {
  start() {
    authService = initAuthService();
    lowauthService = initLowauthService();
    window.authService = authService;
  },
  getUserInfo() {
    let userInfoPromise = null;

    if (window.appInfo.hasUserCenter) {
      userInfoPromise = lowauthService.GetUser({
        headers: getBaseHeaders(),
        config: {
          noErrorTip: true,
        },
      });
    } else {
      userInfoPromise = authService.GetUser({
        headers: getBaseHeaders(),
        config: {
          noErrorTip: true,
        },
      });
    }
    userInfoPromise = userInfoPromise
      .then((result) => {
        // 兼容新的返回格式
        let userInfo;
        if (result?.data?.Data) {
          userInfo = result.data.Data;
        } else {
          userInfo = result?.Data;
        }

        if (!userInfo?.UserId && userInfo?.userId) {
          userInfo.UserId = userInfo.userId;
          userInfo.UserName = userInfo.userName;
        }
        if (userInfo && !userInfo?.DisplayName && userInfo?.UserName) {
          userInfo.DisplayName = userInfo.UserName;
        }

        const $global = Config.globalProperties.get('$global') || {};
        const frontendVariables = $global.frontendVariables || {};
        frontendVariables.userInfo = userInfo;
        $global.userInfo = userInfo;

        return userInfo;
      })
      .catch((e) => {
        userInfoPromise = null;
        throw e;
      });

    return userInfoPromise;
  },
  getUserResources(DomainName) {
    let userResourcesPromise = null;

    if (window.appInfo.hasAuth) {
      userResourcesPromise = lowauthService
        .GetUserResources({
          headers: getBaseHeaders(),
          query: {},
          config: {
            noErrorTip: true,
          },
        })
        .then((result) => {
          // 兼容新的返回格式
          const data = result?.data || result;

          let resources = [];
          // 初始化权限项
          _map = new Map();
          if (Array.isArray(data)) {
            resources = data.filter((resource) => resource?.resourceType === 'ui');
            resources.forEach((resource) => _map.set(resource.resourceValue, resource));
          }
          return resources;
        });
    } else {
      // 这个是非下沉应用，调用的是Nuims的接口，此处需非常注意Resource大小写情况，开发时需关注相关测试用例是否覆盖
      userResourcesPromise = authService
        .GetUserResources({
          headers: getBaseHeaders(),
          query: {
            DomainName,
          },
          config: {
            noErrorTip: true,
          },
        })
        .then((res) => {
          _map = new Map();
          const resources = res.Data.items.reduce((acc, { ResourceType, ResourceValue, ...item }) => {
            if (ResourceType === 'ui') {
              acc.push({
                ...item,
                ResourceType,
                ResourceValue,
                resourceType: ResourceType,
                resourceValue: ResourceValue,
              }); // 兼容大小写写法，留存大写，避免影响其他隐藏逻辑
            }
            return acc;
          }, []);
          // 初始化权限项
          resources.forEach((resource) => _map.set(resource?.ResourceValue, resource));
          return resources;
        });
    }
    return userResourcesPromise;
  },
  async getKeycloakLogoutUrl() {
    let logoutUrl = '';
    const basePath = getBasePath();
    if (window.appInfo.hasUserCenter) {
      const res = await lowauthService.getAppLoginTypes({
        query: {
          Action: 'GetTenantLoginTypes',
          Version: '2020-06-01',
          TenantName: window.appInfo.tenant,
        },
      });
      const KeycloakConfig = res?.Data.Keycloak;
      if (KeycloakConfig) {
        logoutUrl = `${KeycloakConfig?.config?.logoutUrl}?redirect_uri=${window.location.protocol}//${window.location.host}${basePath}/login`;
      }
    } else {
      const res = await authService.getNuimsTenantLoginTypes({
        query: {
          Action: 'GetTenantLoginTypes',
          Version: '2020-06-01',
          TenantName: window.appInfo.tenant,
        },
      });
      const KeycloakConfig = res?.Data.find((item) => item.LoginType === 'Keycloak');
      if (KeycloakConfig) {
        logoutUrl = `${KeycloakConfig?.extendProperties?.logoutUrl}?redirect_uri=${window.location.protocol}//${window.location.host}${basePath}/login`;
      }
    }

    return logoutUrl;
  },
  async logout() {
    const sleep = (t) => new Promise((r) => setTimeout(r, t));

    if (window.appInfo.hasUserCenter) {
      const logoutUrl = await Service.getKeycloakLogoutUrl();
      localStorage.setItem('logoutUrl', logoutUrl);
      if (logoutUrl) {
        window.location.href = logoutUrl;
        await sleep(1000);
      } else {
        return lowauthService
          .Logout({
            headers: getBaseHeaders(),
          })
          .then(() => {
            // 用户中心，去除认证和用户名信息
            cookie.erase('authorization');
            cookie.erase('username');
          });
      }
    } else {
      const logoutUrl = await Service.getKeycloakLogoutUrl();
      localStorage.setItem('logoutUrl', logoutUrl);
      if (logoutUrl) {
        window.location.href = logoutUrl;
        await sleep(1000);
      } else {
        return authService
          .Logout({
            headers: getBaseHeaders(),
          })
          .then(() => {
            cookie.erase('authorization');
            cookie.erase('username');
          });
      }
    }
  },
  loginH5(data) {
    return authService.LoginH5({
      headers: getBaseHeaders(),
      ...data,
    });
  },
  getNuims(query) {
    return authService.GetNuims({
      headers: getBaseHeaders(),
      query,
    });
  },
  getConfig() {
    return authService.GetConfig({
      headers: getBaseHeaders(),
    });
  },
  // 处理数据的参数转化
  parse: qs.parse,
  stringify: qs.stringify,
  /**
   * 权限服务是否初始化
   */
  isInit() {
    return !!_map;
  },
  /**
   * 初始化权限服务
   */
  init(domainName) {
    return Service.getUserInfo().then(() => Service.getUserResources(domainName));
  },
  /**
   * 是否有权限
   * @param {*} authPath 权限路径，如 /dashboard/entity/list
   */
  has(authPath) {
    return (_map && _map.has(authPath)) || false;
  },

  _setCustomResources(list = []) {
    _map = new Map();
    list.forEach((resource) =>
      _map.set(resource.resourceValue, {
        ...resource,
        ResourceType: resource.resourceType,
        ResourceValue: resource.resourceValue,
      }),
    );
  },
};

export default Service;
