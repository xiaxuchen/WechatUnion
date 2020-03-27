<template>
    <div class="setting">
      <el-tabs v-model="curTab">
        <el-tab-pane label="接入设置" name="接入设置">
          <div class="padding-md">是否启动自动接入</div>
          <div class="padding-md">
            <el-radio :label="0" v-model="setting.autoJoin" >不启用自动接入，全部手动接入</el-radio>
          </div>
          <div class="padding-md">
            <el-radio :label="1" v-model="setting.autoJoin" :value="1">
              启用自动接入，即当待回复人数较少时，系统自动为你接入等待中所属客户
            </el-radio>
            <div v-show="setting.autoJoin" class="padding-md">
              当前接入人数低于
              <el-select size="mini" style="width: 60px" v-model="setting.lowCount">
                <el-option v-for="i in 9" :key="i" :value="i" />
              </el-select>
              时，自动接入
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="离开设置" name="离开设置">
          <div class="padding-md">离开时，是否启用自动回复</div>
          <div class="padding-md">
            <el-radio :label="1" v-model="setting.autoResponse" :value="1">
              启用自动回复
            </el-radio>
          </div>
          <div class="padding-md">
            <el-radio :label="0" v-model="setting.autoResponse" :value="0">
              不启用自动回复
            </el-radio>
          </div>
          <div class="padding-md" v-show="setting.autoResponse">
            自动回复内容
          </div>
          <div style="width: 60%" class="padding-md"  v-show="setting.autoResponse">
            <el-input size="mini" v-model="setting.responseText"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
export default {
  computed: {
    height () {
      return this.$store.state.system.availableHeight
    }
  },
  data () {
    return {
      curTab: '接入设置',
      setting: {
        // 自动接入
        autoJoin: 0,
        // 自动回复
        autoResponse: 0,
        // 低于多少自动接入
        lowCount: 1,
        // 自动回复的内容
        responseText: ''
      }
    }
  },
  watch: {
    // 当用户的设置变更时自动更新
    setting (newValue, oldValue) {
      this.api.configAgent(this.setting)
    }
  }
}
</script>

<style scoped lang="less">
  .setting {
    padding: 10px 20px
  }
</style>
