<template>
    <div class="setting">
      <el-tabs v-model="curTab">
        <el-tab-pane label="接入设置" name="接入设置">
          <div class="padding-md">是否启动自动接入</div>
          <div class="padding-md">
            <el-radio :label="0" v-model="autoJoin" >不启用自动接入，全部手动接入</el-radio>
          </div>
          <div class="padding-md">
            <el-radio :label="1" v-model="autoJoin" :value="1">
              启用自动接入，即当待回复人数较少时，系统自动为你接入等待中的客户
            </el-radio>
            <div v-show="autoJoin" class="padding-md">
              当待回复人数低于
              <el-select size="mini" style="width: 60px" v-model="lowCount">
                <el-option v-for="i in 9" :key="i" :value="i" />
              </el-select>
              时，自动接入
              <el-select size="mini" style="width: 60px" :value="joinCount" v-model="joinCount">
                <el-option v-for="i in 9" :key="i" :value="i" />
              </el-select>
              个等待中的用户。
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="离开设置" name="离开设置">
          <div class="padding-md">离开时，是否启用自动回复</div>
          <div class="padding-md">
            <el-radio :label="1" v-model="autoResponse" :value="1">
              启用自动回复
            </el-radio>
          </div>
          <div class="padding-md">
            <el-radio :label="0" v-model="autoResponse" :value="0">
              不启用自动回复
            </el-radio>
          </div>
          <div class="padding-md" v-show="autoResponse">
            自动回复内容
          </div>
          <div style="width: 60%" class="padding-md"  v-show="autoResponse">
            <el-input size="mini" v-model="responseText"/>
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
      autoJoin: 0,
      autoResponse: 0,
      lowCount: 1,
      joinCount: 1,
      responseText: ''
    }
  }
}
</script>

<style scoped lang="less">
  .setting {
    padding: 10px 20px
  }
</style>
