import axios from 'axios'
import QS from 'qs'
import { urlHost } from './apiconst'
import constant from '@/constant'

/*
  @ 创建自定义axios实例
*/
const instance = axios.create({
  baseURL: urlHost,
  timeout: 10000
})

/*
  @ request 请求拦截器=>请求发出前处理
*/
instance.interceptors.request.use(
  config => {
    // 添加token
    const token = window.storage.getItem('manager/token')
    if (token != null && config.url !== '/sysuser/login') {
      config.headers.Authorization = token
    }

    // 简化JSON
    if (config.isJson) {
      config.headers['Content-Type'] = 'application/json;charset=utf8'
    }

    // 如果不是JSON同时是post、put请求,就序列化参数
    if (!config.isJson &&
      (config.method === 'post' || config.method === 'put')) {
      // post、put请求时，序列化入参
      config.data = QS.stringify(config.data, { arrayFormat: 'repeat' })
    }
    return config
  }, error => {
    // 接口返回失败
    console.log(error.response)
    Promise.reject(error.response)
  }
)

/*
  @ request 响应拦截器=>处理响应数据
*/
instance.interceptors.response.use(
  response => {
    // TODO 这里暂时这样设置 状态码为500也这样
    if (response.status === 500) {
      location.pathname = constant.loginPath
      console.log('回登录页')
      return Promise.reject(response.data.msg)
    }
    let code = response.data.code
    switch (code) {
      // 当用户未登录的时候导航到登录页面
      case 20002: {
        location.pathname = constant.loginPath
        console.log('回登录页')
        return Promise.reject(response.data.msg)
      }
    }
    return Promise.resolve(response)
  },
  error => {
    // //请求失败，这个地方可以根据error.response.status统一处理一些界面逻辑，比如status为401未登录,可以进行重定向
    // router.replace({
    //     path: '/login',
    //     query: { redirect: router.currentRoute.fullPath }
    //    });
    return Promise.reject(error.response)
  }
)

export default instance
