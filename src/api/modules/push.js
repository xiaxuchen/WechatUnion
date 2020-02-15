import http from '@/api/axios'

export default {
  sendPush (users, pushInfo) {
    return http.post('/push/push', {
      users: JSON.stringify(users),
      pushInfo: JSON.stringify(pushInfo)
    })
  },
  getTagList () {
    return http.get('/push/tagList')
  },
  /**
   * 通过用户标签获取用户列表
   * @param tagList 标签列表
   * @param curPage 当前页，从1开始
   * @param pageSize 页面大小
   * @returns {*}
   */
  loadUserList (tagList, curPage, pageSize, phone) {
    return http.get('/push/userList', {
      tagList,
      curPage,
      pageSize,
      phone
    })
  },
  /**
   * 获取素材列表
   */
  getMaterialList () {
    return http.get('/push/materials')
  },
  /**
   * 获取首页的数据
   */
  getIndexData () {
    return http.get('/indexData')
  }
}
