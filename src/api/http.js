import axios from './config'
import qs from 'qs'

function get (uri, params) {
  return axios.request({
    url: uri,
    method: 'get',
    params: params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }})
}

function post (uri, params) {
  return axios.request({
    url: uri,
    method: 'post',
    data: params
  })
}

function del (uri, params) {
  return axios.request({
    url: uri,
    method: 'delete',
    params: params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }})
}

function put (uri, params) {
  return axios.request({
    url: uri,
    method: 'put',
    data: params
  })
}

function request () {
  return axios.request(...arguments)
}

export default {
  get,
  post,
  del,
  put,
  request
}
