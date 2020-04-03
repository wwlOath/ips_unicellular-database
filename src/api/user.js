// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, postRequestX } from '@/libs/axios';
export const baseURL = "/fusion-db/fusion-db"
// 登录
export const login = (params) => {
  return postRequestX('/user/login', params)
}

// 获取用户登录信息
export const userInfo = (params) => {
  return getRequest('/user/userInfo', params)
}

//注册接口
export const registUser = (params) => {
  return postRequestX('/user/register', params);
}

export const isEffectiveName = (params) => {
  return postRequestX('/user/verify/username', params)
}

export const isEffectiveEmail = (params) => {
  return postRequestX('/user/verify/email', params)
}

// 个人中心编辑
export const userInfoSave = (params) => {
  return postRequestX('/user/update/info', params)
}

// 个人中心修改密码
export const changePass = (params) => {
  return postRequestX('/user/update/password', params)
}

//退出登录
export const logoutInterface = (params) => {
  return postRequest('/user/logout', params);
}

//查看用户是否登录
export const isLoginStatus = (params) => {
  return postRequest('/user/isLoginActive', params);
}

//注册用户激活
export const userActiveInterface = (params) => {
  return postRequestX('/user/active', params);
}
