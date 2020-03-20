import http from '../http'

export default {
  /**
   * 获取当前聊天的所有用户信息列表
   * @returns {*}
   */
  getChatUserList () {
    return http.request(
      {
        url: '/message/chatUserList',
        method: 'get'
      }
    )
  },
  /**
   * 获取与相应用户的聊天记录
   * @param userId 用户id
   * @param lastId 上一次请求消息的最后一个id
   * @returns {*}
   */
  getChatMessageList (userId, lastId) {
    return http.request(
      {
        url: '/message/chatMessageList',
        method: 'get',
        params: {
          userId,
          lastId: lastId || null
        }
      }
    )
  },
  /**
   * .获取待接入的用户列表
   * @param curPage 当前页面
   * @returns {*}
   */
  getWaitingUsers (curPage) {
    return http.request({
      url: '/message/user/waiting',
      method: 'get',
      params: {
        curPage
      }
    })
  },
  /**
   * 接入用户
   * @param userList 用户id列表
   * @returns {*}
   */
  receiveUsers (userList) {
    console.log('接入会话')
    return http.request({
      url: '/message/session',
      method: 'post',
      data: userList,
      isJson: true
    })
  },
  /**
   * 断开
   * @param openId 用户id
   * @returns {*}
   */
  disConnectUser (openId) {
    return http.request({
      url: '/message/session',
      method: 'delete',
      params: {
        openId
      }
    })
  },
  /**
   * 将消息设置为已读
   * @param messageIds 消息的id
   * @param userId 用户id
   * @returns {*}
   */
  setMessagesRead (messageIds, userId) {
    return http.put('/message/list/read', {
      messageIds
    })
  },
  /**
   * 发送消息给指定用户
   * @param content 消息内容
   * @param type 消息类型
   * @param userId 用户id
   */
  sendMessage (type, content, userId) {
    console.log('发送请求')
    return http.request({
      url: '/message',
      method: 'post',
      data: {
        content,
        type,
        userId
      },
      isJson: true
    })
  },
  /**
   * 获取消息id为firstId前的10条历史记录
   * @param lastId 最开始的一条id
   */
  getHistoryMessages (userId, lastId) {
    return http.get('/message/history/list', {
      userId,
      lastId
    })
  }
}
