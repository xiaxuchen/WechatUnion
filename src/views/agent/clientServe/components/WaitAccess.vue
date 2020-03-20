<template>
    <div :style="{height:height -140 + 'px'}" class="wait-access clearfix">
      <div class="user-search">
        <div class="selection" >
          <el-row>
            <el-col :span="8" :push="6">
              <el-input placeholder="搜索" prefix-icon="el-icon-search" size="mini"/>
            </el-col>
            <el-col :span="6" :push="8">
              <!--TODO 不知道这个v-model和value会不会冲突-->
              <el-select size="mini" style="margin-right: 20px" v-model="tags" value="tags"></el-select>
            </el-col>
            <el-col :span="5" :push="8">
              <el-checkbox label="只看我的" style="margin-right: 20px" />
            </el-col>
            <el-col :span="3" :push="8">
              <el-button type="success" size="mini" @click="receiveUser"  v-show="curTab !== '已过期'">接入</el-button>
            </el-col>
          </el-row>
        </div>
        <el-tabs v-model="curTab" >
          <el-tab-pane label="待接入" name="待接入">
              <user-list :height="height" :user-data.sync="waitData" @select="onSelectChange"/>
          </el-tab-pane>
          <!--<el-tab-pane label="已过期" name="已过期">-->
            <!--<user-list :height="height" :selectable="false"/>-->
          <!--</el-tab-pane>-->
          <el-tab-pane label="可回访" name="可回访">
            <!--TODO 添加数据源-->
            <user-list :height="height" :user-data="canConnectData"/>
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
  mounted () {
    this.loadWaitUser()
    // 接入用户
    this.$bus.$on('receiveWaiting', () => {
      let selectMap = this.waitData.selectMap
      const idList = Object.keys(selectMap).map(value => {
        return selectMap[value].id
      })
      if (idList.length === 0) {
        this.$message.error('请至少选中一个用户')
        return
      }
      this.$store.commit('system/toggleLoading', true)
      this.api.message.receiveUsers(idList)
        .commonThen((success) => {
          if (success) {
            this.$message('接入成功')
            this.waitData.selectMap = {}
          }
        }, this).finally(() => {
          this.$store.commit('system/toggleLoading', false)
        })
    })
  },
  data () {
    return {
      tags: [],
      curTab: '待接入',
      waitData: {
        curPage: 1,
        total: 0,
        userList: [],
        selectMap: {}
      },
      // 可以连接的数据
      canConnectData: {
        curPage: 1,
        total: 0,
        userList: [],
        selectMap: {}
      }
    }
  },
  methods: {
    /**
     * 将子组件中的选中的数据传输到父组件中
     * */
    onSelectChange (selectMap) {
      this.waitData.selectMap = selectMap
    },
    /**
     * 加载正在等待的用户
     * */
    loadWaitUser () {
      this.api.message.getWaitingUsers(this.waitData.curPage)
        .commonThen((success, data) => {
          if (success) {
            this.waitData.userList = data.data
            this.waitData.total = data.total
            this.$store.commit('message/setWaitCount', data.total)
          }
        }).finally(() => {
          // 延迟一下去更新一下
          setTimeout(() => {
            this.loadWaitUser()
          }, 1500)
        })
    },
    /**
     * 根据当前面板选择接入的事件
     */
    receiveUser () {
      console.log(this.curTab === '待接入')
      if (this.curTab === '待接入') {
        this.$bus.$emit('receiveWaiting')
      } else if (this.curTab === '可回访') {
        this.$bus.$emit('receiveHistory')
      }
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
