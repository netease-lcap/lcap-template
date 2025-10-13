import axios from 'axios';
import { formatMicroFrontUrl } from '../../init/router/microFrontUrl'; // 微前端路由方法
import { getFilenameFromContentDispositionHeader } from './tools';
import { formatContentType } from './utils';

/**
 * 目前主要测试的是 get 请求
 * 图片，文件，和文件流形式的下载
 * https://raw.githubusercontent.com/vusion/cloud-ui/master/src/assets/images/1.jpg
 * 支持 query 参数
 */
export function download(url) {
  const { path, method, body = {}, headers = {}, query = {}, timeout } = url;

  return axios({
    url: formatMicroFrontUrl(path),
    method,
    params: query,
    data: formatContentType(headers['Content-Type'], body),
    responseType: 'blob',
    timeout,
    // 允许跨域请求携带 cookie
    withCredentials: true,
  })
    .then((res) => {
      // 包含 content-disposition， 从中解析名字，不包含 content-disposition 的获取请求地址的后缀
      let effectiveFileName = res.request.getAllResponseHeaders().includes('content-disposition')
        ? getFilenameFromContentDispositionHeader(res.request.getResponseHeader('content-disposition'))
        : res.request.responseURL.split('/').pop();
      const { data, status, statusText } = res;

      // 通过UA判断是否是移动端
      const mobilePattern = /mobile|mobi|wap|simulator|iphone|android/gi;
      const isMobile = mobilePattern.test(navigator.userAgent);
      if (!isMobile) {
        effectiveFileName = decodeURIComponent(effectiveFileName).replace(/_\d{8,}\./, '.');
        if (data && data.size === 0) {
          return Promise.resolve({
            data: {
              code: status,
              msg: statusText,
            },
          });
        }
      }

      const downloadUrl = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', effectiveFileName); // any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
      return Promise.resolve({
        data: {
          code: status,
          msg: statusText,
        },
      });
    })
    .catch((err) =>
      // 基于 AxiosError 的错误类型 https://github.com/axios/axios/blob/b7e954eba3911874575ed241ec2ec38ff8af21bb/index.d.ts#L85
      Promise.resolve({
        data: {
          code: err.code,
          msg: err.response.statusText,
        },
      }),
    );
}
