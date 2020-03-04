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
    return http.get('/sysuser/permit', {
      path
    })
  },
  /**
   * 分页获取系统用户列表,
   * @param curPage 当前页
   * @param pageSize 每页大小
   */
  getSysUserList (query) {
    return http.get('/sysuser/list', query)
  },
  /**
   * 删除系统用户
   * @param ids 要删除的用户的id
   * @returns {*}
   */
  deleteSysuser (id) {
    return http.del(`/sysuser/${id}`)
  },
  /**
   * 获取系统中的角色列表 TODO 后缀路径需要删除
   */
  getSysRoles () {
    return http.get('/roles/list')
  },
  /**
   * 添加系统用户
   * @param user 系统用户信息
   */
  addSysuser (user, headImg) {
    return http.request({
      url: '/sysuser',
      method: 'post',
      data: user,
      headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
  },
  updateUser (user) {
    return http.request({
      url: '/sysuser',
      method: 'put',
      data: user,
      headers: { 'Content-Type': 'application/json;charset=utf8' }
    }
    )
  },
  /**
   * 退出登录
   */
  logout () {
    return http.request({
      url: '/sysuser/logout',
      method: 'post'
    })
  }
}
