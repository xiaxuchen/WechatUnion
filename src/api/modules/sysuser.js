import http from '@/api/axios'

export default {
  /**
   * 管理员登录
   * @param username 用户名
   * @param password 密码
   * @returns {*}
   */
  login (username, password) {
    return http.post('/sysuser/login', {
      username,
      password
    })
  },
  /**
   * 验证是否有权限进入url
   * @param url 页面路径
   */
  verifyPermit (path) {
    return http.get('/sysuser/permission', {
      path
    })
  },
  /**
   * 分页获取系统用户列表
   * @param curPage 当前页
   * @param pageSize 每页大小
   */
  getSysUserList (curPage, pageSize) {
    return http.get('/sysuser/list', {
      curPage,
      pageSize
    })
  }
}
