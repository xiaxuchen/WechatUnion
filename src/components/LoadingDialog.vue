<template>
    <div class="loading-dialog close-hidden">
      <bottom-button-dialog width="30%" :bottom-visible="false" :visible="visible" top="30vh">
        <template >
          <div class="text-center" style="font-size: 30px">
            <span class="el-icon-loading text-brand"></span>
          </div>
          <div class="text-center">
            加载中...
          </div>
        </template>
      </bottom-button-dialog>
    </div>
</template>

<script>
import BottomButtonDialog from './BottomButtonDialog'
export default {
  components: {
    BottomButtonDialog
  },
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    this.$bus.$on('show-loading-dialog', () => {
      this.visible = true
    })

    this.$bus.$on('hide-loading-dialog', () => {
      this.visible = false
    })
  }
}
</script>

<style scoped lang="less">

</style>
