const interceptors: Array<{
  request?: {
    onSuccess: (config: any) => any;
    onError?: (error: any) => any;
  };
  response?: {
    onSuccess: (response: any) => any;
    onError?: (error: any) => any;
  };
}> = [];

export default interceptors;
