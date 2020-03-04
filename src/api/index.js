import http from './axios'
import push from './modules/push'
import sysuser from './modules/sysuser'
import message from './modules/message'

const baseURL = http.baseURL

export default {
  baseURL,
  push,
  sysuser,
  message,
  commonResp (fn) {
    return function (resp, vue) {
      let data = resp.data
      if (data.code === 1) {
        if (fn) { fn(true, data.data, resp) }
      } else {
        if (fn && !vue) { fn(false, data.msg, resp) } else {
          vue.$message.error(data.msg)
        }
      }
    }
  }
}
