import http from '@/api/axios'

export default {
  /**
   * 发送推送
   * @param users 推送的用户
   * @param pushInfo 推送相关的信息
   * @returns {*}
   */
  sendPush (users, pushInfo) {
    return http.request({
      url: '/push/push',
      data: {
        users: users,
        ...pushInfo
      },
      header: {
        'Content-Type': 'application/json;charset=utf8' // 如果写成contentType会报错
      },
      method: 'post'
    })
  },
  /**
   * 获取所有的用户标签
   * @returns {*}
   */
  getTagList () {
    return http.get('/push/tagList')
  },
  /**
   * 通过筛选获取用户列表
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
  getMaterialList (curPage, pageSize) {
    return http.get('/push/materials', {
      curPage,
      pageSize
    })
  },
  /**
   * 预览推送
   * @param id 预览的用户的openid
   * @param type 消息类型
   * @param content 消息内容
   */
  previewPush (id, type, content) {
    return http.post('/push/preview', {
      id,
      type,
      content
    })
  },
  /**
   * 获取预览的状态
   * @param itemId 预览的id
   * @returns {*}
   */
  getPreviewState (itemId) {
    return http.get('/push/preview/state', {
      itemId
    })
  },
  /**
   * 获取首页的数据
   */
  getIndexData () {
    return http.get('/indexData')
  }
}
