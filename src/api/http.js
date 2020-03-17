import axios from './config'

function get (uri, params) {
  return axios.request({
    url: uri,
    method: 'get',
    params: params
  })
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
    params: params
  })
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
