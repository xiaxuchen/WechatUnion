<template>
  <div class="box">
    <div class="chart-timer" v-if="info.date">
      {{info.time}}
    </div>
    <div class="item">
      <el-row>
        <el-col v-if="info.isUser" :span="2" class="text-center">
          <el-image class="header-el-image" :src="info.headImg"/>
        </el-col>
        <el-col :span="20" :push="(info.isUser?0:2)">
          <div class="message">{{info.message}}</div>
        </el-col>
        <el-col v-if="info.isUser == false" :span="2" :push="2" class="text-center">
          <el-image class="header-el-image" :src="info.headImg" />
        </el-col>
      </el-row>
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
  .box {
    .item {
      padding: 10px 0;
      .header-el-image {
        width: 42px;
        height: 42px;
        border-radius: 100px;
      }

      .message {
        display: inline-block;
        border-radius: 10px;
        background: #b1e37c;
        padding: 9px 10px;
        font-size: 14px;
        font-weight: normal;
      }
    }

    .chart-timer{
      text-align: center;
      color: #616161;
      font-size: 13px;
    }
  }

</style>
