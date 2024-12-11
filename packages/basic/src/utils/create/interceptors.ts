const bigIntInterceptor = {
  request: {
    onSuccess: (config) => {
      return config;
    },
  },
  response: {
    onSuccess: (response) => {
      return response;
    },
  },
};

const interceptors: Array<{
  request?: {
    onSuccess: (config: any) => any;
    onError?: (error: any) => any;
  };
  response?: {
    onSuccess: (response: any) => any;
    onError?: (error: any) => any;
  };
}> = [bigIntInterceptor];

export default interceptors;
