<template>
    <el-container class="wait-response">
      <el-aside class="aside">
        <div :style="{height:height - 140 + 'px'}" class="user-list">
          <p v-if="chatUserList.length === 0" class="text-center font-sm text-info">当前暂未接入用户</p>
          <user-item @click.native="toggleChatUser(user)" :user-info="user" v-for="user in chatUserList" :key="user.id" :active="chatUser != null && chatUser.id === user.id"/>
        </div>
      </el-aside>
      <el-main class="content" :style="{height:height - 140 + 'px'}">
        <!--当前没有正在聊天的用户-->
        <div class="wait-chat text-center text-info" v-if="chatUser == null">
          <div><q class="el-icon-message" style="font-size: 40px" ></q></div>
          <div>未选择聊天</div>
        </div>
        <div class="chat-view" v-else>
          <message-header />
          <div :style="{height:height - 400 + 'px'}" ref="chatListWrap" class="message-list">
            <div class="text-center" style="padding-bottom: 20px" v-show="loadingMessage">
              <q class="el-icon-loading" ></q>
            </div>
            <div class="text-center text-brand font-sm cursor-pointer" v-show="!loadingMessage">
              <el-button type="text" @click="loadHistory" v-show="!chatUser.noMore">{{chatUser.noMore}}查看更多</el-button>
            </div>
            <chat-item v-for="(chatInfo,index) in chatInfoList" :key="index" :info="chatInfo" />
          </div>
          <chat-input />
        </div>
      </el-main>
      <audio controls="controls" ref="audio" src='http://www.xmf119.cn/static/admin/sounds/notify.wav' hidden='true' />
    </el-container>
</template>

<script>
import UserItem from './UserItem'
import ChatItem from './ChatItem'
import MessageHeader from './MessageHeader'
import ChatInput from './ChatInput'
import {ListMap} from '@/utils/ListMap'

export default {
  inject: ['connectSuccess'],
  mounted () {
    // 断开某用户
    this.$bus.$on('session-disconnect', (openId) => {
      this.api.message.disConnectUser(openId).commonThen((success) => {
        if (success) {
          let index = this.userMap[`user${openId}`]
          delete this.userMap[`user${openId}`]
          this.chatUserList.splice(index, 1)
          this.$store.commit('message/setCurChatUser', null)
        }
      }, this)
    })
    this.$bus.$on('send-message', (type, content, openId) => {
      this.sendMessageToUser(type, content, openId)
    })
    this.$bus.$on(this.connectSuccess, (ws, managerId) => {
      // 初始获取当前的用户列表
      ws.subscribe('/message/chatting/users', (body) => {
        this.updateUserList(body)
      })

      // 监听消息的数量的变化
      ws.subscribe(`/user/${managerId}/chatUser/message/count`, (body) => {
        let time = this.lastRequestTime['messageChange'] || 0
        if (body.time > time) {
          this.chatUserListMap.get(body.openId).notRead = body.count
          this.lastRequestTime['messageChange'] = body.time
          this.updateRespCount()
        }
      })

      // 监听新消息
      ws.subscribe(`/user/${managerId}/chatUser/message`, (body) => {
        let time = this.lastRequestTime['newMessage'] || 0
        if (body.time > time) {
          const openId = body.message.userId
          // 如果不是当前用户就只更新未读数
          if (!this.isCurUser(openId)) {
            this.setLastMsg(openId, body.message, body.count)
            this.receiveNotCurMsg(openId, body.message)
            return
          }
          this.setLastMsg(openId, body.message)
          this.updateMessages([body.message], openId)
          this.lastRequestTime['newMessage'] = body.time
        }
      })

      // 监听接收用户成功
      ws.subscribe(`/user/${managerId}/chatUser/user/received`, (body) => {
      })

      // 监听用户退出聊天
      ws.subscribe(`/user/${managerId}/chatUser/user/exit`, (body) => {
        let time = this.lastRequestTime['userExit'] || 0
        if (body.time > time) {
          this.lastRequestTime['userExit'] = body.time
          // 从聊天列表中删除
          const user = this.chatUserListMap.delete(body.openId)[0]
          console.log(user)
          this.$message(`${user.name} 已结束聊天`)
        }
      })
    })
  },
  data () {
    return {
      // 当前经理的聊天列表
      chatUserListMap: new ListMap(),
      userMap: {},
      // 当前聊天的用户的信息列表
      chatInfoList: [],
      messageListMap: new ListMap(),
      lastRequestTime: {},
      hintMusic: 'http://www.xmf119.cn/static/admin/sounds/notify.wav',
      // 所有已加载的用户聊天记录列表
      userChatMap: {},
      loadingMessage: false,
      // 接受到的不是用户的消息
      receivedMessage: new ListMap()
    }
  },
  computed: {
    // 聊天用户列表
    chatUserList () {
      return this.chatUserListMap.getRange()
    },
    // 当前聊天的用户
    chatUser () {
      return this.$store.state.message.curChatUser
    },
    height () {
      return this.$store.state.system.availableHeight
    }
  },
  methods: {
    /*
    * 更新待回复的数量
    * */
    updateRespCount () {
      let waitResp = 0
      this.chatUserList.forEach((user) => {
        if (user.notRead > 0) {
          waitResp++
        }
      })
      this.$store.commit('message/setRespondCount', waitResp)
    },
    /*
    * 接受不是当前用户的信息
    * */
    receiveNotCurMsg (openId, msg) {
      // 从头开始播放提示音
      this.$refs.audio.currentTime = 0
      // 播放
      this.$refs.audio.play()
      if (this.receivedMessage.exist(openId)) {
        // 如果存在就放入列表
        let msgList = this.receivedMessage.get(openId)
        msgList.push(msg)
      } else {
        // 如果不存在就新建一个然后放入消息，在推入ListMap中
        let msgList = []
        msgList.push(msg)
        this.receivedMessage.push(openId, msgList)
      }
    },
    // 获取当前聊天的所有用户信息，并且再结束后会延迟3000ms再次获取
    getChatUserList () {
      this.api.message.getChatUserList()
        .then(this.api.commonResp((success, data) => {
          this.updateUserList(data)
          this.$store.commit('message/setRespondCount', data.filter(user => {
            return user.notRead > 0
          }).length)
        }, this)).finally(() => {
          setTimeout(() => {
            this.getChatUserList()
          }, 3000)
        })
    },
    /**
     * 设置消息的未读条数
     * **/
    setLastMsg (openId, lastMessage, count) {
      if (this.chatUserListMap.get(openId)) {
        if (count) {
          this.chatUserListMap.get(openId).notRead = count
        }
        this.chatUserListMap.get(openId).lastMessage = lastMessage
        this.updateRespCount()
      }
    },
    // 更新用户列表的数据(主要是更新用户的未读消息和最后一条消息)
    updateUserList (userList) {
      let waitResp = 0
      userList.forEach((user) => {
        this.chatUserListMap.push(user.id, user)
        if (user.notRead > 0) {
          waitResp++
        }
      })
      this.$store.commit('message/setRespondCount', waitResp)
    },
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
        this.loadingMessage = false
      }
      if (!this.messageListMap.exist(userId)) {
        this.messageListMap.push(userId, [])
      }
      // 如果需要翻转就翻转
      if (reverse) {
        messageList = messageList.reverse()
      }
      messageList.forEach((message) => {
        if (history) {
          this.messageListMap.get(userId).unshift(message)
        } else {
          this.messageListMap.get(userId).push(message)
        }
      })
      // 如果还是这个用户的话才设置进消息列表
      if (this.isCurUser(userId)) {
        this.chatInfoList = this.messageListMap.get(userId)
      }
      // 切换的时候将滚动条拖到底部
      this.$nextTick(() => {
        let chatListWrap = this.$refs.chatListWrap
        if (history) {
          chatListWrap.scrollTop = 0
        } else {
          chatListWrap.scrollTop = chatListWrap.scrollHeight
        }
      })
    },
    // 切换当前的聊天用户
    toggleChatUser (user) {
      // 设置当前聊天的用户
      this.$store.commit('message/setCurChatUser', user)
      // 将当前聊天的列表设置为该用户的
      if (this.messageListMap.exist(user.id)) {
        this.chatInfoList = this.messageListMap.get(user.id)
      } else {
        this.chatInfoList = []
        this.messageListMap.push(user.id, this.chatInfoList)
      }
      /**
       * 如果有缓存的消息，添加入列表
       */
      if (this.receivedMessage.exist(user.id)) {
        // 将消息加入到列表中去，同时将这些消息设为已读
        this.updateMessages(this.receivedMessage.get(user.id), user.id, false, false)
        // 从缓存列表中删除
        this.receivedMessage.delete(user.id)
      }
      if (this.chatInfoList.length === 0) {
        this.loadMessage(user)
      }
    },
    /**
     * 将消息设为已读
     * */
    messageRead (ids, userId) {
      this.api.message.setMessagesRead(ids, userId)
        .finally(() => {
          this.loadingMessage = false
        })
    },
    /**
     * 加载消息
     */
    loadMessage (user = this.chatUser) {
      this.loadingMessage = true
      // 获取最后一个消息的id
      let lastId = null
      if (this.chatInfoList && this.chatInfoList.length > 0) {
        lastId = this.chatInfoList[this.chatInfoList.length - 1].id
      }
      let userId = user.id
      this.api.message.getHistoryMessages(userId, lastId)
        .then(this.api.commonResp((success, data) => {
          if (success) {
            // 更新消息
            this.updateMessages(data, userId)
          } else {
            this.loadingMessage = false
          }
        }, this)).catch(() => {
          this.loadingMessage = false
        })
    },
    /**
     * 发送消息给当前聊天用户
     * @param type 消息类型
     * @param message 消息内容
     * @param openId 用户id
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
      this.api.message.sendMessage(type, message, openId)
        .commonThen((success, data) => {
          m.id = data.data
          // 发送成功后显示
          this.updateMessages([m], openId)
        }, this)
    },
    /**
     *  加载历史记录
     */
    loadHistory () {
      let lastId = null
      if (this.chatInfoList && this.chatInfoList.length > 0) {
        lastId = this.chatInfoList[0].id
      }
      const userId = this.chatUser.id
      this.api.message.getHistoryMessages(userId, lastId)
        .commonThen((success, data) => {
          // 如果没有消息，就设置不能再加载更多
          if (data.length === 0) {
            this.chatUserListMap.get(userId).noMore = true
            console.log(data.length, this.chatUserListMap.get(userId), this.isCurUser(userId))
            // 如果仍是当前用户，则更新到vuex
            if (this.isCurUser(userId)) {
              this.$store.commit('message/setCurChatUser', {...this.chatUserListMap.get(userId)})
            }
            return
          }
          this.updateMessages(data, userId, true)
        })
    },
    /**
     * 是否为当前用户
     * @param userId 用户id
     * @returns {boolean} 是否为当前用户
     */
    isCurUser (userId) {
      if (userId && this.chatUser && this.chatUser.id === userId) {
        return true
      }
      return false
    }
  },
  components: {
    UserItem,
    ChatItem,
    MessageHeader,
    ChatInput
  }
}
</script>

<style scoped lang="less">
  .wait-response {
    .aside {
      width: 300px;
      overflow: hidden;
      .user-list {
        background-color: white;
        width: 300px;
        border-right: 1px solid #dcdcdc;
        overflow: hidden;
        overflow-y: scroll;
      }
    }

    .content {
      position: relative;
      margin: 0;
      padding: 0;
      .wait-chat {
        position: absolute;
        top: 45%;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }

    .message-list {
      border-bottom:1px solid #dcdcdc;
      padding: 20px;
      overflow: hidden;
      overflow-y: scroll;
    }

  }
</style>
