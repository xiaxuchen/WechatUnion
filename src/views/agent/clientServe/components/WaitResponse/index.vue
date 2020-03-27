<template>
    <el-container class="wait-response">
      <el-aside class="aside">
        <div :style="{height:height - 140 + 'px'}" class="user-list">
          <p v-if="chatUserList.length === 0" class="text-center font-sm text-info">当前暂未接入用户</p>
          <user-item @click.native="onUserToggle(user)" :user-info="user" v-for="user in chatUserList" :key="user.id" :active="chatUser != null && chatUser.id === user.id"/>
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
              <el-button type="text" @click="onLoadHistory" v-show="!chatUser.noMore">{{chatUser.noMore}}查看更多</el-button>
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
import UserItem from '../UserItem'
import ChatItem from '../ChatItem'
import MessageHeader from '../MessageHeader'
import ChatInput from '../ChatInput'
import {ListMap} from '@/utils/ListMap'
import ChatUserBusiness from './ChatUser.business'
import ChatMessageBusiness from '@/views/agent/clientServe/components/WaitResponse/ChatMessage.business'
export default {
  inject: ['connectSuccess'],
  data () {
    return {
      // 当前经理的聊天列表
      chatUserListMap: new ListMap(),
      // 当前聊天的用户的信息列表，以 openId:用户信息 的方式存放
      chatInfoList: [],
      // 用户的消息以 用户id:消息列表 的形式存放
      messageListMap: new ListMap(),
      // 记录上次请求的时间，以保证更新为最新
      lastRequestTime: {},
      // 提示音
      hintMusic: 'http://www.xmf119.cn/static/admin/sounds/notify.wav',
      // 正在加载消息
      loadingMessage: false,
      // 如果接受到的消息不是当前对话的用户，就缓存在这里，切换的时候将其取出并设置为已读
      receivedMessage: new ListMap(),
      // 聊天用户的业务逻辑
      chatUserBusiness: new ChatUserBusiness(this),
      // 聊天消息的业务逻辑
      chatMessageBusiness: new ChatMessageBusiness(this)
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
    // 根据计算的窗体剩余高度
    height () {
      return this.$store.state.system.availableHeight
    }
  },
  mounted () {
    // 断开某用户
    this.$bus.$on('session-disconnect', (openId) => {
      this.chatUserBusiness.disconnect(openId)
    })
    // 发送消息给指定用户
    this.$bus.$on('send-message', (type, content, openId) => {
      this.chatMessageBusiness.sendMessageToUser(type, content, openId)
    })
    // websocket的监听，当连接成功回调
    this.$bus.$on(this.connectSuccess, (ws, managerId) => {
      // 初始获取当前的用户列表
      ws.subscribe('/message/chatting/users', (body) => {
        this.chatUserBusiness.addUsers(body)
      })

      // 监听消息的数量的变化，消息被设置为已读或者有新消息都会触发
      ws.subscribe(`/user/${managerId}/chatUser/message/count`, (body) => {
        // 更新用户消息的未读数
        this.chatUserBusiness.updateNotRead(body.time, body.id, body.count)
      })

      // 监听新消息的到来
      ws.subscribe(`/user/${managerId}/chatUser/message`, (body) => {
        this.chatMessageBusiness.addNewMessage(body.time, body.message, body.count)
      })

      // 监听接收用户成功
      ws.subscribe(`/user/${managerId}/chatUser/user/received`, (body) => {
        this.chatUserBusiness.addUsers([body.user])
      })

      // 监听用户退出聊天
      ws.subscribe(`/user/${managerId}/chatUser/user/exit`, (body) => {
        this.chatUserBusiness.delExitUser(body.openId)
      })
    })
  },
  methods: {
    onLoadHistory () {
      this.chatMessageBusiness.loadHistory()
    },
    /**
     * 用户切换
     * */
    onUserToggle (user) {
      this.chatUserBusiness.toggleChatUser(user)
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
