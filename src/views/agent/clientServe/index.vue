<template>
      <div :style="{height:height - 30 + 'px'}" class="client-serve">
        <Panel :title-style="{backgroundColor: '#42494b',color: '#fff'}" :border="false">
          <template slot="title">
            <tab-header @toggle-tab="toggleTab" />
          </template>
          <template>
            <div style="background-color: #f5f5f5;overflow: hidden" :style="{height:$store.state.system.availableHeight - 140 + 'px'}">
                <wait-response v-show="curTab === 0" key="response"/>
                <wait-access v-show="curTab === 1" key="access" />
                <setting v-show="curTab === 2" key="setting"/>
            </div>
          </template>
        </Panel>
      </div>
</template>

<script>
import Panel from '@/components/Panel'
import WaitResponse from './components/WaitResponse'
import TabHeader from './components/TabHeader'
import WaitAccess from './components/WaitAccess'
import Setting from './components/Setting'
import {ChatWebSocket} from '@/utils/ChatWebSocket'
export default {
  provide () {
    return {
      webSocket: this.webSocket,
      connectSuccess: this.connectSuccess
    }
  },
  computed: {
    height () {
      return this.$store.state.system.availableHeight
    },
    // websocket连接的url
    url () {
      return `${this.api.baseURL}/chat?token=${this.token}`
    },
    userId () {
      if (this.$store.state.manager.manager) { return this.$store.state.manager.manager.id }
      return null
    },
    token () {
      return this.$store.state.manager.token
    }
  },
  components: {
    Panel,
    WaitResponse,
    TabHeader,
    WaitAccess,
    Setting
  },
  data () {
    return {
      // 连接成功事件
      connectSuccess: 'ws-chat-connect-success',
      curTab: 0,
      scrollHeight: 0,
      webSocket: null
    }
  },
  mounted () {
    // 直到有userId再去连接
    this.$util.timeoutInterval((stop) => {
      if (!this.userId && !this.token) {
        return
      }
      // 如果已经有了就断开重连
      if (this.webSocket) {
        this.webSocket.close()
      }
      this.webSocket = new ChatWebSocket(this.url, (resp) => {
        // 连接成功发送事件
        this.$bus.$emit(this.connectSuccess, this.webSocket, this.user, resp)
      }, {id: this.userId})
      this.webSocket.open()
      stop()
    })
  },
  methods: {
    toggleTab (tab) {
      this.curTab = tab
      console.log(this.height)
    },
    showStateToggle () {
    }
  },
  beforeDestroy () {
    this.webSocket.close()
  }
}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<style scoped lang="less">
  .client-serve {
    background-image: url("https://res.wx.qq.com/mpkf/zh_CN/images/background4706d9.png");
    padding: 30px 120px 0 120px;
  }

</style>
