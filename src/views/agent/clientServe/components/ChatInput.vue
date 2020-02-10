<template>
    <div class="chat-input">
      <el-row>
        <el-col :span="2" align="center">
          <el-popover
            placement="top-start"
            title="标题"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <q slot="reference" class="fa fa-smile-o icon-button"></q>
            <template>
              <emotion :width="400" :height="200"/>
            </template>
          </el-popover>
        </el-col>
        <el-col :span="2" align="center">
          <q class="el-icon-folder icon-button"></q>
        </el-col>
        <el-col :span="3" :push="17" align="center">
          <div class="quick-response">
            快捷回复 <q class="el-icon-arrow-right"></q>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col>
          <el-input type="textarea" @keyup.enter.native="sendMessage" v-model="textMessage" size="medium" resize="none" class="transparent text-message-input" />
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col align="right" class="text-info">
          按Enter发送，Ctrl+Enter换行
        </el-col>
      </el-row>
    </div>
</template>

<script>
import Emotion from '@/components/Emotion'
export default {
  data () {
    return {
      textMessage: null
    }
  },
  components: {
    Emotion
  },
  methods: {
    sendMessage () {
      this.$bus.$emit('send-message', this.textMessage)
      this.textMessage = ''
    }
  }
}
</script>

<style scoped lang="less">
  .chat-input {
    margin: 15px;
    .icon-button {
      font-size: 24px;
    }

    .quick-response,.icon-button {
      color: #909399;
      &:hover {
        color: #5a5a5a;
        cursor: pointer;
      }
    }

    .quick-response {
      font-size: 16px;
    }

  }
</style>
