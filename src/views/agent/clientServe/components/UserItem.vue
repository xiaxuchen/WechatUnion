<template>
    <div class="user-item" :class="{active:active}">
      <el-row>
        <el-col :span="6">
          <el-image :src="require('@/assets/images/0.png')" class="head-img"/>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-col class="nickname" :span="12">
              夏旭晨
            </el-col>
            <el-col class="tel" :span="12">
              17779911413
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="18" class="last-info">
              你好啊
            </el-col>
            <el-col :span="6" class="state">
              已超时
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped lang="less">
  .user-item {
    cursor: pointer;
    padding: 15px 25px;
    &.active {
      cursor: default;
      background-color: #f5f5f5;
    }
    .head-img {
      width: 40px;
      height: 40px;
    }

    .nickname {
      font-size: 14px;
    }

    .tel {
      font-size: 13px;
      color: #909399;
    }

    .last-info {
      font-size: 12px;
      color: #909399;
    }

    .state {
      font-size: 12px;
      color: #909399;
    }
  }
</style>
