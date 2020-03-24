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
              <el-button type="text" @click="loadHistory" v-show="!chatUser.noMore">查看更多</el-button>
            </div>
            <chat-item v-for="(chatInfo,index) in chatInfoList" :key="index" :info="chatInfo" />
          </div>
          <chat-input />
        </div>
      </el-main>
    </el-container>
</template>

<script>
import UserItem from './UserItem'
import ChatItem from './ChatItem'
import MessageHeader from './MessageHeader'
import ChatInput from './ChatInput'
import {ListMap} from '@/utils/ListMap'
export default {
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
    this.$bus.$on('ws-agent-user', (users) => {
      users.forEach((user) => {
        this.chatUserListMap.push(user.id, user)
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
      lastRequestTime: 0,
      // 所有已加载的用户聊天记录列表
      userChatMap: {},
      loadingMessage: false
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
    // 更新用户列表的数据(主要是更新用户的未读消息和最后一条消息)
    updateUserList (userList) {
      userList.forEach((user) => {
        let index = this.userMap[`user${user.id}`]
        if (index == null) {
          // 不存在这个用户则将其加入列表
          this.chatUserList.push(user)
          // userMap记录其所在的位置
          this.userMap[`user${user.id}`] = this.chatUserList.length - 1
        } else {
          // 存在则更新
          this.chatUserList.splice(index, 1, user)
        }
        // 如果当前用户有未读消息，就自动加载
        if (!this.loadingMessage && this.isCurUser(user.id) && user.notRead > 0) {
          this.loadMessage()
        }
      })
    },
    // 更新消息
    updateMessages (messageList, userId) {
      // 将新消息同步到map
      let messages = this.userChatMap[`user${this.chatUser.id}`]
      if (messages) {
        // 如果列表已存在就添加进去
        messageList.forEach((message) => {
          this.chatInfoList.push(message)
        })
      } else {
        messages = messageList
      }
      // 重新放回map中
      this.userChatMap[`user${this.chatUser.id}`] = messages
      // 如果还是这个用户的话才设置进消息列表
      if (this.isCurUser(userId)) {
        console.log('123')
        this.chatInfoList = messages
      }
      // 切换的时候将滚动条拖到底部
      this.$nextTick(() => {
        let chatListWrap = this.$refs.chatListWrap
        chatListWrap.scrollTop = chatListWrap.scrollHeight
      })
    },
    // 切换当前的聊天用户
    toggleChatUser (user) {
      // 设置当前聊天的用户
      this.$store.commit('message/setCurChatUser', user)
      this.chatInfoList = this.userChatMap[`user${user.id}`]
      let messageList = this.userChatMap[`user${user.id}`]
      if (messageList != null) {
        this.chatInfoList = messageList
        // 切换的时候将滚动条拖到底部
        this.$nextTick(() => {
          let chatListWrap = this.$refs.chatListWrap
          chatListWrap.scrollTop = chatListWrap.scrollHeight
        })
      }
      this.loadMessage()
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
    loadMessage () {
      this.loadingMessage = true
      // 获取最后一个消息的id
      let lastId = null
      if (this.chatInfoList && this.chatInfoList.length > 0) {
        lastId = this.chatInfoList[this.chatInfoList.length - 1].id
      }
      let userId = this.chatUser.id
      this.api.message.getChatMessageList(userId, lastId)
        .then(this.api.commonResp((success, data) => {
          if (success) {
            // 更新消息
            this.updateMessages(data, userId)
            let ids = data.map((msg) => {
              return msg.id
            })
            // 将加载下来的消息设置为已读
            if (ids && ids.length > 0) {
              this.messageRead(ids, userId)
            } else {
              this.loadingMessage = false
            }
          } else {
            this.loadingMessage = false
          }
        }, this)).catch(() => {
          this.loadingMessage = false
        }).finally(() => {
          this.$nextTick(() => {
            let chatListWrap = this.$refs.chatListWrap
            chatListWrap.scrollTop = chatListWrap.scrollHeight
          })
        })
    },
    /**
     * 发送消息给当前聊天用户
     * @param type 消息类型
     * @param message 消息内容
     * @param openId 用户id
     */
    sendMessageToUser (type, message, openId) {
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
          this.updateMessages([m])
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
          // 如果没有消息
          if (data.length === 0) {
            const index = this.userMap[`user${userId}`]
            console.log(index)
            if (index === 0 || index) {
              // 就给用户加上没有更多消息
              this.chatUserList[index].noMore = true
              console.log(this.chatUserList[index])
              // 如果仍是当前用户，则更新到vuex
              if (this.isCurUser(userId)) {
                this.$store.commit('message/setCurChatUser', this.chatUserList[index])
              }
            }
          }
          let infoList = this.userChatMap[`user${userId}`]
          if (!infoList) {
            infoList = []
          }
          // 将信息放入开头
          data.forEach((msg) => {
            infoList.unshift(msg)
          })
          this.chatInfoList = infoList
          // 将用户的消息放入用户的聊天的map
          this.userChatMap[`user${userId}`] = infoList
          // 如果还是当前用户，就更新到消息list中去
          if (this.isCurUser(userId)) {
            this.chatInfoList = infoList
          }
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
