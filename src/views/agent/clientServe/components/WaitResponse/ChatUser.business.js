import BaseBusiness from '@/common/BaseBusiness'

export default class ChatUserBusiness extends BaseBusiness {
  /**
   * 断开用户的连接
   * @param openId 用户id
   */
  disconnect (openId) {
    this.api.message.disConnectUser(openId).commonThen((success) => {
      if (success) {
        // 删除该用户
        this.context.chatUserListMap.delete(openId)
        // 如果是当前用户，则将当前用户设置为空
        if (this.context.isCurUser(openId)) {
          this.$store.commit('message/setCurChatUser', null)
        }
      }
    }, this)
  }
  /**
   * 将用户信息添加到列表中
   * 更新用户列表的数据(主要是更新用户的未读消息和最后一条消息)
    * @param 主要是更新用户的未读消息和最后一条消息
   */
  addUsers (userList) {
    let waitResp = 0
    userList.forEach((user) => {
      this.context.chatUserListMap.push(user.id, user)
      if (user.notRead > 0) {
        waitResp++
      }
    })
    this.context.$store.commit('message/setRespondCount', waitResp)
  }

  /**
   * 更新当前的未读消息
   * @param requestTime 请求的时间
   * @param openId 用户id
   * @param count 未读消息数
   */
  updateNotRead (requestTime, openId, count) {
    let time = this.context.lastRequestTime['messageChange'] || 0
    if (requestTime > time) {
      // 如果不存在该用户就直接不管
      if (!this.context.chatUserListMap.exist(openId)) {
        return
      }
      this.context.chatUserListMap.get(openId).notRead = count
      this.context.lastRequestTime['messageChange'] = requestTime
      // 最后更新一波待回复人数
      this.context.chatMessageBusiness.updateRespCount()
    }
  }

  /**
   * 切换当前的聊天用户，并去加载该用户的消息（如果有缓存则加载缓存并设置为已读）
   * @param user 新的用户
   */
  toggleChatUser (user) {
    // 设置当前聊天的用户
    this.context.$store.commit('message/setCurChatUser', user)
    // 将当前聊天的列表设置为该用户的
    if (this.context.messageListMap.exist(user.id)) {
      this.context.chatInfoList = this.context.messageListMap.get(user.id)
    } else {
      this.context.chatInfoList = []
      this.context.messageListMap.push(user.id, this.context.chatInfoList)
    }
    /**
     * 如果有缓存的消息，添加入列表
     */
    if (this.context.receivedMessage.exist(user.id)) {
      // 将消息加入到列表中去，同时将这些消息设为已读
      this.updateMessages(this.context.receivedMessage.get(user.id), user.id, false, false)
      // 从缓存列表中删除
      this.context.receivedMessage.delete(user.id)
    }
    if (this.context.chatInfoList.length === 0) {
      // 调用消息业务去加载消息
      this.context.chatMessageBusiness.loadMessage(user)
    }
  }

  /**
   * 删除退出服务的用户
   * @param openId 用户id
   */
  delExitUser (openId) {
    // 从聊天列表中删除
    const user = this.context.chatUserListMap.delete(openId)
    this.context.$message(`${user.name} 已结束聊天`)
  }
}
