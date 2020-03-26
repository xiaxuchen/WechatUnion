import {urlHost} from './apiconst'
import push from './modules/push'
import sysuser from './modules/sysuser'
import message from './modules/message'
import tag from './modules/tag'

const baseURL = urlHost

const commonResp = (fn, vue) => {
  return function (resp) {
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
/* eslint-disable */
Promise.prototype.commonThen = function (fn, vue) {
  return this.then(commonResp(fn, vue))
}

export default {
  baseURL,
  push,
  sysuser,
  message,
  tag,
  commonResp
}
