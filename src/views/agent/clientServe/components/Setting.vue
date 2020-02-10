<template>
    <div class="setting">
      <el-tabs v-model="curTab">
        <el-tab-pane label="接入设置" name="接入设置"></el-tab-pane>
        <el-tab-pane label="离开设置" name="离开设置"></el-tab-pane>
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
      curTab: '接入设置'
    }
  }
}
</script>

<style scoped lang="less">
  .setting {
    padding: 10px 20px
  }
</style>
