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
              <el-button type="success" size="mini" @click="onSearchUsers" >搜索</el-button>
              <el-button type="success" size="mini" @click="onReceiveUser" >接入</el-button>
            </el-col>
          </el-row>
        </div>
        <el-tabs v-model="curTab" >
          <el-tab-pane label="待接入" name="待接入">
              <user-list :loading="waitLoading" :height="height" :user-data.sync="waitData" @select="onWaitSelectChange"/>
          </el-tab-pane>
          <el-tab-pane label="可回访" name="可回访">
            <user-list :loading="receivableLoading" :user-data.sync="receivableData" @select="onReceivableSelectChange"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
import UserList from '../WaitList'
import {ListMap} from '@/utils/ListMap'
import {mapState} from 'vuex'
import WaitBusiness from '@/views/agent/clientServe/components/WaitAccess/wait.business'
import ReceivableBusiness from '@/views/agent/clientServe/components/WaitAccess/receivable.business'
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
      tags: [],
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
        total: 0,
        // 当前显示的用户
        userList: new ListMap(),
        // 当前已选的用户
        selectMap: {}
      },
      receivableLoading: false,
      // 可以接入的用户
      receivableData: {
        curPage: 1,
        total: 0,
        // 当前显示的用户
        userList: new ListMap(),
        // 当前已选的用户
        selectMap: {}
      },
      waitBusiness: new WaitBusiness(this),
      receivableBusiness: new ReceivableBusiness(this)
    }
  },
  mounted () {
    this.api.push.getTagList().commonThen((success, data) => {
      this.tags = [
        {
          id: -1,
          name: '全部用户'
        },
        ...data
      ]
    })
    // websocket连接成功
    this.$bus.$on(this.connectSuccess, (ws) => {
      this.webSocket = ws
      // 初始时获取等待的用户的信息
      ws.subscribe('/message/waiting/users', (body) => {
        this.waitBusiness.updateWaitingUsers(body, true)
      })
      // 关注总的等待用户的数量
      ws.subscribe('/chatUser/waiting/count', (body) => {
        this.waitBusiness.updateWaitTotal(body.count, body.time)
        // 根据当前是否为空刷新列表
        this.waitBusiness.updateWhenEmpty()
      })
      // 关注用户已被获取，若存在于我们的列表中，就移除他
      ws.subscribe('/chatUser/user/received', (body) => {
        // 删除已有的，更新等待总数
        this.waitData.userList.delete(body.openId)
        this.waitBusiness.updateWaitTotal(body.count, body.time)
        // 根据当前是否为空刷新列表
        this.waitBusiness.updateWhenEmpty()
      })
      // 关注等待用户的更新，也就是当我们的消息发送过去后，接受返回并显示
      ws.subscribe('/user/waitUser/users', (body) => {
        this.waitBusiness.updateWaitingUsers(body)
      })

      // 关注可接受用户的更新，也就是当我们的消息发送过去后，接受返回并显示
      ws.subscribe('/user/receivableUser/users', (body) => {
        this.receivableBusiness.updateReceivableUsers(body)
      })
    })
  },
  methods: {
    /**
     * 等待用户的选中改变
     * */
    onWaitSelectChange (selectMap) {
      this.waitData.selectMap = selectMap
    },
    /**
     * 可接入的选中改变
     * */
    onReceivableSelectChange (selectMap) {
      this.receivableData.selectMap = selectMap
    },
    /**
     * 当点击搜索时触发搜索事件
     * */
    onSearchUsers () {
      if (this.curTab === '待接入') {
        this.waitBusiness.updateList(true)
      } else {
        this.receivableBusiness.loadList()
      }
    },
    /**
     * 根据当前面板选择接入用户的事件
     */
    onReceiveUser () {
      if (this.curTab === '待接入') {
        this.waitBusiness.receiveWaitingUser()
      } else if (this.curTab === '可回访') {
        this.receivableBusiness.receiveReceivableUser()
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
