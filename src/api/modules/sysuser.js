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
   * 分页获取系统用户列表,TODO 后缀路径需要删除
   * @param curPage 当前页
   * @param pageSize 每页大小
   */
  getSysUserList (query) {
    return http.get('/sysusers/list', {
      query: JSON.stringify(query)
    })
  },
  /**
   * 删除系统用户 TODO 后缀路径需要删除
   * @param ids 要删除的用户的id
   * @returns {*}
   */
  deleteSysusers (ids) {
    return http.del('/sysusers/delete', {
      ids
    })
  },
  /**
   * 获取系统中的角色列表 TODO 后缀路径需要删除
   */
  getSysRoles () {
    return http.get('/roles/list')
  },
  /**
   * 添加系统用户 TODO 需要把后缀去掉
   * @param user 系统用户信息
   */
  addSysuser (user) {
    return http.post('/sysuser/add', {
      user
    })
  },
  updateUser (user) {
    return http.put('/sysuser/update', {}, {
      data: JSON.stringify(user)
    })
  }
}
