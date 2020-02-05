import http from '@/api/axios'

export default {
  /**
   * 管理员登录
   * @param username 用户名
   * @param password 密码
   * @returns {*}
   */
  login (username, password) {
    return http.post('/manager/login', {
      username,
      password
    })
  },
  /**
   * 验证是否有权限进入url
   * @param url 页面路径
   */
  verifyPermit (path) {
    return http.get('/manager/permission', {
      path
    })
  }
}
