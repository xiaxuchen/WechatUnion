<template>
    <div class="chat-input">
      <el-row>
        <el-col :span="2" align="center">
          <el-popover
            placement="top-start"
            title="表情"
            trigger="click"
            v-model="visible"
            >
            <q slot="reference" class="fa fa-smile-o icon-button"></q>
            <template>
              <emotion @emotion-click="inputEmotion" :width="400" :height="200"/>
            </template>
          </el-popover>
        </el-col>
        <!--TODO 先注释，后期加上-->
        <!--<el-col :span="2" align="center">-->
          <!--<q class="el-icon-folder icon-button"></q>-->
        <!--</el-col>-->
        <!--<el-col :span="3" :push="17" align="center">-->
          <!--<div class="quick-response">-->
            <!--快捷回复 <q class="el-icon-arrow-right"></q>-->
          <!--</div>-->
        <!--</el-col>-->
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col>
          <el-input id="chatInput" type="textarea" @keyup.enter.native="sendTextMessage()" v-model="textMessage" size="medium" resize="none" class="transparent text-message-input" />
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col align="right" class="text-info">
          按Enter发送
        </el-col>
      </el-row>
    </div>
</template>

<script>
import Emotion from '@/components/Emotion'
const messageType = {
  text: 0,
  image: 1
}
export default {
  data () {
    return {
      textMessage: '',
      visible: false
    }
  },
  components: {
    Emotion
  },
  computed: {
    curChatUser () {
      return this.$store.state.message.curChatUser
    }
  },
  methods: {
    sendTextMessage () {
      this.$bus.$emit('send-message', messageType.text, this.textMessage, this.curChatUser.id)
      this.textMessage = ''
    },
    inputEmotion (emotion) {
      let chatInput = document.getElementById('chatInput')
      let start = chatInput.selectionStart
      let end = chatInput.selectionEnd
      console.log(start, end)
      if (start === undefined || end === undefined) {
        return
      }
      this.textMessage = this.textMessage.substring(0, start) + emotion + this.textMessage.substring(end)
      this.visible = false
      chatInput.focus()
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
