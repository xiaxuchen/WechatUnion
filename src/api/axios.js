import axios from 'axios'
import qs from 'qs'
// const baseURL = 'http://rest.apizza.net/mock/4b3bc197a2d00928b7e3a9f0a4932342'
const baseURL = 'http://localhost'
let http = axios.create({
  baseURL: baseURL
})

// 请求发前拦截，header中添加token
http.interceptors.request.use(config => {
  const token = window.storage.getItem('manager/token')
  console.log(token)
  if (token != null) {
    config.headers.Authorization = token
  }
  return config
})

// 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   return response
// }, function (error) {
//   return Promise.reject(error)
// })

const get = function (apiPath, params) {
  handleNullParam(params)
  return http.get(apiPath, {
    params: params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    } })
}
const post = function (apiPath, params, config) {
  handleNullParam(params)
  return http.post(apiPath, qs.stringify(params, { indices: false }), config)
}

const put = function (apiPath, params, config) {
  handleNullParam(params)
  return http.put(apiPath, qs.stringify(params, { indices: false }, config))
  // return http.put(apiPath, null, {
  //   data: qs.stringify(params, { indices: false})
  // })
}

const del = function (apiPath, params) {
  handleNullParam(params)
  return http.delete(apiPath, {
    params: params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    } })
}

function handleNullParam (params) {
  // if (typeof params === 'object') {
  //   Object.keys(params).forEach(key => {
  //     if (params[key] == null) {
  //       params[key] = ''
  //     } else if (typeof params[key] === 'object') {
  //       handleNullParam(params[key])
  //     }
  //   })
  // }
}

/**
 * 请求结果处理
 * @param axiosRequest
 * @param successCallback
 * @param errorCallback
 */
// function thenResponse (axiosRequest, successCallback, errorCallback) {
//   axiosRequest.then((res) => {
//     if (res.status === 200) {
//       res = res.data
//       if (res.code === 0) {
//         if (successCallback) successCallback(res)
//       } else {
//         if (errorCallback) errorCallback(res.code, res.msg)
//       }
//     }
//   }).catch((error) => {
//     if (errorCallback) errorCallback(-1, error.message)
//   })
// }
export default { baseURL, get, put, del, post, request: http.request }
