import { encodeUrl } from "./utils";

type ConfigType = {
  toast: {
    show: (message: string, stack?: string) => void;
    error: (message: string, stack?: string) => void;
  };
  utils: any;
  router: {
    destination: (url: string, target: string) => void;
  };
  axios: {
    interceptors: Array<any>;
  };
  configureRequest?: (options: any, axios: any) => void;
}

// 差异性配置，由H5、PC端启动时 传入覆盖
const Config: ConfigType = {
  toast: {
    show: (message, stack?) => void 0,
    error: (message, stack?) => void 0,
  },
  utils: {},
  router: {
    destination: (url: string, target: string) => {
      if (target === "_self") {
        location.href = encodeUrl(url);
      } else {
        window.open(encodeUrl(url), target);
      }
    },
  },
  axios: {
    interceptors: []
  }
};

export function setConfig(newConfig) {
  Object.assign(Config, newConfig);
}

export function getConfig() {
  return Config;
}

export default Config;