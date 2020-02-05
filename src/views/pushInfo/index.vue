<template>
    <div class="pushInfo">
      <h3>群发内容</h3>
      <p class="text-info font-sm">为保障用户体验，微信公众平台严禁恶意营销以及诱导分享朋友圈，严禁发布色情低俗、暴力血腥、政治谣言等各类违反法律法规及相关政策规定的信息。 </p>
      <el-card>
        <el-tabs v-model="activeMessage">
          <el-tab-pane name="文本消息" class="tab-panel">
            <template slot="label" >
              <b class="el-icon-document"></b> 文本消息
            </template>
            <el-input type="textarea" v-model="textMessage" size="medium " resize="none" :rows="6" class="text-message-input"></el-input>
          </el-tab-pane>
          <el-tab-pane name="图文消息" class="tab-panel">
            <template slot="label" >
              <b class="el-icon-picture"></b> 图文消息
            </template>
            <div class="full pic-text-material" @click="showMaterialDialog">
              <div class="text-center">
                <div class="el-icon-folder" style="font-size: 50px"></div>
                <div class="font-sm">从素材库中选取</div>
                <div v-if="picTextId != null" class="font-sm">已选择</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-col align="right" style="padding: 20px">
          <el-button type="primary" @click="sendPush" >发送 <b class="el-icon-s-promotion"></b></el-button>
        </el-col>
      </el-card>
      <material-dialog @on-check-material="checkMaterial" />
    </div>
</template>

<script>
import MaterialDialog from './components/MaterialDialog'
export default {
  data () {
    return {
      activeMessage: '文本消息',
      textMessage: '',
      picTextId: null
    }
  },
  methods: {
    checkMaterial (id) {
      console.log(id)
      this.picTextId = id
    },
    showMaterialDialog () {
      this.$bus.$emit('show-material-dialog')
    },
    sendPush () {
      let type = 1
      let content = null
      let users = []
      switch (this.activeMessage) {
        case '文本消息': {
          type = 1
          content = this.textMessage
          break
        }
        case '图文消息': {
          type = 2
          content = this.picTextId
          break
        }
      }
      Object.keys(this.$store.state.push.selectedUserMap).forEach((key) => {
        users.push(this.$store.state.push.selectedUserMap[key].id)
      })

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.api.push.sendPush(users, {
        type,
        content
      }).then(this.api.commonResp((success, data) => {
        if (success) {
          this.$store.commit('push/clear')
          this.$router.push({name: 'selectReceiver'})
        }
        this.$message(data)
        loading.close()
      }))
    }
  },
  components: {
    MaterialDialog
  }
}
</script>

<style scoped lang="less">
  .pushInfo {
    padding: 20px;
    .tab-panel {
      height: 200px;
      .text-message-input {
        margin-top: 20px;
      }
      .pic-text-material {
        width: 140px;
        height: 140px;
        padding: 1px;
        margin: 40px auto;
        color: #f759ab;
        &>div:first-of-type {
          margin-top: 35px;
        }
        &:hover {
          background: #F8F8F8;
        }
      }
    }
  }
</style>
