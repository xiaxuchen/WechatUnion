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
            <!--<user-list :height="height" :user-data="canConnectData"/>-->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
import UserList from './UserList'
import {ListMap} from '@/utils/ListMap'
import {mapState} from 'vuex'
export default {
  inject: ['connectSuccess'],
  provide () {
    return {
      pageSize: this.pageSize
    }
  },
  components: {
    UserList
  },
  computed: {
    ...mapState({
      height: 'system.availableHeight',
      managerId: 'manager.manager.id',
      waitCount: 'message.waitCount'
    })
  },
  mounted () {
    // 接入用户
    this.$bus.$on('receive-waiting', () => {
      this.receiveWaitingUser()
    })
    // websocket连接成功
    this.$bus.$on(this.connectSuccess, (ws) => {
      this.webSocket = ws
      // 初始时获取等待的用户的信息
      ws.subscribe('/message/waiting/users', (body) => {
        this.updateWaitingUsers(body, true)
      })
      // 关注总的等待用户的数量
      ws.subscribe('/chatUser/waiting/count', (body) => {
        this.updateWaitTotal(body.count, body.time)
        this.loadList()
      })
      // 关注用户已被获取，若存在于我们的列表中，就移除他
      ws.subscribe('/chatUser/user/received', (body) => {
        this.waitData.userList.delete(body.openId)
        this.updateWaitTotal(body.count, body.time)
      })
      // 关注等待用户的更新，也就是当我们的消息发送过去后，接受返回并显示
      ws.subscribe('/user/waitUser/users', (body) => {
        this.updateWaitingUsers(body)
      })
    })
  },
  data () {
    return {
      webSocket: null,
      pageSize: 20,
      tags: [],
      curTab: '待接入',
      lastCountUpdateTime: 0,
      waitData: {
        curPage: 1,
        // TODO 这里改成vuex管理的
        total: 0,
        // 当前显示的用户
        userList: new ListMap(),
        // 当前已选的用户
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
    /*
    ** 接受用户
    * */
    receiveWaitingUser () {
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
    },
    /*
    * 更新等待用户列表
    * */
    updateWaitingUsers (userPage, isInit = false) {
      if (isInit) {
        this.updateWaitTotal(userPage.total, new Date().getTime())
      }
      // 设置记录总数
      this.waitData.total = userPage.total
      // 清除原来的
      this.waitData.userList.clear()
      // 添加
      userPage.data.forEach((user) => {
        this.waitData.userList.push(user.id, user)
      })
    },
    loadList () {
      if (!this.webSocket) {
        return
      }
      this.webSocket.send('/message/waitUser/users', {
        curPage: 1,
        tagId: this.tagId,
        searchKey: this.searchKey,
        agentId: this.managerId
      })
    },
    /*
    * 当由于列表的用户都被其他经理接受时，重新加载此列表
    * **/
    updateList () {
      let {curPage, total} = this.waitData
      const pageCount = (total / this.pageSize + total % this.page ? 1 : 0)
      // 如果当前页比真实页小，就跳转到第一页去
      if (pageCount < curPage) {
        curPage = 1
      }
      // 发送请求告知服务端，发送新的数据过来
      // this.webSocket.send({
      //   type: 1,
      //   name: 'getWaitingUsers',
      //   content: {
      //     curPage: curPage,
      //     pageSize: this.pageSize
      //   }
      // })
    },
    /**
     * 将子组件中的选中的数据传输到父组件中
     * */
    onSelectChange (selectMap) {
      this.waitData.selectMap = selectMap
    },
    updateWaitTotal (count, time) {
      if (!time || this.lastCountUpdateTime < time) {
        // 设置等待的数量
        this.$store.commit('message/setWaitCount', count)
      }
    },
    /**
     * 加载正在等待的用户
     * */
    // loadWaitUser () {
    //   this.api.message.getWaitingUsers(this.waitData.curPage)
    //     .commonThen((success, data) => {
    //       if (success) {
    //         this.waitData.userList = data.data
    //         this.waitData.total = data.total
    //         this.$store.commit('message/setWaitCount', data.total)
    //       }
    //     }).finally(() => {
    //       // 延迟一下去更新一下
    //       setTimeout(() => {
    //         this.loadWaitUser()
    //       }, 1500)
    //     })
    // },
    /**
     * 根据当前面板选择接入用户的事件
     */
    receiveUser () {
      console.log(this.curTab === '待接入')
      if (this.curTab === '待接入') {
        this.$bus.$emit('receive-waiting')
      } else if (this.curTab === '可回访') {
        this.$bus.$emit('receive-history')
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
