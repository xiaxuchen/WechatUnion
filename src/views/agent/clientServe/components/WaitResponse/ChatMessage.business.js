import BaseBusiness from '@/common/BaseBusiness'

export default class ChatMessageBusiness extends BaseBusiness {
  /*
  * 更新待回复的数量
  * */
  updateRespCount () {
    let waitResp = 0
    this.context.chatUserList.forEach((user) => {
      if (user.notRead > 0) {
        waitResp++
      }
    })
    this.context.$store.commit('message/setRespondCount', waitResp)
  }

  /*
  * 接受不是当前用户的信息
  * */
  receiveNotCurMsg (openId, msg) {
    // 从头开始播放提示音
    this.context.$refs.audio.currentTime = 0
    // 播放
    this.context.$refs.audio.play()
    if (this.context.receivedMessage.exist(openId)) {
      // 如果存在就放入列表
      let msgList = this.context.receivedMessage.get(openId)
      msgList.push(msg)
    } else {
      // 如果不存在就新建一个然后放入消息，在推入ListMap中
      let msgList = []
      msgList.push(msg)
      this.context.receivedMessage.push(openId, msgList)
    }
  }

  /**
   * 设置消息用户的最新消息以及未读数
   * @param openId 用户id
   * @param lastMessage 最新消息
   * @param count 未读数
   * **/
  setLastMsg (openId, lastMessage, count) {
    if (this.context.chatUserListMap.get(openId)) {
      if (count) {
        this.context.chatUserListMap.get(openId).notRead = count
      }
      this.context.chatUserListMap.get(openId).lastMessage = lastMessage
      this.updateRespCount()
    }
  }

  /**
   * 更新消息列表,且如果不是历史记录就去设置为已读
   * @param messageList 新的消息列表
   * @param userId 消息的用户id
   * @param history 是否为历史记录
   * @param reverse 是否需要翻转
   * */
  updateMessages (messageList, userId, history = false, reverse = true) {
    let ids = messageList.map((msg) => {
      return msg.id
    })
    // 将加载下来的消息设置为已读
    if (ids && ids.length > 0) {
      this.messageRead(ids, userId)
    } else {
      this.context.loadingMessage = false
    }
    if (!this.context.messageListMap.exist(userId)) {
      this.context.messageListMap.push(userId, [])
    }
    // 如果需要翻转就翻转
    if (reverse) {
      messageList = messageList.reverse()
    }
    messageList.forEach((message) => {
      if (history) {
        this.context.messageListMap.get(userId).unshift(message)
      } else {
        this.context.messageListMap.get(userId).push(message)
      }
    })
    // 如果还是这个用户的话才设置进消息列表
    if (this.context.isCurUser(userId)) {
      this.context.chatInfoList = this.context.messageListMap.get(userId)
    }
    // 切换的时候将滚动条拖到底部
    this.context.$nextTick(() => {
      let chatListWrap = this.context.$refs.chatListWrap
      if (history) {
        chatListWrap.scrollTop = 0
      } else {
        chatListWrap.scrollTop = chatListWrap.scrollHeight
      }
    })
  }

  /**
   * 将消息设为已读
   * */
  messageRead (ids, userId) {
    this.context.api.message.setMessagesRead(ids, userId)
      .finally(() => {
        this.context.loadingMessage = false
      })
  }

  /**
   * 加载用户的最新消息
   */
  loadMessage (user = this.context.chatUser) {
    this.context.loadingMessage = true
    // 获取最后一个消息的id
    let lastId = null
    if (this.context.chatInfoList && this.context.chatInfoList.length > 0) {
      lastId = this.context.chatInfoList[this.context.chatInfoList.length - 1].id
    }
    let userId = user.id
    this.context.api.message.getHistoryMessages(userId, lastId)
      .then(this.context.api.commonResp((success, data) => {
        if (success) {
          // 更新消息
          this.updateMessages(data, userId)
        } else {
          this.context.loadingMessage = false
        }
      }, this)).catch(() => {
        this.context.loadingMessage = false
      })
  }

  /**
   * 发送消息给指定用户
   * @param type 消息类型
   * @param message 消息内容
   * @param openId 消息接受的微信用户id
   */
  sendMessageToUser (type, message, openId) {
    message = message.trim()
    let m = {
      isUser: false,
      time: null,
      message,
      userId: openId,
      type: 0
    }
    this.context.api.message.sendMessage(type, message, openId)
      .commonThen((success, data) => {
        m.id = data.data
        // 发送成功后显示
        this.updateMessages([m], openId)
      }, this)
  }

  /**
   *  加载当前用户的历史消息
   */
  loadHistory () {
    let lastId = null
    // 如果当前消息列表中有消息就告知服务器要第一条消息前面的历史
    if (this.context.chatInfoList && this.context.chatInfoList.length > 0) {
      lastId = this.context.chatInfoList[0].id
    }
    const userId = this.context.chatUser.id
    // 请求消息历史
    this.context.api.message.getHistoryMessages(userId, lastId)
      .commonThen((success, data) => {
        // 如果没有消息，就设置不能再加载更多
        if (data.length === 0) {
          this.context.chatUserListMap.get(userId).noMore = true
          // 如果仍是当前用户，则更新到vuex
          if (this.context.isCurUser(userId)) {
            this.context.$store.commit('message/setCurChatUser', {...this.context.chatUserListMap.get(userId)})
          }
          return
        }
        // 更新历史消息到消息列表中
        this.updateMessages(data.reverse(), userId, true)
      })
  }

  /**
   * 将信息添加进消息列表或缓存中
   * @param requestTime 新消息发送的时间
   * @param message 新消息
   */
  addNewMessage (requestTime, message, count) {
    let time = this.context.lastRequestTime['newMessage'] || 0
    if (requestTime > time) {
      const openId = message.userId
      // 如果不是当前用户更新最新消息信息并将消息放入缓存
      if (!this.context.isCurUser(openId)) {
        this.setLastMsg(openId, message, count)
        this.receiveNotCurMsg(openId, message)
      } else {
        // 如果是当前用户就只设置最新消息而不设置未读数
        this.setLastMsg(openId, message)
        // 同时更新消息列表
        this.updateMessages([message], openId)
      }
      this.context.lastRequestTime['newMessage'] = requestTime
    }
  }
}
