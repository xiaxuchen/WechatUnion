<template>
  <div class="box">
    <div class="chart-timer" v-if="info.date">
      {{info.date}}
    </div>
    <div class="item" :class="info.type? info.type:'left'">
      <el-image class="header-el-image" :src="info.headImg" />
      <span class="message">{{info.message}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
  .item {
    display: flex;
    margin-bottom: 10px;
  }

  .left {
    flex-direction: row;
  }

  .right {
    flex-direction: row-reverse;
  }

  .right .message {
    margin-right: 10px;
  }
  .left .message{
    margin-left: 10px;
    background-color: white;
  }

  .header-el-image {
    width: 42px;
    height: 42px;
    border-radius: 100px;
  }

  .message {
    border-radius: 10px;
    display: flex;
    background: #b1e37c;
    min-height: 25px;
    padding: 9px 10px;
    align-items: center;
    font-size: 14px;
    font-weight: normal;
  }

  .input-box {
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    display: flex;
    padding: 4px 6px;
    box-sizing: border-box;
  }

  .input-box input {
    flex: 1;
    border-radius: 10px;
    border: 1px #cecece solid;
    padding: 3px 4px;
    outline: none;
  }

  .input-box button {
    width: 80px;
    background: #2196F4;
    border-radius: 21px;
    border: 1px #fffa solid;
    color: #ffffff;
    margin: 0px 6px;
    outline: none;
  }
  button:active{}

  .chart-timer{
    text-align: center;
    color: #616161;
    font-size: 13px;
  }
</style>
