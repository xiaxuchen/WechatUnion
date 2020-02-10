<template>
    <el-container class="wait-response">
      <el-aside class="aside">
        <div :style="{height:height - 140 + 'px'}" class="user-list">
          <user-item  @click.native="clicked(i)" v-for="i in 100" :key="i" :active="i === curPosition"/>
        </div>
      </el-aside>
      <el-main class="content" :style="{height:height - 140 + 'px'}">
        <message-header />
        <div :style="{height:height - 400 + 'px'}" class="message-list">
          <chat-item v-for="(chatInfo,index) in chatInfoList" :key="index" :info="chatInfo" />
        </div>
        <chat-input />
      </el-main>
    </el-container>
</template>

<script>
import UserItem from './UserItem'
import ChatItem from './ChatItem'
import MessageHeader from './MessageHeader'
import ChatInput from './ChatInput'
export default {
  data () {
    return {
      curPosition: 1,
      chatInfoList: [
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        },
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        },
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        },
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        },
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        },
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        },
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        },
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        },
        {
          message: '你好呀',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png',
          type: 'right'
        },
        {
          message: '你好哇',
          headImg: 'http://localhost:8080/static/img/0.68fb09f.png'
        }
      ]
    }
  },
  methods: {
    clicked (i) {
      this.curPosition = i
    }
  },
  computed: {
    height () {
      return this.$store.state.system.availableHeight
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
      margin: 0;
      padding: 0;
    }

    .message-list {
      border-bottom:1px solid #dcdcdc;
      padding: 20px;
      overflow: hidden;
      overflow-y: scroll;
    }

  }
</style>
