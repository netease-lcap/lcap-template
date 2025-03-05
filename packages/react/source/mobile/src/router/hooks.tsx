import { useRequest } from 'ahooks';
import { nasl } from '../Hooks'
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useUserInfo() {
  const { data, error, loading } = useRequest(nasl.auth.getUserInfo);

  return {
    userInfo: data,
    userInfoError: error,
    userInfoLoading: loading,
  }
}

export function useUserResources(){
  const appConfig = window.appInfo.appConfig;
  const fetchUerResources = () => {
    return nasl.auth.getUserResources(appConfig.domain);
  }

  const { data, error, loading } = useRequest(fetchUerResources);

  return {
    resources: (data || []).map((item: any) => item?.resourceValue || item?.ResourceValue),
    resourcesError: error,
    resourcesLoading: loading,
  };
}


export const useHandlePageNavigationEvent = ()=>{
  const navigate = useNavigate();
  const useHandler = useCallback((e)=>{
      const url = e?.detail?.url;
      if(url){
        navigate(url);
      }
  },[navigate]);
  useEffect(() => {
    // 监听全局跳转事件
    window.addEventListener('pageNavigation', useHandler);
    return () => {
      window.removeEventListener('pageNavigation', useHandler);
    }
  });
}
