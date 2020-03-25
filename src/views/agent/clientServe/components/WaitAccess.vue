<template>
    <div :style="{height:height -140 + 'px'}" class="wait-access clearfix">
      <div class="user-search">
        <div class="selection" >
          <el-row>
            <el-col :span="6" :push="5">
              <el-input placeholder="搜索" v-model="searcher[curTab].searchKey" prefix-icon="el-icon-search" size="mini"/>
            </el-col>
            <el-col :span="6" :push="6">
              <!--TODO 不知道这个v-model和value会不会冲突-->
              <el-select size="mini" style="margin-right: 20px" v-model="searcher[curTab].tagId">
                <el-option
                  v-for="item in tags"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :push="6">
              <el-checkbox v-model="searcher[curTab].agentId" style="margin-right: 20px" >
                只看我的
              </el-checkbox>
            </el-col>
            <el-col :span="6" :push="7">
              <el-button type="success" size="mini" @click="searchUsers" >搜索</el-button>
              <el-button type="success" size="mini" @click="receiveUser" >接入</el-button>
            </el-col>
          </el-row>
        </div>
        <el-tabs v-model="curTab" >
          <el-tab-pane label="待接入" name="待接入">
              <user-list :loading="waitLoading" :height="height" :user-data.sync="waitData" @select="onSelectChange"/>
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
      waitCount: 'message.waitCount'
    }),
    managerId () {
      if (this.$store.state.manager.manager) {
        return this.$store.state.manager.manager.id
      }
      return null
    }
  },
  data () {
    return {
      // 等待的用户在加载
      waitLoading: false,
      webSocket: null,
      pageSize: 20,
      tags: [{
        name: '所有用户',
        id: -1
      }, {
        name: 'vip',
        id: 1
      }, {
        name: '普通用户',
        id: 2
      }],
      // 搜索的dto
      searcher: {
        '待接入': {
          tagId: -1,
          agentId: false,
          searchKey: ''
        },
        '可回访': {
          tagId: -1,
          agentId: false,
          searchKey: ''
        }
      },
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
        // 根据当前是否为空刷新列表
        this.updateWhenEmpty()
      })
      // 关注用户已被获取，若存在于我们的列表中，就移除他
      ws.subscribe('/chatUser/user/received', (body) => {
        // 删除已有的，更新等待总数
        this.waitData.userList.delete(body.openId)
        this.updateWaitTotal(body.count, body.time)
        // 根据当前是否为空刷新列表
        this.updateWhenEmpty()
      })
      // 关注等待用户的更新，也就是当我们的消息发送过去后，接受返回并显示
      ws.subscribe('/user/waitUser/users', (body) => {
        this.updateWaitingUsers(body)
      })
    })
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
        .commonThen((success, data) => {
          if (success) {
            if (data.length > 0) {
              const errorList = data.map((openId) => {
                console.log(openId)
                return this.waitData.userList.get(openId).name
              }).toString()
              this.$message.error(errorList + ' 接入失败，已被其他经理接入或已离线')
            } else {
              this.$message('接入成功')
            }
            // 将选择的用户清除
            idList.forEach((openId) => {
              console.log('delete openId', openId)
              this.waitData.userList.delete(openId)
            })
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
      this.waitLoading = false
    },
    /**
     * 发送消息加载用户列表
     * @param 当前页
     * @param 是否强制获取
     **/
    loadList (curPage = this.curPage, focus = false) {
      if (!this.webSocket || this.waitLoading) {
        return
      }
      console.log(JSON.stringify(this.searcher))
      const searcher = {
        curPage,
        ...this.searcher[this.curTab]
      }
      if (searcher.agentId) {
        searcher.agentId = this.managerId
      } else {
        delete searcher.agentId
      }
      console.log(JSON.stringify(searcher))
      this.webSocket.send('/message/waitUser/users', searcher)
      this.waitLoading = true
    },
    // 当前列表空了才更新
    updateWhenEmpty () {
      // 没有人在等或者当前列表不为空就不更新
      if (this.waitCount === 0 || !this.waitData.userList.isEmpty()) {
        return
      }
      this.updateList()
    },
    /*
    * 当由于列表的用户都被其他经理接受时，重新加载此列表
    * @param focus 是否强制更新
    * **/
    updateList (focus = false) {
      let {curPage, total} = this.waitData
      const pageCount = (total / this.pageSize + total % this.page ? 1 : 0)
      // 如果当前页比真实页小，就跳转到第一页去
      if (pageCount < curPage) {
        curPage = 1
      }
      // 请求服务器
      this.loadList(curPage)
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
    searchUsers () {
      if (this.curTab === '待接入') {
        this.updateList(true)
      }
    },
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
