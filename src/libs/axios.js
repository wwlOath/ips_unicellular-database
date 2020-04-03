import axios from 'axios';
import qs from 'qs';
import { getStore, setStore } from './storage';
import { router } from '../router/index';
import { Message } from 'view-design';


axios.defaults.withCredentials = true;// 允许跨域携带cookie

// 统一请求路径前缀

let baseBioaitech =  '/unicellular-db/unicellular-db';

// 超时设定
axios.defaults.timeout = 15000;

// 添加请求拦截器
axios.interceptors.request.use(config => {
    return config;
}, err => {
    Message.error('request timeout');
    return Promise.resolve(err);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
    const data = response.data;

    // 根据返回的code值来做不同的处理(和后端约定)
    switch (data.status) {
        case '5000':
            // 未登录 清除已登录状态

            setStore('unicellularUserInfo', '');
            router.push({
              name: 'Home',
              query: {
                redirect: 'lose'
              }
            })
            Message.error(data.msg);
            break;
        case '6000':
            /*// 没有权限
            if (data.msg !== null) {*/
               // Message.error(data.msg);
           /* } else {
                Message.error("No authority");
            }*/
            break;
        default:
            return data;
    }

    return data;
}, (err) => {
    // 返回状态码不为200时候的错误处理
    //Message.error(err.toString());
    return Promise.resolve(err);
});

export const getRequest = async (url, params) => {
    let base_url = baseBioaitech;

    return axios({
        method: 'get',
        url: `${base_url}${url}`,
        params: params
    });
};

export const getRequestPhoto = async (url, params) => {
    return axios({
        method: 'get',
        url: `${baseBioaitech}${url}`,
        params: params,
        responseType: 'arraybuffer',
    });
};

export const getRequestDownload = async (url, params) => {

    return axios({
        method: 'get',
        url: `${baseBioaitech}${url}`,
        params: params,
        responseType: 'blob',
    });
};

export const postRequestDownload = async (url, params) => {

  return axios({
    method: 'post',
    url: `${baseBioaitech}${url}`,
    params: params,
    responseType: 'blob',

  });
};

export const postRequestDownloadExcel = async (url, params) => {

  return axios({
    method: 'post',
    url: `${baseBioaitech}${url}`,
    data: params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
};

export const postRequest = async (url, params) => {

    let base_url = baseBioaitech;

    return axios({
        method: 'post',
        url: `${base_url}${url}`,
        data: params,

    });
};

export const postRequestPort = async (url, params) => {

  return axios.post(`${baseBioaitech}${url}`, qs.stringify(params, { indices: false }), {

  });
};

export const postRequestX = async (url, params) => {

    let base_url = baseBioaitech;
    return axios.post(`${base_url}${url}`, qs.stringify(params, { indices: false }), {

    });
};


