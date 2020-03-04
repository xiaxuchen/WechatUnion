import http from '../axios'

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
   * @param offset 记录偏移
   * @returns {*}
   */
  getChatMessageList (userId, offset) {
    return http.request(
      {
        url: '/message/chatMessageList',
        method: 'get',
        params: {userId}
      }
    )
  },
  refreshServe () {
    return http.request({
      url: '/message/refreshServe',
      method: 'get'
    })
  }
}
