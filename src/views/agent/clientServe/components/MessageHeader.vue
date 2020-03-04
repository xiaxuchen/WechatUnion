<template>
    <div class="message-header">
      <el-row>
        <el-col :span="2">
          {{chatUser.name}}
        </el-col>
        <el-col :span="1" :push="20">
          <el-tooltip effect="dark" content="转接" placement="bottom" class="icon-button">
            <q class="el-icon-refresh" />
          </el-tooltip>
        </el-col>
        <el-col :span="1" :push="20">
          <el-tooltip effect="dark" content="关闭会话" placement="bottom" class="icon-button">
            <q class="el-icon-remove-outline"></q>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
</template>

<script>
export default {
  computed: {
    chatUser () {
      return this.$store.state.message.curChatUser
    }
  }
}
</script>

<style scoped lang="less">
  .message-header {
    padding: 10px;
    border-bottom:1px solid #dcdcdc;
    .icon-button {
      color: #909399;
      font-size: 20px;
      margin: 4px;
      &:hover {
        color: #5a5a5a;
        cursor: pointer;
      }
    }
  }

</style>
