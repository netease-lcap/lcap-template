import Taro from "@tarojs/taro";
import { baseUrl,frontend } from "./config";
const server = async (params) => {
  const { url, data, method } = params
  return new Promise((resolve, reject) =>
    Taro.request({
      url: baseUrl + url,
      header: {
        "LCAP-FRONTEND":frontend
      },
      method,
      data,
      success: (r) => {
        resolve(r.data);
      },
      fail: (r) => {
        reject(r);
      },
    })
  );
};
  
export default server;

