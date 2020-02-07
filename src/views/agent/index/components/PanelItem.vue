<template>
    <div class="panel-item">
      <div class="count">{{count}}</div>
      <div class="text">{{text}}</div>
    </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
  .panel-item {
    .count {
      text-align: center;
      font-size: 22px;
      color: #f56c6c;
    }

    .text {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      color: #606266;
    }
  }
</style>
