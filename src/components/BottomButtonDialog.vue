<template>
    <div class="bottom-button-dialog">
      <el-dialog :visible="visible" @close="hide" v-bind="$attrs">
        <div slot="title" v-if="$slots.title != null">
          <slot name="title" />
        </div>
        <slot />
        <div slot="footer" class="dialog-footer" align="right" v-if="bottomVisible">
          <div>
            <el-button @click="hide">取 消</el-button>
            <el-button type="primary" @click="confirm">{{confirmButton}}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    bottomVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    confirmButton: {
      type: String,
      required: false,
      default: '确 定'
    }
  },
  methods: {
    hide () {
      this.$emit('update:visible', false)
    },
    confirm () {
      this.$emit('on-confirm')
    }
  }
}
</script>

<style scoped lang="less">

</style>
