<template>
    <div v-if="refresh">
      <el-row>
        <el-col>
          <push-info @send-push="onSendPush"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <select-receiver />
        </el-col>
      </el-row>
    </div>
</template>

<script>
import PushInfo from './components/PushInfo'
import SelectReceiver from './components/Select'
export default {
  components: {
    SelectReceiver,
    PushInfo
  },
  data () {
    return {
      refresh: true
    }
  },
  beforeDestroy () {
    this.$store.commit('push/clear')
  },
  methods: {
    onSendPush (pushInfo) {
      let users = []
      Object.keys(this.$store.state.push.selectedUserMap).forEach((key) => {
        users.push(this.$store.state.push.selectedUserMap[key].id)
      })

      if (users.length < 2) {
        this.$message.error('请至少选择两个用户')
        return
      }

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.api.push.sendPush(users, pushInfo).then(this.api.commonResp((success, data) => {
        if (success) {
          this.$store.commit('push/clear')
          this.$router.push({name: 'push'})
          this.refresh = false
          this.$nextTick(() => {
            this.refresh = true
          })
          this.$message('推送成功')
        } else {
          this.$message.error(data)
        }
      })).finally(() => {
        loading.close()
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
