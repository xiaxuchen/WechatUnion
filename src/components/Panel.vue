<template>
    <div class="panel">
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
    }
  }
}
</script>

<style scoped lang="less">
  .panel {
    border: 1px solid #dcdfe6;
    .panel_title {
      text-align: left;
      padding: 14px 20px;
      background-color: #f2f6fc;
      color: #606266;
      font-size: 14px;
    }

    .panel_content {
      padding: 10px 20px;
    }
  }
</style>
