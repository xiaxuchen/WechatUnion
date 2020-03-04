<template>
    <el-container class="wait-response">
      <el-aside class="aside">
        <div :style="{height:height - 140 + 'px'}" class="user-list">
          <p v-if="chatUserList.length == 0" class="text-center font-sm text-info">当前暂未接入用户</p>
          <user-item @click.native="toggleChatUser(user)" :user-info="user" v-for="user in chatUserList" :key="user.id" :active="chatUser != null && chatUser.id === user.id"/>
        </div>
      </el-aside>
      <el-main class="content" :style="{height:height - 140 + 'px'}">
        <!--当前没有正在聊天的用户-->
        <div class="wait-chat text-center text-info" v-if="chatUser == null">
          <div><q class="el-icon-message" style="font-size: 40px" /></div>
          <div>未选择聊天</div>
        </div>
        <div class="chat-view" v-else>
          <message-header />
          <div :style="{height:height - 400 + 'px'}" ref="chatListWrap" class="message-list">
            <div class="text-center" style="padding-bottom: 20px" v-show="loadingMessage">
              <q class="el-icon-loading" />
            </div>
            <div class="text-center text-brand font-sm cursor-pointer" v-show="!loadingMessage">
              查看更多
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
export default {
  mounted () {
    this.api.message.getChatUserList()
      .then(this.api.commonResp((success, data) => {
        this.updateUserList(data)
      }, this))
    setInterval(() => {
      let requestTime = new Date().getTime()
      // 轮询服务器，获取最新的消息和用户列表
      this.api.message.refreshServe()
        .then(this.api.commonResp((success, data) => {
          if (requestTime > this.lastRequestTime) {
            this.updateUserList(data.userList)
            this.updateMessageList(data.messageList)
          }
        }, this))
    }, 2000)
  },
  data () {
    return {
      // 当前聊天的所有用户
      chatUserList: [],
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
    chatUser () {
      return this.$store.state.message.curChatUser
    },
    height () {
      return this.$store.state.system.availableHeight
    }
  },
  methods: {
    updateUserList (userList) {
      userList.forEach((user) => {
        let index = this.userMap[`user${user.id}`]
        if (index == null) {
          // 不存在这个用户则将其加入列表
          this.chatUserList.push(user)
          // userMap记录其所在的位置
          this.userMap[`user${user.id}`] = this.chatUserList.length - 1
          console.log('添加', this.chatUserList.length - 1, user.id)
        } else {
          // 存在则更新
          this.chatUserList.splice(index, 1, user)
          // console.log('更新', index, user.id)
        }
      })
    },
    updateMessageList (messageList) {
      messageList.forEach((message) => {
        if (this.userChatMap[`user${message.userId}`] != null) {
          this.userChatMap[`user${message.userId}`].push(message)
        }
      })
    },
    // 切换当前的聊天用户
    toggleChatUser (user) {
      console.log(user)
      // 设置当前聊天的用户
      this.$store.commit('message/setCurChatUser', user)
      let messageList = this.userChatMap[`user${user.id}`]
      if (messageList != null) {
        this.chatInfoList = messageList
        // 切换的时候将滚动条拖到底部
        this.$nextTick(() => {
          let chatListWrap = this.$refs.chatListWrap
          chatListWrap.scrollTop = chatListWrap.scrollHeight
        })
      } else {
        this.loadingMessage = true
        this.chatInfoList = []
        this.api.message.getChatMessageList(user.id)
          .then(this.api.commonResp((success, data) => {
            this.chatInfoList = data
            this.userChatMap[`user${user.id}`] = data
          }, this)).finally(() => {
            this.loadingMessage = false
            this.$nextTick(() => {
              let chatListWrap = this.$refs.chatListWrap
              chatListWrap.scrollTop = chatListWrap.scrollHeight
            })
          })
      }
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
