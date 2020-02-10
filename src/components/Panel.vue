<template>
    <div class="panel" :class="{active:border}">
      <div class="panel_title" :style="titleStyle">
        <slot name="title" >{{title}}</slot>
      </div>
      <div class="panel_content">
        <slot />
      </div>
    </div>
</template>

<script>
export default {
  props: {
    titleStyle: {
      type: Object,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    border: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="less">
  @borderRadius: 3px;
  .panel {
    border-radius: @borderRadius;
    .panel_title {
      border-top-left-radius: @borderRadius;
      border-top-right-radius: @borderRadius;
      text-align: left;
      padding: 14px 20px;
      background-color: #f2f6fc;
      color: #606266;
      font-size: 14px;
    }

    &.active {
      border: 1px solid #bfbfbf;
    }

    .panel_content {
    }
  }
</style>
