<template>
    <div class="material-item">
      <h1>更新于 {{material.updateTime}}</h1>
      <div class="divider"></div>
      <el-image :src="material.pic" fit="fill" class="image"></el-image>
      <div class="title">{{material.title}}</div>
      <div class="cover full clearfix" @click="$emit('select')">
        <b class="el-icon-check"></b>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    material: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
  .material-item {
    margin: 10px 20px;
    position: relative;
    width: 300px;
    height: 250px;
    border: 1px solid #87e8de;
    background: white;
    h1 {
      color: #A5A5A5;
      font-size: 14px;
      margin: 0 10px;
      padding: 10px 0;
    }
    .divider {
      height: 1px;
      background: #87e8de;
      margin: 0 10px;
    }
    .image {
      margin: 0 10px;
      height: 160px;
    }
    .title {
      margin: 10px 20px;
      color: #000;
    }
    &:hover>.cover{
      visibility: visible;
    }
    .cover {
      position: absolute;
      background: #00000088;
      top: 0;
      left: 0;
      text-align: center;
      visibility: hidden;
      b{
        margin: 100px auto;
        font-size: 50px;
        color: white;
      }
    }
  }
</style>
