/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
//import { router } from 'umi';
import { merge } from 'lodash';
import { notification } from 'antd';
import axios from 'axios';
import projectSetting from '../../config/projectSetting';

axios.defaults.timeout = 180000; // 设置默认超时 30秒
axios.defaults.withCredentials = false;
const {BASEURL}=projectSetting;
axios.defaults.baseURL=BASEURL;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// request拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log(
      `%c\ud83d\uDE80 request ${config.method} `,
      'background:#000;color:#b1dcff',
      config.url,
    );
    // console.log('headers---1111', crypto.getHeader(), token);
    //config.headers.Authorization = crypto.getHeader();
    config.headers.token = token;
    return config;
  },
  error => {
    console.log(error);
    return error;
  },
);
// response拦截器
axios.interceptors.response.use(
  response => {
    const { data, status } = response || {};
    if (status === 200) {
      console.info('%c\ud83d\uDC4C 请求成功 ', 'background:#000;color:#a9ef87', response);
      //const { Data, Status } = data;
        return data;
    }
    notification.error({
      message: codeMessage[status] || '未知错误',
    });
    return Promise.reject(data);
  },
  error => {
    const { status, data } = error.response || {};
    if (status === 500) {
      const { ErrorType, Message } = data;
      notification.error({
        message: `${ErrorType}:${Message}`,
      });
    } else {
      notification.error({
        message: codeMessage[status] || '未知错误',
      });
    }
    return Promise.reject(error);
  },
);

const request = async (_options: any, method = 'GET') => {
  const options = merge(
    { ..._options },
    {
      method,
    },
  );
  return axios(options);
};

/**
 * 封装get请求
 * @param { String } url 请求路径
 * @param { Object } 请求参数
 *  params GET请求参数
 */
const GET = (url: string, params?: any, _options?: any) => {
  return request({ ..._options, params, url });
};
/**
 * 封装post请求
 * @param { Object } 请求参数
 *  data POST请求请求参数，对象形式
 */
const POST = (url: string, data?: any, _options?: any) => {
  return request({ ..._options, data, url }, 'POST');
};

const PUT = (url: string, data?: any, _options?: any) => {
  return request({ ..._options, data, url }, 'PUT');
};

const DELETE = (url: string, data?: any, _options?: any) => {
  return request({ ..._options, data, url }, 'DELETE');
};

export { GET, PUT, POST, DELETE, BASEURL,request };
