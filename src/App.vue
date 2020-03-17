<template>
  <div id="app">
    <router-view style="width: 100%;height: 100%"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      data () {
        return {
          socket: ''
        }
      }
    }
  },
  computed: {
    path () {
      return `${this.api.baseURL.replace('http', 'ws')}/websocket/message/${this.manager.id}`
    },
    manager () {
      return this.$store.state.manager.manager
    }
  },
  mounted () {
    console.log(this.manager)
    if (this.manager) {
      this.init()
    }
  },
  watch: {
    manager () {
      this.init()
    }
  },
  methods: {
    init: function () {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function () {
      console.log('socket连接成功')
    },
    error: function () {
      console.log('连接错误')
    },
    getMessage: function (msg) {
      console.log(msg.data)
    },
    send: function () {
      this.socket.send('')
    },
    close: function () {
      console.log('socket已经关闭')
    }
  },
  destroyed () {
    // 销毁监听
    this.socket.onclose = this.close
  }
}
</script>

<style lang="less">
  @import "assets/stylesheet/reset";
  @import "assets/stylesheet/common";
  #app {
    width: 100%;
    height: 100%;
  }
</style>
