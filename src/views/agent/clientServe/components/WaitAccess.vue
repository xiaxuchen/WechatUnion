<template>
    <div :style="{height:height -140 + 'px'}" class="wait-access clearfix">
      <div class="user-search">
        <div class="selection" >
          <el-row>
            <el-col :span="8" :push="6">
              <el-input placeholder="搜索" prefix-icon="el-icon-search" size="mini"/>
            </el-col>
            <el-col :span="6" :push="8">
              <el-select size="mini" style="margin-right: 20px"></el-select>
            </el-col>
            <el-col :span="5" :push="8">
              <el-checkbox label="只看我的" style="margin-right: 20px" />
            </el-col>
            <el-col :span="3" :push="8">
              <el-button type="success" size="mini"  v-show="curTab !== '已过期'">接入</el-button>
            </el-col>
          </el-row>
        </div>
        <el-tabs v-model="curTab" >
          <el-tab-pane label="待接入" name="待接入">
              <user-list :height="height"/>
          </el-tab-pane>
          <el-tab-pane label="已过期" name="已过期">
            <user-list :height="height" :selectable="false"/>
          </el-tab-pane>
          <el-tab-pane label="可回访" name="可回访">
            <user-list :height="height"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
import UserList from './UserList'
export default {
  components: {
    UserList
  },
  computed: {
    height () {
      return this.$store.state.system.availableHeight
    }
  },
  data () {
    return {
      curTab: '待接入'
    }
  }
}
</script>

<style scoped lang="less">
  .wait-access {
    .user-search {
      margin:20px;
      position: relative;
    }

    .selection {
      position: absolute;
      right: 140px;
      z-index: 100;
    }
  }
</style>
