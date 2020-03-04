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
          <el-button @click="onPreviewPush" :loading="previewLoading" >发送预览 <b class="el-icon-view"></b></el-button>
          <el-button type="primary" @click="sendPush" >发送 <b class="el-icon-s-promotion"></b></el-button>
        </el-col>
      </el-card>
      <bottom-button-dialog :bottom-visible="false" :visible.sync="qrCodeVisible" width="20">
        <div>
          <el-row>
            <el-col align="center">
              <el-image :src="url"  style="width: 200px;height: 200px" fit="cover"/>
              <div class="text-center">请使用微信扫码</div>
              <div class="text-center text-warning">{{hintTxt}}</div>
            </el-col>
          </el-row>
        </div>
      </bottom-button-dialog>
      <material-dialog @on-check-material="checkMaterial" />
    </div>
</template>

<script>
import MaterialDialog from './MaterialDialog'
import BottomButtonDialog from '@/components/BottomButtonDialog'
export default {
  data () {
    return {
      activeMessage: '文本消息',
      textMessage: '',
      picTextId: null,
      previewLoading: false,
      url: null,
      qrCodeVisible: false,
      hintTxt: '',
      curIntervalId: null
    }
  },
  methods: {
    /**
     * 预览推送,同时监听状态
     * @param pushInfo
     */
    onPreviewPush () {
      let message = this.verify()
      if (!message) {
        return
      }
      this.previewLoading = true
      this.api.push.previewPush(null, message.type, message.content)
        .then(this.api.commonResp((success, data) => {
          clearInterval(this.curIntervalId)
          this.curIntervalId = setInterval(() => {
            this.api.push.getPreviewState(data.pushItemId)
              .then(this.api.commonResp((success, data) => {
                if (success) {
                  if (data === 1) {
                    this.hintTxt = '发送成功'
                    clearInterval(this.curIntervalId)
                  } else if (data === -1) {
                    this.hintTxt = '预览已过期'
                    clearInterval(this.curIntervalId)
                  }
                }
              }))
          }, 2000)
          this.url = data.url
          this.qrCodeVisible = true
          this.hintTxt = ''
        }, this)).finally(() => {
          this.previewLoading = false
        })
    },
    checkMaterial (id) {
      console.log(id)
      this.picTextId = id
    },
    showMaterialDialog () {
      this.$bus.$emit('show-material-dialog')
    },
    sendPush () {
      let message = this.verify()
      if (message) {
        this.$emit('send-push', message)
      }
    },
    verify () {
      let type = 1
      let content = null
      switch (this.activeMessage) {
        case '文本消息': {
          type = 0
          content = this.textMessage
          break
        }
        case '图文消息': {
          type = 1
          content = this.picTextId
          break
        }
      }

      if (content == null || content.trim() === '') {
        this.$message.error('推送内容不能为空')
        return null
      }
      return {
        type,
        content
      }
    }
  },
  components: {
    MaterialDialog,
    BottomButtonDialog
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
