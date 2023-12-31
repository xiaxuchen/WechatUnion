import http from '../http'

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
   * @param path 页面路径
   */
  verifyPermit (path) {
    return http.get('/sysuser/permit', {
      url: path
    })
  },
  /**
   * 分页获取系统用户列表,
   * @param query 查询参数
   */
  getSysUserList (query) {
    return http.get('/sysuser/list', query)
  },
  /**
   * 删除系统用户
   * @param id 要删除的用户的id
   * @returns {*}
   */
  deleteSysuser (id) {
    return http.del(`/sysuser/${id}`)
  },
  /**
   * 获取系统中的角色列表 TODO 后缀路径需要删除
   */
  getSysRoles () {
    return http.get('/sysuser/roles')
  },
  /**
   * 添加系统用户
   * @param user 系统用户信息
   */
  addSysuser (user) {
    return http.request({
      url: '/sysuser',
      method: 'post',
      data: user,
      isJson: true
    })
  },
  updateUser (user) {
    return http.request({
      url: '/sysuser',
      method: 'put',
      data: user,
      isJson: true
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
  },
  /**
   * 获取我的信息
   * @returns {*}
   */
  getMineInfo () {
    return http.get('/sysuser/info')
  },
  /**
   * 修改密码
   * @param originPwd 原密码
   * @param newPwd 新密码
   * @returns {*}
   */
  alterPwd (originPwd, newPwd) {
    return http.put('/sysuser/pwd', {
      originPwd,
      newPwd
    })
  },
  /**
   * 获取用户所属信息
   * @param agentId 经理的id
   * @param curPage 当前页
   * @param pageSize 每页的size
   * @returns {*}
   */
  getBelong (agentId, curPage, pageSize) {
    return http.get('/sysuser/belong', {
      agentId,
      curPage,
      pageSize
    })
  }
}
