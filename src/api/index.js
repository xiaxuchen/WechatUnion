import http from './axios'
import push from './modules/push'
import sysuser from './modules/sysuser'

const baseURL = http.baseURL

export default {
  baseURL,
  push,
  sysuser,
  commonResp (fn) {
    return function (resp) {
      let data = resp.data
      if (data.code === 1) {
        if (fn) { fn(true, data.data, resp) }
      } else {
        if (fn) { fn(false, data.msg, resp) }
      }
    }
  }
}
