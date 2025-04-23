import { useLocation } from 'react-router-dom';
import { NASLUserInfo } from '@lcap/basic-template';
import { getBasePath } from '@lcap/basic-template';
import { Skeleton } from 'antd';
import React, { Suspense } from 'react';
import { Navigate, RouteObject, RouteProps, createBrowserRouter, useMatches, useNavigate } from 'react-router-dom';
import { useAppConfig } from '../nasl';
import { nasl } from '../Hooks';
import { useHandlePageNavigationEvent } from './hooks';

export type RouteObjectMeta = { crumb: string; title: string };

export type RouterHookFunc = (x: {
  navigate: ReturnType<typeof useNavigate>;
  matches: ReturnType<typeof useMatches>;
  userInfo?: NASLUserInfo | undefined;
  meta: RouteObjectMeta | undefined;
}) => void;

export const Guarded: React.FC<
  RouteProps & {
    userResources: string[];
    userInfo: NASLUserInfo;
    beforeEach?: RouterHookFunc;
    meta: RouteObjectMeta | undefined;
  }
> = ({ children, userResources, userInfo, beforeEach, meta }) => {
  useHandlePageNavigationEvent();
  const location = useLocation();

  const { pathname } = location;
  const toPath = pathname;

  const $auth = nasl.auth;
  const appConfig = useAppConfig();
  const { authResourcePaths } = appConfig;

  const needCheckAuth = (authResourcePaths as string[]).find((authResourcePath) => {
    return authResourcePath === toPath || `${authResourcePath}/` === toPath;
  });

  // 当前页面需要权限
  if (needCheckAuth) {
    // 未登录
    if ($auth.isInit() && !userInfo?.UserId) {
      localStorage.setItem('beforeLogin', JSON.stringify(location));
      // 跳转到登录页面
      return <Navigate to={`/login`}></Navigate>;
    }

    const normalizePath = (path: string) => path.endsWith('/') ? path : `${path}/`;
    const hasPermission = userResources.some((userResource: string) => {
      const a = normalizePath(userResource);
      const b = normalizePath(toPath);
      
      return a === b;
    });
    // 已登录, 无权限
    if (!hasPermission) {
      // @ts-ignore
      return <Navigate to={`/noAuth`}></Navigate>;
    }
  }

  beforeEach?.({ meta });

  return <>{children}</>;
};

type RouterOpts = {
  basename?: string;
  beforeEach?: RouterHookFunc;
  resources: Array<string>;
  userInfo: NASLUserInfo;
};

export function createRouter(routes: RouteObject[], opts: RouterOpts) {
  const appConfig = useAppConfig();
  const { baseResourcePaths } = appConfig;
  const userResources = opts?.resources || [];
  const realResources = userResources?.concat(baseResourcePaths);

  routes.forEach(guardIfNecessary);

  function guardIfNecessary(route: RouteObject) {
    if (route.element) {
      route.element = (
        <Suspense fallback={<Skeleton></Skeleton>}>
          <Guarded
            meta={route?.meta}
            userInfo={opts?.userInfo}
            userResources={realResources}
            beforeEach={opts?.beforeEach}
          >
            {route.element}
          </Guarded>
        </Suspense>
      );
    }
    route.children?.forEach(guardIfNecessary);
  }

  return createBrowserRouter(routes, opts);
}
